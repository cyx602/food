package com.food.controller;

import com.food.entity.User;
import com.food.mapper.UserMapper;
import com.food.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;



@Controller
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper; // 注入 Mapper 以便直接查询

    @Autowired(required = false) // 允许为空，防止没配置邮箱时报错
    private JavaMailSender mailSender;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    /**
     * 发送邮箱验证码接口
     */
    @PostMapping("/send-email-code")
    @ResponseBody
    public Map<String, Object> sendEmailCode(@RequestBody Map<String, String> body, HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        String email = body.get("email");

        if (email == null || email.isEmpty()) {
            res.put("success", false);
            res.put("message", "邮箱不能为空");
            return res;
        }

        // 1. 检查邮箱是否注册
        User user = userMapper.selectByEmail(email);
        if (user == null) {
            res.put("success", false);
            res.put("message", "该邮箱未注册");
            return res;
        }

        // 2. 生成6位随机验证码
        String code = String.valueOf((int)((Math.random() * 9 + 1) * 100000));

        // 3. 发送邮件 (如果没有配置真实邮箱，可以在控制台打印 code 来测试)
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                // 注意：这里必须改成你在 application.yml 里配置的 username
                message.setFrom("3135829696@qq.com");
                message.setTo(email);
                message.setSubject("【美食天地】找回密码验证码");
                message.setText("您的验证码是：" + code + "，有效期5分钟。");
                mailSender.send(message);
                System.out.println("✅ 邮件已发送至: " + email);
            } else {
                throw new RuntimeException("MailSender 未配置");
            }
            res.put("success", true);
            res.put("message", "验证码已发送，请查收邮件");


        } catch (Exception e) {
            // 【核心修复】：邮件发送失败时的兜底方案
            e.printStackTrace();
            System.err.println("❌ 邮件发送失败 (可能是SMTP配置问题)");
            System.err.println("👉 [测试模式] 请手动使用此验证码: " + code);

            res.put("success", true);
            res.put("message", "邮件发送模拟成功(请看IDEA控制台获取验证码)");
        }
        // 4. 将验证码存入 Session，设置过期时间逻辑（这里简化处理）
        session.setAttribute("reset_email", email);
        session.setAttribute("reset_code", code);
        session.setAttribute("reset_time", System.currentTimeMillis());


        return res;
    }

    /**
     * 重置密码接口
     */
    @PostMapping("/reset-password")
    @ResponseBody
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> body, HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        String email = body.get("email");
        String code = body.get("code");
        String newPassword = body.get("newPassword");

        // 1. 校验参数
        if (email == null || code == null || newPassword == null) {
            res.put("success", false);
            res.put("message", "信息填写不完整");
            return res;
        }

        // 2. 校验验证码 (逻辑保持不变)
        String sessionEmail = (String) session.getAttribute("reset_email");
        String sessionCode = (String) session.getAttribute("reset_code");
        Long sessionTime = (Long) session.getAttribute("reset_time");

        if (sessionCode == null || !sessionCode.equals(code) || !email.equals(sessionEmail)) {
            res.put("success", false);
            res.put("message", "验证码错误或邮箱不匹配");
            return res;
        }

        if (System.currentTimeMillis() - sessionTime > 5 * 60 * 1000) {
            res.put("success", false);
            res.put("message", "验证码已过期，请重新获取");
            return res;
        }

        // 3. 更新密码
        try {
            // 【核心修改】：使用 BCrypt 对新密码进行加密
            String encodedPassword = passwordEncoder.encode(newPassword);

            // 将加密后的密码存入数据库
            userMapper.updatePasswordByEmail(email, encodedPassword);

            // 清除 Session
            session.removeAttribute("reset_code");
            session.removeAttribute("reset_email");
            session.removeAttribute("reset_time");

            res.put("success", true);
            res.put("message", "密码重置成功，请重新登录");
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "系统异常：" + e.getMessage());
        }

        return res;
    }

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
     * 普通用户注册接口 (修改版)
     * 逻辑：只验证邮箱是否被注册，用户名不再强制唯一
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

            // ===== 基本非空校验 =====
            if (email == null || email.trim().isEmpty()) {
                res.put("success", false); res.put("message", "邮箱不能为空"); return ResponseEntity.badRequest().body(res);
            }
            if (password == null || password.trim().isEmpty() || password.length() < 6) {
                res.put("success", false); res.put("message", "密码长度不能少于6位"); return ResponseEntity.badRequest().body(res);
            }
            if (username == null || username.trim().isEmpty()) {
                username = "美食家_" + System.currentTimeMillis(); // 如果没填用户名，自动生成一个
            }

            // 默认头像处理
            if (avatarFileName == null || avatarFileName.trim().isEmpty()) {
                avatarFileName = "default_avatar.jpg";
            }

            // 【删除】原来对 username 的重复检查
            // if (userService.countByUsername(username) > 0) { ... }

            // 组装对象
            User user = new User();
            user.setUsername(username.trim());
            user.setPassword(password.trim());
            user.setGender(gender);
            user.setStyles(styles);
            user.setPhone(phone);
            user.setEmail(email.trim()); // 确保去空格
            user.setAddress(address);
            user.setAvatarFileName(avatarFileName);
            user.setRole("user");

            // 调用 Service 进行注册 (Service 中会检查邮箱唯一性)
            boolean success = userService.register(user);

            if (success) {
                res.put("success", true);
                res.put("message", "注册成功，欢迎加入美食天地！");
                return ResponseEntity.ok(res);
            } else {
                res.put("success", false);
                res.put("message", "该邮箱已被注册，请直接登录");
                return ResponseEntity.badRequest().body(res);
            }

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
            String email = (String) body.get("email");
            String password = (String) body.get("password");

            if (email == null || password == null) {
                res.put("success", false);
                res.put("message", "邮箱或密码不能为空");
                return ResponseEntity.badRequest().body(res);
            }

            User user = userService.login(email.trim(), password.trim());

            if (user == null) {
                res.put("success", false);
                res.put("message", "邮箱或密码错误"); // 提示语修改
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
            // 更新各个字段
            currentUser.setUsername((String) body.get("username"));
            currentUser.setPhone((String) body.get("phone"));
            currentUser.setEmail((String) body.get("email"));
            currentUser.setGender((String) body.get("gender"));

            // 接收头像文件名
            if (body.containsKey("avatarFileName")) {
                currentUser.setAvatarFileName((String) body.get("avatarFileName"));
            }

            // 处理偏好设置
            if (body.containsKey("styles")) {
                @SuppressWarnings("unchecked")
                List<String> styles = (List<String>) body.get("styles");
                currentUser.setStyles(styles);
            }

            // 保存到数据库
            userService.updateUserInfo(currentUser);

            // 更新 Session 中的用户信息，确保页面刷新后也是最新的
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
     * 退出登录接口
     */
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        request.getSession().invalidate(); // 销毁 Session
        return ResponseEntity.ok("退出成功");
    }

    /**
     * 注销账号接口 (物理删除)
     */
    @PostMapping("/user/delete")
    public ResponseEntity<Map<String, Object>> deleteAccount(HttpServletRequest request) {
        Map<String, Object> res = new HashMap<>();
        User user = (User) request.getSession().getAttribute("currentUser");

        if (user == null) {
            res.put("success", false);
            res.put("message", "未登录");
            return ResponseEntity.status(401).body(res);
        }

        try {
            userService.deleteUser(user.getId());
            request.getSession().invalidate(); // 删除后强制退出
            res.put("success", true);
            res.put("message", "账号已注销");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "注销失败：" + e.getMessage());
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