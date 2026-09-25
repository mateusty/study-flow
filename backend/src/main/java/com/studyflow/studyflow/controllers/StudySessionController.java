package com.studyflow.studyflow.controllers;

import com.studyflow.studyflow.entities.StudySession;
import com.studyflow.studyflow.model.StudySessionRequest;
import com.studyflow.studyflow.security.AuthenticatedUser;
import com.studyflow.studyflow.services.StudySessionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/study-session")
public class StudySessionController {

    private StudySessionService studySessionService;

    @PostMapping
    public ResponseEntity<StudySession> postStudySession(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody StudySessionRequest request
    ) {
        StudySession session = studySessionService.postStudySession(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> putStudySession(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody StudySessionRequest request,
            @PathVariable UUID id
            ) {
        studySessionService.putStudySession(request, id, user.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudySession(
            @PathVariable UUID id
    ) {
        studySessionService.deleteStudySession(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
