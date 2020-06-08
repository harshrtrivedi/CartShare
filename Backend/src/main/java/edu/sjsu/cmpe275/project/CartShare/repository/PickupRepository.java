package edu.sjsu.cmpe275.project.CartShare.repository;

import edu.sjsu.cmpe275.project.CartShare.model.Pickup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Long> {
    @Query(value = "SELECT p FROM Pickup p WHERE p.pickupPerson.id = :id and p.status ='AVAILABLE'")
    public Optional<List<Pickup>> findPickup(@Param("id") Long id);
}
