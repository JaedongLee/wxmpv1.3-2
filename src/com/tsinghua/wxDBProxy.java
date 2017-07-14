package com.tsinghua;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by e_jjk on 2017/7/13 0013.
 */

@WebServlet(name = "wxDBProxy")
public class wxDBProxy extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //get input data from ajax
        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        StringBuffer sb = new StringBuffer();
        String line;
        for (line = br.readLine();line != null;line = br.readLine()) {
            sb.append(line);
        }
        String str = sb.toString();

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
