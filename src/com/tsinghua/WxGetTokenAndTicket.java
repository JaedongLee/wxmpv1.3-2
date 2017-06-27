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
/* 	public static void main(String[] args) {
        try{
            // 本地连接 Memcached 服务
            MemcachedClient mcc = new MemcachedClient(new InetSocketAddress("127.0.0.1", 11211));
            System.out.println("Connection to server sucessful.");
            Future fo = mcc.set("runoob", 900, "Free Education");
            System.out.println(fo.get());
            System.out.println(mcc.get("runoob"));
            // 关闭连接
            mcc.shutdown();

        }
        catch(Exception ex){
            System.out.println( ex.getMessage() );
        }
	}*/
/*	public void init() throws ServletException {

		try {
			URL selfURL = new URL("http://localhost:8080/wxtest/wxgettokenandticket");
			URLConnection conn = selfURL.openConnection();
	       	conn.connect();
	       	System.out.println("connect success");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				}

	    }*/

    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        //circle
        while (true) {
            try {
                //use appid and appsecret to get access_token
                String result = "";
                BufferedReader in = null;
                StringBuffer sb = new StringBuffer();
                URL realURL = new URL("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx51b7336a2b1cd2d9&secret=ee47e5d1248dd4f55fb2c5bd2852a0d1");
                URLConnection conn = realURL.openConnection();
                conn.connect();
                Map<String, List<String>> map = conn.getHeaderFields();
                for (String key : map.keySet()) {
                    System.out.println(key + "--->" + map.get(key));
                }
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
                System.out.println(at);
                System.out.println(jtint);


                //use access_token to get jsapi_ticket
                String result2 = "";
                BufferedReader in2 = null;
                StringBuffer sb2 = new StringBuffer();
                String urlStr = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + at + "&type=jsapi";
                System.out.println(urlStr);

                URL realURL2 = new URL(urlStr);
                URLConnection conn2 = realURL2.openConnection();
                conn2.connect();
                Map<String, List<String>> map2 = conn2.getHeaderFields();
                for (String key : map2.keySet()) {
                    System.out.println(key + "--->" + map.get(key));
                }
                in2 = new BufferedReader(new InputStreamReader(conn2.getInputStream()));
                System.out.println(in);
                String line2;
                while ((line2 = in2.readLine()) != null) {
                    sb2.append(line2);
                }
                String st2 = sb2.toString();
                JSONObject json2 = new JSONObject(st2);
                String at2 = json2.getString("ticket");
                String jt2 = json2.getString("expires_in");
                int jtint2 = Integer.parseInt(jt2);
                System.out.println(at2);
                System.out.println(jtint2);


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
                System.out.println(e.getMessage());
            }
        }
    }
    public void doPost(HttpServletRequest request,HttpServletResponse response) {
        this.doGet(request,response);
    }
}
