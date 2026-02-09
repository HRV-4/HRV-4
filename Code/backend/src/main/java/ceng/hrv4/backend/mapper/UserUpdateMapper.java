package ceng.hrv4.backend.mapper;


import ceng.hrv4.backend.dto.request.UserRegisterDto;
import ceng.hrv4.backend.dto.request.UserUpdateDto;
import ceng.hrv4.backend.dto.response.UserResponseDto;
import ceng.hrv4.backend.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserUpdateMapper {

    public User toEntity(UserUpdateDto dto) {
        User user = new User();
        user.setAge(dto.age());
        user.setGender(dto.gender());
        user.setNotes(dto.notes());
        user.setClinicalStory(dto.clinicalStory());
        user.setActivities(dto.activities());
        return user;
    }

    public UserResponseDto toResponseDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getAge(),
                user.getGender(),
                user.getNotes(),
                user.getClinicalStory(),
                user.getActivities()
        );
    }
}

