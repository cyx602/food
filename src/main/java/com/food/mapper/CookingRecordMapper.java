package com.food.mapper;
import com.food.entity.CookingRecord;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface CookingRecordMapper {
    void insertRecord(CookingRecord record);
    List<CookingRecord> selectByRecipeId(@Param("recipeId") int recipeId);
}