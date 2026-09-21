package com.studyflow.studyflow.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @GetMapping
    public ResponseEntity<String> get() {
        return ResponseEntity.ok("Teste rodando API no vscode");
    }
    
}
