package com.netease.server.example.util;

/**
 * Util class for request id get/set.
 * 
 * @author jiaozhihui@corp.netease.com
 */
public class RequestIdUtil {
    /**
     * Thread local for request id.
     */
    private static ThreadLocal<String> reqeustIdThreadLocal = new ThreadLocal<String>() {
        @Override
        protected String initialValue() {
            return null;
        }
    };

    /**
     * Private constructor.
     */
    private RequestIdUtil() {
        // do nothing
    }

    /**
     * Get request id for current request thread.
     * 
     * @return the request id
     */
    public static String getRequestId() {
        return reqeustIdThreadLocal.get();
    }

    /**
     * Set request id for current request thread.
     * 
     * @param requestId
     *            the request id to be set
     */
    public static void setRequestId(String requestId) {
        reqeustIdThreadLocal.set(requestId);
    }
}
