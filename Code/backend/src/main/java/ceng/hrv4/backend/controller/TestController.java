package ceng.hrv4.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping ("api/v1/test")
public class TestController {
    /* this is just a test, don't use template here. use a repository instead */
    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<Void> ok() {
        ceng.hrv4.backend.entity.Test testDoc = new ceng.hrv4.backend.entity.Test();
        mongoTemplate.save(testDoc);
        return ResponseEntity.ok().build();
    }
}
