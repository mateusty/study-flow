package com.studyflow.studyflow.controllers;

import com.studyflow.studyflow.entities.User;
import com.studyflow.studyflow.model.UserRegisterDTO;
import com.studyflow.studyflow.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<Void> registerUser(@Valid @RequestBody UserRegisterDTO user) {
        userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody UserRegisterDTO user) {
        String token = userService.loginUser(user);
        return ResponseEntity.ok(token);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
