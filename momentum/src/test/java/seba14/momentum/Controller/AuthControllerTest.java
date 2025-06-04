package seba14.momentum.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import seba14.momentum.config.JwtUtil;
import seba14.momentum.model.User;
import seba14.momentum.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthControllerTest {

    private AuthController authController;
    private JwtUtil jwtUtil;
    private BCryptPasswordEncoder passwordEncoder;
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        jwtUtil = mock(JwtUtil.class);
        passwordEncoder = new BCryptPasswordEncoder();
        userRepository = mock(UserRepository.class);

        authController = new AuthController(jwtUtil, passwordEncoder, userRepository);
    }

    @Test
    void testLoginSuccess() {
        // Given
        User inputUser = new User();
        inputUser.setUsername("john");
        inputUser.setPassword("123456");

        User storedUser = new User();
        storedUser.setId(1L);
        storedUser.setUsername("john");
        storedUser.setPassword(passwordEncoder.encode("123456"));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(storedUser));
        when(jwtUtil.generateToken("john")).thenReturn("mocked-token");

        // When
        ResponseEntity<?> response = authController.login(inputUser);

        // Then
        assertEquals(200, response.getStatusCodeValue());

        AuthController.AuthResponse authResponse = (AuthController.AuthResponse) response.getBody();
        assertNotNull(authResponse);
        assertEquals("mocked-token", authResponse.getToken());
        assertEquals(1L, authResponse.getUserId());
    }

    @Test
    void testLoginFailure_InvalidPassword() {
        // Given
        User inputUser = new User();
        inputUser.setUsername("john");
        inputUser.setPassword("wrongpass");

        User storedUser = new User();
        storedUser.setId(1L);
        storedUser.setUsername("john");
        storedUser.setPassword(passwordEncoder.encode("correctpass"));

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(storedUser));

        // When
        ResponseEntity<?> response = authController.login(inputUser);

        // Then
        assertEquals(401, response.getStatusCodeValue());

        AuthController.ErrorResponse errorResponse = (AuthController.ErrorResponse) response.getBody();
        assertNotNull(errorResponse);
        assertEquals("Invalid username or password", errorResponse.getMessage());
    }
}
