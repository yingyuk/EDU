package com.netease.server.example.factory;

import com.netease.server.example.service.UserService;
import com.netease.server.example.service.impl.UserServiceImpl;

/**
 *
 *
 */
public class ServiceFactory {
    private static UserService userService = new UserServiceImpl();

    public static UserService getUserService() {
        return userService;
    }
}
