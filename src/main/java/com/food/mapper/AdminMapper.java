package com.food.mapper;

import com.food.entity.*;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

public interface AdminMapper {
    // --- 用户管理 ---
    List<User> selectUsersPage(@Param("keyword") String keyword, @Param("offset") int offset, @Param("limit") int limit);
    int countUsers(@Param("keyword") String keyword); // 新增带搜索的统计

    // --- 食材管理 ---
    List<Ingredient> selectAllIngredients();
    List<Ingredient> selectIngredientsPage(@Param("keyword") String keyword, @Param("offset") int offset, @Param("limit") int limit);
    int countIngredients(@Param("keyword") String keyword); // 修改为带搜索
    void insertIngredient(Ingredient ingredient);
    void updateIngredient(Ingredient ingredient);
    void deleteIngredient(int id);

    // --- 菜系管理 ---
    List<Cuisine> selectAllCuisines();
    List<Cuisine> selectCuisinesPage(@Param("keyword") String keyword, @Param("offset") int offset, @Param("limit") int limit);
    int countCuisines(@Param("keyword") String keyword); // 修改为带搜索
    void insertCuisine(Cuisine cuisine);
    void updateCuisine(Cuisine cuisine);
    void deleteCuisine(int id);

    // --- 食谱管理 ---
    List<Recipe> selectRecipesPage(@Param("keyword") String keyword, @Param("offset") int offset, @Param("limit") int limit);
    int countRecipes(@Param("keyword") String keyword); // 新增带搜索的统计
    void updateRecipeStatus(@Param("id") int id, @Param("status") int status);
    void updateRecipeRecommendation(@Param("id") int id, @Param("isRecommended") boolean isRecommended);
    List<Map<String, Object>> selectHotRecipes();

    // --- 订单管理 ---
    List<Order> selectAllOrders();
    List<Order> selectOrdersPage(@Param("keyword") String keyword, @Param("offset") int offset, @Param("limit") int limit);
    int countOrders(@Param("keyword") String keyword); // 新增带搜索的统计
    void updateOrderStatus(@Param("id") int id, @Param("status") String status);
    List<Map<String, Object>> countOrdersByStatus();

    List<Order> selectOrdersPage(@Param("keyword") String keyword, @Param("status") String status, @Param("offset") int offset, @Param("limit") int limit);
    int countOrders(@Param("keyword") String keyword, @Param("status") String status);

    // --- 公告管理 ---
    Announcement selectLatestAnnouncement();
    List<Announcement> selectAllAnnouncements();
    void insertAnnouncement(Announcement announcement);
    void deleteAnnouncement(int id);
}