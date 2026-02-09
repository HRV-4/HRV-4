package ceng.hrv4.backend.dto.response;

import java.time.Instant;

public record ProcessedDataResponseDto(
        String id,
        String userId,
        Instant measurementTime,
        Double rmssd,
        Double sdnn,
        Double pnn50,
        Double minHr,
        Double maxHr,
        Double gvi,
        Double stress,
        Double stressPercentage,
        Double healthState,
        Double healthStatePercentage,
        Double biologicalAge,
        Double biologicalAgePercentage,
        Double burnoutResistance,
        Double burnoutResistancePercentage,
        Double performancePotential,
        Double performancePotentialPercentage,
        Instant createdAt
) {}
