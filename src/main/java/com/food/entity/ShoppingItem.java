package com.food.entity;

public class ShoppingItem {
    private Integer id;
    private Integer userId;
    private String name;
    private String quantity;
    private Boolean isBought;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }
    public Boolean getIsBought() { return isBought; }
    public void setIsBought(Boolean isBought) { this.isBought = isBought; }
}