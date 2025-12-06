package com.food.mapper;

import com.food.entity.ShoppingItem;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface ShoppingListMapper {
    // 获取我的清单
    List<ShoppingItem> selectByUserId(int userId);

    // 添加单项
    void insertItem(ShoppingItem item);

    // 批量添加（用于食谱导入）
    void batchInsertItems(@Param("items") List<ShoppingItem> items);

    // 更新状态（勾选/取消）
    void updateStatus(@Param("id") int id, @Param("isBought") boolean isBought);

    // 删除单项
    void deleteItem(int id);

    // 清理已买
    void deleteBoughtItems(int userId);

    // 新增：清理待买
    void deleteTodoItems(int userId);
}