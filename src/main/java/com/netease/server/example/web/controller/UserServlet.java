package com.netease.server.example.web.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.netease.server.example.factory.ServiceFactory;
import com.netease.server.example.meta.User;
import com.netease.server.example.service.UserService;

/**
 *
 *
 */
public class UserServlet extends HttpServlet {
    private static final long serialVersionUID = 4607606190625660785L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        process(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        process(request, response);
    }

    protected void process(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        String userName = request.getParameter("userName");
        String userPassword = request.getParameter("userPassword");

        UserService userService = ServiceFactory.getUserService();
        RequestDispatcher dispatcher = null;

        User u = new User();
        u.setUserName(userName);
        u.setUserPassword(userPassword);

        try {
            User user = userService.getUserByAccount(u);
            if (user != null) {
                PrintWriter writer = response.getWriter();
                writer.println("<html>");
                writer.println("<head><title>用户中心</title></head>");
                writer.println("<body>");
                writer.println("<p><img src=\"./user.jpeg\" /></p>");
                writer.println("<p>用户名：" + user.getUserName() + "</p>");
                writer.println("<p>用户说明：" + user.getUserDesc() + "</p>");
                writer.println("</body>");
                writer.println("</html>");
                writer.close();
            } else {
                dispatcher = request.getRequestDispatcher("/error.html");
                dispatcher.forward(request, response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            dispatcher = request.getRequestDispatcher("/error.html");
            dispatcher.forward(request, response);
        }

    }
}
