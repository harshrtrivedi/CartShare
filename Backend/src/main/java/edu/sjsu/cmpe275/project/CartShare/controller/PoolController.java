package edu.sjsu.cmpe275.project.CartShare.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import edu.sjsu.cmpe275.project.CartShare.model.Pool;
import edu.sjsu.cmpe275.project.CartShare.model.Request;
import edu.sjsu.cmpe275.project.CartShare.model.User;
import edu.sjsu.cmpe275.project.CartShare.repository.PoolRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.RequestRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.UserRepository;
import edu.sjsu.cmpe275.project.CartShare.service.EmailService;
import edu.sjsu.cmpe275.project.CartShare.service.PoolService;
import edu.sjsu.cmpe275.project.CartShare.utils.EmailUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.source.InvalidConfigurationPropertyValueException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@Transactional
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowCredentials = "true")
public class PoolController {

    @Autowired
    PoolRepository poolRepository;

    @Autowired
    PoolService poolService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RequestRepository requestRepository;

    @Autowired
    EmailService emailService;

    @PostMapping("/createpool/{id}")
    @ResponseBody
    public ResponseEntity<?> createPool(@Valid @RequestBody Pool pool, @PathVariable(value = "id") String mail)
            throws URISyntaxException {
        System.out.println("Body sent : " + pool.getPoolId());
        System.out.println("Body sentdd : " + mail);
        Pool IDPool = poolRepository.findBypoolId(pool.getPoolId());
        if (IDPool != null) {
            System.out.println("User exists");
            return new ResponseEntity<>("{\"status\" : \"Pool with same poolID is already present .!!\"}",
                    HttpStatus.FOUND);
        }
        Pool namePool = poolRepository.findByName(pool.getName());
        if (namePool != null) {
            System.out.println("User exists");
            return new ResponseEntity<>("{\"status\" : \"Pool with same name is already present .!!\"}",
                    HttpStatus.FOUND);
        }
        poolService.addPool(pool, mail);
        // String message = EmailUtility.createVerificationMsg(user.getID());
        // emailService.sendEmail(user.getEmail(), message, " User Profile
        // Verification");
        return new ResponseEntity<>("{\"status\" : \"Pool has been created Successfully.!!\"}", HttpStatus.OK);
    }

    @GetMapping("/pools")
    public List<Pool> getAllPools() {
        return poolRepository.findAll();
    }

    @GetMapping("/pools/{id}")
    public ResponseEntity<Pool> getPlayersById(@PathVariable(value = "id") String id)
            throws InvalidConfigurationPropertyValueException {
        Pool pool = poolRepository.findById(id).orElseThrow(
                () -> new InvalidConfigurationPropertyValueException("", null, "User not found on :: " + id));
        System.out.println("jijojoklonojnkmk");
        List<User> newList = pool.getPoolers();
        System.out.println(newList);
        // newList.stream().forEach(System.out::println);
        for (User leave : newList) {
            System.out.println("In pool list " + leave.getEmail());
        }
        return ResponseEntity.ok().body(pool);
    }

    @GetMapping("/searchpools/{type}/{given}")
    public List<Pool> searchPool(@PathVariable(value = "type") String type, @PathVariable(value = "given") String val)
            throws InvalidConfigurationPropertyValueException {
        System.out.println("Passed value " + type + val);
        List<Pool> poolList = new ArrayList<>();
        switch (type) {
            case "Name":
                System.out.println("inside name");
                Pool pool = poolRepository.findByName(val);
                if (pool != null) {
                    poolList.add(pool);
                }
                return poolList;
            case "Neighbourhood":
                System.out.println("inside nighbo");
                return poolRepository.findByneighbourhood(val);
            case "Zipcode":
                System.out.println("inside zip");
                return poolRepository.findByzipcode(Integer.parseInt(val));
            default:
                System.out.println("inside default");
                return poolList;
        }
    }

