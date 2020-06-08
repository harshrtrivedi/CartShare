package edu.sjsu.cmpe275.project.CartShare.controller;

import edu.sjsu.cmpe275.project.CartShare.exception.CustomException;
import edu.sjsu.cmpe275.project.CartShare.model.Pool;
import edu.sjsu.cmpe275.project.CartShare.model.User;
import edu.sjsu.cmpe275.project.CartShare.repository.PoolRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.UserRepository;
import edu.sjsu.cmpe275.project.CartShare.service.EmailService;
import edu.sjsu.cmpe275.project.CartShare.service.UserService;
import edu.sjsu.cmpe275.project.CartShare.utils.EmailUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.source.InvalidConfigurationPropertyValueException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowCredentials = "true")
public class UserSignupController {

    @Autowired
    UserService userService;

    @Autowired
    EmailService emailService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PoolRepository poolRepository;

    private static final String USER_VERIFICATION_EXCEPTION_MESSAGE = "User account verification failed";

    @PostMapping("/signup")
    @ResponseBody
    public ResponseEntity<String> registration(@Valid @RequestBody User user) throws URISyntaxException {
        System.out.println("Body sent : " + user.getEmail());
//        Address add = user.getAddress();
        System.out.println("Body sent : ");

        User existingUser = userService.findByEmail(user.getEmail());
        if (existingUser != null) {
            System.out.println("User exists");
            return new ResponseEntity<>("{\"status\" : \"User with same email is already registered .!!\"}",
                    HttpStatus.FOUND);
        }
        User existingScreenName = userRepository.findByscreenName(user.getScreenName());
        if (existingScreenName != null) {
            System.out.println("Screenname exists");
            return new ResponseEntity<>("{\"status\" : \"User with same screenname is already registered .!!\"}",
                    HttpStatus.METHOD_NOT_ALLOWED);
        }
        User existingNickName = userRepository.findBynickName(user.getNickName());
        if (existingNickName != null) {
            System.out.println("NickName exists");
            return new ResponseEntity<>("{\"status\" : \"User with same NickName is already registered .!!\"}",
                    HttpStatus.NOT_ACCEPTABLE);
        }
        userService.register(user);
        String message = EmailUtility.createVerificationMsg(user.getID());
        emailService.sendEmail(user.getEmail(), message, " User Profile Verification");
        return new ResponseEntity<>("{\"status\" : \"User Registered Successfully.!!\"}", HttpStatus.OK);
    }

    @RequestMapping(value = "/verifyaccount", method = RequestMethod.GET)
    public ResponseEntity<?> verifyUserAccount(@RequestParam Long ID) {
        System.out.println("Verification link clicked" + ID);
        try {
            boolean verificationStatus = userService.verifyUserRegistration(ID);
            System.out.println("verificationStatus: " + verificationStatus);
            if (verificationStatus) {
                return new ResponseEntity<>("{\"status\" : \"User is verified successfully!!\"}", HttpStatus.OK);
            } else if (!verificationStatus) {
                return new ResponseEntity<>(
                        "{\"status\" : \"User could not be verified because of bad request from user!!\"}",
                        HttpStatus.BAD_REQUEST);
            }
        } catch (Exception exp) {
            System.out.println("Verification Exception:" + exp.getMessage());
            throw new CustomException(USER_VERIFICATION_EXCEPTION_MESSAGE);
        }
        return new ResponseEntity<>("{\"status\" : \"User could not be verified because of server error!!\"}",
                HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/oauthverified/{email}")
    public ResponseEntity<?> verifyUserOauthAccount(@PathVariable String email) {
        System.out.println("User ID sent as a parmeter : " + email);
        if (userRepository.findByEmail(email) == null) {
            System.out.println("User is not present");
            return new ResponseEntity<>("{\"status\" : \"User is not registered with any oauth login!!\"}",
                    HttpStatus.NOT_FOUND);
        }
        User verifiedUser = userService.checkUserVerified(email);
        System.out.println("verifiedUser : " + verifiedUser);
        if (verifiedUser == null) {
            new ResponseEntity<>("{\"status\" : \"User could not be verified because of bad request from user!!\"}",
                    HttpStatus.BAD_REQUEST);
        } else
            return ResponseEntity.ok(verifiedUser);
        return new ResponseEntity<>(
                "{\"status\" : \"User could not be verified because of bad request from user..!!\"}",
                HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> login(@Valid @RequestBody User user) throws URISyntaxException {
        System.out.println("Body sent : " + user.getEmail());
        User existingUser = userService.findByEmail(user.getEmail());
        if (existingUser == null) {
            System.out.println("User does not exist");
            return new ResponseEntity<>("{\"status\" : \"Cannot login. User is not registered, first sign up..!!\"}",
                    HttpStatus.NOT_FOUND);
        }
        if (!existingUser.isVerified()) {
            System.out.println("User is not verified");
            return new ResponseEntity<>("{\"status\" : \"Cannot login. user is not verified yet..!!\"}",
                    HttpStatus.NOT_ACCEPTABLE);
        }
        boolean authorizedUser = userService.loginUser(user);
        if (!authorizedUser) {
            System.out.println("User entered wrong email or password");
            return new ResponseEntity<>("{\"status\" : \"User entered wrong email or password..!!\"}",
                    HttpStatus.BAD_REQUEST);
        }
        System.out.println("User logged in successfully");
        return ResponseEntity.ok(existingUser);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.PUT, value = "/updateuser")
    public ResponseEntity<?> updateUser(@Valid @RequestBody User user) throws URISyntaxException {
        System.out.println("inside update user api");
        User userNick = userRepository.findBynickName(user.getNickName());
        if (userNick != null) {
            return new ResponseEntity<>(
                    "{\"status\" : \"User could not be verified because of nickname already exists..!!\"}",
                    HttpStatus.METHOD_NOT_ALLOWED);
        }
        User us = userRepository.findByEmail(user.getEmail());
        us.setNickName(user.getNickName());
        userRepository.save(us);
        return ResponseEntity.ok(us);
    }

    // @GetMapping("/users/{id}")
    // public ResponseEntity<User> getPlayersById(@PathVariable(value = "id") String
    // id)
    // throws InvalidConfigurationPropertyValueException {
    // User user = userRepository.findByEmail(id);
    // System.out.println("jijojoklonojnkmk");
    // List<Request> newList = user.getRequests();
    // System.out.println(newList);
    // // newList.stream().forEach(System.out::println);
    // for (Request leave : newList) {
    // System.out.println("In pool list " + leave.getId());
    // }
    // return ResponseEntity.ok().body(user);
    // }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getPlayersById(@PathVariable(value = "id") String id)
            throws InvalidConfigurationPropertyValueException {
        User user = userRepository.findByEmail(id);
        // Pool pol = user.getPool();
        return ResponseEntity.ok().body(user);
    }

    @GetMapping("/getpool/{id}")
    public List<String> getPoolOfUser(@PathVariable(value = "id") String id)
            throws InvalidConfigurationPropertyValueException {
        User user = userRepository.findByEmail(id);
        String userRole = user.getRole();
        Pool pool = user.getPool();
        String poolName = pool.getName();
        String poolId = pool.getPoolId();

        List<String> ret = new ArrayList<>();
        ret.add(userRole);
        ret.add(poolName);
        ret.add(poolId);
        ret.add(String.valueOf(pool.getPoolers().size()));
        return ret;
    }

}
