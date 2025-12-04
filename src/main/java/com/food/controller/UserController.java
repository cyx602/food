package com.food.controller;

import com.food.entity.User;
import com.food.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.*;

/**
 * 用户相关控制器：
 *  - /upload-avatar：上传头像，返回文件名（给前端 register.js 使用）
 *  - /register      ：接收 JSON 注册信息并写入数据库
 *  - 页面转发       ：/, /register, /login
 */
@Controller
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 头像上传接口
     * 前端：register.js -> fetch('/upload-avatar', { method:'POST', body:FormData })
     * 返回示例：
     *  { "success": true, "fileName": "upload/xxxx-uuid.jpg" }
     */
    @PostMapping("/upload-avatar")
    @ResponseBody
    public Map<String, Object> uploadAvatar(@RequestParam("avatar") MultipartFile avatar,
                                            HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (avatar.isEmpty()) {
                result.put("success", false);
                result.put("message", "上传文件为空");
                return result;
            }

            String uploadDir = request.getServletContext().getRealPath("/static/upload/");
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = UUID.randomUUID() + "_" + avatar.getOriginalFilename();
            File dest = new File(dir, fileName);
            avatar.transferTo(dest);

            result.put("success", true);
            result.put("fileName", fileName);
            result.put("message", "上传成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "上传失败: " + e.getMessage());
        }
        return result;
    }



    /**
     * 用户注册接口
     * 前端：register.js -> fetch('/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(userData) })
     * userData 字段：
     *  username, password, gender, styles(List<String>), phone, address, avatarFileName
     */
    @PostMapping(value = "/register",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> body) {

        System.out.println("🎯 register 接口被调用");
        System.out.println("📥 接收到的数据: " + body);

        Map<String, Object> res = new HashMap<>();

        try {
            String username = (String) body.get("username");
            String password = (String) body.get("password");
            String gender   = (String) body.get("gender");
            String phone    = (String) body.get("phone");
            String email    = (String) body.get("email");
            String address  = (String) body.get("address");
            String avatarFileName = (String) body.get("avatarFileName");

            @SuppressWarnings("unchecked")
            List<String> styles = (List<String>) body.get("styles");

            // ===== 基本校验（和前端保持一致，防止绕过） =====
            if (username == null || username.trim().isEmpty()) {
                System.out.println("❌ 校验失败: 用户名为空");
                res.put("success", false);
                res.put("message", "美食昵称不能为空");
                return ResponseEntity.badRequest().body(res);
            }
            if (password == null || password.trim().isEmpty()) {
                System.out.println("❌ 校验失败: 密码为空");
                res.put("success", false);
                res.put("message", "登录密码不能为空");
                return ResponseEntity.badRequest().body(res);
            }
            if (password.length() < 6) {
                System.out.println("❌ 校验失败: 密码长度不足");
                res.put("success", false);
                res.put("message", "密码长度不能少于6位");
                return ResponseEntity.badRequest().body(res);
            }
            if (phone == null || phone.trim().isEmpty()) {
                System.out.println("❌ 校验失败: 手机号为空");
                res.put("success", false);
                res.put("message", "手机号不能为空");
                return ResponseEntity.badRequest().body(res);
            }
            if (email == null || email.trim().isEmpty()) {
                System.out.println("❌ 校验失败: 邮箱为空");
                res.put("success", false);
                res.put("message", "电子邮箱不能为空");
                return ResponseEntity.badRequest().body(res);
            }
            if (address == null || address.trim().isEmpty()) {
                System.out.println("❌ 校验失败: 地址为空");
                res.put("success", false);
                res.put("message", "食材配送地址不能为空");
                return ResponseEntity.badRequest().body(res);
            }
            if (gender == null || gender.trim().isEmpty()) {
                System.out.println("❌ 校验失败: 性别为空");
                res.put("success", false);
                res.put("message", "性别不能为空");
                return ResponseEntity.badRequest().body(res);
            }
            if (styles == null || styles.isEmpty()) {
                System.out.println("❌ 校验失败: 偏好为空");
                res.put("success", false);
                res.put("message", "至少选择一种美食偏好");
                return ResponseEntity.badRequest().body(res);
            }
            if (avatarFileName == null || avatarFileName.trim().isEmpty()) {
                // 与前端默认值保持一致
                avatarFileName = "default_avatar.jpg";
                System.out.println("ℹ️ 使用默认头像: " + avatarFileName);
            }

            // ===== 检查用户名是否已存在 =====
            int count = userService.countByUsername(username);
            if (count > 0) {
                System.out.println("❌ 用户名已存在: " + username);
                res.put("success", false);
                res.put("message", "用户名已存在，请选择其他昵称");
                return ResponseEntity.badRequest().body(res);
            }

            // ===== 组装实体对象 =====
            User user = new User();
            user.setUsername(username.trim());
            user.setPassword(password.trim());
            user.setGender(gender.trim());
            user.setStyles(styles);        // List<String>，由自定义 TypeHandler 处理
            user.setPhone(phone.trim());
            user.setEmail(email.trim());
            user.setAddress(address.trim());
            user.setAvatarFileName(avatarFileName.trim());

            System.out.println("👤 组装用户对象: " + user);

            // ===== 调用业务层保存 =====
            boolean ok = userService.register(user);

            if (!ok) {
                System.out.println("❌ 注册失败，业务层返回 false");
                res.put("success", false);
                res.put("message", "注册失败，请稍后重试");
                return ResponseEntity.badRequest().body(res);
            }

            System.out.println("✅ 注册成功: " + username);
            res.put("success", true);
            res.put("message", "注册成功，欢迎加入美食天地！");
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            System.out.println("❌ 注册异常: " + e.getMessage());
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "服务器异常：" + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }


    }


    /**
     * 用户登录接口（新增）
     * 前端：login.js -> fetch(baseUrl + '/api/login', {...})
     */
    @PostMapping(value = "/login",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> body,
                                                     HttpServletRequest request) {

        System.out.println("🎯 login 接口被调用");
        System.out.println("📥 接收到的数据: " + body);

        Map<String, Object> res = new HashMap<>();
        try {
            String username = (String) body.get("username");
            String password = (String) body.get("password");

            if (username == null || username.trim().isEmpty()) {
                res.put("success", false);
                res.put("message", "用户名不能为空");
                return ResponseEntity.badRequest().body(res);
            }
            if (password == null || password.trim().isEmpty()) {
                res.put("success", false);
                res.put("message", "登录密码不能为空");
                return ResponseEntity.badRequest().body(res);
            }

            User user = userService.login(username.trim(), password.trim());
            if (user == null) {
                System.out.println("❌ 登录失败：用户名或密码错误，username=" + username);
                res.put("success", false);
                res.put("message", "用户名或密码错误");
                return ResponseEntity.status(401).body(res);
            }

            // 可选：放入会话
            request.getSession().setAttribute("currentUser", user);

            System.out.println("✅ 登录成功: " + username);
            res.put("success", true);
            res.put("message", "登录成功，欢迎回来！");
            res.put("username", user.getUsername());
            res.put("avatarFileName", user.getAvatarFileName());
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("❌ 登录异常：" + e.getMessage());
            res.put("success", false);
            res.put("message", "服务器异常：" + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    @PostMapping(value = "/update-profile", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> body,
                                                             HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User currentUser = (User) request.getSession().getAttribute("currentUser");

        if (currentUser == null) {
            res.put("success", false);
            res.put("message", "登录已过期，请重新登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            // 更新 Session 中的对象属性
            currentUser.setUsername((String) body.get("username"));
            currentUser.setPhone((String) body.get("phone"));
            currentUser.setEmail((String) body.get("email"));
            currentUser.setGender((String) body.get("gender"));
            // 注意：实际项目中应重新从DB查一次ID防止Session过期数据问题

            userService.updateUserInfo(currentUser);

            // 更新 Session
            request.getSession().setAttribute("currentUser", currentUser);

            res.put("success", true);
            res.put("message", "个人信息修改成功");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "更新失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    /**
     * 获取当前登录用户信息
     */
    /**
     * 获取当前登录用户信息 - 修改版
     */
    @GetMapping(value = "/current-user",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User currentUser = (User) request.getSession().getAttribute("currentUser");

        if (currentUser == null) {
            res.put("success", false);
            res.put("message", "用户未登录");
            return ResponseEntity.status(401).body(res);
        }

        res.put("success", true);
        res.put("username", currentUser.getUsername());
        res.put("avatarFileName", currentUser.getAvatarFileName());
        // 新增返回的字段
        res.put("gender", currentUser.getGender());
        res.put("phone", currentUser.getPhone());
        res.put("email", currentUser.getEmail());
        res.put("address", currentUser.getAddress());
        res.put("styles", currentUser.getStyles()); // 返回 List<String>
        res.put("createdAt", currentUser.getCreatedAt());

        return ResponseEntity.ok(res);
    }

}