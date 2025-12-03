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

-- 3. 初始化食材数据 (对应 market.js 中的数据，确保 ID 一致)
-- 先清空旧数据防止主键冲突（开发环境）
TRUNCATE TABLE ingredients;

INSERT INTO ingredients (id, name, category_id, price, unit, stock, image) VALUES
-- 蔬菜类
    { id: 1, name: "新鲜番茄", category: "vegetables", price: 8.5, image: "static/image/新鲜番茄.png", unit: "500g", stock: 50 },
    { id: 2, name: "有机黄瓜", category: "vegetables", price: 6.8, image: "static/image/有机黄瓜.png", unit: "500g", stock: 45 },
    { id: 3, name: "胡萝卜", category: "vegetables", price: 4.5, image: "static/image/胡萝卜.png", unit: "500g", stock: 60 },
    { id: 4, name: "土豆", category: "vegetables", price: 3.8, image: "static/image/土豆.png", unit: "500g", stock: 80 },
    { id: 5, name: "洋葱", category: "vegetables", price: 5.2, image: "static/image/洋葱.png", unit: "500g", stock: 55 },
    { id: 22, name: "青椒", category: "vegetables", price: 7.5, image: "static/image/青椒.png", unit: "500g", stock: 40 },
    { id: 23, name: "菠菜", category: "vegetables", price: 6.2, image: "static/image/菠菜.png", unit: "500g", stock: 35 },
    { id: 24, name: "西兰花", category: "vegetables", price: 9.8, image: "static/image/西兰花.png", unit: "500g", stock: 30 },
    { id: 25, name: "大白菜", category: "vegetables", price: 3.5, image: "static/image/大白菜.png", unit: "500g", stock: 65 },
    { id: 26, name: "芹菜", category: "vegetables", price: 5.8, image: "static/image/芹菜.png", unit: "500g", stock: 25 },

-- 肉类
    { id: 6, name: "鸡胸肉", category: "meat", price: 25.8, image: "static/image/鸡胸肉.png", unit: "500g", stock: 30 },
    { id: 7, name: "猪里脊", category: "meat", price: 32.5, image: "static/image/猪里脊.png", unit: "500g", stock: 25 },
    { id: 8, name: "牛肉片", category: "meat", price: 48.9, image: "static/image/牛肉片.png", unit: "500g", stock: 20 },
    { id: 9, name: "三文鱼", category: "meat", price: 68.0, image: "static/image/三文鱼.png", unit: "300g", stock: 15 },
    { id: 27, name: "鸡翅", category: "meat", price: 28.5, image: "static/image/鸡翅.png", unit: "500g", stock: 35 },
    { id: 28, name: "猪五花肉", category: "meat", price: 35.8, image: "static/image/猪五花肉.png", unit: "500g", stock: 28 },
    { id: 29, name: "牛排", category: "meat", price: 59.9, image: "static/image/牛排.png", unit: "300g", stock: 18 },
    { id: 30, name: "羊肉片", category: "meat", price: 52.5, image: "static/image/羊肉片.png", unit: "500g", stock: 22 },

-- 蛋奶类
    { id: 10, name: "新鲜鸡蛋", category: "dairy", price: 12.8, image: "static/image/新鲜鸡蛋.png", unit: "30个", stock: 100 },
    { id: 11, name: "纯牛奶", category: "dairy", price: 8.5, image: "static/image/纯牛奶.png", unit: "1L", stock: 60 },
    { id: 12, name: "黄油", category: "dairy", price: 15.9, image: "static/image/黄油.png", unit: "200g", stock: 40 },
    { id: 31, name: "酸奶", category: "dairy", price: 6.8, image: "static/image/酸奶.png", unit: "200g", stock: 55 },
    { id: 32, name: "奶酪", category: "dairy", price: 22.5, image: "static/image/奶酪.png", unit: "200g", stock: 30 },
    { id: 33, name: "淡奶油", category: "dairy", price: 18.9, image: "static/image/淡奶油.png", unit: "250ml", stock: 25 },

-- 调味品
    { id: 13, name: "生抽", category: "seasoning", price: 12.8, image: "static/image/生抽.png", unit: "500ml", stock: 80 },
    { id: 14, name: "老抽", category: "seasoning", price: 10.5, image: "static/image/老抽.png", unit: "500ml", stock: 70 },
    { id: 15, name: "香醋", category: "seasoning", price: 8.9, image: "static/image/香醋.png", unit: "500ml", stock: 65 },
    { id: 16, name: "料酒", category: "seasoning", price: 9.8, image: "static/image/料酒.png", unit: "500ml", stock: 75 },
    { id: 17, name: "白糖", category: "seasoning", price: 6.5, image: "static/image/白糖.png", unit: "500g", stock: 90 },
    { id: 18, name: "食盐", category: "seasoning", price: 3.5, image: "static/image/食盐.png", unit: "500g", stock: 95 },
    { id: 34, name: "蚝油", category: "seasoning", price: 11.5, image: "static/image/蚝油.png", unit: "500g", stock: 60 },
    { id: 35, name: "芝麻油", category: "seasoning", price: 15.8, image: "static/image/芝麻油.png", unit: "200ml", stock: 45 },
    { id: 36, name: "辣椒酱", category: "seasoning", price: 8.9, image: "static/image/辣椒酱.png", unit: "300g", stock: 50 },

-- 水果类
    { id: 19, name: "香蕉", category: "fruits", price: 6.8, image: "static/image/香蕉.png", unit: "500g", stock: 40 },
    { id: 20, name: "苹果", category: "fruits", price: 9.9, image: "static/image/苹果.png", unit: "500g", stock: 55 },
    { id: 21, name: "柠檬", category: "fruits", price: 12.5, image: "static/image/柠檬.png", unit: "500g", stock: 30 },
    { id: 37, name: "橙子", category: "fruits", price: 11.8, image: "static/image/橙子.png", unit: "500g", stock: 48 },
    { id: 38, name: "葡萄", category: "fruits", price: 15.9, image: "static/image/葡萄.png", unit: "500g", stock: 35 },
    { id: 39, name: "草莓", category: "fruits", price: 22.5, image: "static/image/草莓.png", unit: "500g", stock: 20 },
    { id: 40, name: "西瓜", category: "fruits", price: 8.9, image: "static/image/西瓜.png", unit: "个", stock: 25 },

-- 新增分类：主食类
    { id: 41, name: "大米", category: "staple", price: 6.5, image: "static/image/大米.png", unit: "1kg", stock: 120 },
    { id: 42, name: "面粉", category: "staple", price: 5.8, image: "static/image/面粉.png", unit: "1kg", stock: 110 },
    { id: 43, name: "面条", category: "staple", price: 8.2, image: "static/image/面条.png", unit: "500g", stock: 85 },
    { id: 44, name: "意大利面", category: "staple", price: 12.5, image: "static/image/意大利面.png", unit: "500g", stock: 60 },

-- 新增分类：海鲜类
    { id: 45, name: "虾仁", category: "seafood", price: 45.8, image: "static/image/虾仁.png", unit: "500g", stock: 25 },
    { id: 46, name: "鱿鱼", category: "seafood", price: 38.9, image: "static/image/鱿鱼.png", unit: "500g", stock: 20 },
    { id: 47, name: "带鱼", category: "seafood", price: 32.5, image: "static/image/带鱼.png", unit: "500g", stock: 18 },
    { id: 48, name: "蛤蜊", category: "seafood", price: 18.9, image: "static/image/蛤蜊.png", unit: "500g", stock: 15 }


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