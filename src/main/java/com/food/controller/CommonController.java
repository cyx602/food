package com.food.controller;

import com.food.entity.Ingredient;
import com.food.entity.Recipe;
import com.food.mapper.AdminMapper;
import com.food.mapper.RecipeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 通用公共接口，供前台页面获取数据
 * 解决前台 market.js 和 cuisine.js 报 404 的问题
 */
@RestController
@RequestMapping("/api/common")
public class CommonController {

    @Autowired
    private AdminMapper adminMapper; // 复用 AdminMapper 获取食材列表

    @Autowired
    private RecipeMapper recipeMapper; // 复用 RecipeMapper 获取食谱列表

    // 获取所有食材列表 (供 market.html 使用)
    // 对应前端请求: /api/common/ingredients
    @GetMapping("/ingredients")
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        // 调用 AdminMapper 中已存在的 selectAllIngredients 方法
        return ResponseEntity.ok(adminMapper.selectAllIngredients());
    }

    // 获取所有食谱列表 (供 cuisine.html 使用)
    // 对应前端请求: /api/common/recipes
    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        // 调用 RecipeMapper 中已存在的 selectAllRecipes 方法
        return ResponseEntity.ok(recipeMapper.selectAllRecipes());
    }
}