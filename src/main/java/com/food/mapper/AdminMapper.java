package com.food.mapper;

import com.food.entity.*;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

public interface AdminMapper {
    // --- 用户分页 (复用 UserMapper 的 count) ---
    List<User> selectUsersPage(@Param("offset") int offset, @Param("limit") int limit);

    // --- 食材管理 ---
    List<Ingredient> selectAllIngredients(); // 保持给 market.js 用
    List<Ingredient> selectIngredientsPage(@Param("offset") int offset, @Param("limit") int limit);
    int countIngredients();
    void insertIngredient(Ingredient ingredient);
    void updateIngredient(Ingredient ingredient);
    void deleteIngredient(int id);
    // 在接口中添加
    void updateRecipeStatus(@Param("id") int id, @Param("status") int status);
    // --- 菜系管理 ---
    List<Cuisine> selectAllCuisines(); // 保持给 cuisine.js 用
    List<Cuisine> selectCuisinesPage(@Param("offset") int offset, @Param("limit") int limit);
    int countCuisines();
    void insertCuisine(Cuisine cuisine);
    void updateCuisine(Cuisine cuisine);
    void deleteCuisine(int id);

    // --- 食谱管理 ---
    List<Recipe> selectRecipesPage(@Param("offset") int offset, @Param("limit") int limit);
    void updateRecipeRecommendation(@Param("id") int id, @Param("isRecommended") boolean isRecommended);
    List<Map<String, Object>> selectHotRecipes();

    // --- 订单管理 ---
    List<Order> selectAllOrders();
    List<Order> selectOrdersPage(@Param("offset") int offset, @Param("limit") int limit);
    void updateOrderStatus(@Param("id") int id, @Param("status") String status);
    List<Map<String, Object>> countOrdersByStatus();

    // --- 公告管理 ---
    List<Announcement> selectAllAnnouncements();
    void insertAnnouncement(Announcement announcement);
    void deleteAnnouncement(int id);
}