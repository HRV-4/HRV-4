package ceng.hrv4.backend.entity;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.Instant;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Document(collection = "raw_datas")
public class RawData extends BaseDocument {

    @Indexed
    @Field("user_id")
    private String userId;

    @Indexed
    @Field("measurement_start_time")
    private Instant measurementStartTime;
    @Indexed
    @Field("measurement_end_time")
    private Instant measurementEndTime;
    @Field("activity_id")
    private String activityId;
    @Field("device_name")
    private String deviceName;


    @Field("rr_intervals_ms")
    private List<Double> rrIntervalsMs;

    @Field("raw_duration_seconds")
    private Double rawDurationSeconds;

    public RawData() {}

    public RawData(String userId, Instant measurementStartTime, Instant measurementEndTime, List<Double> rrIntervalsMs) {
        this.userId = userId;
        this.measurementStartTime = measurementStartTime;
        this.measurementEndTime = measurementEndTime;
        this.rrIntervalsMs = rrIntervalsMs;
    }

    @Override
    public String toString() {
        return "RawData{" +
                "id='" + getId() + '\'' +
                ", userId='" + userId + '\'' +
                ", measurementStartTime=" + measurementStartTime +
                ", rrIntervalsCount=" + (rrIntervalsMs != null ? rrIntervalsMs.size() : 0) +
                ", createdAt=" + getCreatedAt() +
                '}';
    }
}
