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

@Aspect
@Component
public class RestControllerLoggingAspect {
    
    private static final Logger log = LoggerFactory.getLogger(RestControllerLoggingAspect.class);

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void restControllerPointcut() {
    }

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