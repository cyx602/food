package com.food.controller;

import com.food.entity.Ingredient;
import com.food.entity.Recipe;
import com.food.mapper.AdminMapper;
import com.food.mapper.RecipeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/common")
public class CommonController {

    @Autowired
    private AdminMapper adminMapper; 

    @Autowired
    private RecipeMapper recipeMapper; 


    @GetMapping("/ingredients")
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        return ResponseEntity.ok(adminMapper.selectAllIngredients());
    }

    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        return ResponseEntity.ok(recipeMapper.selectAllRecipes());
    }


    @GetMapping("/featured-recipes")
    public ResponseEntity<List<Recipe>> getFeaturedRecipes() {
        return ResponseEntity.ok(recipeMapper.selectRecommendedRecipes());
    }


    @GetMapping("/latest-announcement")
    public ResponseEntity<Map<String, Object>> getLatestAnnouncement() {
        Map<String, Object> res = new HashMap<>();
        try {
            com.food.entity.Announcement announcement = adminMapper.selectLatestAnnouncement();
            if (announcement != null) {
                res.put("success", true);
                res.put("data", announcement);
            } else {
                res.put("success", false);
            }
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}