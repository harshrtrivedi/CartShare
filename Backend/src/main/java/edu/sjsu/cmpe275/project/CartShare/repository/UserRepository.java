package edu.sjsu.cmpe275.project.CartShare.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.project.CartShare.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    // @Query(value = "SELECT u FROM User u WHERE u.email = :email")
    // public User findByEmail(@Param("email") String email);

    Optional<User> findById(Long id);

    User findByscreenName(String screenname);

    User findBynickName(String nickname);

    void save(Optional<User> user);
}
