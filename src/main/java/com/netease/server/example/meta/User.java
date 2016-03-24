package com.netease.server.example.meta;

/**
 *
 *
 * @author jiaozhihui@corp.netease.com
 */
public class User {
    private String userName;
    private String userPassword;
    private String userDesc;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public String getUserDesc() {
        return userDesc;
    }

    public void setUserDesc(String userDesc) {
        this.userDesc = userDesc;
    }
}
