package com.food.controller;

import com.food.entity.CartItem;
import com.food.entity.User;
import com.food.mapper.CartMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartMapper cartMapper;

    // 获取购物车列表
    @GetMapping("/list")
    public ResponseEntity<?> getCart(HttpSession session) {
        User user = (User) session.getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "请先登录"));
        return ResponseEntity.ok(cartMapper.selectCartByUserId(user.getId()));
    }

    // 添加商品 (修复逻辑)
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, Object> body, HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) session.getAttribute("currentUser");

        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            // 增强健壮性：防止前端传空值导致 NullPointerException
            if (body.get("ingredientId") == null) {
                throw new IllegalArgumentException("商品ID不能为空");
            }

            Integer ingredientId = Integer.parseInt(body.get("ingredientId").toString());
            // 默认为 1
            Integer quantity = body.get("quantity") != null ? Integer.parseInt(body.get("quantity").toString()) : 1;

            CartItem existing = cartMapper.selectByUserAndIngredient(user.getId(), ingredientId);

            if (existing != null) {
                cartMapper.updateQuantity(existing.getId(), existing.getQuantity() + quantity);
            } else {
                CartItem newItem = new CartItem();
                newItem.setUserId(user.getId());
                newItem.setIngredientId(ingredientId);
                newItem.setQuantity(quantity);
                cartMapper.insertCartItem(newItem);
            }
            res.put("success", true);
            res.put("message", "添加成功");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "操作失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }
    // 移除商品
    @PostMapping("/remove")
    public ResponseEntity<Map<String, Object>> remove(@RequestBody Map<String, Integer> body) {
        cartMapper.deleteCartItem(body.get("id"));
        return ResponseEntity.ok(Map.of("success", true));
    }
}