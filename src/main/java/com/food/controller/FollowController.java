package com.food.controller;

import com.food.entity.Recipe;
import com.food.entity.User;
import com.food.mapper.FollowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowMapper followMapper;

    // 切换关注状态 (关注/取关)
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleFollow(@RequestBody Map<String, Integer> body,
                                                            HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User currentUser = (User) request.getSession().getAttribute("currentUser");

        if (currentUser == null) {
            res.put("success", false);
            res.put("message", "请先登录");
            return ResponseEntity.status(401).body(res);
        }

        Integer targetUserId = body.get("targetUserId");
        if (targetUserId == null || targetUserId.equals(currentUser.getId())) {
            res.put("success", false);
            res.put("message", "不能关注自己");
            return ResponseEntity.badRequest().body(res);
        }

        int count = followMapper.checkFollow(currentUser.getId(), targetUserId);
        if (count > 0) {
            followMapper.deleteFollow(currentUser.getId(), targetUserId);
            res.put("status", "unfollowed");
            res.put("message", "已取消关注");
        } else {
            followMapper.insertFollow(currentUser.getId(), targetUserId);
            res.put("status", "followed");
            res.put("message", "关注成功");
        }
        res.put("success", true);
        return ResponseEntity.ok(res);
    }

    // 获取动态圈食谱 (Feed)
    @GetMapping("/feed")
    public ResponseEntity<List<Recipe>> getFeed(HttpServletRequest request) {
        User currentUser = (User) request.getSession().getAttribute("currentUser");
        if (currentUser == null) return ResponseEntity.status(401).build();

        List<Recipe> recipes = followMapper.selectFollowedRecipes(currentUser.getId());
        return ResponseEntity.ok(recipes);
    }

    // 检查是否关注了某人
    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> checkStatus(@RequestParam int targetUserId, HttpServletRequest request) {
        User currentUser = (User) request.getSession().getAttribute("currentUser");
        boolean isFollowing = false;
        if (currentUser != null) {
            int count = followMapper.checkFollow(currentUser.getId(), targetUserId);
            isFollowing = count > 0;
        }
        return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
    }
}