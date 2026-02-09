package ceng.hrv4.backend.dto.request;
import jakarta.validation.constraints.NotBlank;


import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Email;
    public record ChangePasswordDto(
            String oldPassword,
            @NotBlank(message = "Password cannot be empty.")
            @Pattern(
                    regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=*!])(?=\\S+$).{8,64}$",
                    message = "Password must be 8-64 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            )
            String newPassword
    ) {}



