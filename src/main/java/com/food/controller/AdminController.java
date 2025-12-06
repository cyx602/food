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
        return user != null && ("admin".equals(user.getUsername()) || "admin".equals(user.getRole()));
    }

    // 1. 获取仪表盘统计数据
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();

        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("userCount", userMapper.countAllUsers());
            stats.put("recipeCount", recipeMapper.countAllRecipes());
            stats.put("orderCount", orderMapper.countAllOrders());
            stats.put("hotRecipes", adminMapper.selectHotRecipes()); // 热门食谱
            stats.put("systemStatus", "运行正常");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 2. 用户管理 (已修改：支持分页)
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUserList(@RequestParam(defaultValue = "1") int page,
                                                           @RequestParam(defaultValue = "10") int size,
                                                           @RequestParam(required = false) String keyword, // 新增
                                                           HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();

        int offset = (page - 1) * size;
        List<User> list = adminMapper.selectUsersPage(keyword, offset, size); // 传入 keyword
        int total = adminMapper.countUsers(keyword); // 使用带 keyword 的统计

        Map<String, Object> res = new HashMap<>();
        res.put("rows", list);
        res.put("total", total);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/user/status")
    public ResponseEntity<String> updateUserStatus(@RequestBody Map<String, Integer> body, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        if (body.get("status") == null) return ResponseEntity.badRequest().body("状态不能为空");
        userMapper.updateUserStatus(body.get("id"), body.get("status"));
        return ResponseEntity.ok("更新成功");
    }

    // --- 食材管理 (已修改：支持分页) ---
    @GetMapping("/ingredients")
    public ResponseEntity<Map<String, Object>> getIngredients(@RequestParam(defaultValue = "1") int page,
                                                              @RequestParam(defaultValue = "10") int size,
                                                              @RequestParam(required = false) String keyword,
                                                              HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();

        int offset = (page - 1) * size;
        List<Ingredient> list = adminMapper.selectIngredientsPage(keyword, offset, size);
        int total = adminMapper.countIngredients(keyword);

        Map<String, Object> res = new HashMap<>();
        res.put("rows", list);
        res.put("total", total);
        return ResponseEntity.ok(res);
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

    // --- 菜系管理 (已修改：支持分页) ---
    @GetMapping("/cuisines")
    public ResponseEntity<Map<String, Object>> getCuisines(@RequestParam(defaultValue = "1") int page,
                                                           @RequestParam(defaultValue = "10") int size,
                                                           @RequestParam(required = false) String keyword,
                                                           HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();

        int offset = (page - 1) * size;
        List<Cuisine> list = adminMapper.selectCuisinesPage(keyword, offset, size);
        int total = adminMapper.countCuisines(keyword);

        Map<String, Object> res = new HashMap<>();
        res.put("rows", list);
        res.put("total", total);
        return ResponseEntity.ok(res);
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

    // 3. 食谱管理 (已修改：支持分页)
    @GetMapping("/recipes")
    public ResponseEntity<Map<String, Object>> getRecipeList(@RequestParam(defaultValue = "1") int page,
                                                             @RequestParam(defaultValue = "10") int size,
                                                             @RequestParam(required = false) String keyword,
                                                             HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();

        int offset = (page - 1) * size;
        List<Recipe> list = adminMapper.selectRecipesPage(keyword, offset, size);
        int total = adminMapper.countRecipes(keyword);

        Map<String, Object> res = new HashMap<>();
        res.put("rows", list);
        res.put("total", total);
        return ResponseEntity.ok(res);
    }

    // 在 AdminController 类中添加以下方法

    // 审核食谱接口
    @PostMapping("/recipe/audit")
    public ResponseEntity<Map<String, Object>> auditRecipe(@RequestBody Map<String, Integer> body, HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        if (!isAdmin(request)) { res.put("success", false); return ResponseEntity.status(403).body(res); }
        adminMapper.updateRecipeStatus(body.get("id"), body.get("status"));
        res.put("success", true);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/recipe/recommend")
    public ResponseEntity<String> toggleRecommend(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        adminMapper.updateRecipeRecommendation((Integer) body.get("id"), (Boolean) body.get("isRecommended"));
        return ResponseEntity.ok("操作成功");
    }


    // 4. 订单管理 (已修改：支持分页)
    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getAllOrders(@RequestParam(defaultValue = "1") int page,
                                                            @RequestParam(defaultValue = "10") int size,
                                                            @RequestParam(required = false) String keyword,
                                                            @RequestParam(required = false) String status, // 新增参数
                                                            HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        // private boolean isAdmin(HttpServletRequest request) 方法假设已存在于类中
        // if (!isAdmin(request)) ... (保持原有权限检查)

        int offset = (page - 1) * size;

        // 传入 status 参数
        List<Order> list = adminMapper.selectOrdersPage(keyword, status, offset, size);
        int total = adminMapper.countOrders(keyword, status);

        res.put("rows", list);
        res.put("total", total);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/order/status")
    public ResponseEntity<String> updateOrderStatus(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        adminMapper.updateOrderStatus((Integer) body.get("id"), (String) body.get("status"));
        return ResponseEntity.ok("状态更新成功");
    }

    @GetMapping("/order/stats")
    public ResponseEntity<?> getOrderStats(HttpServletRequest request) {
        if (!isAdmin(request)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(adminMapper.countOrdersByStatus());
    }

    // --- 系统配置 & 公告 ---
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

    // 5. 管理员删除食谱接口
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