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

/**
 * Created by e_jjk on 2017/7/19 0019.
 */
@WebServlet(name = "wxGetCourseByCourseID")
public class wxGetCourseByCourseID extends HttpServlet {
//    static String courseID;
//
//    public String putCourseID(String string) {
//        return courseID;
//    }

//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        String string = courseID;
//        JSONObject jsonObj = getCourseByCourseID(string);
//
//    }
//
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        this.doPost(request,response);
//    }

    public JSONObject getCourseByCourseID(String courseID) throws org.json.JSONException,ServletException,IOException {
        JSONObject jsonObj = new JSONObject();
        try {
            jsonObj.put("type","getCourseByCourseID");
            jsonObj.put("CourseID",courseID);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String jsonStr = jsonObj.toString();
        String jsonData = "CTAG=settings.ChengChuangCourse&SCOBJ=" + jsonStr;
        String urlStr = "http://192.168.0.110:8080/lindasrv/JSONServlet";
        wxInsertOpenIDCourseID wxIn = new wxInsertOpenIDCourseID();

        JSONObject jsonRes = wxIn.urlCon(urlStr,jsonData);
        return jsonRes;
    }

    public JSONObject brJsonTran(BufferedReader bufferedReader) throws org.json.JSONException,ServletException,IOException {
        StringBuffer sb = new StringBuffer();
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            sb.append(line);
        }
        String st = sb.toString();
        System.out.println("======读取的Course流为：" + st);
        JSONObject json = new JSONObject(st);
        return json;
    }
}
