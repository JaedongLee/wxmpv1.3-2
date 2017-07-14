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
@WebServlet(name = "wxsendDB")
public class wxsendDB extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
            sendScResponse(getDatabase("select * from lynda.dbo.wxmpcc","lynda","sa","3276588ztr"),response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }

    final static Gson m_gson = new GsonBuilder().setPrettyPrinting().create();

    public static Map<String ,Object> getDatabase(String sql,String databaseName,String username,String password) {
        String driverName = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
        String  dbURL = "jdbc:sqlserver://localhost:1433;DatabaseName=" + databaseName;
        Connection conn = null;
        Map<String,Object> map1 = new HashMap<>();
        ResultSet rs = null;
        try {
            Class.forName(driverName);
            conn = DriverManager.getConnection(dbURL,username,password);
            System.out.println("wxsendDB connect success");
            System.out.println(sql);
            String id;
            String name;
            String time;
            String url;
            Map<String,String> map = new HashMap<>();
            try {
                Statement statement = conn.createStatement();
//                rs = statement.executeQuery(sql);
                System.out.println("连接的状态为：" + statement.executeQuery(sql));
                if (statement.executeQuery(sql) != null) {
                    rs = statement.executeQuery(sql);
                    while(rs.next()) {
                        id = rs.getString("ID");
                        name = rs.getString("Name");
                        time = rs.getString("Time");
                        url = rs.getString("URL");
                        map.put("Name",name);
                        map.put("Time",time);
                        map.put("URL",url);
                        map1.put(id,m_gson.toJson(map));//id is key,json from map is value
                        System.out.println(map);
                        System.out.println(map1);
                    }
                    rs.close();
                } else {
                    System.out.println("sql server数据库请求无返回");
                    return null;
                }
            }
            catch (Exception e) {
                e.printStackTrace();
            }

/*
            ResultSet rs = statement.executeQuery(sqlDB);
            while(rs.next()) {
                id = rs.getString("ID");
                name = rs.getString("Name");
                time = rs.getString("Time");
                url = rs.getString("URL");
                map.put("Name",name);
                map.put("Time",time);
                map.put("URL",url);
                map1.put(id,m_gson.toJson(map));//id is key,json from map is value
                System.out.println(map);
                System.out.println(map1);
            }
            rs.close();
*/
            conn.close();
        }
        catch (Exception e) {
            e.printStackTrace();
            System.out.println("wxsendDB connect fail");
        }
        System.out.println(conn);
        return map1;
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
