
package com.fooddelivery.management.controller;

import com.fooddelivery.management.entity.OrderTracking;
import com.fooddelivery.management.service.OrderTrackingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "https://food-delivery-management-three.vercel.app"
})
public class OrderTrackingController {

    private final OrderTrackingService trackingService;

    public OrderTrackingController(OrderTrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @GetMapping("/{orderId}")
    public List<OrderTracking> getTrackingHistory(@PathVariable Long orderId) {
        return trackingService.getTrackingHistory(orderId);
    }

    @PostMapping("/{orderId}")
    public OrderTracking addTrackingUpdate(
            @PathVariable Long orderId,
            @RequestBody OrderTracking tracking) {
        return trackingService.addTrackingUpdate(orderId, tracking);
    }
}
