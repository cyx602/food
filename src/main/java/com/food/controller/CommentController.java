package com.food.controller;

import com.food.entity.Comment;
import com.food.entity.User;
import com.food.mapper.CommentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentMapper commentMapper;

    /**
     * 发布评论接口
     * POST /api/comment/add
     * Body: { "recipeId": 1, "content": "很好吃！", "rating": 5 }
     */
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addComment(@RequestBody Comment comment,
                                                          HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();

        // 1. 获取当前登录用户
        User user = (User) request.getSession().getAttribute("currentUser");
        if (user == null) {
            res.put("success", false);
            res.put("message", "请先登录后再发表评论");
            return ResponseEntity.status(401).body(res);
        }

        // 2. 校验参数
        if (comment.getRecipeId() == null) {
            res.put("success", false);
            res.put("message", "食谱ID不能为空");
            return ResponseEntity.badRequest().body(res);
        }
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            res.put("success", false);
            res.put("message", "评论内容不能为空");
            return ResponseEntity.badRequest().body(res);
        }

        // 默认评分为5分
        if (comment.getRating() == null) {
            comment.setRating(5);
        }

        try {
            // 3. 补全评论信息并保存
            comment.setUserId(user.getId());
            commentMapper.insertComment(comment);

            res.put("success", true);
            res.put("message", "评论发表成功！");
            // 返回新生成的ID，方便前端追加显示
            res.put("newCommentId", comment.getId());
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "评论失败：" + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    /**
     * 获取评论列表接口
     * GET /api/comment/list?recipeId=1
     */
    @GetMapping("/list")
    public ResponseEntity<List<Comment>> getComments(@RequestParam("recipeId") Integer recipeId) {
        // 直接返回列表，前端可以通过 status 判断是否成功
        List<Comment> comments = commentMapper.selectCommentsByRecipeId(recipeId);
        return ResponseEntity.ok(comments);
    }
}