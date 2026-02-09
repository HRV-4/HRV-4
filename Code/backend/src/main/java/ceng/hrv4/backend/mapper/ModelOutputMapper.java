package ceng.hrv4.backend.mapper;


import ceng.hrv4.backend.dto.request.ModelOutputRequestDto;
import ceng.hrv4.backend.dto.response.ModelOutputResponseDto;
import ceng.hrv4.backend.entity.ModelOutput;
import org.springframework.stereotype.Component;

@Component
public class ModelOutputMapper {
    public ModelOutput toEntity(ModelOutputRequestDto dto) {
        ModelOutput output = new ModelOutput();
        output.setUserId(dto.userId());
        output.setMeasurementId(dto.measurementId());
        output.setMeasurementTime(dto.measurementTime());
        return output;

}
    public ModelOutputResponseDto toDto(ModelOutput output) {
        return new ModelOutputResponseDto(
                output.getId(),
                output.getUserId(),
                output.getMeasurementTime(),
                output.getBiologicalAge(),
                output.getBiologicalAgePercentage(),
                output.getBurnoutResistance(),
                output.getBurnoutResistancePercentage(),
                output.getPerformancePotential(),
                output.getPerformancePotentialPercentage(),
                output.getStress(),
                output.getStressPercentage(),
                output.getHealthState(),
                output.getHealthStatePercentage()
        );
    }
}