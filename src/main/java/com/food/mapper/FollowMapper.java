package com.food.mapper;

import com.food.entity.Recipe;
import com.food.entity.User;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface FollowMapper {
    // 关注
    void insertFollow(@Param("followerId") int followerId, @Param("followedId") int followedId);

    // 取消关注
    void deleteFollow(@Param("followerId") int followerId, @Param("followedId") int followedId);

    // 检查是否已关注 (返回1表示已关注，0表示未关注)
    int checkFollow(@Param("followerId") int followerId, @Param("followedId") int followedId);

    // 获取我关注的人发布的食谱（朋友圈动态）
    List<Recipe> selectFollowedRecipes(@Param("userId") int userId);

    // 获取我关注的用户列表
    List<User> selectFollowing(@Param("userId") int userId);
}