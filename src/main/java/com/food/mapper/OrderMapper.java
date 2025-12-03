package com.food.mapper;
import com.food.entity.Order;
import com.food.entity.OrderItem;
import java.util.List;

public interface OrderMapper {
    void insertOrder(Order order);
    void insertOrderItem(OrderItem item);
    List<Order> selectOrdersByUserId(int userId);
}