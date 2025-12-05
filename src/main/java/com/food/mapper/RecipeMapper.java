package com.food.mapper;

import com.food.entity.Recipe;
import org.apache.ibatis.annotations.Param;
import java.util.*;

public interface RecipeMapper {
    void insertFavorite(@Param("userId") int userId, @Param("recipeId") int recipeId);
    void deleteFavorite(@Param("userId") int userId, @Param("recipeId") int recipeId);
    int checkFavorite(@Param("userId") int userId, @Param("recipeId") int recipeId);
    List<Integer> selectFavoriteRecipeIds(@Param("userId") int userId);

    List<Recipe> selectRecommendedRecipes();


    // 【新增】分页获取收藏列表
    List<Recipe> selectFavoriteRecipesPage(@Param("userId") int userId, @Param("offset") int offset, @Param("limit") int limit);
    // 【新增】统计收藏总数
    int countFavoriteRecipes(@Param("userId") int userId);

    void updateRecipe(Recipe recipe);
    void insertRecipe(Recipe recipe);

    // 原有方法保留兼容
    List<Recipe> selectRecipesByUserId(@Param("userId") int userId);

    // 【新增】分页获取我的创作
    List<Recipe> selectRecipesByUserIdPage(@Param("userId") int userId, @Param("offset") int offset, @Param("limit") int limit);
    // 【新增】统计我的创作总数
    int countRecipesByUserId(@Param("userId") int userId);

    Recipe selectRecipeById(@Param("id") int id);
    void deleteRecipe(@Param("id") int id, @Param("userId") int userId);
    void adminDeleteRecipe(@Param("id") int id);
    int countAllRecipes();
    List<Recipe> selectAllRecipes();
}