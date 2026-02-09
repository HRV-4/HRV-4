package ceng.hrv4.backend.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

public record RawDataRequestDto(

        @NotBlank(message = "User ID cannot be empty.")
        String userId,
        String activityId,

        @NotNull(message = "Measurement start time is required.")
        Instant measurementStartTime,
        @NotNull(message = "Measurement end time is required.")
        Instant measurementEndTime,

        String deviceName,


        @NotNull(message = "RR intervals list cannot be null.")
        @Size(min = 1, message = "RR intervals list must contain at least one value.")
        List<Double> rrIntervalsMs
) {}
