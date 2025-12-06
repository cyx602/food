package com.food.controller;

import com.food.entity.*;
import com.food.mapper.CartMapper;
import com.food.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired private CartMapper cartMapper;
    @Autowired private OrderMapper orderMapper;

    // ... (保留原有的 checkout 和 list 方法) ...
    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<Map<String, Object>> checkout(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        // ... (保持原有代码不变) ...
        // 为了节省篇幅，此处省略原有 checkout 代码，请保留原文件内容
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            String receiverName = (String) body.get("receiverName");
            String receiverPhone = (String) body.get("receiverPhone");
            String receiverAddress = (String) body.get("receiverAddress");

            if (receiverName == null || receiverPhone == null || receiverAddress == null) {
                throw new IllegalArgumentException("收货信息不完整");
            }

            List<CartItem> cartItems = cartMapper.selectCartByUserId(user.getId());
            if (cartItems.isEmpty()) {
                res.put("success", false);
                res.put("message", "购物车为空，无法结算");
                return ResponseEntity.badRequest().body(res);
            }

            double total = 0.0;
            for (CartItem item : cartItems) {
                total += item.getPrice() * item.getQuantity();
            }

            Order order = new Order();
            order.setUserId(user.getId());
            order.setOrderNo(UUID.randomUUID().toString().replace("-", "").substring(0, 18));
            order.setTotalAmount(total);
            order.setReceiverName(receiverName);
            order.setReceiverPhone(receiverPhone);
            order.setReceiverAddress(receiverAddress);

            orderMapper.insertOrder(order);

            for (CartItem ci : cartItems) {
                OrderItem oi = new OrderItem();
                oi.setOrderId(order.getId());
                oi.setIngredientId(ci.getIngredientId());
                oi.setName(ci.getIngredientName() != null ? ci.getIngredientName() : "未知商品");
                oi.setPrice(ci.getPrice());
                oi.setQuantity(ci.getQuantity());
                orderMapper.insertOrderItem(oi);
            }

            cartMapper.deleteCartByUserId(user.getId());

            res.put("success", true);
            res.put("message", "下单成功！");
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "结算失败：" + e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getMyOrders(@RequestParam(defaultValue = "1") int page,
                                                           @RequestParam(defaultValue = "5") int size,
                                                           @RequestParam(required = false) String keyword,
                                                           HttpServletRequest request) {
        // ... (保持原有代码不变) ...
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();

        int offset = (page - 1) * size;
        List<Order> list = orderMapper.selectOrdersPageByUserId(user.getId(), keyword, offset, size);
        int total = orderMapper.countOrdersByUserId(user.getId(), keyword);

        Map<String, Object> res = new HashMap<>();
        res.put("rows", list);
        res.put("total", total);
        return ResponseEntity.ok(res);
    }

    // 【新增】修改订单地址
    @PostMapping("/update-address")
    public ResponseEntity<Map<String, Object>> updateAddress(@RequestBody Map<String, Object> body, HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) session.getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();

        try {
            Integer orderId = (Integer) body.get("id");
            String name = (String) body.get("receiverName");
            String phone = (String) body.get("receiverPhone");
            String address = (String) body.get("receiverAddress");

            // 执行更新，Mapper 中会校验 user_id 和 status='PENDING'
            int rows = orderMapper.updateReceiverInfo(orderId, user.getId(), name, phone, address);

            if (rows > 0) {
                res.put("success", true);
                res.put("message", "地址修改成功");
                return ResponseEntity.ok(res);
            } else {
                res.put("success", false);
                res.put("message", "修改失败：订单可能已发货或不存在");
                return ResponseEntity.badRequest().body(res);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // 【新增】删除订单
    @PostMapping("/delete")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteOrder(@RequestBody Map<String, Integer> body, HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) session.getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();

        try {
            Integer orderId = body.get("id");
            // 先删除子项（外键约束）
            orderMapper.deleteOrderItems(orderId);
            // 再删除主表，且校验 user_id
            int rows = orderMapper.deleteOrder(orderId, user.getId());

            if (rows > 0) {
                res.put("success", true);
                res.put("message", "订单已删除");
                return ResponseEntity.ok(res);
            } else {
                // 如果主表删除失败（例如不是自己的订单），回滚（由 @Transactional 控制，抛异常即可回滚，这里简单处理）
                throw new RuntimeException("删除失败或无权限");
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "删除失败");
            return ResponseEntity.badRequest().body(res);
        }
    }
}