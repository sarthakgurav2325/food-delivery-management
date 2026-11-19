
package com.fooddelivery.management.repository;

import com.fooddelivery.management.entity.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderTrackingRepository extends JpaRepository<OrderTracking, Long> {

    List<OrderTracking> findByOrderIdOrderByUpdatedAtDesc(Long orderId);
}
