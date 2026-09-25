package com.studyflow.studyflow.model;

import com.studyflow.studyflow.entities.StudySession;
import com.studyflow.studyflow.enums.StudySessionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudySessionResponse {
    private UUID id;

    private String subject;
    private String topic;
    private String activity;

    private Instant startedAt;
    private Instant finishedAt;

    private StudySessionStatus status;
    private String notes;

    public StudySessionResponse(StudySession session) {
        this.id = session.getId();
        this.subject = session.getSubject();
        this.topic = session.getTopic();
        this.activity = session.getActivity();
        this.startedAt = session.getStartedAt();
        this.finishedAt = session.getFinishedAt();
        this.status = session.getStatus();
        this.notes = session.getNotes();
    }
}
