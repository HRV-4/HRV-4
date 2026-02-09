package ceng.hrv4.backend.entity;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Document(collection = "model_outputs")
public class ModelOutput extends BaseDocument {
    public ModelOutput() {}
    public ModelOutput(String userId, Instant measurementTime) {
        this.userId = userId;
        this.measurementTime = measurementTime;
    }
    @Indexed
    @Field("measurement_id")
    private String measurementId;
    @Indexed
    @Field("user_id")
    private String userId;
    @Indexed
    @Field("measurement_time")
    private Instant measurementTime;
    @Field("biological_age")
    private Double biologicalAge;

    @Field("biological_age_percentage")
    private Double biologicalAgePercentage;
    @Field("burnout_resistance_percentage")
    private Double burnoutResistancePercentage;

    @Field("burnout_resistance")
    private Double burnoutResistance;

    @Field("performance_potential")
    private Double performancePotential;

    @Field("performance_potential_percentage")
    private Double performancePotentialPercentage;

    @Field("stress")
    private Double stress;

    @Field("stress_percentage")
    private Double stressPercentage;

    @Field("health_state")
    @Indexed
    private Double healthState;

    @Field("health_state_percentage")
    private Double healthStatePercentage;

    @Override
    public String toString() {
        return "ModelOutput{" +
                "id='" + getId() + '\'' +
                ", userId='" + userId + '\'' +
                ", measurementTime=" + measurementTime +
                ", biologicalAge=" + biologicalAge +
                ", stress=" + stress +
                ", createdAt=" + getCreatedAt() +
                '}';
    }


}
