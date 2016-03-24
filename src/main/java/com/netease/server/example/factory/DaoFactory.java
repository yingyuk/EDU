package com.netease.server.example.factory;

import com.netease.server.example.dao.UserDao;
import com.netease.server.example.dao.impl.UserDaoImpl;

/**
 *
 *
 */
public class DaoFactory {
    private static UserDao userDao = new UserDaoImpl();

    public static UserDao getUserDao() {
        return userDao;
    }
}
