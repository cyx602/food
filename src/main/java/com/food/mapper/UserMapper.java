package com.food.mapper;

import com.food.entity.User;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * MyBatis Mapper 接口：定义与用户表相关的数据库操作
 * 无需实现类，MyBatis 通过 XML 映射文件自动生成实现
 */
public interface UserMapper {


    /**
     * 新增用户（注册功能）
     * @param user 包含注册信息的 User 对象
     */
    void insertUser(User user);

    /**
     * 根据用户名查询用户（登录功能）
     * @param username 用户名
     * @return 匹配的 User 对象（无匹配则返回 null）
     */
    User selectByUsername(@Param("username") String username);



    void updateUser(User user);
    /**
     * 统计指定用户名的数量（用于检查用户名是否已存在）
     * @param username 用户名
     * @return 数量（0：不存在；1：已存在）
     */
    int countByUsername(@Param("username") String username);
    int updateAvatarByUsername(@Param("username") String username,
                               @Param("avatarFileName") String avatarFileName);

    int countAllUsers();
    List<User> selectAllUsers();
    void updateUserStatus(@Param("id") int id, @Param("status") int status);
}