package com.epam.rd.autocode.assessment.appliances.service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Slf4j
@Service
public class LoginAttemptService {
    private static final int MAX_ATTEMPTS = 5;
    private static final int BLOCK_DURATION_SECONDS = 10;
    private final Map<String, LoginAttempt> attemptsCache = new ConcurrentHashMap<>();
    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
        log.debug("Login succeeded for key: {}, attempts reset", key);
    }
    public void loginFailed(String key) {
        LoginAttempt attempt = attemptsCache.getOrDefault(key, new LoginAttempt());
        attempt.increment();
        attemptsCache.put(key, attempt);
        log.warn("Login failed for key: {}, attempts: {}/{}", key, attempt.getAttempts(), MAX_ATTEMPTS);
    }
    public boolean isBlocked(String key) {
        LoginAttempt attempt = attemptsCache.get(key);
        if (attempt == null) {
            return false;
        }
        if (attempt.isExpired(BLOCK_DURATION_SECONDS)) {
            attemptsCache.remove(key);
            return false;
        }
        boolean blocked = attempt.getAttempts() >= MAX_ATTEMPTS;
        if (blocked) {
            log.warn("Login blocked for key: {} due to {} failed attempts", key, attempt.getAttempts());
        }
        return blocked;
    }
    public int getRemainingAttempts(String key) {
        LoginAttempt attempt = attemptsCache.get(key);
        if (attempt == null || attempt.isExpired(BLOCK_DURATION_SECONDS)) {
            return MAX_ATTEMPTS;
        }
        return Math.max(0, MAX_ATTEMPTS - attempt.getAttempts());
    }
    public int getBlockDurationMinutes() {
        return BLOCK_DURATION_SECONDS / 60;
    }
    public int getBlockDurationSeconds() {
        return BLOCK_DURATION_SECONDS;
    }
    private static class LoginAttempt {
        private int attempts = 0;
        private LocalDateTime firstAttemptTime = LocalDateTime.now();
        public void increment() {
            attempts++;
        }
        public int getAttempts() {
            return attempts;
        }
        public boolean isExpired(int durationSeconds) {
            return LocalDateTime.now().isAfter(firstAttemptTime.plusSeconds(durationSeconds));
        }
    }
}