package com.tsinghua;

import org.dom4j.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.lang.reflect.Array;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.util.*;

/**
 * Created by e_jjk on 2017/6/27 0027.
 */
@WebServlet(name = "wxpay")
public class wxpay extends HttpServlet {
    final static Gson m_gson = new GsonBuilder().setPrettyPrinting().create();

    static String openID;

    public String putOpenID(String string) {
        this.openID = string;
        return openID;
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String appid = "wx089d88a718cffb12";
        String secret = "0e9cd43ba77a97a67126d86b8ca7342a";

        //get code and courseID from request
        BufferedReader codeGetbr = new BufferedReader(new InputStreamReader(request.getInputStream()));
        StringBuffer codeGetSbf = new StringBuffer();
        String codeGetLine;
        String code = "";
        for (codeGetLine = codeGetbr.readLine();codeGetLine != null; codeGetLine = codeGetbr.readLine()) {
            codeGetSbf.append(codeGetLine);
        }
        String courseID = codeGetSbf.toString();
        wxGetCourseByCourseID wxGC = new wxGetCourseByCourseID();
        JSONObject jsonObj = new JSONObject();
        try {
            jsonObj = wxGC.getCourseByCourseID(courseID);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String listStr = "";
        JSONArray listAry = new JSONArray();
        String feeStr = "";
        JSONObject listObj = new JSONObject();
        try {
            listStr = jsonObj.getString("listOfChengChuangCourse");
            listAry = new JSONArray(listStr);
            listObj = listAry.getJSONObject(0);
            feeStr = listObj.getString("Price");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        float feeFloat_cent = Float.parseFloat((feeStr));
        float feeFloat = feeFloat_cent*100;


        //统一下单所需要的参数
        String mch_id = "1482465612";//商户号
        String nonce_str = create_nonce_str();
        String nonce_hash = Integer.toString(nonce_str.hashCode());//convert int nonce_str.hashCode() into string
        String timestamp = create_timestamp();
        String device_info = "web";
        String body = "test";
        String out_trade_no = timestamp + nonce_hash;
        int total_fee = (int)feeFloat;
        String spbill_create_ip = getIpAddress(request);
        System.out.println("=====获取到的用户真实IP地址为：" + spbill_create_ip);
        String notify_url = "http://chengchuang.cn-north-1.eb.amazonaws.com.cn/";
        String redirect_url = URLEncoder.encode(notify_url,"Utf-8");
        String trade_type = "JSAPI";
//        String openid = "oDiIBs4hbNTW2wuG3q941OlGPYHw";
        String sign = "";

        //拼接成字符串，再进行MD5转换
        String signTran = "appid=" + appid + "&body=" + body + "&device_info=" + device_info + "&mch_id=" + mch_id + "&nonce_str=" + nonce_str + "&notify_url=" + notify_url + "&openid=" + openID + "&out_trade_no=" + out_trade_no + "&spbill_create_ip=" + spbill_create_ip + "&total_fee=" + total_fee + "&trade_type=" + trade_type;
        System.out.println("=====统一下单拼接字符串为：" + signTran);
        //compose key with signTran
        String key = "l5a1nWOhtVh0DiA6dFt77v8VaF8GMWC8";
        String signComp = signTran + "&key=" + key;
        //convert signComp by MD5
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.reset();
            md.update(signComp.getBytes("UTF-8"));
            sign = byteToHex(md.digest()).toUpperCase();
            System.out.println("=====统一下单签名为：" + sign);
        }catch (Exception e) {
            e.printStackTrace();
        }

        //生成XML文件形式的字符流
        StringBuffer sb = new StringBuffer();
        sb.append("<xml>");
        sb.append("<appid>" + appid + "</appid>");
        sb.append("<body>" + body + "</body>");
        sb.append("<mch_id>" + mch_id + "</mch_id>");
        sb.append("<nonce_str>" + nonce_str + "</nonce_str>");
        sb.append("<notify_url>" + notify_url + "</notify_url>");
        sb.append("<out_trade_no>" + out_trade_no + "</out_trade_no>");
        sb.append("<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>");
        sb.append("<total_fee>" + total_fee + "</total_fee>");
        sb.append("<trade_type>" + trade_type + "</trade_type>");
        sb.append("<device_info>" + device_info + "</device_info>");
        sb.append("<sign>" + sign + "</sign>");
        sb.append("<openid>" + openID + "</openid>");
        sb.append("</xml>");
        String sbStr = sb.toString();
        System.out.println("=====发送的统一下单XML为：" + sbStr);

        //发送数据并接收回复
        try {
            //send xml to url
            String urlStr = "https://api.mch.weixin.qq.com/pay/unifiedorder";
            URL url = new URL(urlStr);
            URLConnection con = url.openConnection();
            con.setDoOutput(true);
            con.setRequestProperty("Pragma","no-cache");
            con.setRequestProperty("Cache-Control","no-cache");
            con.setRequestProperty("Content-Type","text/xml");
            OutputStreamWriter out = new OutputStreamWriter(con.getOutputStream());
            out.write(new String(sbStr.getBytes("UTF-8")));
            out.flush();
            out.close();

            //get  response data in class BufferReader
            BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            StringBuffer sbf = new StringBuffer();
            String line = "";
            for (line = br.readLine();line != null; line = br.readLine()) {
                sbf.append(line);
            }

            //convert BufferReader to String
            String xmlStr = sbf.toString();
            System.out.println("=====获取的统一下单XML回复为：" + sbf.toString());

            //convert String to XML and get needed data from XML strut
            org.dom4j.Document document = DocumentHelper.parseText(xmlStr);
            Element root = document.getRootElement();
            Element prepayEle = root.element("prepay_id");
            System.out.println("=====预付订单号1" + prepayEle.getText());
            String prepay_id = prepayEle.getTextTrim();
            System.out.println("=====预付订单号" + prepay_id);

            //convert string to map and send to r esponse
            Map<String,String> map = new HashMap<String ,String >();
            String timeStamp = timestamp;
            String nonceStr = nonce_str;
            String pg = "prepay_id=" + prepay_id;
//          String paySignStr = "appId=" + appid + "&nonceStr=" + nonceStr + "&package=" + pg + "&signType=" + "MD5" + "&timeStamp=" + timeStamp + "&key=" + key;
            String paySignStr = "appId=" + appid + "&nonceStr=" + nonceStr + "&package=" + pg + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key;
            System.out.println("=====微信支付拼接字符串为：" + paySignStr);
            String paySign = sign(paySignStr).toUpperCase();
            System.out.println("=====微信支付签名为" + paySign);
            map.put("appId",appid);
            map.put("timeStamp",timeStamp);
            map.put("nonceStr",nonceStr);
            map.put("package",pg);
            map.put("signType","MD5");
            map.put("paySign",paySign);
            sendScResponse(map,response);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }

    private void sendScResponse(Object obj, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/javascript; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        if (obj != null) {
            String responseStr = m_gson.toJson(obj);
            response.getWriter().write(responseStr);
        }
    }


    //获取用户端真正IP地址
    public static String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        String[] ipAry = ip.split(",");
        ip = ipAry[0];
        return ip;
    }



    //convert string to sign
    public  static String sign (String signStr) {
        String signRet = "";
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.reset();
            md.update(signStr.getBytes("UTF-8"));
            signRet = byteToHex(md.digest());
        }catch (Exception e) {
            e.printStackTrace();
        }
        return signRet;
    }


    //byte convent to hex
    private static String byteToHex(final byte[] hash) {
        Formatter formatter = new Formatter();
        for (byte b : hash)
        {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

    //32-bit random
    private static String create_nonce_str() {
        return UUID.randomUUID().toString().trim().replaceAll("-", "");
    }

    //时间戳
    private static String create_timestamp() {
        return Long.toString(System.currentTimeMillis() / 1000);
    }
}
