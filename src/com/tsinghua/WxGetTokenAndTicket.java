package com.tsinghua;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

import javax.servlet.ServletException;
import javax.servlet.http.*;

import org.json.JSONObject;

public class WxGetTokenAndTicket extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        //circle
        while (true) {
            try {
                //use appid and appsecret to get access_token
                String result = "";
                BufferedReader in = null;
                StringBuffer sb = new StringBuffer();
                URL realURL = new URL("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx089d88a718cffb12&secret=0e9cd43ba77a97a67126d86b8ca7342a");
                URLConnection conn = realURL.openConnection();
                conn.connect();
                in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                System.out.println(in);
                String line;
                while ((line = in.readLine()) != null) {
                    sb.append(line);
                }
                String st = sb.toString();
                JSONObject json = new JSONObject(st);
                String at = json.getString("access_token");
                String jt = json.getString("expires_in");
                int jtint = Integer.parseInt(jt);
                System.out.println("=====获取的access_token为：" + at);
                System.out.println("=====获取的access_token的有效时间为：" + jtint);


                //use access_token to get jsapi_ticket
                String result2 = "";
                BufferedReader in2 = null;
                StringBuffer sb2 = new StringBuffer();
                String urlStr = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + at + "&type=jsapi";
                URL realURL2 = new URL(urlStr);
                URLConnection conn2 = realURL2.openConnection();
                conn2.connect();
                in2 = new BufferedReader(new InputStreamReader(conn2.getInputStream()));
                String line2;
                while ((line2 = in2.readLine()) != null) {
                    sb2.append(line2);
                }
                String st2 = sb2.toString();
                JSONObject json2 = new JSONObject(st2);
                String at2 = json2.getString("ticket");
                String jt2 = json2.getString("expires_in");
                int jtint2 = Integer.parseInt(jt2);
                System.out.println("=====获取的ticket为：" + at2);
                System.out.println("=====获取的ticket的有效时间（秒）为：" + jtint2);


                //send data to WxCacheCountSend.java
                WxCacheCountSend sign = new WxCacheCountSend();
                sign.PutTicket(at2);


                //choose sleep or not
                if(null != at) {
                    Thread.sleep((jtint - 200)*1000);

                }else {
                    Thread.sleep(60*1000);
                }
            }
            catch (Exception e) {
                // TODO: handle exception
                System.out.println("=====获取access_token和ticket时出现错误：" + e.getMessage());
            }
        }
    }
    public void doPost(HttpServletRequest request,HttpServletResponse response) {
        this.doGet(request,response);
    }
}
