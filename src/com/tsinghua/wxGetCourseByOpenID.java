package com.tsinghua;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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
import java.net.URLConnection;

/**
 * Created by e_jjk on 2017/7/17 0017.
 */
@WebServlet(name = "wxGetCourseByOpenID")
public class wxGetCourseByOpenID extends HttpServlet {
    //public static String openID;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String appid = "wx089d88a718cffb12";
        String secret = "0e9cd43ba77a97a67126d86b8ca7342a";

        //get code from request: ../subInterface.html
        BufferedReader codeGetbr = new BufferedReader(new InputStreamReader(request.getInputStream()));
        StringBuffer codeGetSbf = new StringBuffer();
        String codeGetLine;
        String code = "";
        String courseID = "";
        String openID = "";
        for (codeGetLine = codeGetbr.readLine();codeGetLine != null; codeGetLine = codeGetbr.readLine()) {
            codeGetSbf.append(codeGetLine);
        }
        code = codeGetSbf.toString();

        //get openid from wei xin after end
        String codeUrlStr = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="
                + appid + "&secret=" + secret + "&code=" + code + "&grant_type=authorization_code";
        System.out.println("=====发送code请求的链接为：" + codeUrlStr);
        URL codeUrl = new URL(codeUrlStr);
        URLConnection codeCon = codeUrl.openConnection();
        BufferedReader codeBr = new BufferedReader(new InputStreamReader(codeCon.getInputStream()));
        StringBuffer codeSbf = new StringBuffer();
        String codeLine = "";
        while ((codeLine = codeBr.readLine()) != null) {
            codeSbf.append(codeLine);
        }
        String codeRetStr = codeSbf.toString();
        System.out.println("=====Code请求返回码为：" + codeRetStr);
        try {
            JSONObject openidJs = new JSONObject(codeRetStr);
            openID = openidJs.getString("openid");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("=====openid为：" + openID);

        wxpay putOpenID = new wxpay();
        putOpenID.putOpenID(openID);

        JSONObject jsonObj = new JSONObject();
        try {
            jsonObj.put("WXUsersOpenID",openID);
            jsonObj.put("type","getCourseByWXUsersOpenID");
        }catch (Exception e) {
            e.printStackTrace();
        }
        String jsonStr = jsonObj.toString();
        String jsonData = "CTAG=settings.ChengChuangCourse&SCOBJ=" + jsonStr;
        String urlStr = "http://192.168.0.110:8080/lindasrv/JSONServlet";
        wxInsertOpenIDCourseID wxIN = new wxInsertOpenIDCourseID();
        JSONObject jsonRes = new JSONObject();
        try {
            wxIN.urlCon(urlStr,jsonData);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        sendScResponse(jsonRes,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    final static Gson m_gson = new GsonBuilder().setPrettyPrinting().create();

    private void sendScResponse(Object obj, HttpServletResponse response) throws ServletException,IOException {
        response.setContentType("text/javascript;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        if (obj != null) {
            String responseStr = m_gson.toJson(obj);
            response.getWriter().write(responseStr);
        }
    }
}
