package edu.sjsu.cmpe275.project.CartShare.repository;

import edu.sjsu.cmpe275.project.CartShare.model.Order_Items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemsRepository extends JpaRepository<Order_Items, Long> {

    @Query(value = "SELECT o FROM Order_Items o WHERE o.product.id.storeId= :storeId  and o.product.id.sku = :sku and status  != 'DELIVERED'")
    public Optional<List<Order_Items>> findByProductId(@Param("storeId") Long storeId, @Param("sku") Long sku);

}
