package ceng.hrv4.backend.dto.response;


import java.util.List;
import ceng.hrv4.backend.entity.Activity;

public record UserResponseDto(
        String id,
        String email,
        String firstName,
        String lastName,
        Integer age,
        String gender,
        List<String> notes,
        String clinicalStory,
        List<Activity> activities


) {}