    @PostMapping("/joinpool")
    @ResponseBody
    public ResponseEntity<String> createPool(@Valid @RequestBody ObjectNode objectNode) {
        String poolId = objectNode.get("poolId").asText();
        String initiater = objectNode.get("initiater").asText();
        String approver = objectNode.get("approver").asText();

        System.out.println("values passed " + initiater + approver + poolId);

        User requestApprover = userRepository.findByscreenName(approver);
        User requestInitiater = userRepository.findByscreenName(initiater);
        if (requestApprover == null) {
            return new ResponseEntity<>(
                    "{\"status\" : \" No user with this screenname found! Given reference for this pool not found.!!\"}",
                    HttpStatus.NOT_FOUND);
        }

        Request requ = requestRepository.findByinitiater(requestInitiater);
        if (requ != null) {
            System.out.println("Already sent a request to join another pool.!!");
            return new ResponseEntity<>("{\"status\" : \" Already sent a request to join another pool.!!\"}",
                    HttpStatus.METHOD_NOT_ALLOWED);
        }

        Pool pool = poolRepository.findBypoolId(poolId);
        List<User> poolList = pool.getPoolers();

        if (poolList.contains(requestApprover)) {
            System.out.println("User foud");
        } else {
            return new ResponseEntity<>("{\"status\" : \" Given reference for this pool not found.!!\"}",
                    HttpStatus.NOT_FOUND);
        }

        String userRole = requestApprover.getRole();
        String status = "";

        switch (userRole) {
            case "POOL_LEADER":
                status = "SENT TO POOL LEADER";
                break;
            case "POOLER":
                status = "SENT TO REFERENCE";
                break;
            default:
                status = "";
                break;
        }

        Request req = new Request();
        req.setApprover(requestApprover);
        req.setInitiater(requestInitiater);
        req.setStatus(status);

        requestRepository.saveAndFlush(req);

        List<Request> currentRequests = requestApprover.getRequests();
        currentRequests.add(req);

        userRepository.save(requestApprover);

        // if (IDPool != null) {
        // System.out.println("User exists");
        // return new ResponseEntity<>("{\"status\" : \"Pool with same poolID is already
        // present .!!\"}",
        // HttpStatus.FOUND);
        // }
        // Pool namePool = poolRepository.findByName(pool.getName());
        // if (namePool != null) {
        // System.out.println("User exists");
        // return new ResponseEntity<>("{\"status\" : \"Pool with same name is already
        // present .!!\"}",
        // HttpStatus.FOUND);
        // }
        // poolService.addPool(pool, mail);
        // String message = EmailUtility.createVerificationMsg(user.getID());
        // emailService.sendEmail(user.getEmail(), message, " User Profile
        // Verification");
        String message = EmailUtility.createPoolRequestReceived(initiater, approver);
        emailService.sendEmail(requestApprover.getEmail(), message, "Pool Request");
        return new ResponseEntity<>("{\"status\" : \"Pool request has been sent Successfully.!!\"}", HttpStatus.OK);
    }

    @RequestMapping(value = "/pool/{id}/{user}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deletePool(@PathVariable String id, @PathVariable String user) {
        System.out.println("Inside delete pool controller");

        return poolService.deletePool(id, user);
    }

    @GetMapping("/poolerslist/{currentUser}")
    public List<String> listOfPoolers(@PathVariable(value = "currentUser") String currentUser) {
        System.out.println("Insise listOfPoolers " + currentUser);
        User user = userRepository.findByscreenName(currentUser);
        Pool pool = user.getPool();
        List<User> poolersList = pool.getPoolers();
        poolersList.remove(user);
        List<String> userList = new ArrayList<>();
        for (User u : poolersList) {
            userList.add(u.getScreenName());
        }
        return userList;
    }

    @PostMapping("/sendmessage")
    @ResponseBody
    public ResponseEntity<String> sendMessage(@Valid @RequestBody ObjectNode objectNode) {
        String sender = objectNode.get("sender").asText();
        String receiver = objectNode.get("receiver").asText();
        String msg = objectNode.get("msg").asText();

        User messageReceiver = userRepository.findByscreenName(receiver);

        String message = EmailUtility.messageNotification(sender, receiver, msg);
        emailService.sendEmail(messageReceiver.getEmail(), message, "Message from fellow Pooler");
        return new ResponseEntity<>("{\"status\" : \"Message has been sent Successfully.!!\"}", HttpStatus.OK);
    }

