package com.tsinghua;

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
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;

/**
 * Created by e_jjk on 2017/7/17 0017.
 */
@WebServlet(name = "wxInsertOpenIDCourseID")
public class wxInsertOpenIDCategoryID extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        BufferedReader codeGetbr = new BufferedReader(new InputStreamReader(request.getInputStream()));
        StringBuffer codeGetSbf = new StringBuffer();
        String codeGetLine;
        String code = "";
        for (codeGetLine = codeGetbr.readLine();codeGetLine != null; codeGetLine = codeGetbr.readLine()) {
            codeGetSbf.append(codeGetLine);
        }
        String st = codeGetSbf.toString();
        JSONObject jsonObject = new JSONObject();
        String openID= "";
        String categoryID = "";
        try {
            jsonObject = new JSONObject(st);
            openID = jsonObject.getString("openID");
            categoryID = jsonObject.getString("categoryID");
        }catch (Exception e) {
            e.printStackTrace();
        }
        String type = "CreateUserCourseByCategoryID";
        JSONObject jsonID = new JSONObject();
        try {
            jsonID.put("WXUsersOpenID",openID);
            jsonID.put("categoryID",categoryID);
            jsonID.put("type",type);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String jsonStr = jsonID.toString();
        String jsonData = "CTAG=settings.ChengChuangCourse&SCOBJ=" + jsonStr;
        System.out.println(jsonData);
        String urlStr = "https://lynda.lidayun.cn/JSONServlet";
        JSONObject jsonRes = new JSONObject();
        try {
            jsonRes = urlCon(urlStr,jsonData);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        System.out.println(jsonRes);
        sendScResponse(jsonRes,response);

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }


    public JSONObject urlCon(String urlStr,String string) throws org.json.JSONException,ServletException, IOException {
        PrintWriter out = null;
        String result = "";
        BufferedReader in = null;
        StringBuffer sb = new StringBuffer();
        URL url = new URL(urlStr);
        URLConnection conn = url.openConnection();
        conn.setRequestProperty("accept","*/*");
        conn.setRequestProperty("connection","Keep-Alive");
        conn.setDoOutput(true);
        conn.setDoInput(true);
        out = new PrintWriter(conn.getOutputStream());
        out.print(string);
        out.flush();
        in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String line;
        while((line = in.readLine()) != null) {
            sb.append(line);
        }
        String st = sb.toString();
        JSONObject json = new JSONObject(st);
        return json;

    }

    private void sendScResponse(JSONObject obj, HttpServletResponse response) throws ServletException,IOException {
        response.setContentType("text/javascript;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        if (obj != null) {
            String responseStr = obj.toString();
            response.getWriter().write(responseStr);
        }
    }


}
