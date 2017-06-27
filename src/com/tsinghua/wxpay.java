package com.tsinghua;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Created by e_jjk on 2017/6/27 0027.
 */
@WebServlet(name = "wxpay")
public class wxpay extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String appid = "wx51b7336a2b1cd2d9";
        String mch_id = "1482465612";
        String nonce_str = create_nonce_str();
        String timestamp = create_timestamp();
        String device_info = "web";
        String body = "猎天使魔女皮肤";
        String out_trade_no = timestamp + nonce_str;
        int total_fee = 4900;
        String spbill_create_ip = request.getRemoteAddr();
        String notify_url = "http://http://chengchuang.cn-north-1.eb.amazonaws.com.cn/";
        String trade_type = "JSAPI";
        String signTran = "appid=" + appid + "&body" + body + "&device_info" + device_info + "&mch_id" + mch_id + "&nonce_str" + nonce_str + "&notify_url" + notify_url + "&out_trade_no" + out_trade_no + "&spbill_create_ip" + spbill_create_ip + "&timestamp" + timestamp + "&total_fee" + total_fee + "&trade_type" + trade_type;

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
        sb.append("</xml>");


        //set response type
        String reqURL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
        wxpay wp = new wxpay();
        wp.postData(reqURL);

    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }

    //post data
    public void postData(String urlStr) {
        try {
            URL url = new URL(urlStr);
            URLConnection con = url.openConnection();
            con.setDoOutput(true);
            con.setRequestProperty("Pragma","no-cache");
            con.setRequestProperty("Cache-Control","no-cache");
            con.setRequestProperty("Content-Type","text/xml");

            OutputStreamWriter out = new OutputStreamWriter(con.getOutputStream());
            String xmlInfo = getXmlInfo();
            System.out.println("urlStr=" + urlStr);
            out.write(new String(xmlInfo.getBytes("UTF-8")));
            out.flush();
            out.close();
            BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String line = "";
            for (line = br.readLine();line != null; line = br.readLine()) {
                System.out.println(line);
            }
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    //build XML
    private String getXmlInfo() {

        StringBuffer sb = new StringBuffer();

        sb.append("<xml>");
        sb.append("<mch_id>");
        sb.append("demacia");
        sb.append("</mch_id>");
        sb.append("</xml>");
        return sb.toString();
    }



    private static String create_nonce_str() {
        return UUID.randomUUID().toString();
    }

    private static String create_timestamp() {
        return Long.toString(System.currentTimeMillis() / 1000);
    }
}
