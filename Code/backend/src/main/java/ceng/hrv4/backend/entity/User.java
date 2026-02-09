package ceng.hrv4.backend.entity;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "users")
public class User extends BaseDocument {

        @Field("age")
        private Integer age;
        @Field("gender")
        private String gender;
        @Field("first_name")
        private String firstName;
        @Field("last_name")
        private String lastName;
        @Indexed(unique = true)
        @Field("email")
        private String email;
        @Field("password")
        private String password;
        @Field("phone")
        private String phone;
        @Field("clinical_story")
        private String clinicalStory;
        @Field("notes")
        private List<String> notes;
        @Field("activities")
        private List<Activity> activities;





    public User(){

    }
    public User(Integer age, String gender,String firstName, String lastName, String email, String phone, String clinicalStory, List<String> notes) {
        this.age = age;
        this.gender = gender;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.clinicalStory = clinicalStory;
        this.notes = notes;
    }


    @Override
    public String toString() {
        return "User{" +
                "id='" + getId() + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                ", createdAt=" + getCreatedAt() +
                ", updatedAt=" + getUpdatedAt() +
                '}';
    }


}
