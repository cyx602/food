package com.food.controller;

import com.food.entity.*;
import com.food.mapper.CartMapper;
import com.food.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.text.SimpleDateFormat;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired private CartMapper cartMapper;
    @Autowired private OrderMapper orderMapper;

    // 修改：增加 @RequestBody 接收参数
    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<Map<String, Object>> checkout(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            // 校验地址信息
            String receiverName = (String) body.get("receiverName");
            String receiverPhone = (String) body.get("receiverPhone");
            String receiverAddress = (String) body.get("receiverAddress");

            if (receiverName == null || receiverPhone == null || receiverAddress == null) {
                throw new IllegalArgumentException("收货信息不完整");
            }

            // 1. 获取购物车
            List<CartItem> cartItems = cartMapper.selectCartByUserId(user.getId());
            if (cartItems.isEmpty()) {
                res.put("success", false);
                res.put("message", "购物车为空，无法结算");
                return ResponseEntity.badRequest().body(res);
            }

            // 2. 计算总价
            double total = 0.0;
            for (CartItem item : cartItems) {
                if (item.getPrice() == null) {
                    throw new RuntimeException("商品 " + item.getIngredientName() + " 价格异常");
                }
                total += item.getPrice() * item.getQuantity();
            }

            // 3. 创建订单
            Order order = new Order();
            order.setUserId(user.getId());

            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
            String timeStr = sdf.format(new Date());
            // 生成 100000 到 999999 之间的随机数
            int randomNum = (int)((Math.random() * 9 + 1) * 100000);
            String orderNo = timeStr + randomNum;

            order.setOrderNo(orderNo);
            order.setOrderNo(UUID.randomUUID().toString().replace("-", "").substring(0, 18));
            order.setTotalAmount(total);

            // 设置收货信息
            order.setReceiverName(receiverName);
            order.setReceiverPhone(receiverPhone);
            order.setReceiverAddress(receiverAddress);

            orderMapper.insertOrder(order);

            if (order.getId() == null) throw new RuntimeException("订单创建失败：ID为空");

            // 4. 创建订单详情
            for (CartItem ci : cartItems) {
                OrderItem oi = new OrderItem();
                oi.setOrderId(order.getId());
                oi.setIngredientId(ci.getIngredientId());
                oi.setName(ci.getIngredientName() != null ? ci.getIngredientName() : "未知商品");
                oi.setPrice(ci.getPrice());
                oi.setQuantity(ci.getQuantity());
                orderMapper.insertOrderItem(oi);
            }

            // 5. 清空购物车
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
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) return ResponseEntity.status(401).build();

        int offset = (page - 1) * size;

        // 执行分页查询
        List<Order> list = orderMapper.selectOrdersPageByUserId(user.getId(), keyword, offset, size);
        // 查询总数
        int total = orderMapper.countOrdersByUserId(user.getId(), keyword);

        Map<String, Object> res = new HashMap<>();
        res.put("rows", list);
        res.put("total", total);
        return ResponseEntity.ok(res);
    }
}