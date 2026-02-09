package ceng.hrv4.backend.mapper;

import ceng.hrv4.backend.dto.request.UserRegisterDto;
import ceng.hrv4.backend.dto.response.UserResponseDto;
import ceng.hrv4.backend.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public class UserRegisterMapper {

    public User toEntity(UserRegisterDto dto) {
        User user = new User();
        user.setEmail(dto.email());
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setAge(dto.age());
        user.setGender(dto.gender());
        user.setPhone(dto.phone());
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

