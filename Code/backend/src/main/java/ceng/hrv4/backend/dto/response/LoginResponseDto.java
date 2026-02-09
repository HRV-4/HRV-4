package ceng.hrv4.backend.dto.response;



public record LoginResponseDto(
        String token,
        UserResponseDto user
) {}
