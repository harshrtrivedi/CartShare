package edu.sjsu.cmpe275.project.CartShare.repository;

import edu.sjsu.cmpe275.project.CartShare.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

	@Query(value = "SELECT p FROM Order p WHERE p.store.id = :id and p.status !='DELIVERED'")
	public Optional<List<Order>> findOrdersByStore(@Param("id") Long id);

	 @Query(value = "SELECT p FROM Order p WHERE p.buyerId.id = :id and p.status !='DELIVERED'")
	 public Optional<List<Order>> findOrdersById(@Param("id") Long id);

	@Query(value = "SELECT p FROM Order p WHERE p.buyerId.id = :id and p.status =:status ")
	public Optional<List<Order>> findPastOrders(@Param("id") Long id, String status);

	@Query(value = "SELECT p FROM Order p WHERE p.buyerId.id = :id and p.pickupOption = 'SELF' and p.status =:status ")
	public Optional<List<Order>> findPickupOrders(@Param("id") Long id, String status);

	@Query(value = "SELECT o FROM Order o WHERE o.buyerId.id = :id and o.pickupOption = 'SELF' and o.status ='DELIVERED'")
	public Optional<List<Order>> findDeliveryById(Long id);

	@Query(value = "SELECT p FROM Order p WHERE p.pool.poolId = :poolId and p.store.id = :storeId and p.buyerId.id != :userId and p.pickupOption = 'OTHERS' and p.status = 'PENDING'  ORDER BY p.orderTime ASC ")
	public Optional<List<Order>> findPoolOrdersById(  String poolId, Long storeId, Long userId);

}
