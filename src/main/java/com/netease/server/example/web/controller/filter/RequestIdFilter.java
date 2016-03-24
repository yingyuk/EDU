package com.netease.server.example.web.controller.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.log4j.Logger;

import com.netease.server.example.util.GeneralUtil;
import com.netease.server.example.util.RequestIdUtil;

/**
 * Filter for set request id.
 * 
 * @author jiaozhihui@corp.netease.com
 */
public class RequestIdFilter implements Filter {
    /**
     * Logger for this class.
     */
    private static Logger logger = Logger.getLogger(RequestIdFilter.class);

    /*
     * (non-Javadoc)
     * 
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
        // do nothing
    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse,
     * javax.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException,
            ServletException {
        String requestId = GeneralUtil.generateId();
        RequestIdUtil.setRequestId(requestId);

        logger.info("request " + requestId + " started");
        filterChain.doFilter(request, response);
        logger.info("request " + requestId + " ended");
    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // do nothing
    }
}
