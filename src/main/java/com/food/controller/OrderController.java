package com.food.controller;

import com.food.entity.*;
import com.food.mapper.CartMapper;
import com.food.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired private CartMapper cartMapper;
    @Autowired private OrderMapper orderMapper;

    @PostMapping("/checkout")
    @Transactional // 开启事务：创建订单+清空购物车必须同时成功
    public ResponseEntity<Map<String, Object>> checkout(HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();

        // 1. 获取购物车
        List<CartItem> cartItems = cartMapper.selectCartByUserId(user.getId());
        if (cartItems.isEmpty()) {
            res.put("success", false);
            res.put("message", "购物车为空");
            return ResponseEntity.badRequest().body(res);
        }

        // 2. 计算总价
        double total = cartItems.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();

        // 3. 创建订单
        Order order = new Order();
        order.setUserId(user.getId());
        order.setOrderNo(UUID.randomUUID().toString().substring(0, 18)); // 简单订单号
        order.setTotalAmount(total);
        orderMapper.insertOrder(order);

        // 4. 创建订单详情
        for (CartItem ci : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setOrderId(order.getId());
            oi.setIngredientId(ci.getIngredientId());
            oi.setName(ci.getIngredientName());
            oi.setPrice(ci.getPrice());
            oi.setQuantity(ci.getQuantity());
            orderMapper.insertOrderItem(oi);
        }

        // 5. 清空购物车
        cartMapper.deleteCartByUserId(user.getId());

        res.put("success", true);
        res.put("message", "下单成功！");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Order>> getMyOrders(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderMapper.selectOrdersByUserId(user.getId()));
    }
}