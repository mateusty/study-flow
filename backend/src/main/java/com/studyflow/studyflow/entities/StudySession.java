package com.studyflow.studyflow.entities;

import com.studyflow.studyflow.enums.StudySessionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "study-session")
public class StudySession {

    @Id
    private UUID id = UUID.randomUUID();

    private UUID userId;

    private String subject;
    private String topic;
    private String activity;

    private Instant startedAt;
    private Instant finishedAt;

    private StudySessionStatus status;
    private String notes;

    public StudySession(UUID userId,
                        String subject,
                        String topic,
                        String activity,
                        Instant startedAt,
                        Instant finishedAt,
                        StudySessionStatus status,
                        String notes
                        ) {
        this.userId = userId;
        this.subject = subject;
        this.topic = topic;
        this.activity = activity;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.status = status;
        this.notes = notes;
    }
}
