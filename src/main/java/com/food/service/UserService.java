package com.food.service;

import com.food.entity.User;
import com.food.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务层：封装注册、登录、更新头像等业务逻辑
 * 依赖 MyBatis 的 UserMapper 接口与数据库交互
 */
@Service
public class UserService {

    // 注入 MyBatis Mapper 接口
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * 用户注册
     */
    @Transactional
    public boolean register(User user) {
        int count = userMapper.countByUsername(user.getUsername());
        if (count > 0) {
            return false; // 用户名已存在
        }
        userMapper.insertUser(user);
        return true;
    }

    /**
     * 用户登录
     */
    public User login(String username, String password) {
        System.out.println("🔍 开始登录验证 - 用户名: " + username);
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            System.out.println("❌ 用户不存在: " + username);
            return null;
        }
        System.out.println("🔐 数据库用户信息: " + user);
        System.out.println("🔑 密码比较 - 数据库密码: " + user.getPassword() +
                ", 输入密码: " + password +
                ", 是否匹配: " + user.getPassword().equals(password));

        if (user.getPassword().equals(password)) {
            System.out.println("✅ 登录验证成功");
            return user;
        }
        System.out.println("❌ 密码不匹配");
        return null;
    }

    /**
     * 更新用户头像文件名
     * @param username 用户名
     * @param avatarFileName 新头像文件名或相对路径
     * @return 是否更新成功
     */
    @Transactional
    public boolean updateAvatar(String username, String avatarFileName) {
        int rows = userMapper.updateAvatarByUsername(username, avatarFileName);
        return rows > 0;
    }

    public int countByUsername(String username) {
        return userMapper.countByUsername(username);
    }
}
