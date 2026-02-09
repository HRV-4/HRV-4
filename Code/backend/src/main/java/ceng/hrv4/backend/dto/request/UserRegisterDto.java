package ceng.hrv4.backend.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;


public record UserRegisterDto(

        @NotBlank(message = "Email cannot be empty.")
        @Email(message = "Please provide a valid email address.")
        String email,

        @NotBlank(message = "Password cannot be empty.")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=*!])(?=\\S+$).{8,64}$",
                message = "Password must be 8–64 characters long and contain at least one uppercase letter, one lowercase letter, one number, one special character, and no whitespace."
        )
        String password,

        @NotBlank(message = "First name cannot be empty.")
        String firstName,

        @NotBlank(message = "Last name cannot be empty.")
        String lastName,

        Integer age,
        String gender,
        List<String> clinicalStory,
        String phone
) {}



