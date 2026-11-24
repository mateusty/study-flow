package com.studyflow.studyflow.services;

import com.studyflow.studyflow.model.SendWelcomeEmailPayload;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class N8nService {

    private final RestClient restClient;
    private final String webHookURL;

    public N8nService(
            RestClient restClient,
            @Value("${n8n.webhook.url}") String webHookURL
    ) {
        this.restClient = restClient;
        this.webHookURL = webHookURL;
    }

    public void sendWelcomeEmail(SendWelcomeEmailPayload payload) {
        restClient.post()
                .uri(webHookURL)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();
    }
}
