package com.tsinghua;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.io.UnsupportedEncodingException;
import java.net.*;
import java.net.URL;
import java.net.URLConnection;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.sun.xml.internal.ws.Closeable;

import org.json.JSONObject;
import net.sf.json.*;

public class WxCacheCountSend extends HttpServlet {
    final static Gson m_gson = new GsonBuilder().setPrettyPrinting().create();


    public static Map<String, String> sign(String jsapi_ticket, String url) {
        Map<String, String> ret = new HashMap<String, String>();
        String nonce_str = create_nonce_str();
        String timestamp = create_timestamp();
        String string1;
        String signature = "";

        //注意这里参数名必须全部小写，且必须有序
        string1 = "jsapi_ticket=" + jsapi_ticket +
                "&noncestr=" + nonce_str +
                "&timestamp=" + timestamp +
                "&url=" + url;
        System.out.println("=====JS-API签名字符串为：" + string1);

        try {
            MessageDigest crypt = MessageDigest.getInstance("SHA-1");
            crypt.reset();
            crypt.update(string1.getBytes("UTF-8"));
            signature = byteToHex(crypt.digest());
        }
        catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        catch (UnsupportedEncodingException e)
        {
            e.printStackTrace();
        }
        ret.put("url",url);
        ret.put("jsapi_ticket",jsapi_ticket);
        ret.put("nonceStr",nonce_str);
        ret.put("timestamp",timestamp);
        ret.put("signature",signature);
        return ret;
    }

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

    private static String create_nonce_str() {
        return UUID.randomUUID().toString();
    }

    private static String create_timestamp() {
        return Long.toString(System.currentTimeMillis() / 1000);
    }

    static String token;
    static int tokenExpiresIn;
    static String ticket;
    static int ticketExpiresIn;
    static String line;

    public String PutToken(String token){
        return token;
    }
    public int PutTokenExpiresIn(int tokenExpiresIn){
		/*System.out.println(tokenExpiresIn);*/
        return tokenExpiresIn;
    }
    public String PutTicket(String ticket){
        System.out.println("=====获取的来自wxgettokenandticket的ticket为：" + ticket);
        this.ticket = ticket;

		/*System.out.println(ticket);*/
        return ticket;
    }
    public int PutTicketExpiresIn(int ticketExpiresIn){
        System.out.println("=====获取的来自wxgettokenandticket的ticket的有效时间为：" + ticketExpiresIn);
        return ticketExpiresIn;
    }
    public String PutLine(String line){
        System.out.println("=====获取的来自wxgettokenandticket的回复信息为：" + line);
        return line;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            //send data to url
            String jsapi_ticket = ticket;

            //

            // 注意 URL 一定要动态获取，不能 hardcode
            String url = request.getHeader("Referer").toString();
            /*System.out.println(url);*/

    /*        String url = "http://chengchuang.cn-north-1.eb.amazonaws.com.cn/GetData.jsp";*/
            Map<String, String> ret = sign(jsapi_ticket, url);
            sendScResponse(ret, response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        try {
            /*doCommon(request, response);*/
            this.doGet(request, response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

/*    private void doCommon(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException {
        String jsapi_ticket = "kgt8ON7yVITDhtdwci0qeXxjVFn7AZ9I21TkQnlxXoQF3VTPc5tRORpvuB_slLD-Xua5sSwuBOrO5ZfMNGJUTA";

        // 注意 URL 一定要动态获取，不能 hardcode
        String url = request.getRequestURL().toString() + "/";
        System.out.println(url);
        String url = "http://chengchuang.cn-north-1.eb.amazonaws.com.cn/GetData.jsp";
        Map<String, String> ret = sign(jsapi_ticket, url);
                    sendScResponse(ret, response);
    }*/

    private void sendScResponse(Object obj, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/javascript; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        if (obj != null) {
            String responseStr = m_gson.toJson(obj);
            response.getWriter().write(responseStr);
        }
    }
}
