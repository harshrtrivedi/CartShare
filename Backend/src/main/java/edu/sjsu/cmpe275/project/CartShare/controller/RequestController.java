package edu.sjsu.cmpe275.project.CartShare.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.source.InvalidConfigurationPropertyValueException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.project.CartShare.model.Pool;
import edu.sjsu.cmpe275.project.CartShare.model.Request;
import edu.sjsu.cmpe275.project.CartShare.model.User;
import edu.sjsu.cmpe275.project.CartShare.repository.PoolRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.RequestRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowCredentials = "true")
public class RequestController {

    @Autowired
    RequestRepository requestRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PoolRepository poolRepository;

    @GetMapping("/requests/{screenname}")
    public List<Request> getRequestByScreenName(@PathVariable(value = "screenname") String requester) {
        User user = userRepository.findByscreenName(requester);
        return user.getRequests();
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.PUT, value = "/approverequest/{id}/{approver}")
    public ResponseEntity<?> approveRequest(@PathVariable(value = "id") long requestId,
            @PathVariable(value = "approver") String approver) {

        System.out.println(requestId + " " + approver);

        Request request = requestRepository.findById(requestId).orElseThrow(
                () -> new InvalidConfigurationPropertyValueException("", null, "User not found on :: " + requestId));
        User requestApprover = userRepository.findByscreenName(approver);
        String role = requestApprover.getRole();
        User initiater = request.getInitiater();
        if (role.equals("POOLER")) {
            System.out.println("inside user = pooler");
            List<Request> poolerRequests = requestApprover.getRequests();
            Pool pool = requestApprover.getPool();
            User leader = pool.getPoolLeader();
            poolerRequests.remove(request);
            requestApprover.setRequests(poolerRequests);
            userRepository.saveAndFlush(requestApprover);
            request.setApprover(leader);
            request.setStatus("Sent to pool leader");
            requestRepository.saveAndFlush(request);
            leader.getRequests().add(request);
            userRepository.saveAndFlush(leader);
            initiater.setRequestStatus("SENT TO POOL LEADER");
            userRepository.saveAndFlush(initiater);
            return new ResponseEntity<>("{\"status\" : \"Request has been approved.!!\"}", HttpStatus.OK);

        } else if (role.equals("POOL_LEADER")) {
            // System.out.println("inside pool leader");
            // List<Request> poolerRequests = requestApprover.getRequests(); // get requests
            // of leader
            // Pool pool = requestApprover.getPool(); // leader's pool
            // System.out.println("Before list " + poolerRequests);
            // // poolerRequests.remove(request); // remove request from leader's requests
            // poolerRequests.removeIf(request_pool -> request_pool == request); // remove
            // request from leader's requests
            // System.out.println("After list " + poolerRequests);
            // requestApprover.setRequests(poolerRequests); // set modified list
            // System.out.println("First get " + requestApprover.getRequests());
            // userRepository.saveAndFlush(requestApprover); // save leader object
            // System.out.println("second get " + requestApprover.getRequests());
            // List<User> poolersList = pool.getPoolers(); // get poolers of the pool
            // System.out.println("************* initial pooler list");
            // for (User u : poolersList) {
            // System.out.println(u.getScreenName());
            // }
            // User initiater = request.getInitiater(); // get initiater of the request
            // initiater.setRole("POOLER"); // set role of initiater as pooler
            // userRepository.saveAndFlush(initiater); // save initiater
            // poolersList.add(initiater); // add initiater to poollist
            // System.out.println("************* second pooler list");
            // for (User u : poolersList) {
            // System.out.println(u.getScreenName());
            // }
            // poolRepository.saveAndFlush(pool); // save pool
            // System.out.println("************* third pooler list");
            // for (User u : poolersList) {
            // System.out.println(u.getScreenName());
            // }
            // request.setStatus("APPROVED"); // set request status
            // requestRepository.saveAndFlush(request); // save request
            // return new ResponseEntity<>("{\"status\" : \"Request has been
            // approved.!!\"}", HttpStatus.OK);

            Pool pool = requestApprover.getPool();
            initiater.setRole("POOLER");
            initiater.setRequestStatus("APPROVED");
            initiater.setPool(pool);
            userRepository.saveAndFlush(initiater);
            pool.getPoolers().add(initiater);
            poolRepository.saveAndFlush(pool);
            requestApprover.getRequests().removeIf(request_pool -> request_pool == request);
            userRepository.saveAndFlush(requestApprover);
            requestRepository.delete(request);
            return new ResponseEntity<>("{\"status\" : \"Request has been approved.!!\"}", HttpStatus.OK);
        }
        // Pool pool = poolRepository.findBypoolId("jhfj");

        // User user = userRepository.findByEmail(email);
        // user.setPool(pool);

        // userRepository.save(user);
        return new ResponseEntity<>(
                "{\"status\" : \"User could not be verified because of bad request from user..!!\"}",
                HttpStatus.BAD_REQUEST);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.PUT, value = "/rejectrequest/{id}/{rejecter}")
    public ResponseEntity<?> rejectRequest(@PathVariable(value = "id") long requestId,
            @PathVariable(value = "rejecter") String rejecter) {

        System.out.println("inside reject request : " + requestId + " " + rejecter);

        Request request = requestRepository.findById(requestId).orElseThrow(
                () -> new InvalidConfigurationPropertyValueException("", null, "User not found on :: " + requestId));
        User requestRejecter = userRepository.findByscreenName(rejecter);
        User initiater = request.getInitiater();

        initiater.setRequestStatus("REJECTED");
        userRepository.saveAndFlush(initiater);
        requestRejecter.getRequests().removeIf(request_pool -> request_pool == request);
        userRepository.saveAndFlush(requestRejecter);
        requestRepository.delete(request);

        return new ResponseEntity<>("{\"status\" : \"Request has been rejected..!!\"}", HttpStatus.OK);
    }

}