package com.epam.rd.autocode.assessment.appliances.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;

/**
 * Aspect for logging REST API requests and responses.
 */
@Aspect
@Component
public class RestControllerLoggingAspect {
    
    private static final Logger log = LoggerFactory.getLogger(RestControllerLoggingAspect.class);

    /**
     * Pointcut that matches all REST controllers.
     */
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void restControllerPointcut() {
        // Method is empty as this is just a Pointcut, the implementations are in the advices.
    }

    /**
     * Advice that logs REST API requests before execution.
     */
    @Before("restControllerPointcut()")
    public void logRestRequest(JoinPoint joinPoint) {
        if (log.isInfoEnabled()) {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                log.info("REST API Request: {} {} | Controller: {}.{} | Parameters: {}",
                        request.getMethod(),
                        request.getRequestURI(),
                        joinPoint.getSignature().getDeclaringTypeName(),
                        joinPoint.getSignature().getName(),
                        Arrays.toString(joinPoint.getArgs()));
            }
        }
    }

    /**
     * Advice that logs REST API responses after successful execution.
     */
    @AfterReturning(pointcut = "restControllerPointcut()", returning = "result")
    public void logRestResponse(JoinPoint joinPoint, Object result) {
        if (log.isInfoEnabled()) {
            log.info("REST API Response: {}.{} | Result: {}",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    result != null ? result.getClass().getSimpleName() : "void");
        }
    }
}
