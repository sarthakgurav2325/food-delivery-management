
package com.fooddelivery.management.service;

import com.fooddelivery.management.entity.Food;
import com.fooddelivery.management.repository.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public Food getFoodById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found"));
    }

    public Food addFood(Food food) {
        return foodRepository.save(food);
    }

    public Food updateFood(Long id, Food food) {
        Food existingFood = getFoodById(id);

        existingFood.setName(food.getName());
        existingFood.setDescription(food.getDescription());
        existingFood.setPrice(food.getPrice());
        existingFood.setCategory(food.getCategory());
        existingFood.setImageUrl(food.getImageUrl());
        existingFood.setAvailable(food.isAvailable());

        return foodRepository.save(existingFood);
    }

    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }
}
