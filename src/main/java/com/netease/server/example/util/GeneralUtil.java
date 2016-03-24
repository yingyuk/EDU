package com.netease.server.example.util;

import java.util.UUID;

public class GeneralUtil {
    public static String generateId() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}
