-- 用户表
CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    gender VARCHAR(10),
    styles VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(200),
    avatar_file_name VARCHAR(100),
    status INT DEFAULT 1, -- 新增：1=正常, 0=禁用
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 菜系表
CREATE TABLE IF NOT EXISTS cuisines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description VARCHAR(200)
);

-- 食谱表
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    cuisine_id INT,
    image VARCHAR(200),
    description TEXT,
    ingredients TEXT,
    steps TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cuisine_id) REFERENCES cuisines(id)

);

-- 食材分类表
CREATE TABLE IF NOT EXISTS ingredient_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL
);

-- 食材表
CREATE TABLE IF NOT EXISTS ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    stock INT NOT NULL,
    image VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES ingredient_categories(id)
);

-- 购物车表
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    ingredient_id INT,
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    recipe_id INT,
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    UNIQUE KEY unique_favorite (user_id, recipe_id)
);

-- 关注表：存储谁关注了谁
CREATE TABLE IF NOT EXISTS follows (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       follower_id INT NOT NULL, -- 粉丝（我）
                                       followed_id INT NOT NULL, -- 被关注者（大神）
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       UNIQUE KEY unique_follow (follower_id, followed_id), -- 防止重复关注
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followed_id) REFERENCES users(id)
    );

-- 插入默认菜系数据
INSERT INTO cuisines (name, code, description) VALUES
('中餐', 'chinese', '中国传统美食'),
('西餐', 'western', '欧美风味料理'),
('日料', 'japanese', '日本传统料理'),
('韩式', 'korean', '韩国特色美食'),
('泰式', 'thai', '泰国风味料理'),
('甜点', 'dessert', '各式甜点和糕点');

-- 插入默认食材分类数据
INSERT INTO ingredient_categories (name, code) VALUES
('新鲜蔬菜', 'vegetables'),
('肉类禽蛋', 'meat'),
('海鲜水产', 'seafood'),
('奶制品', 'dairy'),
('调味品', 'seasoning'),
('水果', 'fruits'),
('主食粮油', 'staple');

-- 1. 评论表 (社交互动)
CREATE TABLE IF NOT EXISTS comments (
                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                        user_id INT NOT NULL,
                                        recipe_id INT NOT NULL,
                                        content TEXT,
                                        rating INT DEFAULT 5, -- 评分 1-5
                                        image VARCHAR(255),   -- 新增：评论图片路径
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    );

-- 2. 用户关注表 (社交互动)
CREATE TABLE IF NOT EXISTS follows (
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       follower_id INT NOT NULL, -- 关注者
                                       followed_id INT NOT NULL, -- 被关注者
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       UNIQUE KEY unique_follow (follower_id, followed_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followed_id) REFERENCES users(id)
    );

-- 3. 烹饪记录表 (交互功能)
CREATE TABLE IF NOT EXISTS cooking_records (
                                               id INT AUTO_INCREMENT PRIMARY KEY,
                                               user_id INT NOT NULL,
                                               recipe_id INT NOT NULL,
                                               note TEXT, -- 心得
                                               image_url VARCHAR(200), -- 成品图
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    );

-- 1. 订单主表
CREATE TABLE IF NOT EXISTS orders (
                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                      user_id INT NOT NULL,
                                      order_no VARCHAR(50) UNIQUE NOT NULL, -- 订单号
    total_amount DECIMAL(10,2) NOT NULL,  -- 总金额
    status VARCHAR(20) DEFAULT 'PENDING', -- 状态：PENDING(待发货), SHIPPED(已发货), COMPLETED(已完成)
    receiver_name VARCHAR(50),
    receiver_phone VARCHAR(20),
    receiver_address VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );

-- 2. 订单详情表
CREATE TABLE IF NOT EXISTS order_items (
                                           id INT AUTO_INCREMENT PRIMARY KEY,
                                           order_id INT NOT NULL,
                                           ingredient_id INT NOT NULL,
                                           name VARCHAR(100), -- 冗余存储商品名，防止商品删除后订单无法查看
    price DECIMAL(10,2), -- 下单时的单价
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    );


-- 3. 初始化食材数据 (修复后的 SQL)
TRUNCATE TABLE ingredients;

INSERT INTO ingredients (id, name, category_id, price, unit, stock, image) VALUES
-- 蔬菜类 (category_id 需要对应: 1=蔬菜, 2=肉类, 3=海鲜, 4=奶制品, 5=调味品, 6=水果, 7=主食)
(1, '新鲜番茄', 1, 8.5, '500g', 50, 'static/image/新鲜番茄.png'),
(2, '有机黄瓜', 1, 6.8, '500g', 45, 'static/image/有机黄瓜.png'),
(3, '胡萝卜', 1, 4.5, '500g', 60, 'static/image/胡萝卜.png'),
(4, '土豆', 1, 3.8, '500g', 80, 'static/image/土豆.png'),
(5, '洋葱', 1, 5.2, '500g', 55, 'static/image/洋葱.png'),
(22, '青椒', 1, 7.5, '500g', 40, 'static/image/青椒.png'),
(23, '菠菜', 1, 6.2, '500g', 35, 'static/image/菠菜.png'),
(24, '西兰花', 1, 9.8, '500g', 30, 'static/image/西兰花.png'),
(25, '大白菜', 1, 3.5, '500g', 65, 'static/image/大白菜.png'),
(26, '芹菜', 1, 5.8, '500g', 25, 'static/image/芹菜.png'),

