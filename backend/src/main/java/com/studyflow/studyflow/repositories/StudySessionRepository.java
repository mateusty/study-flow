package com.studyflow.studyflow.repositories;

import com.studyflow.studyflow.entities.StudySession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;

public interface StudySessionRepository extends MongoRepository<StudySession, UUID> {
}
