package ceng.hrv4.backend.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record ModelOutputRequestDto(

        @NotBlank(message = "User ID cannot be empty.")
        String userId,
        @NotNull(message = "Measurement time is required.")
        Instant measurementTime,
        String measurementId

) {}
