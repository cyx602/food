package com.food.mapper;
import com.food.entity.Order;
import com.food.entity.OrderItem;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface OrderMapper {
    void insertOrder(Order order);
    void insertOrderItem(OrderItem item);

    // 原有的列表查询（可保留也可废弃，建议保留做兼容）
    List<Order> selectOrdersByUserId(int userId);

    // --- 新增：带搜索和分页的查询 ---
    List<Order> selectOrdersPageByUserId(@Param("userId") int userId,
                                         @Param("keyword") String keyword,
                                         @Param("offset") int offset,
                                         @Param("limit") int limit);

    // --- 新增：统计符合条件的订单总数 ---
    int countOrdersByUserId(@Param("userId") int userId, @Param("keyword") String keyword);

    int countAllOrders();
    List<Order> selectAllOrders();
}