package com.company.iotmonitor.ingestion.interceptor;

import com.company.iotmonitor.ingestion.exception.RateLimitException;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, Bucket> buckets;
    private final int rateLimitRequests;
    private final int rateLimitDuration;

    public RateLimitInterceptor(
            @Value("${iot.rate.limit.requests}") int rateLimitRequests,
            @Value("${iot.rate.limit.duration}") int rateLimitDuration) {
        this.buckets = new ConcurrentHashMap<>();
        this.rateLimitRequests = rateLimitRequests;
        this.rateLimitDuration = rateLimitDuration;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();
        String deviceId = extractDeviceIdFromPath(path);
        
        if (deviceId == null) {
            return true; // Skip rate limiting if no deviceId in path
        }

        Bucket bucket = buckets.computeIfAbsent(deviceId, k -> createNewBucket());
        
        if (bucket.tryConsume(1)) {
            return true;
        } else {
            throw new RateLimitException(
                "Rate limit exceeded. Try again in " + rateLimitDuration + " seconds",
                rateLimitDuration);
        }
    }

    private String extractDeviceIdFromPath(String path) {
        // Matches paths like /api/ingestion/devices/{deviceId}/readings
        if (path.matches(".*/devices/([^/]+)/readings.*")) {
            String[] parts = path.split("/");
            return parts[parts.length - 3]; // deviceId is third from last
        }
        return null;
    }

    private Bucket createNewBucket() {
        Refill refill = Refill.intervally(rateLimitRequests, Duration.ofSeconds(rateLimitDuration));
        Bandwidth limit = Bandwidth.classic(rateLimitRequests, refill);
        return Bucket.builder().addLimit(limit).build();
    }
}