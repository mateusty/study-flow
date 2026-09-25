package com.studyflow.studyflow.controllers;

import com.studyflow.studyflow.model.StudySessionRequest;
import com.studyflow.studyflow.model.StudySessionResponse;
import com.studyflow.studyflow.security.AuthenticatedUser;
import com.studyflow.studyflow.services.StudySessionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/study-session")
public class StudySessionController {

    private StudySessionService studySessionService;

    @PostMapping
    public ResponseEntity<StudySessionResponse> postStudySession(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody StudySessionRequest request
    ) {
        StudySessionResponse session = studySessionService.postStudySession(request, user.getId());
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
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable UUID id
    ) {
        studySessionService.deleteStudySession(id, user.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<List<StudySessionResponse>> getStudySessions(
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(studySessionService.getStudySessions(user.getId()));
    }
}
