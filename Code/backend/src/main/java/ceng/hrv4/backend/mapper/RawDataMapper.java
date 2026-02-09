package ceng.hrv4.backend.mapper;

import ceng.hrv4.backend.dto.request.RawDataRequestDto;
import ceng.hrv4.backend.dto.response.RawDataResponseDto;
import ceng.hrv4.backend.entity.RawData;
import org.springframework.stereotype.Component;


@Component
public class RawDataMapper {


    public RawData toEntity(RawDataRequestDto dto) {
        RawData entity = new RawData();
        entity.setDeviceName(dto.deviceName());
        entity.setUserId(dto.userId());
        entity.setActivityId(dto.activityId());
        entity.setMeasurementStartTime(dto.measurementStartTime());
        entity.setMeasurementEndTime(dto.measurementEndTime());
        entity.setRrIntervalsMs(dto.rrIntervalsMs());
        return entity;
    }



    public RawDataResponseDto toDto(RawData entity) {
        return new RawDataResponseDto(
                entity.getId(),
                entity.getUserId(),
                entity.getActivityId(),
                entity.getMeasurementStartTime(),
                entity.getMeasurementEndTime(),
                entity.getDeviceName(),
                entity.getRrIntervalsMs() != null ? entity.getRrIntervalsMs().size() : 0,
                entity.getCreatedAt()
        );
    }
}
