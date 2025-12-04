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
        // 获取当前登录用户
        User user = (User) request.getSession().getAttribute("currentUser");

        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            // 绑定当前用户ID
            recipe.setUserId(user.getId());

            // 插入数据库
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

    // 更新食谱接口
    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateRecipe(@RequestBody Recipe recipe,
                                                            HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");

        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            // 强制设置当前用户ID，确保只能改自己的
            recipe.setUserId(user.getId());

            // 简单校验
            if(recipe.getId() == null) {
                throw new IllegalArgumentException("食谱ID不能为空");
            }

            recipeMapper.updateRecipe(recipe);

            res.put("success", true);
            res.put("message", "食谱修改成功！");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "修改失败：" + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteRecipe(@RequestBody Map<String, Integer> body,
                                                            HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");

        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            Integer recipeId = body.get("id");
            if (recipeId == null) {
                res.put("success", false);
                res.put("message", "参数错误");
                return ResponseEntity.badRequest().body(res);
            }

            recipeMapper.deleteRecipe(recipeId, user.getId());

            res.put("success", true);
            res.put("message", "删除成功");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "删除失败：" + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }



}