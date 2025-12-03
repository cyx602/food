package com.food.controller;

import com.food.entity.Recipe;
import com.food.entity.User;
import com.food.mapper.RecipeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipe")
public class RecipeController {

    @Autowired
    private RecipeMapper recipeMapper;

    // 切换收藏状态（收藏/取消）
    @PostMapping("/favorite/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavorite(@RequestBody Map<String, Integer> body,
                                                              HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");

        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        Integer recipeId = body.get("recipeId");
        int count = recipeMapper.checkFavorite(user.getId(), recipeId);

        if (count > 0) {
            recipeMapper.deleteFavorite(user.getId(), recipeId);
            res.put("status", "removed");
            res.put("message", "已取消收藏");
        } else {
            recipeMapper.insertFavorite(user.getId(), recipeId);
            res.put("status", "added");
            res.put("message", "收藏成功");
        }
        res.put("success", true);
        return ResponseEntity.ok(res);
    }

    // 获取我的收藏ID列表
    @GetMapping("/favorites")
    public ResponseEntity<List<Integer>> getMyFavorites(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();

        List<Integer> ids = recipeMapper.selectFavoriteRecipeIds(user.getId());
        return ResponseEntity.ok(ids);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createRecipe(@RequestBody Recipe recipe,
                                                            HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");

        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            recipe.setUserId(user.getId());
            // 这里可以添加更多校验，如标题不能为空等
            recipeMapper.insertRecipe(recipe);

            res.put("success", true);
            res.put("message", "食谱发布成功！");
            res.put("recipeId", recipe.getId());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "发布失败：" + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    // 获取我的食谱列表
    @GetMapping("/my-list")
    public ResponseEntity<List<Recipe>> getMyRecipes(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();

        List<Recipe> list = recipeMapper.selectRecipesByUserId(user.getId());
        return ResponseEntity.ok(list);
    }

    // 获取食谱详情（包含作者信息）
    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeDetail(@PathVariable int id) {
        Recipe recipe = recipeMapper.selectRecipeById(id);
        if (recipe != null) {
            return ResponseEntity.ok(recipe);
        }
        return ResponseEntity.notFound().build();
    }


}