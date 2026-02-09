package ceng.hrv4.backend.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record LoginRequestDto(

        @NotBlank(message = "Email cannot be empty.")
        String email,

        @NotBlank(message = "Password cannot be empty.")

        String password

) {}

