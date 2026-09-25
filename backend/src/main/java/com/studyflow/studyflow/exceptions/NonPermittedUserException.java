package com.studyflow.studyflow.exceptions;

public class NonPermittedUserException extends RuntimeException {
    public NonPermittedUserException(String message) {
        super(message);
    }
}
