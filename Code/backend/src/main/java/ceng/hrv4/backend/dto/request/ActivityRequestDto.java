package ceng.hrv4.backend.dto.request;

import jakarta.validation.constraints.NotBlank;


public record ActivityRequestDto(

        @NotBlank(message = "Activity name cannot be empty.")
        String name

) {}