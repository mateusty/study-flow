package com.studyflow.studyflow.services;

import com.studyflow.studyflow.entities.StudySession;
import com.studyflow.studyflow.model.StudySessionRequest;
import com.studyflow.studyflow.repositories.StudySessionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
public class StudySessionService {

    private StudySessionRepository studySessionRepository;

    public StudySession postStudySession(StudySessionRequest request, UUID userId) {
        StudySession session = new StudySession(
                userId,
                request.getSubject(),
                request.getTopic(),
                request.getActivity(),
                request.getStartedAt(),
                request.getFinishedAt(),
                request.getStatus(),
                request.getNotes()
        );
        studySessionRepository.insert(session);
        return session;
    }
}
