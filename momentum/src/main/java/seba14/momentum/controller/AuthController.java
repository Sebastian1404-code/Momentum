package seba14.momentum.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import seba14.momentum.config.JwtUtil;
import seba14.momentum.model.User;
import org.springframework.web.bind.annotation.*;
import seba14.momentum.repository.UserRepository;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

/**
 * Controller for handling authentication-related endpoints such as registration and login.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    /**
     * Constructs an AuthController with required dependencies.
     *
     * @param jwtUtil          Utility for generating JWT tokens.
     * @param passwordEncoder  Encoder for securely storing user passwords.
     * @param userRepository   Repository for accessing user data.
     */
    public AuthController(JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    /**
     * Registers a new user by encoding the password and saving the user to the repository.
     *
     * @param user The user object containing username and password.
     * @return Response indicating success or failure.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully.");
    }

    /**
     * Authenticates a user based on the provided credentials and returns a JWT token if successful.
     *
     * @param user The user object containing username and password.
     * @return JWT token and user ID if authentication is successful, or an error message otherwise.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> storedUser = userRepository.findByUsername(user.getUsername());
        if (storedUser.isEmpty() || !passwordEncoder.matches(user.getPassword(), storedUser.get().getPassword())) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid username or password"));
        }
        String token = jwtUtil.generateToken(storedUser.get().getUsername());
        Long id = storedUser.get().getId();
        System.out.println("Id:" + id);
        return ResponseEntity.ok(new AuthResponse(token, id));
    }

    /**
     * Inner class representing a successful authentication response.
     */
    static class AuthResponse {
        private String token;
        private Long userId;

        /**
         * Constructs an AuthResponse with a JWT token and user ID.
         *
         * @param token  The JWT token.
         * @param userId The ID of the authenticated user.
         */
        public AuthResponse(String token, Long userId) {
            this.token = token;
            this.userId = userId;
        }

        public String getToken() {
            return token;
        }

        public Long getUserId() {
            return userId;
        }
    }

    /**
     * Inner class representing an error response.
     */
    static class ErrorResponse {
        private String message;

        /**
         * Constructs an ErrorResponse with a specific message.
         *
         * @param message The error message.
         */
        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
