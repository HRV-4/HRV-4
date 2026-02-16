package ceng.hrv4.backend.dto.response;

public record ActivityResponseDto(
        String id,
        String name,
        String category,
        Integer durationMin,
        // ─── Optional fields (may be null) ───
        String intensity,
        Integer calories,
        String note,
        String date,
        String time,
        String userId
) {}