package com.ledger.music.controller;

import com.ledger.music.domain.User;
import com.ledger.music.dto.AuthRequest;
import com.ledger.music.dto.AuthResponse;
import com.ledger.music.exception.DuplicateResourceException;
import com.ledger.music.repository.UserRepository;
import com.ledger.music.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody AuthRequest authRequest) {
        if (userRepository.existsByUsername(authRequest.getUsername())) {
            throw new DuplicateResourceException("Username '" + authRequest.getUsername() + "' is already taken");
        }

        User user = User.builder()
                .username(authRequest.getUsername())
                .password(passwordEncoder.encode(authRequest.getPassword()))
                .role("ROLE_USER")
                .build();

        User saved = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .username(saved.getUsername())
                .userId(saved.getId())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByUsername(authRequest.getUsername()).orElseThrow();

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .userId(user.getId())
                .build());
    }
}
