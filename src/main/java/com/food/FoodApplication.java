package com.food;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.food.mapper") // 扫描 Mapper 接口
public class FoodApplication {
    public static void main(String[] args) {
        SpringApplication.run(FoodApplication.class, args);
    }
}