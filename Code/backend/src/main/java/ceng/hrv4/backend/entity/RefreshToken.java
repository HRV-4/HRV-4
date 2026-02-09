package ceng.hrv4.backend.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Document(collection = "refresh_tokens")
public class RefreshToken {

    @Id
    private String id; // MongoDB uses String/ObjectId

    @Indexed(unique = true)
    private String token;

    private String username;

    //MongoDB can auto-delete expired refresh tokens
    @Indexed(expireAfter = "0s")
    private Date expiryDate;

    private boolean revoked = false;

    private String replacedByToken;

    private Date createdAt = new Date();
}