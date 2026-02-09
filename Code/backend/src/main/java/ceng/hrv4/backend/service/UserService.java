// UserService.java
package ceng.hrv4.backend.service;

import ceng.hrv4.backend.dto.request.LoginRequestDto;
import ceng.hrv4.backend.dto.request.UserUpdateDto;
import ceng.hrv4.backend.dto.request.ChangePasswordDto;
import ceng.hrv4.backend.dto.request.UserRegisterDto;
import ceng.hrv4.backend.dto.response.UserResponseDto;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface UserService {

    ResponseEntity<UserResponseDto> registerUser(UserRegisterDto registerDto);

    ResponseEntity<String> deleteUser(String userId);

    ResponseEntity<UserResponseDto> findUserById(String userId);

    ResponseEntity<UserResponseDto> findUserByEmail(String email);

    ResponseEntity<List<UserResponseDto>> findAllUsers();

    ResponseEntity<UserResponseDto> updateUser(String userId, UserUpdateDto updateDto);

    ResponseEntity<String> changePassword(String userId, ChangePasswordDto dto);

    ResponseEntity<?> loginUser(LoginRequestDto loginRequestDto);

    ResponseEntity<?> refreshToken(String refreshToken);

    ResponseEntity<?> logout(String refreshToken);

    // Note: loadUserByUsername is NOT needed here, it will be called by the authenticate
}

