package ceng.hrv4.backend.mapper;

import org.springframework.stereotype.Component;
import ceng.hrv4.backend.dto.request.ActivityRequestDto;
import ceng.hrv4.backend.dto.response.ActivityResponseDto;
import ceng.hrv4.backend.entity.Activity;

@Component
public class ActivityMapper {
    public Activity toEntity(ActivityRequestDto dto) {
        Activity activity = new Activity();
        activity.setName(dto.name());
        return activity;
    }
    public ActivityResponseDto toDto(Activity entity) {
        return new ActivityResponseDto(
                entity.getId(),
                entity.getName()
        );


    }
}
