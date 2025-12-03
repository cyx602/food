package com.food.mapper;

import com.food.entity.Comment;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface CommentMapper {

    /**
     * 插入一条新评论
     * @param comment 评论对象
     */
    void insertComment(Comment comment);

    /**
     * 查询指定食谱的所有评论（包含评论者的昵称和头像）
     * @param recipeId 食谱ID
     * @return 评论列表
     */
    List<Comment> selectCommentsByRecipeId(@Param("recipeId") Integer recipeId);
}