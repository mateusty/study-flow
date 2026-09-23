package com.studyflow.studyflow.services;

import com.studyflow.studyflow.entities.User;
import com.studyflow.studyflow.exceptions.NotFoundException;
import com.studyflow.studyflow.model.UserRegisterDTO;
import com.studyflow.studyflow.repositories.UserRepository;
import com.studyflow.studyflow.security.AuthenticatedUser;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class UserService {

    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private JwtService jwtService;

    public void registerUser(UserRegisterDTO user) {
        User newUser = new User();
        String hashedPassword = hashPassword(user.getPassword());

        newUser.setEmail(user.getEmail());
        newUser.setPassword(hashedPassword);
        newUser.setRoles(List.of("USER"));
        userRepository.insert(newUser);
    }

    public String loginUser(UserRegisterDTO user) {
        User dbUser = userRepository.findByEmail(user.getEmail());

        if(!doPasswordMatch(user.getPassword(), dbUser.getPassword())) {
            throw new NotFoundException("Não existe um usuário cadastrado com o email: " + user.getEmail());
        }
        Collection<GrantedAuthority> authorities = dbUser.getRoles()
                .stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        AuthenticatedUser authUser = new AuthenticatedUser(UUID.fromString(dbUser.getId()), dbUser.getEmail(), authorities);
        return jwtService.generateToken(authUser);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean doPasswordMatch(String password, String hashedPassword) {
        return passwordEncoder.matches(password, hashedPassword);
    }
}
