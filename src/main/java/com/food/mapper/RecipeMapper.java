package com.food.mapper;

import com.food.entity.Recipe;
import org.apache.ibatis.annotations.Param;
import java.util.*;

public interface RecipeMapper {
    // ... (保留原有的方法: insertFavorite, deleteFavorite, checkFavorite, selectFavoriteRecipeIds) ...

    void insertFavorite(@Param("userId") int userId, @Param("recipeId") int recipeId);
    void deleteFavorite(@Param("userId") int userId, @Param("recipeId") int recipeId);
    int checkFavorite(@Param("userId") int userId, @Param("recipeId") int recipeId);
    List<Integer> selectFavoriteRecipeIds(@Param("userId") int userId);

    // ... (保留原有的方法: updateRecipe, insertRecipe, selectRecipesByUserId, selectRecipeById) ...
    void updateRecipe(Recipe recipe);
    void insertRecipe(Recipe recipe);
    List<Recipe> selectRecipesByUserId(@Param("userId") int userId);
    Recipe selectRecipeById(@Param("id") int id);

    // 【新增】删除食谱方法
    void deleteRecipe(@Param("id") int id, @Param("userId") int userId);
}