package com.food.service;

import com.food.entity.User;
import com.food.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务层：封装注册、登录、更新头像等业务逻辑
 * 依赖 MyBatis 的 UserMapper 接口与数据库交互
 */
@Service
public class UserService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * 用户注册 (改为检查邮箱是否重复)
     */
    @Transactional
    public boolean register(User user) {
        int count = userMapper.countByEmail(user.getEmail());
        if (count > 0) return false;

        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            user.setUsername(user.getEmail().split("@")[0]);
        }
        String encodedPwd = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPwd);

        userMapper.insertUser(user);
        return true;
    }

    /**
     * 用户登录 (改为使用邮箱登录)
     */
    public User login(String email, String password) {
        System.out.println("🔍 开始登录验证 - 邮箱: " + email);
        // 修改点：根据邮箱查询用户
        User user = userMapper.selectByEmail(email);

        if (user == null) {
            System.out.println("❌ 用户不存在: " + email);
            return null;
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
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

    @Transactional
    public void deleteUser(Integer id) {
        userMapper.deleteUserById(id);
    }

    @Transactional
    public boolean updateUserInfo(User user) {
        // 这里可以添加逻辑判断，比如检查新用户名是否和其他人重复（除了自己）
        userMapper.updateUser(user);
        return true;
    }
    public int countByUsername(String username) {
        return userMapper.countByUsername(username);
    }
}
