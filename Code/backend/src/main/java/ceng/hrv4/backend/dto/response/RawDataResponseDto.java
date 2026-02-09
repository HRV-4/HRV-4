package ceng.hrv4.backend.dto.response;

import java.time.Instant;

public record RawDataResponseDto(
        String id,
        String userId,
        String activityId,
        Instant measurementStartTime,
        Instant measurementEndTime,
        String deviceName,
        Integer rrCount,
        Instant createdAt
) {}
