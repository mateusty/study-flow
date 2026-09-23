package com.studyflow.studyflow.repositories;

import com.studyflow.studyflow.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;

public interface UserRepository extends MongoRepository<User, UUID> {
}
