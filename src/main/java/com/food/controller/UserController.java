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


@Controller
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 头像上传接口
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
     * 管理员注册接口 (新增)
     * 逻辑：校验注册码 -> 成功则赋予 admin 角色并注册
     */
    @PostMapping(value = "/admin/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> adminRegister(@RequestBody Map<String, Object> body) {
        Map<String, Object> res = new HashMap<>();
        try {
            String regCode = (String) body.get("regCode");

            // 1. 校验注册码 (此处硬编码为 88888888，实际可配置在文件或数据库中)
            if (!"88888888".equals(regCode)) {
                res.put("success", false);
                res.put("message", "注册码错误");
                return ResponseEntity.badRequest().body(res);
            }

            // 2. 构建管理员用户对象
            User user = new User();
            // 注意：前端 admin_register.js 传过来的姓名字段是 name，这里映射给 username
            user.setUsername((String) body.get("name"));
            user.setPassword((String) body.get("password"));
            user.setPhone((String) body.get("phone"));
            user.setEmail((String) body.get("email"));
            user.setAvatarFileName((String) body.get("avatarFileName"));

            // 关键设置：角色设为 admin
            user.setRole("admin");

            // 设置一些默认值，防止数据库非空校验报错
            user.setGender("secret");
            user.setAddress("管理员办公地");
            user.setStyles(new ArrayList<>());

            // 3. 校验用户名是否已存在
            if (userService.countByUsername(user.getUsername()) > 0) {
                res.put("success", false);
                res.put("message", "管理员账号已存在");
                return ResponseEntity.badRequest().body(res);
            }

            // 4. 执行注册
            boolean ok = userService.register(user);
            if (ok) {
                res.put("success", true);
                res.put("message", "管理员注册成功！");
                return ResponseEntity.ok(res);
            } else {
                res.put("success", false);
                res.put("message", "注册失败，请重试");
                return ResponseEntity.badRequest().body(res);
            }

        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "注册异常: " + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    /**
     * 普通用户注册接口
     * 逻辑：基本校验 -> 赋予 user 角色 -> 注册
     */
    @PostMapping(value = "/register",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> body) {

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

            // ===== 基本校验 =====
            if (username == null || username.trim().isEmpty()) {
                res.put("success", false); res.put("message", "美食昵称不能为空"); return ResponseEntity.badRequest().body(res);
            }
            if (password == null || password.trim().isEmpty() || password.length() < 6) {
                res.put("success", false); res.put("message", "密码长度不能少于6位"); return ResponseEntity.badRequest().body(res);
            }
            if (phone == null || phone.trim().isEmpty()) {
                res.put("success", false); res.put("message", "手机号不能为空"); return ResponseEntity.badRequest().body(res);
            }
            // ... (可以添加更多校验)

            // 默认头像处理
            if (avatarFileName == null || avatarFileName.trim().isEmpty()) {
                avatarFileName = "default_avatar.jpg";
            }

            // 检查用户名
            if (userService.countByUsername(username) > 0) {
                res.put("success", false);
                res.put("message", "用户名已存在，请选择其他昵称");
                return ResponseEntity.badRequest().body(res);
            }

            // 组装对象
            User user = new User();
            user.setUsername(username.trim());
            user.setPassword(password.trim());
            user.setGender(gender);
            user.setStyles(styles);
            user.setPhone(phone);
            user.setEmail(email);
            user.setAddress(address);
            user.setAvatarFileName(avatarFileName);

            // 关键设置：普通用户角色
            user.setRole("user");

            boolean ok = userService.register(user);

            if (!ok) {
                res.put("success", false);
                res.put("message", "注册失败");
                return ResponseEntity.badRequest().body(res);
            }

            res.put("success", true);
            res.put("message", "注册成功，欢迎加入美食天地！");
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "服务器异常：" + e.getMessage());
            return ResponseEntity.badRequest().body(res);
        }
    }

    /**
     * 用户登录接口
     * 返回结果中包含 role，供前端判断跳转
     */
    @PostMapping(value = "/login",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> body,
                                                     HttpServletRequest request) {

        Map<String, Object> res = new HashMap<>();
        try {
            String username = (String) body.get("username");
            String password = (String) body.get("password");

            if (username == null || password == null) {
                res.put("success", false);
                res.put("message", "用户名或密码不能为空");
                return ResponseEntity.badRequest().body(res);
            }

            User user = userService.login(username.trim(), password.trim());

            if (user == null) {
                res.put("success", false);
                res.put("message", "用户名或密码错误");
                return ResponseEntity.status(401).body(res);
            }

            // 检查账号状态 (如果做了封禁功能)
            if (user.getStatus() != null && user.getStatus() == 0) {
                res.put("success", false);
                res.put("message", "账号已被禁用，请联系管理员");
                return ResponseEntity.status(403).body(res);
            }

            // 登录成功，存入 Session
            request.getSession().setAttribute("currentUser", user);

            res.put("success", true);
            res.put("message", "登录成功");
            res.put("username", user.getUsername());
            res.put("avatarFileName", user.getAvatarFileName());
            // 关键：返回角色信息
            res.put("role", user.getRole());

            return ResponseEntity.ok(res);

        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "服务器异常");
            return ResponseEntity.badRequest().body(res);
        }
    }

    /**
     * 更新个人信息
     */
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
            currentUser.setUsername((String) body.get("username"));
            currentUser.setPhone((String) body.get("phone"));
            currentUser.setEmail((String) body.get("email"));
            currentUser.setGender((String) body.get("gender"));

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
     * 包含 role 字段
     */
    @GetMapping(value = "/current-user", produces = MediaType.APPLICATION_JSON_VALUE)
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
        res.put("gender", currentUser.getGender());
        res.put("phone", currentUser.getPhone());
        res.put("email", currentUser.getEmail());
        res.put("address", currentUser.getAddress());
        res.put("styles", currentUser.getStyles());
        res.put("createdAt", currentUser.getCreatedAt());
        // 返回角色，方便前端展示不同菜单或跳转
        res.put("role", currentUser.getRole());

        return ResponseEntity.ok(res);
    }
}