package edu.sjsu.cmpe275.project.CartShare.service;

public class CustomException extends RuntimeException{

    public CustomException() {

    }

    public CustomException(String message) {
        super(message);
    }
}

