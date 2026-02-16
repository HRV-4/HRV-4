package ceng.hrv4.backend.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Document(collection = "activities")
public class Activity extends BaseDocument {

    @Field("name")
    private String name;

    @Field("category")
    private String category;

    @Field("durationMin")
    private Integer durationMin;

    // ─── Optional fields ───

    @Field("intensity")
    private String intensity;

    @Field("calories")
    private Integer calories;

    @Field("note")
    private String note;

    @Field("date")
    private String date;

    @Field("time")
    private String time;

    @Field("userId")
    private String userId;

    public Activity() {}

    public Activity(String name, String category, Integer durationMin) {
        this.name = name;
        this.category = category;
        this.durationMin = durationMin;
    }
}