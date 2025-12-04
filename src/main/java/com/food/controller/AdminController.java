package com.food.controller;

import com.food.entity.*;
import com.food.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private AdminMapper adminMapper;
    @Autowired private UserMapper userMapper;
    @Autowired private RecipeMapper recipeMapper;
    @Autowired private OrderMapper orderMapper;

    // 权限检查辅助方法
    private boolean isAdmin(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("currentUser");
        return user != null && "admin".equals(user.getUsername());
    }

    // 1. 获取仪表盘统计数据
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();

        Map<String, Object> stats = new HashMap<>();
        stats.put("userCount", userMapper.countAllUsers());
        stats.put("recipeCount", recipeMapper.countAllRecipes());
        stats.put("orderCount", orderMapper.countAllOrders());
        stats.put("hotRecipes", adminMapper.selectHotRecipes()); // 热门食谱
        stats.put("systemStatus", "运行正常");
        return ResponseEntity.ok(stats);
    }

    // 2. 用户管理
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUserList(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(userMapper.selectAllUsers());
    }

    @PostMapping("/user/status")
    public ResponseEntity<String> updateUserStatus(@RequestBody Map<String, Integer> body, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        userMapper.updateUserStatus(body.get("id"), body.get("status"));
        return ResponseEntity.ok("更新成功");
    }

    // --- 食材管理 ---
    @GetMapping("/ingredients")
    public ResponseEntity<List<Ingredient>> getIngredients(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(adminMapper.selectAllIngredients());
    }
    @PostMapping("/ingredient/save")
    public ResponseEntity<String> saveIngredient(@RequestBody Ingredient ingredient, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        if (ingredient.getId() == null) adminMapper.insertIngredient(ingredient);
        else adminMapper.updateIngredient(ingredient);
        return ResponseEntity.ok("保存成功");
    }
    @PostMapping("/ingredient/delete")
    public ResponseEntity<String> deleteIngredient(@RequestBody Map<String, Integer> body, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        adminMapper.deleteIngredient(body.get("id"));
        return ResponseEntity.ok("删除成功");
    }

    // --- 菜系管理 ---
    @GetMapping("/cuisines")
    public ResponseEntity<List<Cuisine>> getCuisines(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(adminMapper.selectAllCuisines());
    }
    @PostMapping("/cuisine/save")
    public ResponseEntity<String> saveCuisine(@RequestBody Cuisine cuisine, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        if (cuisine.getId() == null) adminMapper.insertCuisine(cuisine);
        else adminMapper.updateCuisine(cuisine);
        return ResponseEntity.ok("保存成功");
    }
    @PostMapping("/cuisine/delete")
    public ResponseEntity<String> deleteCuisine(@RequestBody Map<String, Integer> body, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        adminMapper.deleteCuisine(body.get("id"));
        return ResponseEntity.ok("删除成功");
    }

    // --- 食谱管理 (推荐) ---
    @PostMapping("/recipe/recommend")
    public ResponseEntity<String> toggleRecommend(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        adminMapper.updateRecipeRecommendation((Integer) body.get("id"), (Boolean) body.get("isRecommended"));
        return ResponseEntity.ok("操作成功");
    }

    // --- 系统配置 & 公告 ---
    @PostMapping("/settings/update")
    public ResponseEntity<String> updateSettings(@RequestBody Map<String, String> settings, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        settings.forEach((k, v) -> adminMapper.updateSetting(k, v));
        return ResponseEntity.ok("配置已更新");
    }
    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(adminMapper.selectAllAnnouncements());
    }
    @PostMapping("/announcement/publish")
    public ResponseEntity<String> publishAnnouncement(@RequestBody Announcement announcement, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        adminMapper.insertAnnouncement(announcement);
        return ResponseEntity.ok("发布成功");
    }
    @PostMapping("/announcement/delete")
    public ResponseEntity<String> deleteAnnouncement(@RequestBody Map<String, Integer> body, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        adminMapper.deleteAnnouncement(body.get("id"));
        return ResponseEntity.ok("删除成功");
    }

    // 3. 食谱管理
    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> getRecipeList(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(recipeMapper.selectAllRecipes());
    }


    // 4. 订单管理
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(adminMapper.selectAllOrders());
    }
    @PostMapping("/order/status")
    public ResponseEntity<String> updateOrderStatus(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        adminMapper.updateOrderStatus((Integer) body.get("id"), (String) body.get("status"));
        return ResponseEntity.ok("状态更新成功");
    }
    @GetMapping("/order/stats")
    public ResponseEntity<List<Map<String, Object>>> getOrderStats(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(adminMapper.countOrdersByStatus());
    }

    // 5. 【新增】管理员删除食谱接口
    @PostMapping("/recipe/delete")
    public ResponseEntity<Map<String, Object>> deleteRecipe(@RequestBody Map<String, Integer> body,
                                                            HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        // 权限检查
        if (!isAdmin(request)) {
            res.put("success", false);
            res.put("message", "权限不足");
            return ResponseEntity.status(403).body(res);
        }

        try {
            Integer recipeId = body.get("id");
            if (recipeId == null) {
                res.put("success", false);
                res.put("message", "参数错误");
                return ResponseEntity.badRequest().body(res);
            }

            // 调用无需校验 userId 的删除方法
            recipeMapper.adminDeleteRecipe(recipeId);

            res.put("success", true);
            res.put("message", "食谱已强制删除");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "删除失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }
}
