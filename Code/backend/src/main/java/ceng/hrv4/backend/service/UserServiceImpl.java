// package is a Java keyword that declares which folder (or "package") this file lives in, to organize your project.
package ceng.hrv4.backend.service;

import ceng.hrv4.backend.dto.request.LoginRequestDto;
import ceng.hrv4.backend.entity.RefreshToken;
import ceng.hrv4.backend.entity.User;
import ceng.hrv4.backend.mapper.UserRegisterMapper;
import ceng.hrv4.backend.dto.request.UserUpdateDto;
import ceng.hrv4.backend.dto.request.ChangePasswordDto;
import ceng.hrv4.backend.dto.request.UserRegisterDto;
import ceng.hrv4.backend.dto.response.UserResponseDto;
import ceng.hrv4.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired; //This is the Spring annotation for Dependency Injection.
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails; //The tools we need to build a secure login system.
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList; // For UserDetails
import java.util.List;
import java.util.Map;

//UserDetailsService is an interface from Spring Security. By "implementing" it, we are promising to provide
//a specific method (loadUserByUsername) that Spring Security can use to find a user when they try to log in.
@Slf4j
@Service  //Used to label this class as a Service.
public class UserServiceImpl implements UserService, UserDetailsService {
    // private final means that they will be const after they'se set in the constructor (I guess)
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Injected from SecurityConfig
    private final UserRegisterMapper userRegisterMapper;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final RefreshTokenService refreshTokenService;

