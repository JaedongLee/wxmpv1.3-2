package com.tsinghua;

import jdk.nashorn.internal.ir.WhileNode;
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
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

/**
 * Created by e_jjk on 2017/7/10 0010.
 */
@WebServlet(name = "wxlayinDB")
public class wxlayinDB extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuffer sb = new StringBuffer();
        BufferedReader in = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String preURL = request.getHeader("Referer").toString();
        System.out.println("请求链接为：" + preURL);
//        System.out.println("德玛西亚" + in.readLine());
        String ID = "";
        String Name = "";
        String Time = "";
        String Description = "";
        String FileName = "";
/*
        while (in.readLine() != null) {
            sb.append(in.readLine());
            System.out.println(sb.toString());
        }
*/
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//获取系统时间
        Time = df.format(new Date());
        System.out.println(Time);

        String st = in.readLine();
        System.out.println("接收到的json字符串为:" + st);
        try {
            JSONObject json = new JSONObject(st);
            ID = json.getString("id");
            Name = json.getString("name");
            FileName = json.getString("fileName");
            Description = json.getString("description");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String urlEN = "https://s3.cn-north-1.amazonaws.com.cn/wx-mp-chengchuang/audio/" + URLEncoder.encode(FileName,"UTF-8");
        System.out.println(urlEN);
        String sqlDB = "insert into lynda.dbo.wxmpcc(ID,Name,Time,URL,Description) " +
                "values ('" + ID + "',N'" + Name + "','" + Time + "','" + urlEN + "','" + Description + "')";
        wxsendDB.getDatabase(sqlDB,"lynda","sa","3276588ztr");

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }


}

