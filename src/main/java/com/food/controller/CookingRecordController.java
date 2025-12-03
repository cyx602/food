package com.food.controller;

import com.food.entity.CookingRecord;
import com.food.entity.User;
import com.food.mapper.CookingRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/record")
public class CookingRecordController {

    @Autowired
    private CookingRecordMapper recordMapper;

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addRecord(@RequestBody CookingRecord record,
                                                         HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            record.setUserId(user.getId());
            recordMapper.insertRecord(record);
            res.put("success", true);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "提交失败");
            return ResponseEntity.badRequest().body(res);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<CookingRecord>> getList(@RequestParam int recipeId) {
        return ResponseEntity.ok(recordMapper.selectByRecipeId(recipeId));
    }
}