    @GetMapping("/getpooldetails/{currentUser}")
    public ResponseEntity<?> PoolDetails(@PathVariable(value = "currentUser") String currentUser) {
        System.out.println("Inside getpooldetails " + currentUser);
        User user = userRepository.findByscreenName(currentUser);
        Pool pool = user.getPool();
        return ResponseEntity.ok().body(pool);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.PUT, value = "/updatepool")
    public ResponseEntity<?> updatePool(@Valid @RequestBody Pool pool) throws URISyntaxException {
        System.out.println("inside update pool api");
        Pool namePool = poolRepository.findByName(pool.getName());
        if (namePool != null) {
            if (!namePool.getPoolId().equals(pool.getPoolId())) {
                return new ResponseEntity<>("{\"status\" : \"Pool name already exists..!!\"}",
                        HttpStatus.METHOD_NOT_ALLOWED);
            }
        }
        Pool poo = poolRepository.findBypoolId(pool.getPoolId());
        poo.setName(pool.getName());
        poo.setNeighbourhood(pool.getNeighbourhood());
        poo.setDescription(pool.getDescription());
        poolRepository.save(poo);
        return ResponseEntity.ok(poo);
    }

}

//package edu.sjsu.cmpe275.project.CartShare.controller;
//
//import com.fasterxml.jackson.databind.node.ObjectNode;
//import edu.sjsu.cmpe275.project.CartShare.model.Pool;
//import edu.sjsu.cmpe275.project.CartShare.model.Request;
//import edu.sjsu.cmpe275.project.CartShare.model.User;
//import edu.sjsu.cmpe275.project.CartShare.repository.PoolRepository;
//import edu.sjsu.cmpe275.project.CartShare.repository.RequestRepository;
//import edu.sjsu.cmpe275.project.CartShare.repository.UserRepository;
//import edu.sjsu.cmpe275.project.CartShare.service.EmailService;
//import edu.sjsu.cmpe275.project.CartShare.service.PoolService;
//import edu.sjsu.cmpe275.project.CartShare.utils.EmailUtility;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.context.properties.source.InvalidConfigurationPropertyValueException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import javax.validation.Valid;
//import java.net.URISyntaxException;
//import java.util.ArrayList;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin(origins = "*", allowCredentials = "true")
//public class PoolController {
//
//    @Autowired
//    PoolRepository poolRepository;
//
//    @Autowired
//    PoolService poolService;
//
//    @Autowired
//    UserRepository userRepository;
//
//    @Autowired
//    RequestRepository requestRepository;
//
//    @Autowired
//    EmailService emailService;
//
//    @PostMapping("/createpool/{id}")
//    @ResponseBody
//    public ResponseEntity<?> createPool(@Valid @RequestBody Pool pool, @PathVariable(value = "id") String mail)
//            throws URISyntaxException {
//        System.out.println("Body sent : " + pool.getPoolId());
//        System.out.println("Body sentdd : " + mail);
//        Pool IDPool = poolRepository.findBypoolId(pool.getPoolId());
//        if (IDPool != null) {
//            System.out.println("User exists");
//            return new ResponseEntity<>("{\"status\" : \"Pool with same poolID is already present .!!\"}",
//                    HttpStatus.FOUND);
//        }
//        Pool namePool = poolRepository.findByName(pool.getName());
//        if (namePool != null) {
//            System.out.println("User exists");
//            return new ResponseEntity<>("{\"status\" : \"Pool with same name is already present .!!\"}",
//                    HttpStatus.FOUND);
//        }
//        poolService.addPool(pool, mail);
//        // String message = EmailUtility.createVerificationMsg(user.getID());
//        // emailService.sendEmail(user.getEmail(), message, " User Profile
//        // Verification");
//        return new ResponseEntity<>("{\"status\" : \"Pool has been created Successfully.!!\"}", HttpStatus.OK);
//    }
//
//    @GetMapping("/pools")
//    public List<Pool> getAllPools() {
//        return poolRepository.findAll();
//    }
//
//    @GetMapping("/pools/{id}")
//    public ResponseEntity<Pool> getPlayersById(@PathVariable(value = "id") String id)
//            throws InvalidConfigurationPropertyValueException {
//        Pool pool = poolRepository.findById(id).orElseThrow(
//                () -> new InvalidConfigurationPropertyValueException("", null, "User not found on :: " + id));
//        System.out.println("jijojoklonojnkmk");
//        List<User> newList = pool.getPoolers();
//        System.out.println(newList);
//        // newList.stream().forEach(System.out::println);
//        for (User leave : newList) {
//            System.out.println("In pool list " + leave.getEmail());
//        }
//        return ResponseEntity.ok().body(pool);
//    }
//
////    @GetMapping("/searchpools/{type}/{given}")
////    public List<Pool> searchPool(@PathVariable(value = "type") String type, @PathVariable(value = "given") String val)
////            throws InvalidConfigurationPropertyValueException {
////        System.out.println("Passed value " + type + val);
////        List<Pool> poolList = new ArrayList<>();
////        switch (type) {
////            case "Name":
////                System.out.println("inside name");
////                Pool pool = poolRepository.findByName(val);
////                poolList.add(pool);
////                return poolList;
////            case "Neighbourhood":
////                System.out.println("inside nighbo");
////                return poolRepository.findByneighbourhood(val);
////            case "Zipcode":
////                System.out.println("inside zip");
////                return poolRepository.findByzipcode(Integer.parseInt(val));
////            default:
////                System.out.println("inside default");
////                return poolList;
////        }
////    }
//
//    @GetMapping("/searchpools/{type}/{given}")
//    public List<Pool> searchPool(@PathVariable(value = "type") String type, @PathVariable(value = "given") String val)
//            throws InvalidConfigurationPropertyValueException {
//        System.out.println("Passed value " + type + val);
//        List<Pool> poolList = new ArrayList<>();
//        switch (type) {
//            case "Name":
//                System.out.println("inside name");
//                Pool pool = poolRepository.findByName(val);
//                if (pool != null) {
//                    poolList.add(pool);
//                }
//                return poolList;
//            case "Neighbourhood":
//                System.out.println("inside nighbo");
//                return poolRepository.findByneighbourhood(val);
//            case "Zipcode":
//                System.out.println("inside zip");
//                return poolRepository.findByzipcode(Integer.parseInt(val));
//            default:
//                System.out.println("inside default");
//                return poolList;
//        }
//    }
//
//    @PostMapping("/joinpool")
//    @ResponseBody
//    public ResponseEntity<String> createPool(@Valid @RequestBody ObjectNode objectNode) {
//        String poolId = objectNode.get("poolId").asText();
//        String initiater = objectNode.get("initiater").asText();
//        String approver = objectNode.get("approver").asText();
//
//        User requestApprover = userRepository.findByscreenName(approver);
//        User requestInitiater = userRepository.findByscreenName(initiater);
//        if (requestApprover == null) {
//            return new ResponseEntity<>(
//                    "{\"status\" : \" No user with this screenname found! Given reference for this pool not found.!!\"}",
//                    HttpStatus.NOT_FOUND);
//        }
//
//        Pool pool = poolRepository.findBypoolId(poolId);
//        List<User> poolList = pool.getPoolers();
//
//        if (poolList.contains(requestApprover)) {
//            System.out.println("User foud");
//        } else {
//            return new ResponseEntity<>("{\"status\" : \" Given reference for this pool not found.!!\"}",
//                    HttpStatus.NOT_FOUND);
//        }
//
//        String userRole = requestApprover.getRole();
//        String status = "";
//
//        switch (userRole) {
//            case "POOL_LEADER":
//                status = "SENT TO POOL LEADER";
//                break;
//            case "POOLER":
//                status = "SENT TO REFERENCE";
//                break;
//            default:
//                status = "";
//                break;
//        }
//
//        Request req = new Request();
//        req.setApprover(requestApprover);
//        req.setInitiater(requestInitiater);
//        req.setStatus(status);
//
//        requestRepository.saveAndFlush(req);
//
//        List<Request> currentRequests = requestApprover.getRequests();
//        currentRequests.add(req);
//
//        userRepository.save(requestApprover);
//
//        // if (IDPool != null) {
//        // System.out.println("User exists");
//        // return new ResponseEntity<>("{\"status\" : \"Pool with same poolID is already
//        // present .!!\"}",
//        // HttpStatus.FOUND);
//        // }
//        // Pool namePool = poolRepository.findByName(pool.getName());
//        // if (namePool != null) {
//        // System.out.println("User exists");
//        // return new ResponseEntity<>("{\"status\" : \"Pool with same name is already
//        // present .!!\"}",
//        // HttpStatus.FOUND);
//        // }
//        // poolService.addPool(pool, mail);
//        // String message = EmailUtility.createVerificationMsg(user.getID());
//        // emailService.sendEmail(user.getEmail(), message, " User Profile
//        // Verification");
//        String message = EmailUtility.createPoolRequestReceived(initiater, approver);
//        emailService.sendEmail(requestApprover.getEmail(), message, "Pool Request");
//        return new ResponseEntity<>("{\"status\" : \"Pool request has been sent Successfully.!!\"}", HttpStatus.OK);
//    }
//
//    @RequestMapping(value = "/pool/{id}/{user}", method = RequestMethod.DELETE)
//    public ResponseEntity<?> deletePool(@PathVariable String id, @PathVariable String user) {
//        System.out.println("Inside delete pool controller");
//
//        return poolService.deletePool(id, user);
//    }
//
//    @GetMapping("/poolerslist/{currentUser}")
//    public List<String> listOfPoolers(@PathVariable(value = "currentUser") String currentUser) {
//        System.out.println("Insise listOfPoolers " + currentUser);
//        User user = userRepository.findByscreenName(currentUser);
//        Pool pool = user.getPool();
//        List<User> poolersList = pool.getPoolers();
//        poolersList.remove(user);
//        List<String> userList = new ArrayList<>();
//        for (User u : poolersList) {
//            userList.add(u.getScreenName());
//        }
//        return userList;
//    }
//
//    @PostMapping("/sendmessage")
//    @ResponseBody
//    public ResponseEntity<String> sendMessage(@Valid @RequestBody ObjectNode objectNode) {
//        String sender = objectNode.get("sender").asText();
//        String receiver = objectNode.get("receiver").asText();
//        String msg = objectNode.get("msg").asText();
//
//        User messageReceiver = userRepository.findByscreenName(receiver);
//
//        String message = EmailUtility.messageNotification(sender, receiver, msg);
//        emailService.sendEmail(messageReceiver.getEmail(), message, "Message from fellow Pooler");
//        return new ResponseEntity<>("{\"status\" : \"Message has been sent Successfully.!!\"}", HttpStatus.OK);
//    }
//
//    @GetMapping("/getpooldetails/{currentUser}")
//    public ResponseEntity<?> PoolDetails(@PathVariable(value = "currentUser") String currentUser) {
//        System.out.println("Inside getpooldetails " + currentUser);
//        User user = userRepository.findByscreenName(currentUser);
//        Pool pool = user.getPool();
//        return ResponseEntity.ok().body(pool);
//    }
//
//    @ResponseBody
//    @RequestMapping(method = RequestMethod.PUT, value = "/updatepool")
//    public ResponseEntity<?> updatePool(@Valid @RequestBody Pool pool) throws URISyntaxException {
//        System.out.println("inside update pool api");
//        Pool namePool = poolRepository.findByName(pool.getName());
//        if (namePool != null) {
//            if (!namePool.getPoolId().equals(pool.getPoolId())) {
//                return new ResponseEntity<>("{\"status\" : \"Pool name already exists..!!\"}",
//                        HttpStatus.METHOD_NOT_ALLOWED);
//            }
//        }
//        Pool poo = poolRepository.findBypoolId(pool.getPoolId());
//        poo.setName(pool.getName());
//        poo.setNeighbourhood(pool.getNeighbourhood());
//        poo.setDescription(pool.getDescription());
//        poolRepository.save(poo);
//        return ResponseEntity.ok(poo);
//    }
//
//}
