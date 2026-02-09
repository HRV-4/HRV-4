package ceng.hrv4.backend.entity;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Document(collection = "processed_datas")
public class ProcessedData extends BaseDocument {
    public ProcessedData() {}

    public ProcessedData(String userId, Instant measurementTime) {
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

    @Field("heart_beats")
    private Double heartBeats;

    @Field("min_hr")
    private Double minHr;

    @Field("max_hr")
    private Double maxHr;

    @Field("gvi")
    private Double gvi;

    @Field("dynamic_a")
    private Double dynamicA;

    @Field("dynamic_b")
    private Double dynamicB;

    @Field("tp")
    private Double tp;

    @Field("ulf")
    private Double ulf;

    @Field("lf")
    private Double lf;

    @Field("hf")
    private Double hf;

    @Field("vlf")
    private Double vlf;

    @Field("pnn_50")
    private Double pnn50;

    @Field("sdnn")
    private Double sdnn;

    @Field("rmssd")
    private Double rmssd;

    // ---- Night values ----
    @Field("tp_night")
    private Double tpNight;

    @Field("ulf_night")
    private Double ulfNight;

    @Field("lf_night")
    private Double lfNight;

    @Field("hf_night")
    private Double hfNight;

    @Field("vlf_night")
    private Double vlfNight;

    @Field("pnn_50_night")
    private Double pnn50Night;

    @Field("sdnn_night")
    private Double sdnnNight;

    @Field("rmssd_night")
    private Double rmssdNight;


    @Field("burnout_resistance")
    private Double burnoutResistance;

    @Field("burnout_resistance_percentage")
    private Double burnoutResistancePercentage;

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
        return "ProcessedData{" +
                "id='" + getId() + '\'' +
                ", userId='" + userId + '\'' +
                ", measurementTime=" + measurementTime +
                ", healthState=" + healthState +
                ", stress=" + stress +
                ", createdAt=" + getCreatedAt() +
                '}';
    }

}
