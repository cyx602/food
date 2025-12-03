package com.food.entity;
import java.util.Date;

public class CookingRecord {
    private Integer id;
    private Integer userId;
    private Integer recipeId;
    private String note;
    private String image;
    private Date createdAt;

    // 扩展字段
    private String username;
    private String userAvatar;

    // Getters Setters 省略... 请补全
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Integer getRecipeId() { return recipeId; }
    public void setRecipeId(Integer recipeId) { this.recipeId = recipeId; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getUserAvatar() { return userAvatar; }
    public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }
}