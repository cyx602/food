package com.food.controller;

import com.food.entity.ShoppingItem;
import com.food.entity.User;
import com.food.mapper.ShoppingListMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shopping-list")
public class ShoppingListController {

    @Autowired
    private ShoppingListMapper shoppingListMapper;

    // 获取清单
    @GetMapping("/list")
    public ResponseEntity<List<ShoppingItem>> getList(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(shoppingListMapper.selectByUserId(user.getId()));
    }

    // 添加单项
    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody ShoppingItem item, HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();

        item.setUserId(user.getId());
        shoppingListMapper.insertItem(item);
        return ResponseEntity.ok("success");
    }

    // 将原来的 batchAdd 方法替换为：
    @PostMapping("/batch-add")
    public ResponseEntity<Map<String, Object>> batchAdd(@RequestBody List<ShoppingItem> items, HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            if (items != null && !items.isEmpty()) {
                for (ShoppingItem item : items) {
                    item.setUserId(user.getId());
                    // 关键修复：防止字段为 null 导致数据库报错
                    if (item.getName() == null) item.setName("未知食材");
                    if (item.getQuantity() == null) item.setQuantity("适量");
                }
                shoppingListMapper.batchInsertItems(items);
            }
            res.put("success", true);
            res.put("message", "已添加到清单");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "添加失败: " + e.getMessage());
            // 关键修复：返回 JSON 错误而非 500 页面
            return ResponseEntity.status(500).body(res);
        }
    }

    // 更新状态
    @PostMapping("/status")
    public ResponseEntity<String> updateStatus(@RequestBody Map<String, Object> body) {
        int id = (Integer) body.get("id");
        boolean isBought = (Boolean) body.get("isBought");
        shoppingListMapper.updateStatus(id, isBought);
        return ResponseEntity.ok("success");
    }

    // 删除
    @PostMapping("/delete")
    public ResponseEntity<String> delete(@RequestBody Map<String, Integer> body) {
        shoppingListMapper.deleteItem(body.get("id"));
        return ResponseEntity.ok("success");
    }

    // 清理已买
    @PostMapping("/clear-bought")
    public ResponseEntity<String> clearBought(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();

        shoppingListMapper.deleteBoughtItems(user.getId());
        return ResponseEntity.ok("success");
    }
}