package ceng.hrv4.backend.controller;

import ceng.hrv4.backend.dto.request.LoginRequestDto;
import ceng.hrv4.backend.dto.request.UserUpdateDto;
import ceng.hrv4.backend.dto.request.UserRegisterDto;
import ceng.hrv4.backend.dto.response.UserResponseDto;
import ceng.hrv4.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;


@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody UserRegisterDto registerDto) {
        return userService.registerUser(registerDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDto loginRequestDto) {
        // Endpoint for user login, receives LoginRequestDto and returns access and refresh tokens
        return userService.loginUser(loginRequestDto);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody String refreshToken) {
        return userService.refreshToken(refreshToken);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody String refreshToken) {
        return userService.logout(refreshToken);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        // Endpoint to get a list of all users
        return userService.findAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable("id") String userId) {
        // Endpoint to get a single user by their ID
        return userService.findUserById(userId);
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserResponseDto> getUserByEmail(@RequestParam String email) {
        return userService.findUserByEmail(email);
    }

    @PatchMapping("/{id}/age")
    public ResponseEntity<UserResponseDto> updateAge(
            @PathVariable("id") String userId,
            @RequestBody Integer age) {
        UserUpdateDto dto = new UserUpdateDto(age, null, null, null, null);
        return userService.updateUser(userId, dto);
    }

    @PatchMapping("/{id}/gender")
    public ResponseEntity<UserResponseDto> updateGender(
            @PathVariable("id") String userId,
            @RequestBody String gender) {
        UserUpdateDto dto = new UserUpdateDto(null, gender, null, null, null);
        return userService.updateUser(userId, dto);
    }

    @PatchMapping("/{id}/clinical-story")
    public ResponseEntity<UserResponseDto> updateClinicalStory(
            @PathVariable("id") String userId,
            @RequestBody String clinicalStory) {
        UserUpdateDto dto = new UserUpdateDto(null, null, clinicalStory, null, null);
        return userService.updateUser(userId, dto);
    }

    @PatchMapping("/{id}/notes")
    public ResponseEntity<UserResponseDto> updateNotes(
            @PathVariable("id") String userId,
            @RequestBody List<String> notes) {
        UserUpdateDto dto = new UserUpdateDto(null, null, null, notes, null);
        return userService.updateUser(userId, dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable("id") String userId,
            @RequestBody UserUpdateDto updateDto) {
        // Endpoint to update an existing user's details
        return userService.updateUser(userId, updateDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") String userId) {
        // Endpoint to delete a user by ID, returns a confirmation message
        return userService.deleteUser(userId);
    }
}

