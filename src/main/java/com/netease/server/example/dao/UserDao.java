package com.netease.server.example.dao;

import com.netease.server.example.meta.User;

public interface UserDao {
    public User getUserByAccount(User user);
}
