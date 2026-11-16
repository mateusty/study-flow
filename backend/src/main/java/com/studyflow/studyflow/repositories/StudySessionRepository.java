package com.studyflow.studyflow.repositories;

import com.studyflow.studyflow.entities.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StudySessionRepository extends JpaRepository<StudySession, UUID> {
    List<StudySession> findAllByUserId(UUID userId);
}
