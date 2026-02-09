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
    public Activity() {}
    public Activity(String name) {
        this.name = name;
    }
}
