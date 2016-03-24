package com.netease.server.example.service.impl;

import com.netease.server.example.dao.UserDao;
import com.netease.server.example.factory.DaoFactory;
import com.netease.server.example.meta.User;
import com.netease.server.example.service.UserService;

/**
 *
 *
 * @author jiaozhihui@corp.netease.com
 */
public class UserServiceImpl implements UserService {
    public User getUserByAccount(User user) {
        UserDao userDao = DaoFactory.getUserDao();
       
        return userDao.getUserByAccount(user);
    }
}
