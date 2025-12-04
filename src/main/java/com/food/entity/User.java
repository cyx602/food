package com.food.entity;

import java.util.Date;
import java.util.List;

/**
 * 用户实体类：对应数据库 users 表
 * 注意：styles 字段为 List<String>，需通过 MyBatis 类型处理器转换为逗号分隔字符串存储
 */
public class User {
    private Integer id;               // 自增主键
    private String username;         // 用户名（唯一）
    private String password;         // 密码（实验简化处理，实际需加密）
    private String gender;           // 性别（如 "male"/"female"）
    private List<String> styles;     // 美食偏好（如 ["中餐", "西餐"]）
    private String phone;            // 手机号
    private String email;            // 电子邮箱
    private String address;          // 地址
    private String avatarFileName;   // 头像文件名（存储路径或文件名） - 确保字段名正确
    private Date createdAt;          // 创建时间（数据库自动生成）
    private Integer status;

    // 全参构造器（方便测试）
    public User(String username, String password, String gender, List<String> styles,
                String phone, String email, String address, String avatarFileName) {
        this.username = username;
        this.password = password;
        this.gender = gender;
        this.styles = styles;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.avatarFileName = avatarFileName;
    }

    // 无参构造器（MyBatis 反射需要）
    public User() {}

    // Getter 和 Setter（必须实现，MyBatis 映射依赖）
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public List<String> getStyles() { return styles; }
    public void setStyles(List<String> styles) { this.styles = styles; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    // 确保getter和setter方法名正确
    public String getAvatarFileName() { return avatarFileName; }
    public void setAvatarFileName(String avatarFileName) { this.avatarFileName = avatarFileName; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    // 添加toString方法用于调试
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", gender='" + gender + '\'' +
                ", styles=" + styles +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", avatarFileName='" + avatarFileName + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}