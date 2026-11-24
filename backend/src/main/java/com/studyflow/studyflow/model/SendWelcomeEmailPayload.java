package com.studyflow.studyflow.model;

public record SendWelcomeEmailPayload(
        String email,
        String name
) {
}
