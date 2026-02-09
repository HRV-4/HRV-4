package ceng.hrv4.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document (collection = "tests")
public class Test {
    @Id
    private String id;
}
