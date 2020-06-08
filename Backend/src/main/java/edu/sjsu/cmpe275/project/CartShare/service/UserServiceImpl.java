package edu.sjsu.cmpe275.project.CartShare.service;

import edu.sjsu.cmpe275.project.CartShare.model.User;
import edu.sjsu.cmpe275.project.CartShare.repository.UserRepository;
import edu.sjsu.cmpe275.project.CartShare.utils.EmailUtility;
import edu.sjsu.cmpe275.project.CartShare.utils.HashingUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailService emailService;

    @Override
    public User findByEmail(String email) {
        User user = null;
        user = userRepository.findByEmail(email);
        return user;
    }

    @Override
    public void register(User user) {
        user.setPassword(HashingUtility.createHashedCode(user.getPassword()));
        System.out.println("Password: " + user.getPassword());
        userRepository.save(user);
    }

    @Override
    public User checkUserVerified(String email) {
        System.out.println("ID sent from body : " + email);
        User user = null;
        user = userRepository.findByEmail(email);
        // System.out.println("user data " + user + user.isVerified() +
        // user.getOauth_flag());
        try {
            if (user == null || !user.isVerified() || !user.getOauthFlag()) {
                return null;
            }
        } catch (Exception e) {
            throw e;
        }
        return user;
    }

    @Override
    public boolean loginUser(User user) {
        User activeUser = findByEmail(user.getEmail());
        return activeUser.getPassword().equals(HashingUtility.createHashedCode(user.getPassword()));
    }

    @Override
    public boolean verifyUserRegistration(Long ID) {
        System.out.println("ID sent from body : " + ID);
        Optional<User> user = userRepository.findById(ID);
        try {
            if (user != null && !user.get().isVerified()) {
                System.out.println("User found with id : " + user.get().getEmail());
                user.get().setVerified(true);
                userRepository.save(user.get());
                emailService.sendEmail(user.get().getEmail(), EmailUtility.VERIFICATION_SUCCESS_MESSAGE,
                        "Successful Account Verification");
                return true;
            } else if (user.get().isVerified()) {
                return false;
            }
        } catch (Exception e) {
            throw e;
        }
        return false;
    }

}