package ceng.hrv4.backend.dto.response;

import java.time.Instant;


public record ModelOutputResponseDto(
        String id,
        String userId,
        Instant measurementTime,
        Double biologicalAge,
        Double biologicalAgePercentage,
        Double burnoutResistance,
        Double burnoutResistancePercentage,
        Double performancePotential,
        Double performancePotentialPercentage,
        Double stress,
        Double stressPercentage,
        Double healthState,
        Double healthStatePercentage
) {}


