package com.food.mapper;

import com.food.entity.*;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

public interface AdminMapper {
    // --- 食材管理 ---
    List<Ingredient> selectAllIngredients();
    void insertIngredient(Ingredient ingredient);
    void updateIngredient(Ingredient ingredient);
    void deleteIngredient(int id);

    // --- 菜系管理 ---
    List<Cuisine> selectAllCuisines();
    void insertCuisine(Cuisine cuisine);
    void updateCuisine(Cuisine cuisine);
    void deleteCuisine(int id);

    // --- 食谱管理 (推荐 & 排行) ---
    void updateRecipeRecommendation(@Param("id") int id, @Param("isRecommended") boolean isRecommended);
    // 获取热门食谱 (根据收藏数)
    List<Map<String, Object>> selectHotRecipes();

    // --- 订单管理 ---
    List<Order> selectAllOrders(); // 覆盖原有的简单查询，可能需要更多字段
    void updateOrderStatus(@Param("id") int id, @Param("status") String status);
    // 统计各状态订单数
    List<Map<String, Object>> countOrdersByStatus();

    // --- 系统配置 ---
    String selectSettingValue(@Param("key") String key);
    void updateSetting(@Param("key") String key, @Param("value") String value);

    // --- 公告管理 ---
    List<Announcement> selectAllAnnouncements();
    void insertAnnouncement(Announcement announcement);
    void deleteAnnouncement(int id);
}