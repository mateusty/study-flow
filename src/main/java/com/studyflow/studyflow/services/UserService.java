package com.studyflow.studyflow.services;

import com.studyflow.studyflow.entities.User;
import com.studyflow.studyflow.model.UserRegisterDTO;
import com.studyflow.studyflow.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class UserService {

    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;

    public void registerUser(UserRegisterDTO user) {
        User newUser = new User();
        String hashedPassword = hashPassword(user.getPassword());

        newUser.setEmail(user.getEmail());
        newUser.setPassword(hashedPassword);
        newUser.setRoles(List.of("USER"));
        userRepository.insert(newUser);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean doPasswordMatch(String password, String hashedPassword) {
        return passwordEncoder.matches(password, hashedPassword);
    }
}
