
package com.fooddelivery.management.service;

import com.fooddelivery.management.entity.Order;
import com.fooddelivery.management.entity.OrderTracking;
import com.fooddelivery.management.repository.OrderRepository;
import com.fooddelivery.management.repository.OrderTrackingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderTrackingService {

    private final OrderTrackingRepository trackingRepository;
    private final OrderRepository orderRepository;

    public OrderTrackingService(
            OrderTrackingRepository trackingRepository,
            OrderRepository orderRepository) {
        this.trackingRepository = trackingRepository;
        this.orderRepository = orderRepository;
    }

    public List<OrderTracking> getTrackingHistory(Long orderId) {
        return trackingRepository.findByOrderIdOrderByUpdatedAtDesc(orderId);
    }

    public OrderTracking addTrackingUpdate(Long orderId, OrderTracking tracking) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        tracking.setOrder(order);
        tracking.setUpdatedAt(LocalDateTime.now());

        return trackingRepository.save(tracking);
    }
}
