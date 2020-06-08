package edu.sjsu.cmpe275.project.CartShare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.project.CartShare.model.Pool;

@Repository
public interface PoolRepository extends JpaRepository<Pool, String> {
    Pool findByName(String name);

    Optional<Pool> findById(String id);

    Pool findBypoolId(String id);

    List<Pool> findByzipcode(int zipcode);

    List<Pool> findByneighbourhood(String neighbourhood);

    void save(Optional<Pool> user);
}