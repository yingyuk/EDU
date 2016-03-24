package com.netease.server.example.dao.impl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import redis.clients.jedis.Jedis;

import com.netease.server.example.dao.UserDao;
import com.netease.server.example.meta.User;

public class UserDaoImpl implements UserDao {
    private static final String DB_DRIVER = "com.mysql.jdbc.Driver";

    private static final String DB_URL = "jdbc:mysql://localhost:3306/example";
    private static final String DB_USER = "server";
    private static final String DB_PASS = "example";

    private static final String REDIS_URL = "localhost";

    private Connection connection = null;
    private Jedis jedisConnection = null;

    private synchronized Connection getSQLConnection() {
        if (connection == null) {
            try {
                Class.forName(DB_DRIVER).newInstance();
                connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return connection;
    }

    private synchronized Jedis getJedisConnection() {
        if (jedisConnection == null) {
            jedisConnection = new Jedis(REDIS_URL);
        }
        return jedisConnection;
    }

    public User getUserByAccount(User user) {
        Jedis jedis = getJedisConnection();
        // read from cache
        List<String> values = jedis.hmget(user.getUserName(), "userPassword", "userDesc");
        if (values.size() > 0) {
            String userPassword = values.get(0);
            String userDesc = values.get(1);
            if (userPassword != null && userPassword.equalsIgnoreCase(user.getUserPassword())) {
                user.setUserDesc(userDesc);
                return user;
            }
        }

        // read from mysql
        Connection conn = getSQLConnection();
        try {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM User where userName=? and userPassword=?");
            ps.setString(1, user.getUserName());
            ps.setString(2, user.getUserPassword());
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                user.setUserDesc(rs.getString("userDesc"));

                // write to cache
                jedis.hset(user.getUserName(), "userPassword", user.getUserPassword());
                jedis.hset(user.getUserName(), "userDesc", user.getUserDesc());
                return user;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
