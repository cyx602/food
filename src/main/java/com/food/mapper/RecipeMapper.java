package com.food.mapper;

import com.food.entity.Recipe;
import org.apache.ibatis.annotations.Param;
import java.util.*;

public interface RecipeMapper {
    // 添加收藏
    void insertFavorite(@Param("userId") int userId, @Param("recipeId") int recipeId);

    // 取消收藏
    void deleteFavorite(@Param("userId") int userId, @Param("recipeId") int recipeId);

    // 检查是否收藏
    int checkFavorite(@Param("userId") int userId, @Param("recipeId") int recipeId);

    // 获取用户收藏列表（需要关联查询食谱表，这里简化返回ID列表）
    List<Integer> selectFavoriteRecipeIds(@Param("userId") int userId);

    void insertRecipe(Recipe recipe);
    List<Recipe> selectRecipesByUserId(@Param("userId") int userId);
    Recipe selectRecipeById(@Param("id") int id);
}