-- 肉类
(6, '鸡胸肉', 2, 25.8, '500g', 30, 'static/image/鸡胸肉.png'),
(7, '猪里脊', 2, 32.5, '500g', 25, 'static/image/猪里脊.png'),
(8, '牛肉片', 2, 48.9, '500g', 20, 'static/image/牛肉片.png'),
(9, '三文鱼', 2, 68.0, '300g', 15, 'static/image/三文鱼.png'),
(27, '鸡翅', 2, 28.5, '500g', 35, 'static/image/鸡翅.png'),
(28, '猪五花肉', 2, 35.8, '500g', 28, 'static/image/猪五花肉.png'),
(29, '牛排', 2, 59.9, '300g', 18, 'static/image/牛排.png'),
(30, '羊肉片', 2, 52.5, '500g', 22, 'static/image/羊肉片.png'),

-- 蛋奶类
(10, '新鲜鸡蛋', 4, 12.8, '30个', 100, 'static/image/新鲜鸡蛋.png'),
(11, '纯牛奶', 4, 8.5, '1L', 60, 'static/image/纯牛奶.png'),
(12, '黄油', 4, 15.9, '200g', 40, 'static/image/黄油.png'),
(31, '酸奶', 4, 6.8, '200g', 55, 'static/image/酸奶.png'),
(32, '奶酪', 4, 22.5, '200g', 30, 'static/image/奶酪.png'),
(33, '淡奶油', 4, 18.9, '250ml', 25, 'static/image/淡奶油.png'),

-- 调味品
(13, '生抽', 5, 12.8, '500ml', 80, 'static/image/生抽.png'),
(14, '老抽', 5, 10.5, '500ml', 70, 'static/image/老抽.png'),
(15, '香醋', 5, 8.9, '500ml', 65, 'static/image/香醋.png'),
(16, '料酒', 5, 9.8, '500ml', 75, 'static/image/料酒.png'),
(17, '白糖', 5, 6.5, '500g', 90, 'static/image/白糖.png'),
(18, '食盐', 5, 3.5, '500g', 95, 'static/image/食盐.png'),
(34, '蚝油', 5, 11.5, '500g', 60, 'static/image/蚝油.png'),
(35, '芝麻油', 5, 15.8, '200ml', 45, 'static/image/芝麻油.png'),
(36, '辣椒酱', 5, 8.9, '300g', 50, 'static/image/辣椒酱.png'),

-- 水果类
(19, '香蕉', 6, 6.8, '500g', 40, 'static/image/香蕉.png'),
(20, '苹果', 6, 9.9, '500g', 55, 'static/image/苹果.png'),
(21, '柠檬', 6, 12.5, '500g', 30, 'static/image/柠檬.png'),
(37, '橙子', 6, 11.8, '500g', 48, 'static/image/橙子.png'),
(38, '葡萄', 6, 15.9, '500g', 35, 'static/image/葡萄.png'),
(39, '草莓', 6, 22.5, '500g', 20, 'static/image/草莓.png'),
(40, '西瓜', 6, 8.9, '个', 25, 'static/image/西瓜.png'),

-- 主食类
(41, '大米', 7, 6.5, '1kg', 120, 'static/image/大米.png'),
(42, '面粉', 7, 5.8, '1kg', 110, 'static/image/面粉.png'),
(43, '面条', 7, 8.2, '500g', 85, 'static/image/面条.png'),
(44, '意大利面', 7, 12.5, '500g', 60, 'static/image/意大利面.png'),

-- 海鲜类
(45, '虾仁', 3, 45.8, '500g', 25, 'static/image/虾仁.png'),
(46, '鱿鱼', 3, 38.9, '500g', 20, 'static/image/鱿鱼.png'),
(47, '带鱼', 3, 32.5, '500g', 18, 'static/image/带鱼.png'),
(48, '蛤蜊', 3, 18.9, '500g', 15, 'static/image/蛤蜊.png');


CREATE TABLE IF NOT EXISTS cooking_records (
                                               id INT AUTO_INCREMENT PRIMARY KEY,
                                               user_id INT NOT NULL,
                                               recipe_id INT NOT NULL,
                                               note TEXT, -- 心得
                                               image VARCHAR(200), -- 成品图
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    );

-- 购物清单表
CREATE TABLE IF NOT EXISTS shopping_list (
                                             id INT AUTO_INCREMENT PRIMARY KEY,
                                             user_id INT NOT NULL,
                                             name VARCHAR(100) NOT NULL, -- 食材名称
    quantity VARCHAR(50),       -- 用量（如 "500g", "2个"）
    is_bought BOOLEAN DEFAULT FALSE, -- 状态：0=待买，1=已买
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );

-- 1. 修改食谱表，添加 '是否推荐' 字段
ALTER TABLE recipes ADD COLUMN is_recommended BOOLEAN DEFAULT FALSE;

-- 2. 确保系统配置表存在
CREATE TABLE IF NOT EXISTS system_settings (
                                               setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- 3. 确保公告表存在
CREATE TABLE IF NOT EXISTS announcements (
                                             id INT AUTO_INCREMENT PRIMARY KEY,
                                             title VARCHAR(100) NOT NULL,
    content TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- 4. 初始化默认配置（防止查询为空）
INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES
('site_title', '美食天地后台管理'),
('welcome_msg', '欢迎来到美食天地！');