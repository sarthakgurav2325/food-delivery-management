
package com.fooddelivery.management.service;

import com.fooddelivery.management.entity.Order;
import com.fooddelivery.management.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order addOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, Order order) {
        Order existing = getOrderById(id);

        existing.setCustomer(order.getCustomer());
        existing.setDeliveryPartner(order.getDeliveryPartner());
        existing.setTotalAmount(order.getTotalAmount());
        existing.setDeliveryAddress(order.getDeliveryAddress());
        existing.setOrderStatus(order.getOrderStatus());

        return orderRepository.save(existing);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order existing = getOrderById(id);
        existing.setOrderStatus(status);
        return orderRepository.save(existing);
    }
}
