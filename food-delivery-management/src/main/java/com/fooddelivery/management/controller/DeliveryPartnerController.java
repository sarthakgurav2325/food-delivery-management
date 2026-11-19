
package com.fooddelivery.management.controller;

import com.fooddelivery.management.entity.DeliveryPartner;
import com.fooddelivery.management.service.DeliveryPartnerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery-partners")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class DeliveryPartnerController {

    private final DeliveryPartnerService deliveryPartnerService;

    public DeliveryPartnerController(DeliveryPartnerService deliveryPartnerService) {
        this.deliveryPartnerService = deliveryPartnerService;
    }

    @GetMapping
    public List<DeliveryPartner> getAllPartners() {
        return deliveryPartnerService.getAllPartners();
    }

    @GetMapping("/{id}")
    public DeliveryPartner getPartnerById(@PathVariable Long id) {
        return deliveryPartnerService.getPartnerById(id);
    }

    @PostMapping
    public DeliveryPartner addPartner(@RequestBody DeliveryPartner partner) {
        return deliveryPartnerService.addPartner(partner);
    }

    @PutMapping("/{id}")
    public DeliveryPartner updatePartner(@PathVariable Long id,
                                         @RequestBody DeliveryPartner partner) {
        return deliveryPartnerService.updatePartner(id, partner);
    }

    @DeleteMapping("/{id}")
    public String deletePartner(@PathVariable Long id) {
        deliveryPartnerService.deletePartner(id);
        return "Delivery partner deleted successfully";
    }
}
