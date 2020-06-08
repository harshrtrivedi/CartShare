package edu.sjsu.cmpe275.project.CartShare.service;

import edu.sjsu.cmpe275.project.CartShare.model.User;

public interface UserService {
    void register(User user);

    User findByEmail(String email);

    boolean verifyUserRegistration(Long ID);

    boolean loginUser(User user);

    User checkUserVerified(String email);

}