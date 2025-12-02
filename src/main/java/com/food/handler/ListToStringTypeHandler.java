package com.food.handler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * MyBatis 类型处理器：将 List<String> 与数据库中的逗号分隔字符串互转
 * 用于处理 User 实体类的 styles 字段
 */
public class ListToStringTypeHandler extends BaseTypeHandler<List<String>> {

    // 插入/更新时：将 List<String> 转为逗号字符串
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<String> parameter, JdbcType jdbcType) throws SQLException {
        String stylesStr = parameter.stream().collect(Collectors.joining(","));
        ps.setString(i, stylesStr);
    }

    // 查询时：将数据库字符串转为 List<String>
    @Override
    public List<String> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String stylesStr = rs.getString(columnName);
        return stylesStr != null ? Arrays.asList(stylesStr.split(",")) : null;
    }

    // 以下两个方法为其他查询场景提供支持（必须实现）
    @Override
    public List<String> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String stylesStr = rs.getString(columnIndex);
        return stylesStr != null ? Arrays.asList(stylesStr.split(",")) : null;
    }

    @Override
    public List<String> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String stylesStr = cs.getString(columnIndex);
        return stylesStr != null ? Arrays.asList(stylesStr.split(",")) : null;
    }
}