    //It tells Spring, "When you create this UserService, you must also find the UserRepository bean and the PasswordEncoder bean and pass them into this constructor."
    //This is Dependency Injection. You never have to write new UserRepository() or new PasswordEncoder(); Spring handles it all.
    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, UserRegisterMapper userRegisterMapper, @Lazy AuthenticationManager authenticationManager,
                           JWTService jwtService, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder; //the password encryption tool
        this.userRegisterMapper = userRegisterMapper;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }


    /**
     * Business logic for registering a new user using a DTO and Mapper.
     * @param registerDto The DTO containing registration data.
     * @return A UserResponseDto of the newly created user.
     * @throws RuntimeException if the email is already in use.
     */
    @Override
    public ResponseEntity<UserResponseDto> registerUser(UserRegisterDto registerDto) {
        try {
            // 1. Business Logic: Check if email already exists
            if (userRepository.existsByEmail(registerDto.email())) {
                log.error("Email is already in use!");
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            // 2. Mapping Logic: Use the mapper to create the entity
            User newUser = userRegisterMapper.toEntity(registerDto);

            // 3. Business Logic: Handle fields the mapper doesn't
            // Call the User entity's setPassword, which handles encoding
            String encodedPassword = passwordEncoder.encode(registerDto.password());
            newUser.setPassword(encodedPassword);

            // Convert List<String> clinicalStory to a single String for the database
            if (registerDto.clinicalStory() != null && !registerDto.clinicalStory().isEmpty()) {
                String clinicalStoryString = String.join(";", registerDto.clinicalStory());
                newUser.setClinicalStory(clinicalStoryString);
            }

            // 4. Save the user to the database
            User savedUser = userRepository.save(newUser);

            // 5. Mapping Logic: Convert the saved entity to a DTO and return it
            return new ResponseEntity<>(userRegisterMapper.toResponseDto(savedUser), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a user by their ID.
     * @param userId The ID of the user to delete.
     * @throws RuntimeException if the user is not found.
     */
    @Override
    public ResponseEntity<String> deleteUser(String userId) {
        try {
            // Check if user exists before trying to delete
            if (!userRepository.existsById(userId)) {
                return new ResponseEntity<>("User not found, cannot delete.", HttpStatus.NOT_FOUND);
            }

            // We call the built-in 'deleteById' method from JpaRepository.
            userRepository.deleteById(userId);
            return new ResponseEntity<>("User deleted successfully.", HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Cannot delete user.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds a single user by their ID.
     * @param userId The ID of the user to find.
     * @return UserResponseDto of the found User.
     * @throws RuntimeException if the user is not found.
     */
    @Override
    public ResponseEntity<UserResponseDto> findUserById(String userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(userRegisterMapper.toResponseDto(user), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds a single user by their email.
     * @param email The email of the user to find.
     * @return UserResponseDto of the found User.
     * @throws RuntimeException if the user is not found.
     */
    @Override
    public ResponseEntity<UserResponseDto> findUserByEmail(String email) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(userRegisterMapper.toResponseDto(user), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Finds all users and converts them to DTOs.
     * @return A list of all UserResponseDto objects.
     */
    @Override
    public ResponseEntity<List<UserResponseDto>> findAllUsers() {
        // 1. Get the list of User entities from the repository
        try {
            List<UserResponseDto> dtos = userRepository.findAll()
                    .stream()
                    .map(userRegisterMapper::toResponseDto)
                    .toList();

            return new ResponseEntity<>(dtos, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Updates a user's profile information.
     * @param userId The ID of the user to update.
     * @param updateDto A DTO containing the fields to update (null fields are ignored).
     * @return UserResponseDTo of the updated and saved User object.
     * @throws RuntimeException if the user is not found.
     */
    @Override
    public ResponseEntity<UserResponseDto> updateUser(String userId, UserUpdateDto updateDto) {
        // 1. Find the existing user from the database
        try {
            User existingUser = userRepository.findById(userId).orElse(null);

            if (existingUser == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }

            // 2. Check each field from the DTO and update if it's not null
            // This allows the frontend to send only the fields they want to change.
            if (updateDto.age() != null) {
                existingUser.setAge(updateDto.age());
            }
            if (updateDto.gender() != null) {
                existingUser.setGender(updateDto.gender());
            }
            if (updateDto.clinicalStory() != null) {
                existingUser.setClinicalStory(updateDto.clinicalStory());
            }
            if (updateDto.notes() != null) {
                existingUser.setNotes(updateDto.notes());
            }

            // 3. Save the modified user back to the database
            // JPA knows that this is an UPDATE, not a new INSERT.
            User user = userRepository.save(existingUser);
            return new ResponseEntity<>(userRegisterMapper.toResponseDto(user), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Securely changes a user's password.
     * @param userId The ID of the user changing their password.
     * @param dto A DTO containing the old and new password.
     * @throws RuntimeException if the user is not found or old password doesn't match.
     */
    @Override
    public ResponseEntity<String> changePassword(String userId, ChangePasswordDto dto) {
        try {
            // 1. Find the user
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return new ResponseEntity<>("User not found, cannot change password", HttpStatus.NOT_FOUND);
            }
            // 2. Check if the OLD password is correct
            // We use the passwordEncoder's "matches" method for this.
            //
            if (!passwordEncoder.matches(dto.oldPassword(), user.getPassword())) {
                return new ResponseEntity<>("Old password does not match.", HttpStatus.BAD_REQUEST);
            }

            // 3. If it matches, encode and set the NEW password
            user.setPassword(dto.newPassword());

            // 4. Save the user
            userRepository.save(user);

            return new ResponseEntity<>("Password changed successfully.", HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Cannot change password.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /* This method is NOT the login function. Do NOT call this method directly from the Controller.
     *
     * This is a "callback" method required by the 'UserDetailsService' interface.
     * Spring Security's internal 'AuthenticationManager' will call this method *automatically*
     * when a login attempt happens.
     *
     * TO PERFORM A LOGIN:
     * The Controller must:
     * 1. Autowire the 'AuthenticationManager'.
     * 2. Call 'authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password))'.
     *
     * This 'loadUserByUsername' method's only job is to:
     * 1. Take the 'email' (as the username) from the AuthenticationManager.
     * 2. Find the user in our database (e.g., userRepository.findByEmail(email)).
     * 3. Return a 'UserDetails' object containing the user's email and their *encrypted* password.
     *
     * Spring Security will then *automatically* compare the encrypted password from this UserDetails
     * with the plain-text password from the login request.*/

    /**
     * This method is required by Spring Security (UserDetailsService).
     * It loads a user by their "username" (which we use as email) for login.
     * @param email The email of the user trying to log in.
     * @return UserDetails object for Spring Security.
     * @throws UsernameNotFoundException if the user is not found.
     */
    //When a user tries to log in, Spring Security will call this method and give it the "username" (which we're using as email).
    //We are overriding this method from the UserDetailsService interface.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));
        //This is how Spring Security knows the login failed due to a bad username.

        //Converts our User entity to Spring Security's UserDetails object
        //The org.springframework.security.core.userdetails.User is a class provided by Spring Security that implements UserDetails.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // Empty list for authorities/roles for now
        );
        //Spring Security will then take this UserDetails object, compare its encrypted password to the plain-text password the user typed in,
        //and either approve or deny the login.
    }

    @Override
    public ResponseEntity<?> loginUser(LoginRequestDto dto) {
        try {
            String username = dto.email();
            String password = dto.password();

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(username, password)
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtService.generateToken(username);
            String refreshToken = refreshTokenService.createRefreshToken(username);

            return ResponseEntity.ok(
                    Map.of(
                            "accessToken", accessToken,
                            "refreshToken", refreshToken
                    )
            );
        }
        catch (Exception e) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public ResponseEntity<?> refreshToken(String refreshToken) {
        try {
            RefreshToken token = refreshTokenService.verify(refreshToken);

            String newAccessToken = jwtService.generateToken(token.getUsername());
            String newRefreshToken =
                    refreshTokenService.rotate(token);

            return ResponseEntity.ok(
                    Map.of(
                            "accessToken", newAccessToken,
                            "refreshToken", newRefreshToken
                    )
            );
        }
        catch (Exception e) {
            return new ResponseEntity<>("Invalid refresh token", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public ResponseEntity<?> logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
        return ResponseEntity.ok("Logged out");
    }
}