package edu.example.backend.repository;

import edu.example.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Modifying
    @Query("UPDATE OrderItem i SET i.farmerUsername = '[deleted]' WHERE i.farmerUsername = :username")
    void anonymizeFarmerItems(@Param("username") String username);
}
