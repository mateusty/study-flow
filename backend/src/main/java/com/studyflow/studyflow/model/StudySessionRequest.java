package com.studyflow.studyflow.model;

import com.studyflow.studyflow.enums.StudySessionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudySessionRequest {
    private String subject;
    private String topic;
    private String activity;

    private Instant startedAt;
    private Instant finishedAt;

    private StudySessionStatus status;
    private String notes;
}
