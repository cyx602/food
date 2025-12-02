// 食谱数据
const recipes = [
    // 推荐页面的特色食谱
    {
        id: 101,
        title: "新手零失败 - 网友推荐番茄炒蛋",
        cuisine: "chinese",
        difficulty: "简单",
        time: "15分钟",
        image: "static/image/番茄炒蛋.png",
        description: "国民家常菜，酸甜可口，营养丰富，最适合厨房新手入门",
        ingredients: [
            "鸡蛋 3个",
            "番茄 2个",
            "小葱 2根",
            "糖 1茶匙",
            "盐 适量",
            "食用油 2汤匙",
            "番茄酱 1汤匙（可选）"
        ],
        steps: [
            "番茄洗净，顶部划十字，用开水烫一下去皮，切块备用",
            "鸡蛋打入碗中，加少许盐打散",
            "小葱切葱花，葱白和葱绿分开",
            "热锅凉油，倒入蛋液，用筷子快速划散，炒至八成熟盛出",
            "锅中再加少许油，爆香葱白",
            "加入番茄块，中火翻炒至出汁",
            "加入糖和盐调味，可加一勺番茄酱增加风味",
            "倒入炒好的鸡蛋，快速翻炒均匀",
            "撒上葱绿，出锅装盘"
        ]
    },
    {
        id: 102,
        title: "健康低脂 - 香煎鸡胸肉",
        cuisine: "western",
        difficulty: "简单",
        time: "20分钟",
        image: "static/image/香煎鸡胸肉.png",
        description: "健身人士最爱，肉质鲜嫩多汁，告别干柴鸡胸肉",
        ingredients: [
            "鸡胸肉 1块（约200g）",
            "橄榄油 1汤匙",
            "黑胡椒 适量",
            "盐 适量",
            "蒜粉 1茶匙",
            "迷迭香 少许",
            "柠檬 半个"
        ],
        steps: [
            "鸡胸肉横切成两片薄片，用刀背轻轻拍松",
            "两面均匀撒上盐、黑胡椒、蒜粉，按摩入味",
            "腌制15分钟（时间充裕可冷藏腌制更久）",
            "平底锅预热，刷一层橄榄油",
            "放入鸡胸肉，中火煎2-3分钟",
            "翻面，撒上迷迭香，再煎2-3分钟",
            "用筷子戳最厚处，能轻松穿透且流出清澈汁水即可",
            "挤上柠檬汁，静置2分钟再切块"
        ]
    },
    {
        id: 103,
        title: "快手早餐 - 香蕉松饼",
        cuisine: "dessert",
        difficulty: "简单",
        time: "25分钟",
        image: "static/image/香蕉松饼.png",
        description: "无需打发，零技巧松饼，香甜松软，孩子超爱吃",
        ingredients: [
            "香蕉 2根（熟透的）",
            "鸡蛋 2个",
            "牛奶 120ml",
            "面粉 150g",
            "泡打粉 1茶匙",
            "糖 2汤匙",
            "盐 一小撮",
            "黄油 适量",
            "蜂蜜 适量",
            "水果 适量（装饰用）"
        ],
        steps: [
            "香蕉用叉子压成泥状",
            "加入鸡蛋、牛奶，搅拌均匀",
            "筛入面粉、泡打粉，加入糖和盐",
            "轻轻搅拌至无干粉即可（不要过度搅拌）",
            "平底锅小火预热，刷薄薄一层黄油",
            "舀一勺面糊倒入锅中，自然形成圆形",
            "表面出现小气泡时翻面",
            "另一面煎至金黄即可出锅",
            "搭配蜂蜜和喜欢的水果享用"
        ]
    },
    // 原有菜系食谱
    {
        id: 1,
        title: "宫保鸡丁",
        cuisine: "chinese",
        image: "static/image/宫保鸡丁.png",
        description: "经典的川菜代表作，麻辣鲜香，鸡肉嫩滑，花生酥脆",
        ingredients: [
            "鸡胸肉 300g",
            "花生米 50g",
            "干辣椒 10个",
            "花椒 1茶匙",
            "大葱 1根",
            "姜 3片",
            "蒜 3瓣",
            "生抽 2汤匙",
            "老抽 1茶匙",
            "醋 1汤匙",
            "糖 1汤匙",
            "料酒 1汤匙",
            "淀粉 适量",
            "盐 适量"
        ],
        steps: [
            "鸡胸肉切丁，用料酒、淀粉、盐腌制15分钟",
            "干辣椒剪段，大葱切段，姜蒜切末",
            "热锅冷油，放入花生米小火炒香，捞出备用",
            "锅中留底油，放入干辣椒和花椒炒香",
            "加入鸡丁翻炒至变色",
            "加入葱段、姜蒜末继续翻炒",
            "调入生抽、老抽、糖、醋翻炒均匀",
            "最后加入炒好的花生米，快速翻炒即可出锅"
        ]
    },
    {
        id: 2,
        title: "意大利肉酱面",
        cuisine: "western",
        image: "static/image/意大利肉酱面.png",
        description: "浓郁的番茄肉酱搭配弹牙的意大利面，经典西餐之选",
        ingredients: [
            "意大利面 200g",
            "牛肉末 150g",
            "猪肉末 100g",
            "洋葱 1个",
            "胡萝卜 1根",
            "西芹 2根",
            "番茄 3个",
            "番茄酱 3汤匙",
            "红酒 50ml",
            "橄榄油 2汤匙",
            "盐 适量",
            "黑胡椒 适量",
            "罗勒叶 适量",
            "帕玛森奶酪 适量"
        ],
        steps: [
            "洋葱、胡萝卜、西芹切末备用",
            "番茄切丁备用",
            "热锅倒入橄榄油，放入洋葱炒至透明",
            "加入胡萝卜和西芹继续翻炒2-3分钟",
            "加入牛肉末和猪肉末，炒至变色",
            "加入番茄丁，炒至软烂",
            "倒入红酒，煮至酒精挥发",
            "加入番茄酱，小火炖煮30分钟",
            "期间不断搅拌，避免糊锅",
            "最后加入盐、黑胡椒和罗勒叶调味",
            "另起锅煮意大利面至八分熟",
            "将煮好的面沥干，加入肉酱中拌匀",
            "撒上帕玛森奶酪即可食用"
        ]
    },
    {
        id: 3,
        title: "寿司拼盘",
        cuisine: "japanese",
        image: "static/image/寿司拼盘.png",
        description: "精致的日式料理，口感丰富，颜值爆表",
        ingredients: [
            "米饭 300g",
            "寿司醋 3汤匙",
            "海苔片 3张",
            "三文鱼 200g",
            "金枪鱼 200g",
            "北极贝 100g",
            "黄瓜 1根",
            "胡萝卜 1根",
            "牛油果 1个",
            "蟹柳 100g",
            "鸡蛋 3个",
            "糖 1汤匙",
            "盐 少许"
        ],
        steps: [
            "米饭煮好后，趁热加入寿司醋拌匀，放凉备用",
            "鸡蛋打散，加入糖和盐，煎成蛋皮，切丝备用",
            "三文鱼、金枪鱼切片，北极贝处理干净",
            "黄瓜、胡萝卜切条，用盐腌制10分钟去除水分",
            "牛油果去皮去核，切片备用",
            "铺上海苔片，均匀铺上米饭，撒上少许芝麻",
            "放上各种食材，卷成寿司卷",
            "用寿司帘压紧，切成小段",
            "将生鱼片铺在小饭团上做成手握寿司",
            "摆盘装饰即可"
        ]
    },
    {
        id: 4,
        title: "石锅拌饭",
        cuisine: "korean",
        image: "static/image/石锅拌饭.png",
        description: "韩国经典料理，营养均衡，锅巴香酥",
        ingredients: [
            "米饭 200g",
            "牛肉片 100g",
            "胡萝卜 1根",
            "菠菜 100g",
            "黄豆芽 100g",
            "鸡蛋 1个",
            "香菇 50g",
            "紫菜 适量",
            "韩式辣酱 2汤匙",
            "芝麻油 2汤匙",
            "生抽 1汤匙",
            "糖 1茶匙",
            "盐 适量",
            "蒜末 1茶匙"
        ],
        steps: [
            "牛肉片用生抽、糖、蒜末腌制15分钟",
            "胡萝卜切丝，香菇切片，菠菜切段，黄豆芽洗净",
            "分别将各种蔬菜焯水后过凉水，沥干水分",
            "热锅倒入芝麻油，炒香牛肉片至变色",
            "将炒好的牛肉和各种蔬菜分别装盘备用",
            "石锅内壁刷一层芝麻油，放入米饭",
            "将各种食材依次码放在米饭上",
            "中间打入一个生鸡蛋",
            "将石锅放在火上，小火加热至发出滋滋声",
            "加入韩式辣酱，搅拌均匀即可食用"
        ]
    },
    {
        id: 5,
        title: "冬阴功汤",
        cuisine: "thai",
        image: "static/image/冬阴功汤.png",
        description: "泰国国汤，酸辣可口，香气四溢",
        ingredients: [
            "虾 500g",
            "草菇 200g",
            "番茄 2个",
            "柠檬叶 5片",
            "香茅 3根",
            "良姜 1块",
            "小米辣 5个",
            "青柠 1个",
            "鱼露 2汤匙",
            "椰浆 200ml",
            "泰国冬阴功酱 2汤匙",
            "糖 1汤匙",
            "香菜 适量",
            "橄榄油 1汤匙"
        ],
        steps: [
            "虾剪去虾须，挑去虾线，草菇洗净切片",
            "番茄切块，香茅切段，良姜切片，小米辣切碎",
            "热锅倒入橄榄油，爆香香茅、良姜和小米辣",
            "加入冬阴功酱炒香",
            "加入清水，放入柠檬叶，大火煮开",
            "加入番茄和草菇，煮5分钟",
            "加入虾，煮至变色卷曲",
            "加入鱼露和糖调味",
            "关火，挤入青柠汁",
            "加入椰浆，搅拌均匀",
            "撒上香菜即可"
        ]
    },
    {
        id: 6,
        title: "提拉米苏",
        cuisine: "dessert",
        image: "static/image/提拉米苏.png",
        description: "经典意大利甜点，口感丝滑，咖啡香气浓郁",
        ingredients: [
            "马斯卡彭芝士 250g",
            "淡奶油 200ml",
            "蛋黄 3个",
            "细砂糖 80g",
            "咖啡酒 50ml",
            "手指饼干 200g",
            "可可粉 适量",
            "巧克力 适量",
            "香草精 1茶匙"
        ],
        steps: [
            "蛋黄和细砂糖隔水加热打发至体积增大，颜色变浅",
            "马斯卡彭芝士室温软化，分次加入打发的蛋黄糊中",
            "加入香草精，搅拌均匀成芝士糊",
            "淡奶油打发至六成，加入芝士糊中轻轻拌匀",
            "咖啡酒倒入浅盘中，手指饼干快速浸泡后铺在容器底部",
            "铺上一层芝士糊，再铺一层浸泡过咖啡酒的手指饼干",
            "再铺上一层芝士糊，重复至材料用完",
            "最后一层必须是芝士糊",
            "放入冰箱冷藏4小时以上",
            "食用前撒上可可粉，用巧克力装饰"
        ]
    },
    {
        id: 7,
        title: "红烧肉",
        cuisine: "chinese",
        image: "static/image/红烧肉.png",
        description: "肥而不腻，入口即化，家常必备硬菜",
        ingredients: [
            "五花肉 500g",
            "葱 3根",
            "姜 5片",
            "蒜 5瓣",
            "八角 3个",
            "桂皮 1块",
            "香叶 3片",
            "干辣椒 3个",
            "冰糖 50g",
            "料酒 2汤匙",
            "生抽 3汤匙",
            "老抽 1汤匙",
            "盐 适量",
            "食用油 2汤匙"
        ],
        steps: [
            "五花肉切成3厘米见方的块",
            "冷水下锅，加入料酒，大火煮开后撇去浮沫",
            "捞出肉块，用清水冲洗干净，沥干水分",
            "热锅冷油，放入冰糖小火炒至融化呈焦糖色",
            "放入肉块翻炒至上色",
            "加入葱姜蒜、八角、桂皮、香叶、干辣椒爆香",
            "倒入生抽、老抽，翻炒均匀",
            "加入清水没过肉块，大火煮开后转小火炖煮1小时",
            "最后大火收汁，根据口味调整盐量",
            "撒上葱花即可出锅"
        ]
    },
    {
        id: 8,
        title: "麻婆豆腐",
        cuisine: "chinese",
        image: "static/image/麻婆豆腐.png",
        description: "川菜经典，麻辣鲜香，豆腐嫩滑，下饭神器",
        ingredients: [
            "嫩豆腐 500g",
            "牛肉末 100g",
            "郫县豆瓣酱 2汤匙",
            "豆豉 1汤匙",
            "干辣椒 5个",
            "花椒 1茶匙",
            "蒜 3瓣",
            "姜 1块",
            "葱 2根",
            "生抽 2汤匙",
            "老抽 1茶匙",
            "料酒 1汤匙",
            "糖 1茶匙",
            "淀粉 1汤匙",
            "食用油 2汤匙"
        ],
        steps: [
            "豆腐切成2厘米见方的小块，用盐水浸泡10分钟",
            "蒜切末，姜切末，葱切末",
            "热锅冷油，放入花椒爆香后捞出",
            "放入牛肉末炒至变色",
            "加入郫县豆瓣酱和豆豉炒出红油",
            "加入蒜末、姜末、干辣椒继续翻炒",
            "加入清水，放入豆腐块",
            "加入生抽、老抽、料酒、糖调味",
            "大火煮开后转小火炖煮5分钟",
            "淀粉加水调成水淀粉，倒入锅中勾芡",
            "最后撒上葱花即可出锅"
        ]
    },
    {
        id: 9,
        title: "法式煎牛排",
        cuisine: "western",
        image: "static/image/法式煎牛排.png",
        description: "外焦里嫩，肉汁丰富，餐厅级别的享受",
        ingredients: [
            "牛排 300g",
            "橄榄油 2汤匙",
            "黄油 30g",
            "大蒜 3瓣",
            "迷迭香 3枝",
            "百里香 3枝",
            "盐 适量",
            "黑胡椒 适量"
        ],
        steps: [
            "牛排提前从冰箱取出，回温至室温",
            "用厨房纸擦干牛排表面的水分",
            "两面均匀撒上盐和黑胡椒",
            "平底锅大火预热，倒入橄榄油",
            "放入牛排，煎至表面金黄，约2分钟",
            "翻面，加入黄油、大蒜、迷迭香、百里香",
            "用勺子舀起热油不断浇在牛排上",
            "根据个人喜好煎至合适的成熟度",
            "取出牛排，静置5分钟让肉汁重新分布",
            "切块食用，可搭配黑椒酱"
        ]
    },
    {
        id: 10,
        title: "海鲜披萨",
        cuisine: "western",
        image: "static/image/海鲜披萨.png",
        description: "丰富的海鲜搭配香浓的芝士，口感层次分明",
        ingredients: [
            "披萨饼底 1个",
            "番茄酱 3汤匙",
            "马苏里拉芝士 200g",
            "虾仁 100g",
            "鱿鱼圈 100g",
            "蟹肉棒 100g",
            "口蘑 50g",
            "洋葱 1/2个",
            "青椒 1/2个",
            "橄榄油 1汤匙",
            "盐 适量",
            "黑胡椒 适量",
            "披萨草 适量",
            "罗勒叶 适量"
        ],
        steps: [
            "预热烤箱至220℃",
            "虾仁去虾线，鱿鱼圈洗净，用盐和黑胡椒腌制10分钟",
            "口蘑切片，洋葱切丝，青椒切丝",
            "披萨饼底均匀涂抹番茄酱",
            "撒上一层马苏里拉芝士",
            "铺上腌制好的海鲜和蔬菜",
            "再撒上剩余的马苏里拉芝士",
            "撒上披萨草和罗勒叶",
            "边缘刷上橄榄油",
            "放入烤箱中层，烤15-20分钟至芝士融化并呈金黄色"
        ]
    },
    {
        id: 11,
        title: "日式拉面",
        cuisine: "japanese",
        image: "static/image/日式拉面.png",
        description: "浓郁的汤底，弹牙的面条，丰富的配料",
        ingredients: [
            "猪骨汤 1000ml",
            "拉面 200g",
            "叉烧肉 100g",
            "溏心蛋 2个",
            "海苔 2片",
            "玉米粒 50g",
            "葱花 适量",
            "蒜末 适量",
            "日式酱油 2汤匙",
            "味噌 1汤匙",
            "盐 适量",
            "糖 适量",
            "料酒 1汤匙",
            "姜片 3片"
        ],
        steps: [
            "猪骨汤加入日式酱油、味噌、盐、糖调味",
            "叉烧肉切片，溏心蛋对半切开",
            "拉面煮熟后过凉水，沥干水分",
            "将煮好的拉面放入碗中",
            "倒入滚烫的猪骨汤",
            "码上叉烧肉、溏心蛋、海苔、玉米粒",
            "撒上葱花和蒜末即可"
        ]
    },
    {
        id: 12,
        title: "天妇罗",
        cuisine: "japanese",
        image: "static/image/天妇罗.png",
        description: "外酥里嫩，色泽金黄，日式油炸料理的代表",
        ingredients: [
            "天妇罗粉 100g",
            "冰水 150ml",
            "鸡蛋 1个",
            "虾 200g",
            "鱿鱼圈 100g",
            "南瓜 100g",
            "茄子 1个",
            "青椒 2个",
            "红薯 100g",
            "食用油 500ml",
            "盐 适量",
            "天妇罗酱油 适量",
            "萝卜泥 适量"
        ],
        steps: [
            "天妇罗粉、冰水、鸡蛋混合成面糊，不要过度搅拌",
            "虾剪去虾须，挑去虾线，用厨房纸吸干水分",
            "鱿鱼圈洗净，用厨房纸吸干水分",
            "南瓜、茄子、青椒、红薯切薄片",
            "热锅倒入食用油，加热至180℃",
            "将食材均匀裹上面糊",
            "放入油锅中炸至金黄酥脆",
            "捞出控油，放在吸油纸上",
            "摆盘，搭配天妇罗酱油和萝卜泥"
        ]
    },
    {
        id: 13,
        title: "韩式炸鸡",
        cuisine: "korean",
        image: "static/image/韩式炸鸡.png",
        description: "外酥里嫩，甜辣可口，追剧必备小吃",
        ingredients: [
            "鸡腿肉 500g",
            "鸡翅 500g",
            "面粉 150g",
            "玉米淀粉 50g",
            "泡打粉 1茶匙",
            "鸡蛋 2个",
            "牛奶 100ml",
            "大蒜 5瓣",
            "生姜 1块",
            "韩式辣酱 3汤匙",
            "番茄酱 2汤匙",
            "糖 2汤匙",
            "醋 1汤匙",
            "芝麻 适量",
            "食用油 1000ml",
            "盐 适量",
            "黑胡椒 适量"
        ],
        steps: [
            "鸡腿肉和鸡翅洗净，用厨房纸吸干水分",
            "大蒜切末，生姜切末",
            "将鸡肉放入碗中，加入蒜末、姜末、盐、黑胡椒、牛奶腌制30分钟",
            "面粉、玉米淀粉、泡打粉混合成炸粉",
            "鸡蛋打散成蛋液",
            "将腌制好的鸡肉先裹一层炸粉，再裹一层蛋液，最后再裹一层炸粉",
            "热锅倒入食用油，加热至170℃",
            "放入鸡肉炸至金黄酥脆，捞出控油",
            "将韩式辣酱、番茄酱、糖、醋混合成酱料",
            "热锅倒入少量食用油，倒入酱料炒至浓稠",
            "放入炸好的鸡肉，翻炒均匀，让鸡肉裹上酱料",
            "撒上芝麻即可"
        ]
    },
    {
        id: 14,
        title: "青咖喱鸡",
        cuisine: "thai",
        image: "static/image/青咖喱鸡.png",
        description: "泰国经典咖喱，椰香浓郁，微辣开胃",
        ingredients: [
            "鸡胸肉 500g",
            "青咖喱酱 3汤匙",
            "椰浆 400ml",
            "茄子 1个",
            "青椒 2个",
            "青豆 100g",
            "鱼露 2汤匙",
            "棕榈糖 1汤匙",
            "青柠 1个",
            "罗勒叶 适量",
            "大蒜 3瓣",
            "姜 1块",
            "香叶 3片",
            "食用油 2汤匙"
        ],
        steps: [
            "鸡胸肉切成小块，茄子切块，青椒切块",
            "大蒜切末，姜切末",
            "热锅倒入食用油，爆香蒜末和姜末",
            "加入青咖喱酱炒香",
            "加入鸡肉块翻炒至变色",
            "倒入椰浆，加入香叶，大火煮开后转小火炖煮10分钟",
            "加入茄子、青椒、青豆继续炖煮5分钟",
            "加入鱼露和棕榈糖调味",
            "关火，挤入青柠汁",
            "撒上罗勒叶即可"
        ]
    },
    {
        id: 15,
        title: "泰式炒河粉",
        cuisine: "thai",
        image: "static/image/泰式炒河粉.png",
        description: "酸甜可口，香气扑鼻，泰国街头美食代表",
        ingredients: [
            "河粉 300g",
            "虾仁 150g",
            "鸡胸肉 150g",
            "鸡蛋 2个",
            "豆芽 100g",
            "韭菜 50g",
            "绿豆芽 100g",
            "花生碎 50g",
            "柠檬 1个",
            "泰式甜辣酱 3汤匙",
            "鱼露 2汤匙",
            "糖 1汤匙",
            "老抽 1茶匙",
            "蒜末 1茶匙",
            "食用油 3汤匙"
        ],
        steps: [
            "河粉提前用清水泡软",
            "虾仁去虾线，鸡胸肉切丝，鸡蛋打散，韭菜切段",
            "热锅倒入食用油，倒入蛋液炒成蛋花",
            "加入鸡胸肉丝炒至变色",
            "加入虾仁炒至变色",
            "加入河粉，用筷子快速翻炒",
            "加入泰式甜辣酱、鱼露、糖、老抽调味",
            "加入豆芽和韭菜翻炒均匀",
            "关火，撒上花生碎",
            "挤入青柠汁即可"
        ]
    },
    {
        id: 16,
        title: "法式马卡龙",
        cuisine: "dessert",
        image: "static/image/法式马卡龙.png",
        description: "精致的法式甜点，外酥内软，色彩缤纷",
        ingredients: [
            "杏仁粉 100g",
            "糖粉 100g",
            "蛋白 3个（约100g）",
            "细砂糖 50g",
            "食用色素 适量",
            "香草精 1茶匙",
            "覆盆子果酱 适量",
            "巧克力 100g",
            "淡奶油 50ml"
        ],
        steps: [
            "杏仁粉和糖粉混合，过筛备用",
            "蛋白分三次加入细砂糖打发至硬性发泡",
            "加入食用色素和香草精，轻轻拌匀",
            "加入过筛的杏仁粉和糖粉，用切拌的方式混合",
            "将面糊装入裱花袋，在烤盘上挤出圆形",
            "轻震烤盘，去除气泡",
            "放在通风处静置30分钟至表面结皮",
            "预热烤箱至150℃，烤15-20分钟",
            "取出冷却至室温",
            "巧克力隔水融化，加入淡奶油做成巧克力夹馅",
            "在马卡龙底部涂抹夹馅或果酱，夹合即可"
        ]
    },
    {
        id: 17,
        title: "抹茶千层蛋糕",
        cuisine: "dessert",
        image: "static/image/抹茶千层蛋糕.png",
        description: "层层叠叠，抹茶清香，口感丰富",
        ingredients: [
            "低筋面粉 200g",
            "抹茶粉 10g",
            "鸡蛋 3个",
            "细砂糖 100g",
            "牛奶 500ml",
            "淡奶油 300ml",
            "黄油 50g",
            "香草精 1茶匙",
            "盐 一小撮",
            "抹茶粉 适量（装饰用）"
        ],
        steps: [
            "鸡蛋打散，加入细砂糖搅拌均匀",
            "加入牛奶、香草精和盐，搅拌均匀",
            "低筋面粉和抹茶粉混合过筛，加入蛋液中",
            "黄油隔水融化，加入面糊中搅拌均匀",
            "面糊过筛，去除结块",
            "平底锅小火预热，舀一勺面糊倒入锅中",
            "旋转锅子，让面糊均匀分布",
            "煎至表面凝固，小心翻面煎至微黄",
            "取出放在厨房纸上冷却",
            "重复上述步骤，煎好所有饼皮",
            "淡奶油打发至硬性发泡",
            "在饼皮上均匀涂抹打发的淡奶油",
            "层层叠加，最后在顶部撒上抹茶粉",
            "放入冰箱冷藏4小时以上"
        ]
    }
];

