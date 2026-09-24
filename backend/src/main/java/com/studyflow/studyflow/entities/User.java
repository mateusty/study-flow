package com.studyflow.studyflow.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.UUID;

@Data
@Document(collection = "users")
public class User {

    @Id
    private UUID id = UUID.randomUUID();

    @Indexed(unique = true)
    private String email;

    private String password;

    private List<String> roles;
}
