package com.food.mapper;
import com.food.entity.CartItem;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface CartMapper {
    // 获取用户购物车列表（包含商品详情）
    List<CartItem> selectCartByUserId(int userId);

    // 检查购物车是否已有该商品
    CartItem selectByUserAndIngredient(@Param("userId") int userId, @Param("ingredientId") int ingredientId);

    // 添加商品
    void insertCartItem(CartItem item);

    // 更新数量
    void updateQuantity(@Param("id") int id, @Param("quantity") int quantity);

    // 删除商品
    void deleteCartItem(int id);

    // 清空购物车
    void deleteCartByUserId(int userId);
}