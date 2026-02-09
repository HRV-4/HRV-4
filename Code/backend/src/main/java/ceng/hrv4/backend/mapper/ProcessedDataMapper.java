package ceng.hrv4.backend.mapper;

import ceng.hrv4.backend.dto.request.ProcessedDataRequestDto;
import ceng.hrv4.backend.dto.response.ProcessedDataResponseDto;
import ceng.hrv4.backend.entity.ProcessedData;
import org.springframework.stereotype.Component;


@Component
public class ProcessedDataMapper {

    public ProcessedData toEntity(ProcessedDataRequestDto dto) {
        ProcessedData entity = new ProcessedData();

        entity.setUserId(dto.userId());
        entity.setMeasurementId(dto.MeasurementId());
        entity.setMeasurementTime(dto.measurementTime());


        return entity;
    }

    public ProcessedDataResponseDto toDto(ProcessedData entity) {
        return new ProcessedDataResponseDto(
                entity.getId(),
                entity.getUserId(),
                entity.getMeasurementTime(),
                entity.getRmssd(),
                entity.getSdnn(),
                entity.getPnn50(),
                entity.getMinHr(),
                entity.getMaxHr(),
                entity.getGvi(),
                entity.getStress(),
                entity.getStressPercentage(),
                entity.getHealthState(),
                entity.getHealthStatePercentage(),
                entity.getBiologicalAge(),
                entity.getBiologicalAgePercentage(),
                entity.getBurnoutResistance(),
                entity.getBurnoutResistancePercentage(),
                entity.getPerformancePotential(),
                entity.getPerformancePotentialPercentage(),
                entity.getCreatedAt()
        );
    }
}
