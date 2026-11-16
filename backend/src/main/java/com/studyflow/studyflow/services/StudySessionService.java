package com.studyflow.studyflow.services;

import com.studyflow.studyflow.entities.StudySession;
import com.studyflow.studyflow.entities.User;
import com.studyflow.studyflow.exceptions.NonPermittedUserException;
import com.studyflow.studyflow.exceptions.NotFoundException;
import com.studyflow.studyflow.model.StudySessionRequest;
import com.studyflow.studyflow.model.StudySessionResponse;
import com.studyflow.studyflow.repositories.StudySessionRepository;
import com.studyflow.studyflow.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class StudySessionService {

    private StudySessionRepository studySessionRepository;
    private UserRepository userRepository;

    public StudySessionResponse postStudySession(StudySessionRequest request, UUID userId) {

        User dbUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Não existe usuário com o id informado"));

        StudySession session = StudySession.builder()
                .user(dbUser)
                .subject(request.getSubject())
                .topic(request.getTopic())
                .activity(request.getActivity())
                .startedAt(request.getStartedAt())
                .finishedAt(request.getFinishedAt())
                .status(request.getStatus())
                .notes(request.getNotes())
                .build();
        studySessionRepository.save(session);
        return new StudySessionResponse(session);
    }

    public void putStudySession(StudySessionRequest request, UUID id, UUID userId) {

        StudySession dbSession = studySessionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Não existe study session com o id informado"));


        User dbUser = dbSession.getUser();
        if(!dbUser.getId().equals(userId)) {
          throw new NonPermittedUserException("A sessão de estudos informada não pertence ao usuário");
        }

        StudySession session = new StudySession(
                id,
                dbUser,
                request.getSubject(),
                request.getTopic(),
                request.getActivity(),
                request.getStartedAt(),
                request.getFinishedAt(),
                request.getStatus(),
                request.getNotes()
        );
        studySessionRepository.save(session);
    }

    public void deleteStudySession(UUID id, UUID userId) {
        StudySession dbSession = studySessionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Não existe study session com o id informado"));

        if(!dbSession.getUser().getId().equals(userId)) {
            throw new NonPermittedUserException("A sessão de estudos informada não pertence ao usuário");
        }

        studySessionRepository.deleteById(id);
    }

    public List<StudySessionResponse> getStudySessions(UUID userId) {
        return studySessionRepository.findAllByUserId(userId).stream()
                .map(StudySessionResponse::new)
                .toList();
    }
}
