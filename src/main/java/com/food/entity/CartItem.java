package com.food.entity;

public class CartItem {
    private Integer id;
    private Integer userId;
    private Integer ingredientId;
    private Integer quantity;

    // 关联查询字段
    private String ingredientName;
    private Double price;
    private String image;
    private String unit;

    // Getters and Setters ... (请自行生成)
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Integer getIngredientId() { return ingredientId; }
    public void setIngredientId(Integer ingredientId) { this.ingredientId = ingredientId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getIngredientName() { return ingredientName; }
    public void setIngredientName(String ingredientName) { this.ingredientName = ingredientName; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}