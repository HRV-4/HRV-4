package ceng.hrv4.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ActivityRequestDto(

        @NotBlank(message = "Activity name cannot be empty.")
        String name,

        @NotBlank(message = "Category cannot be empty.")
        String category,

        @NotNull(message = "Duration cannot be null.")
        Integer durationMin,

        // ─── Optional fields ───
        String intensity,
        Integer calories,
        String note,
        String date,
        String time,
        String userId

) {}