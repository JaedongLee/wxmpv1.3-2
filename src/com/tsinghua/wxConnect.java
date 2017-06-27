package com.tsinghua;

import java.io.*;
import java.io.PrintWriter;
import javax.servlet.http.*;

public class wxConnect extends HttpServlet {
    public void doGet(HttpServletRequest req,HttpServletResponse res)	{
        String signature = req.getParameter("signature");
        String timestamp = req.getParameter("timestamp");
        String nonce = req.getParameter("nonce");
        String echostr = req.getParameter("echostr");
        String qs = req.getQueryString();
        try {
            PrintWriter pw = res.getWriter();
            pw.print(echostr);
        }
        catch (Exception ex) {
            ex.printStackTrace();
            // }final {
            //   pw.close();
            //   pw = null;
        }
    }
}
