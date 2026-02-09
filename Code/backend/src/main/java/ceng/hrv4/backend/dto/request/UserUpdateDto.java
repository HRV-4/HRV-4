package ceng.hrv4.backend.dto.request;

import ceng.hrv4.backend.entity.Activity;
import java.util.List;

public record UserUpdateDto(
        Integer age,
        String gender,
        String clinicalStory,
        List<String> notes,
        List<Activity> activities
) {}

