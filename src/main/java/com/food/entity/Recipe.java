package com.food.entity;

import java.util.Date;

public class Recipe {
    private Integer id;
    private String title;
    private Integer cuisineId; // 对应 cuisines 表
    private String image;      // 图片路径
    private String description;
    private String ingredients; // 简单起见，存为长字符串或JSON
    private String steps;       // 烹饪步骤
    private Integer userId;     // 作者ID (新增字段，记得在数据库添加此列或关联)
    private Date createdAt;
    private Integer status;
    // 扩展字段，用于展示
    private String authorName;
    private String authorAvatar;

    private Boolean isRecommended;


    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public Boolean getIsRecommended() { return isRecommended; }
    public void setIsRecommended(Boolean recommended) { isRecommended = recommended; }
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getCuisineId() { return cuisineId; }
    public void setCuisineId(Integer cuisineId) { this.cuisineId = cuisineId; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }
    public String getSteps() { return steps; }
    public void setSteps(String steps) { this.steps = steps; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getAuthorAvatar() { return authorAvatar; }
    public void setAuthorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; }
}