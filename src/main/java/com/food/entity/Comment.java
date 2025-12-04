package com.food.entity;

import java.util.Date;

/**
 * 评论实体类
 * 对应数据库表：comments
 */
public class Comment {
    private Integer id;
    private Integer userId;
    private Integer recipeId;
    private String content;
    private Integer rating; // 1-5分
    private String image;   // 新增：评论图片
    private Date createdAt;

    // --- 扩展字段 (用于前端展示评论者的信息) ---
    private String username; // 评论者昵称
    private String avatar;   // 评论者头像文件名

    // --- Getters and Setters ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getRecipeId() { return recipeId; }
    public void setRecipeId(Integer recipeId) { this.recipeId = recipeId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
}