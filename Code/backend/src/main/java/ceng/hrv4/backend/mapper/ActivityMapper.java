package ceng.hrv4.backend.mapper;

import ceng.hrv4.backend.dto.request.ActivityRequestDto;
import ceng.hrv4.backend.dto.response.ActivityResponseDto;
import ceng.hrv4.backend.entity.Activity;
import org.springframework.stereotype.Component;

@Component
public class ActivityMapper {

    public Activity toEntity(ActivityRequestDto dto) {
        Activity activity = new Activity();
        // Required
        activity.setName(dto.name());
        activity.setCategory(dto.category());
        activity.setDurationMin(dto.durationMin());
        // Optional - set only if provided
        activity.setIntensity(dto.intensity());
        activity.setCalories(dto.calories());
        activity.setNote(dto.note());
        activity.setDate(dto.date());
        activity.setTime(dto.time());
        activity.setUserId(dto.userId());
        return activity;
    }

    public ActivityResponseDto toDto(Activity entity) {
        return new ActivityResponseDto(
                entity.getId(),
                entity.getName(),
                entity.getCategory(),
                entity.getDurationMin(),
                entity.getIntensity(),
                entity.getCalories(),
                entity.getNote(),
                entity.getDate(),
                entity.getTime(),
                entity.getUserId()
        );
    }
}