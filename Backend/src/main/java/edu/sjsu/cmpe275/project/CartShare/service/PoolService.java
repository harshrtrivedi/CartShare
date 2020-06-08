package edu.sjsu.cmpe275.project.CartShare.service;

import edu.sjsu.cmpe275.project.CartShare.model.Pool;
import edu.sjsu.cmpe275.project.CartShare.model.User;
import edu.sjsu.cmpe275.project.CartShare.repository.PoolRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PoolService {

    @Autowired
    PoolRepository poolRepository;

    @Autowired
    UserRepository userRepository;

    public void addPool(Pool pool, String mail) {
        System.out.println("data sent is : " + pool.getPoolId());
        User user = userRepository.findByEmail(mail);
        String pid = pool.getPoolId();

        poolRepository.saveAndFlush(pool);

        Pool newPool = poolRepository.findBypoolId(pid);

        List<User> poolersList = newPool.getPoolers();
        // System.out.println(poolersList);
        poolersList.add(user);
        // System.out.println(poolersList);
        newPool.setPoolLeader(user);

        user.setPool(newPool);
        user.setRole("POOL_LEADER");
        poolRepository.saveAndFlush(newPool);
        userRepository.saveAndFlush(user);
        // List<User> poolersList = new ArrayList<>();
        // List<User> poolersList = pool.getPoolers();
        // System.out.println(poolersList);
        // poolersList.add(user);
        // System.out.println(poolersList);
        // List<User> poolersList1 = pool.getPoolers();
        // for (User pooler : poolersList1) {
        // System.out.println("Pooler added is " + pooler.getEmail());
        // }

        // pool.setPoolers(poolersList);
        // pool.setPoolLeader(user);
        // poolRepository.save(pool);
    }

    public ResponseEntity<?> deletePool(String id, String screenname) {
        System.out.println("inside delete pool service"+id + screenname);

        Pool pool = poolRepository.findBypoolId(id);
        if (pool.getPoolers().size() > 1) {
            return new ResponseEntity<>("{\"status\" : \" There are poolers in this pool!!\"}",
                    HttpStatus.METHOD_NOT_ALLOWED);
        }
        // User user = userRepository.findByscreenName(screenname);
        // pool.getPoolers().remove(user);
        // user.setPool(null);
        // userRepository.save(user);

        Optional<User> usernew = Optional.ofNullable(userRepository.findByscreenName(screenname));
        System.out.println("user"+usernew);
        if(!usernew.isPresent()){
            return new ResponseEntity<>("{\"status\" : \" Pool Doesn't exist\"}",
                    HttpStatus.METHOD_NOT_ALLOWED);
        }

        usernew.get().setPool(null);
        usernew.get().setRole("User");
        userRepository.saveAndFlush(usernew.get());
        poolRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body(pool);
    }

}