// 分页相关变量
let currentPage = 1;
const recipesPerPage = 6;
let currentCuisine = 'all';

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 显示食谱
    displayRecipes(currentPage);
    
    // 生成分页按钮
    generatePagination();
    
    // 菜系切换事件监听
    const cuisineTabs = document.querySelectorAll('.cuisine-tab');
    cuisineTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有tab的active类
            cuisineTabs.forEach(t => t.classList.remove('active'));
            // 为当前点击的tab添加active类
            this.classList.add('active');
            // 更新当前菜系
            currentCuisine = this.getAttribute('data-cuisine');
            // 重置为第一页
            currentPage = 1;
            // 重新显示食谱和分页
            displayRecipes(currentPage);
            generatePagination();
        });
    });
    
    // 模态框相关事件监听
    const recipeModal = document.getElementById('recipeModal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', function() {
        recipeModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === recipeModal) {
            recipeModal.style.display = 'none';
        }
    });
});

// 显示食谱
function displayRecipes(page) {
    const recipesGrid = document.getElementById('recipesGrid');
    recipesGrid.innerHTML = '';
    
    // 根据当前菜系筛选食谱
    let filteredRecipes = recipes;
    if (currentCuisine !== 'all') {
        filteredRecipes = recipes.filter(recipe => recipe.cuisine === currentCuisine);
    }
    
    // 计算起始和结束索引
    const startIndex = (page - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const currentRecipes = filteredRecipes.slice(startIndex, endIndex);
    
    // 生成食谱卡片
    currentRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        // 菜系标签样式映射
        const cuisineClassMap = {
            'chinese': 'cuisine-chinese',
            'western': 'cuisine-western',
            'japanese': 'cuisine-japanese',
            'korean': 'cuisine-korean',
            'thai': 'cuisine-thai',
            'dessert': 'cuisine-dessert'
        };
        
        // 菜系名称映射
        const cuisineNameMap = {
            'chinese': '中餐',
            'western': '西餐',
            'japanese': '日料',
            'korean': '韩式',
            'thai': '泰式',
            'dessert': '甜点'
        };
        
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" onerror="this.onerror=null; this.src='static/image/default.jpg';">
            <div class="recipe-info">
                <div class="recipe-content">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <p class="recipe-desc">${recipe.description}</p>
                </div>
                <div class="recipe-actions">
                    <button class="favorite-btn" data-id="${recipe.id}">
                        <i class="fas fa-heart"></i> 收藏
                    </button>
                    <button class="buy-ingredients-btn" data-id="${recipe.id}">
                        <i class="fas fa-shopping-cart"></i> 购买食材
                    </button>
                </div>
            </div>
        `;
        
        recipesGrid.appendChild(recipeCard);
    });
    
    // 为整个卡片添加点击事件监听（显示详情）
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', function(event) {
            // 如果点击的是按钮，不触发卡片的点击事件
            if (event.target.closest('button')) {
                return;
            }
            const recipeId = parseInt(this.querySelector('button').getAttribute('data-id'));
            showRecipeDetails(recipeId);
        });
    });
    
    // 为收藏按钮添加事件监听
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            const recipeId = parseInt(this.getAttribute('data-id'));
            addToFavorites(recipeId);
        });
    });
    
    // 为购买食材按钮添加事件监听
    document.querySelectorAll('.buy-ingredients-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            const recipeId = parseInt(this.getAttribute('data-id'));
            buyIngredients(recipeId);
        });
    });

// 购买食材函数
function buyIngredients(recipeId) {
    // 找到对应的食谱
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('请先登录后再购买食材');
        window.location.href = 'login.html';
        return;
    }
    
    // 可以实现将食材添加到购物车的逻辑
    alert(`已将「${recipe.title}」的食材添加到购物车！`);
    // 这里可以跳转到购物车页面或实现其他逻辑
    // window.location.href = 'market.html';
}
}

// 生成分页按钮
function generatePagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';
    
    // 根据当前菜系筛选食谱
    let filteredRecipes = recipes;
    if (currentCuisine !== 'all') {
        filteredRecipes = recipes.filter(recipe => recipe.cuisine === currentCuisine);
    }
    
    // 计算总页数
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    
    // 首页按钮
    const firstPageBtn = document.createElement('button');
    firstPageBtn.className = 'pagination-btn';
    firstPageBtn.textContent = '首页';
    firstPageBtn.disabled = currentPage === 1;
    firstPageBtn.addEventListener('click', function() {
        currentPage = 1;
        displayRecipes(currentPage);
        generatePagination();
    });
    paginationContainer.appendChild(firstPageBtn);
    
    // 上一页按钮
    const prevPageBtn = document.createElement('button');
    prevPageBtn.className = 'pagination-btn';
    prevPageBtn.textContent = '上一页';
    prevPageBtn.disabled = currentPage === 1;
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayRecipes(currentPage);
            generatePagination();
        }
    });
    paginationContainer.appendChild(prevPageBtn);
    
    // 页码按钮
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'pagination-btn';
        pageBtn.textContent = i;
        
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        pageBtn.addEventListener('click', function() {
            currentPage = i;
            displayRecipes(currentPage);
            generatePagination();
        });
        
        paginationContainer.appendChild(pageBtn);
    }
    
    // 下一页按钮
    const nextPageBtn = document.createElement('button');
    nextPageBtn.className = 'pagination-btn';
    nextPageBtn.textContent = '下一页';
    nextPageBtn.disabled = currentPage === totalPages;
    nextPageBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            displayRecipes(currentPage);
            generatePagination();
        }
    });
    paginationContainer.appendChild(nextPageBtn);
    
    // 末页按钮
    const lastPageBtn = document.createElement('button');
    lastPageBtn.className = 'pagination-btn';
    lastPageBtn.textContent = '末页';
    lastPageBtn.disabled = currentPage === totalPages;
    lastPageBtn.addEventListener('click', function() {
        currentPage = totalPages;
        displayRecipes(currentPage);
        generatePagination();
    });
    paginationContainer.appendChild(lastPageBtn);
}

// 显示食谱详情
    function showRecipeDetails(recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;
        
        const modalContent = document.getElementById('modalContent');
        const recipeModal = document.getElementById('recipeModal');
    
    // 获取菜系名称
    const cuisineName = getCuisineName(recipe.cuisine);
    
    // 生成模态框内容，与my_recipes.html中的样式保持一致
    modalContent.innerHTML = `
        <div class="close-modal" onclick="closeRecipeModal()">&times;</div>
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-detail-image" onerror="handleImageError(this)">
        <h2 class="detail-title">${recipe.title}</h2>
        <div class="cuisine-info">
            <span class="cuisine-tag">${cuisineName}</span>
            ${recipe.difficulty ? `<span class="cuisine-tag">${recipe.difficulty}</span>` : ''}
            ${recipe.time ? `<span class="cuisine-tag">${recipe.time}</span>` : ''}
        </div>
        <p class="recipe-desc">${recipe.description}</p>
        <div class="ingredients-section">
            <h3 class="section-title">所需食材</h3>
            <ul class="ingredients-list">
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
        <div class="steps-section">
            <h3 class="section-title">制作步骤</h3>
            <ol class="steps-list">
                ${recipe.steps.map((step, index) => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    `;
    
    recipeModal.style.display = 'flex';
}

// 功能已移除

// 开始烹饪
function startCooking(recipeId) {
    alert('开始烹饪功能即将上线，敬请期待！');
    closeRecipeModal();
}

// 关闭模态框
function closeRecipeModal() {
    const recipeModal = document.getElementById('recipeModal');
    recipeModal.style.display = 'none';
}

// 获取菜系名称
function getCuisineName(cuisineKey) {
    const cuisineMap = {
        'chinese': '中餐',
        'western': '西餐',
        'japanese': '日料',
        'korean': '韩式',
        'thai': '泰式',
        'dessert': '甜点'
    };
    return cuisineMap[cuisineKey] || cuisineKey;
}

// 功能已完全移除

// 添加到收藏
function addToFavorites(recipeId) {
    // 检查是否已登录
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('请先登录后再使用此功能');
        return;
    }
    
    // 获取当前用户的收藏列表
    let favoriteRecipes = JSON.parse(localStorage.getItem(`favorite_recipes_${user.username}`)) || [];
    
    // 检查是否已收藏
    if (favoriteRecipes.includes(recipeId)) {
        alert('已收藏过此食谱');
        return;
    }
    
    // 添加到收藏列表
    favoriteRecipes.push(recipeId);
    
    // 保存到localStorage
    localStorage.setItem(`favorite_recipes_${user.username}`, JSON.stringify(favoriteRecipes));
    
    alert('收藏成功');
}

// 购买食材
function buyIngredients(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // 构建食材购物清单
    const ingredientsList = recipe.ingredients.join('\n');
    
    // 复制到剪贴板
    navigator.clipboard.writeText(`购买清单：\n${recipe.title}\n\n${ingredientsList}`)
        .then(() => {
            alert('食材清单已复制到剪贴板！您可以粘贴到备忘录或购物应用中。');
        })
        .catch(err => {
            console.error('复制失败:', err);
            // 如果复制失败，显示食材列表
            alert(`购买清单：\n${recipe.title}\n\n${ingredientsList}`);
        });
}

// 检查登录状态
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authSection = document.getElementById('authSection');
    
    if (user) {
        // 已登录状态
        authSection.innerHTML = `<span>欢迎，${user.username}!</span>`;
    } else {
        // 未登录状态（保持原样）
    }
}

// 删除食谱（管理员功能，仅作演示）
function deleteRecipe(recipeId) {
    // 实际应用中，这里应该调用后端API进行删除
    alert(`删除食谱ID：${recipeId}（演示功能）`);
}

// 根据菜系显示食谱
function showCuisineRecipes(cuisine) {
    currentCuisine = cuisine;
    currentPage = 1;
    displayRecipes(currentPage);
    generatePagination();
}

// 图片错误处理
function handleImageError(img) {
    img.onerror = null; // 防止无限循环
    img.src = 'static/image/default.jpg';
}