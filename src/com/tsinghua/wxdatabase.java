package com.tsinghua;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by e_jjk on 7/3/2017.
 */
@WebServlet(name = "wxdatabase")
public class wxdatabase extends HttpServlet {
    final static Gson m_gson = new GsonBuilder().setPrettyPrinting().create();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String driverName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
        String  dbURL = "jdbc:sqlserver://localhost:1433;DatabaseName=lynda";
        String userName = "sa";
        String userPwd = "3276588ztr";
        String id;
        String name;
        String time;
        String url;
        Array ary;
        Map<String,String> map = new HashMap<>();
        Map<String,Object> map1 = new HashMap<>();
        try {
            Class.forName(driverName);
            Connection conn = DriverManager.getConnection(dbURL,userName,userPwd);
            System.out.println("wxdatabase connect success");
            Statement statement = conn.createStatement();
            String sql = "select * from lynda.dbo.wxmpccCourse";
            ResultSet rs = statement.executeQuery(sql);
            while(rs.next()) {
                id = rs.getString("ID");
                name = rs.getString("Name");
                time = rs.getString("Time");
                url = rs.getString("URL");
                map.put("Name",name);
                map.put("Time",time);
                map.put("URL",url);
                map1.put(id,m_gson.toJson(map));//id is key,json from map is value
            }
            sendScResponse(map1,response);
            rs.close();
            conn.close();
        }
        catch (Exception e) {
            e.printStackTrace();
            System.out.println("wxdatabase connect fail");
        }

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }

    private void sendScResponse(Object obj, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/javascript; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        if (obj != null) {
            String responseStr = m_gson.toJson(obj);
            response.getWriter().write(responseStr);
        }
    }

}
