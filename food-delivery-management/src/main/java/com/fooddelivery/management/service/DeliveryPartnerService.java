
package com.fooddelivery.management.service;

import com.fooddelivery.management.entity.DeliveryPartner;
import com.fooddelivery.management.repository.DeliveryPartnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryPartnerService {

    private final DeliveryPartnerRepository deliveryPartnerRepository;

    public DeliveryPartnerService(DeliveryPartnerRepository deliveryPartnerRepository) {
        this.deliveryPartnerRepository = deliveryPartnerRepository;
    }

    public List<DeliveryPartner> getAllPartners() {
        return deliveryPartnerRepository.findAll();
    }

    public DeliveryPartner getPartnerById(Long id) {
        return deliveryPartnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery partner not found"));
    }

    public DeliveryPartner addPartner(DeliveryPartner partner) {
        return deliveryPartnerRepository.save(partner);
    }

    public DeliveryPartner updatePartner(Long id, DeliveryPartner partner) {
        DeliveryPartner existing = getPartnerById(id);

        existing.setFullName(partner.getFullName());
        existing.setPhone(partner.getPhone());
        existing.setVehicleType(partner.getVehicleType());
        existing.setVehicleNumber(partner.getVehicleNumber());
        existing.setAvailable(partner.isAvailable());

        return deliveryPartnerRepository.save(existing);
    }

    public void deletePartner(Long id) {
        deliveryPartnerRepository.deleteById(id);
    }
}
