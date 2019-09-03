/*
 Navicat MySQL Data Transfer

 Source Server         : J1ong
 Source Server Type    : MySQL
 Source Server Version : 80013
 Source Host           : localhost:3306
 Source Schema         : db_film

 Target Server Type    : MySQL
 Target Server Version : 80013
 File Encoding         : 65001

 Date: 03/09/2019 17:18:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin`  (
  `admin_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '管理员id',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '管理员姓名',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '管理员密码',
  `sex` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '管理员性别',
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '管理员联系电话',
  `birthday` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '出生年月日',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '管理员头像',
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES (1, 'admin', 'admin', '男', '13414850215', '1999-9-9', '/images/admin/admin.gif');

-- ----------------------------
-- Table structure for t_cinema
-- ----------------------------
DROP TABLE IF EXISTS `t_cinema`;
CREATE TABLE `t_cinema`  (
  `cinema_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '影院id',
  `cinema_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '影院名称',
  `cinema_phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '影院电话',
  `province` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '影院所在省份',
  `city` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '影院所在市',
  `county` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '影院所在区县',
  `specified_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '影院详细地址',
  PRIMARY KEY (`cinema_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_cinema
-- ----------------------------
INSERT INTO `t_cinema` VALUES (1, '横店电影城(庆丰店)', '13498476301', '广东', '广州', '白云区', '白云区庆丰广场路财智广场2楼');
INSERT INTO `t_cinema` VALUES (2, '尚影影院', '13745454545', '广东', '广州', '白云区', '白云区石夏路288号金铂广场7楼');
INSERT INTO `t_cinema` VALUES (4, '烽禾影城(祈福新邨店)', '13409989898', '广东', '广州', '番禺区', '番禺区钟屏路钟福广场3层（祈福新村祈福医院旁）');
INSERT INTO `t_cinema` VALUES (5, '沙湾3D数字电影院', '13465102832', '广东', '广州', '番禺区', '番禺区沙湾镇大巷涌路沙湾文化中心2楼（沁芳园对面）');
INSERT INTO `t_cinema` VALUES (6, '大地影院(奥体高德美居店)', '13454729283', '广东', '广州', '天河区', '天河区奥体南路12号高德美居家居馆3楼（近天河百货）');
INSERT INTO `t_cinema` VALUES (7, '金逸国际影城(维家思店)', '13483743433', '广东', '广州', '天河区', '天河区黄埔大道西188号维家思广场3楼（富力盈隆广场对面）');
INSERT INTO `t_cinema` VALUES (8, 'FUN范影城(喜洋时代东圃店)', '13418226112', '广东', '广州', '天河区', '天河区东圃大马路4号四季时尚荟A栋1楼（近东圃购物中心）');
INSERT INTO `t_cinema` VALUES (14, '万达影院', '13498746534', NULL, NULL, NULL, '天河区长湴北街34号3楼');

-- ----------------------------
-- Table structure for t_comment
-- ----------------------------
DROP TABLE IF EXISTS `t_comment`;
CREATE TABLE `t_comment`  (
  `comment_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `user_id` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '用户id',
  `movie_id` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '电影id',
  `user_score` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '用户评分',
  `comment_content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL COMMENT '用户评论内容',
  `comment_date` datetime(6) NULL DEFAULT NULL COMMENT '评论日期',
  `support_num` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '点赞数',
  `is_pass` int(1) NULL DEFAULT 0 COMMENT '评论是否通过审核',
  `support_user` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL COMMENT '点赞用户数组',
  PRIMARY KEY (`comment_id`) USING BTREE,
  INDEX `t_comment_ibfk_1`(`user_id`) USING BTREE,
  INDEX `t_comment_ibfk_2`(`movie_id`) USING BTREE,
  CONSTRAINT `t_comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t_comment_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `t_movie` (`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_comment
-- ----------------------------
INSERT INTO `t_comment` VALUES (57, 1, 4, 9, '很好看，挺悲伤的，让我哭一会！', '2019-08-08 15:59:38.000000', 2, 1, '[1,53]');
INSERT INTO `t_comment` VALUES (58, 1, 7, 8, '很好看，有一起的吗？', '2019-08-08 16:05:46.000000', 2, 1, '[53,1]');

-- ----------------------------
-- Table structure for t_hall
-- ----------------------------
DROP TABLE IF EXISTS `t_hall`;
CREATE TABLE `t_hall`  (
  `hall_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '影厅id',
  `cinema_id` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '影院id',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '影厅名称',
  PRIMARY KEY (`hall_id`) USING BTREE,
  INDEX `t_hall_ibfk_1`(`cinema_id`) USING BTREE,
  CONSTRAINT `t_hall_ibfk_1` FOREIGN KEY (`cinema_id`) REFERENCES `t_cinema` (`cinema_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 40 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_hall
-- ----------------------------
INSERT INTO `t_hall` VALUES (30, 1, '1号激光厅');
INSERT INTO `t_hall` VALUES (32, 2, '1号激光厅');
INSERT INTO `t_hall` VALUES (34, 4, '1号激光厅');
INSERT INTO `t_hall` VALUES (35, 5, '1号激光厅');
INSERT INTO `t_hall` VALUES (36, 6, '1号激光厅');
INSERT INTO `t_hall` VALUES (37, 7, '1号激光厅');
INSERT INTO `t_hall` VALUES (38, 8, '1号激光厅');
INSERT INTO `t_hall` VALUES (40, 5, '2号激光厅');

-- ----------------------------
-- Table structure for t_movie
-- ----------------------------
DROP TABLE IF EXISTS `t_movie`;
CREATE TABLE `t_movie`  (
  `movie_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '电影id',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '电影名称',
  `poster` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '电影海报',
  `director` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '导演',
  `actor` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '主演',
  `movie_long` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '电影片长',
  `language` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '电影语言版本',
  `intro` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL COMMENT '电影简介',
  `type` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '电影类型',
  `public_date` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '电影上映时间',
  `wish_num` int(4) UNSIGNED NULL DEFAULT 0 COMMENT '想看人数',
  `score` decimal(4, 1) NULL DEFAULT NULL COMMENT '电影综合评分',
  PRIMARY KEY (`movie_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_movie
-- ----------------------------
INSERT INTO `t_movie` VALUES (1, '驯龙高手3', '/images/movie/hot1.jpg', '迪恩·德布洛斯', '刘昊然', '130分钟', '英语', '统领伯克岛的酋长嗝嗝（刘昊然 配音），与阿丝翠德（亚美莉卡·费雷拉 配音）共同打造了一个奇妙而热闹的飞龙乌托邦。一只雌性光煞飞龙的意外出现，加上一个前所未有的威胁的到来，令嗝嗝和没牙仔不得不离开自己唯一的家园，前往他们本以为只存在于神话之中的隐秘之境。在发现自己真正的命运之后，飞龙与骑士将携手殊死奋战，保护他们所珍爱的一切。', '动漫', '2018-12-11', 0, 0.0);
INSERT INTO `t_movie` VALUES (3, '夏目友人帐', '/images/movie/hot3.jpg', '大森贵弘', '村濑步', '105分钟', '日语', '夏目（神谷浩史 配音）在一次归还妖怪名字的过程中，结识了外祖母玲子（小林沙苗 配音）的旧识津村容莉枝岛本须美 配音）和她的儿子椋雄（高良健吾 配音）。在与其接触后，夏目的“保镖”猫咪老师（井上和彦 配音）竟第一次意外分裂成了三只！夏目能否解决危机？这对母子又与妖怪有何关系？', '言情', '2018-11-13', 1, NULL);
INSERT INTO `t_movie` VALUES (4, '比悲伤更悲伤的故事', '/images/movie/hot4.jpg', '林孝谦', '陈庭妮', '105分钟', '国语', '唱片制作人张哲凯（刘以豪 饰）和王牌作词人宋媛媛（陈意涵 饰）相依为命，两人自幼身世坎坷只有彼此为伴，他们是亲人、是朋友，也彷佛是命中注定的另一半。父亲罹患遗传重症而被母亲抛弃的哲凯，深怕自己随时会发病不久人世，始终没有跨出友谊的界线对媛媛展露爱意。眼见哲凯的病情加重，他暗自决定用剩余的生命完成他们之间的终曲，再为媛媛找个可以托付一生的好男人。这时，事业有成温柔体贴的医生（张书豪 饰）适时的出现让他成为照顾媛媛的最佳人选，二人按部就班发展着关系。一切看似都在哲凯的计划下进行。然而，故事远比这里所写更要悲伤', '言情', '2018-9-1', 0, 9.0);
INSERT INTO `t_movie` VALUES (5, '惊奇队长', '/images/movie/hot5.jpg', '瑞安·弗雷克', '本·门德尔森', '108分钟', '英语', '卡罗尔·丹弗斯（布丽·拉尔森 饰）是克里人的精英部队一员，但她挣扎着回忆过去，对于怎么获得超能力、以及之前的人生等超能力之前的人生，她只在梦中有片段不成章的记忆，这层困扰引起的情绪波动也进而影响她对超能力的掌控。所幸，在星际战队指挥官（裘德·洛 饰）的调教之下，卡罗尔·丹弗斯学会如何控制自己的超能力。一次外星任务中，卡罗尔·丹弗斯因故来到了地球，并遇到还是低阶探员的尼克·弗瑞（塞缪尔·杰克逊 饰），卡罗尔·丹弗斯与尼克·弗瑞一起追捕在地球惹事的变形人塔罗斯（本·门德尔森 饰），同时，也发现自己如何获得超能力。', '爱情', '2018-7-3', 1, 0.0);
INSERT INTO `t_movie` VALUES (6, '我的英雄学院', '/images/movie/hot6.jpg', '长崎健司', '生濑胜久', '96分钟', '日语', '讲述在绝大多数人都有超能力的未来时代，没有天赋的异能少年，如何凭努力与坚持打破绝境，成长为最强英雄，守卫世界和平的故事。 剧场版以移动科研都市“我之岛”为舞台，描绘正反两派的殊死激战。在第一英雄被困之际，少年与英雄科同学拼死克敌，却在无意中探得隐秘真相，剧情随之反转', '科幻', '2018-8-13', 1, NULL);
INSERT INTO `t_movie` VALUES (7, '我叫为何', '/images/movie/1.jpg', '李小军', '乔新峰', '86分钟', '国语', '讲述了两个技术宅男为何和吕相立志设计一款以圣朝名将无束为主角的火爆游戏。作为战神无束的死忠粉丝，为何在设计游戏的过程中，意外穿越到了圣朝，有机会亲眼目睹无束驱除西土的宏大场面。', '喜剧', '2019-8-20', 1, 8.0);
INSERT INTO `t_movie` VALUES (8, '如影随心', '/images/movie/2.jpg', '霍建起', '马苏', '96分钟', '国语', '小提琴家陆松（陈晓 饰）与室内设计师文罂（杜鹃 饰）巴黎邂逅，不打不相识，彼此迷恋越陷越深。爱情之名怂恿着他们为爱再大胆一次，走出各自问题满满的情感关系。仿佛只要现任变前任，幸福就唾手可得。然而前任们也都是战士，文罂的前任郑可（华少 饰）是个理性至极的医生，陆松的前任刘娟（马苏 饰）则在情感社区开启了喋喋不休的骂战，是继续坚持对爱的信仰，还是选择放下与原谅重新开始？现代都市情感危机在北京与巴黎街头上演。越是深爱的，往往也正是痛苦的源头，爱情，像是影子，抓不住却也离不开，如影随心', '爱情', '2019-9-11', 2, NULL);
INSERT INTO `t_movie` VALUES (9, '转型团伙', '/images/movie/3.jpg', '吴镇宇', '吴镇宇', '90分钟', '国语', '过气影帝宇哥（吴镇宇 饰）与当红童星费曼（费曼 饰）因一场拍摄意外而陷入黑帮纷争的故事。失忆的宇哥意外“入戏”，以为自己就是真正的社团大哥，为了赚钱照顾儿子决定重出江湖，殊不知时代已经改变，引发一连串令人啼笑皆非的乌龙事件，更上演了险象环生的黑帮纷争', '剧情', '2019-7-28', 2, NULL);
INSERT INTO `t_movie` VALUES (10, '境界', '/images/movie/4.jpg', '佐藤信介', '真野惠里菜', '108分钟', '日语', '从小异于常人的黑崎一护（福士苍汰 饰），在一次机缘巧合下遭遇女死神“朽木露琪亚”（杉咲花 饰）。 露琪亚是将灵魂从现实世界引领到尸魂界的收魂者之一，他们为保护人类 不被“虚” 侵害，一直在与这些怪物战斗。在与一只异常强大的“虚” 战斗时，露琪亚身负重伤，无奈只能将死神 的力量暂时转给黑崎一护，让其代为战斗。两人经过一段时间的磨合后并肩战斗，终于战胜了当年害死一护母亲的“虚”，但在这期间，露琪亚的兄长朽木白哉（石原贵雅 饰）强迫她不顾黑崎一护的生命安危收回法力。露琪亚为保护一护，拖延到与“虚”的战斗结束，并清除了一护的记忆', '动作', '2019-11-12', 1, NULL);
INSERT INTO `t_movie` VALUES (11, '神奇乐园历险记', '/images/movie/5.jpg', 'Dylan Brown', '基南·汤普森', '95分钟', '英语', '古灵精怪的十二岁女孩朱妮（Sofia Mali 配音），偶然间她发现了一座神奇的乐园。小朱妮在乐园里遇到了憨厚可掬的蓝熊布默（肯·哈德森·坎贝尔 配音），善良的疣猪格里塔（米拉·库尼斯 配音），贫嘴的豪猪史蒂夫（约翰·奥利弗 配音），滑稽搞笑的海狸兄弟库珀（郑肯 配音）和格斯（基南·汤普森 配音），充满奇幻想象力的首领和乐园里炙手可热的动物明星猴子花生，并很快和它们成为朋友。这座隐藏在森林中的神奇乐园不仅有着形形色色的动物，还有很多惊险刺激的游乐设施。但从动物朋友口中，小朱妮得知乐园已经衰败无法运营。很快，小朱妮就意识到这座神奇乐园和她之前想象中的乐园一模一样。只有她能拯救这座已经没落的乐园。于是，她和动物朋友们组成了一只小分队，希望帮助乐园重现昔日繁华。', '冒险', '2019-12-1', 0, NULL);
INSERT INTO `t_movie` VALUES (12, '毕业旅行之逍遥骑士', '/images/movie/6.jpg', '郭奎永', '田雨', '90分钟', '国语', '高考落榜的文艺少年杨风（张朔祯 饰）梦想成为一个“嬉皮士”浪子，并誓要在毕业旅行中完成自己的浪子清单：打架、泡妞、吸烟喝酒、打坐冥想、和摇滚歌手交朋友……他在好友陈火（赵一凡 饰）的相助下伪装成“逍遥骑士”，想借助漂亮师姐思思（安紫依 饰）完成自己的“破处之旅”，却没想到思思也暗藏自己的“少女成人计划”，“逍遥路上”演绎啼笑皆非的动人故事。', '青春', '2019-11-11', 2, 0.0);
INSERT INTO `t_movie` VALUES (13, '复仇者联盟4', '/images/movie/7.jpg', '乔·罗素', '小罗伯特·唐尼', '181分钟', '英语', '改编自漫威漫画，也是漫威电影宇宙第22部影片。复仇者联盟的一众超级英雄，必须抱着牺牲一切的信念，与史上最强大反派灭霸殊死一搏，阻止其摧毁宇宙的邪恶计划。', '动作', '2019-4-24', 3, 0.0);
INSERT INTO `t_movie` VALUES (14, '撞死了一只羊', '/images/movie/8.jpg', '万玛才旦', '金巴', '87分钟', '国语', '司机金巴（金巴 饰）在路上撞死了一只羊，决意超度此羊；杀手金巴（更登彭措 饰）即将找到杀父仇人，准备报仇雪恨。阴差阳错，杀手金巴搭上了司机金巴的卡车。于是，两个叫金巴的男人的命运便神秘地联系在了一起，一段惊心动魄的旅程开始……', '剧情', '2019-8-12', 0, NULL);
INSERT INTO `t_movie` VALUES (15, '云雾笼罩的山峰', '/images/movie/9.jpg', '左志国', '王海涛', '92分钟', '国语', '一位年轻的父亲为了筹钱医治自己病重的爱女，又要不到拖欠的赔款，被迫铤而走险绑架了老板的女儿。然而他不知道的是，在这座幽静的山里，还有其他人带着不同的目的和欲望参与了这件事情，一座山上、一日之内、六组人马，各自的贪念在错综复杂的因果之下，逐渐失控，转向不可预知的方向。罪恶之中，谁能逃脱命运的审判？', '悬疑', '2019-7-14', 1, NULL);
INSERT INTO `t_movie` VALUES (16, '九克拉战栗', '/images/movie/10.jpg', '林峻兆', '付然', '86分钟', '国语', '珠宝店店员包小萱鬼迷心窍捡走车祸死者——女老板虞娜的钻戒，这是枚被恶魔诅咒的钻戒。 瞬间，包小萱被虞娜灵魂附身，同时，这场车祸似乎也从没发生过。随之各种恐怖事件纷纷降临在被虞娜灵魂附身的包小萱身上……', '恐怖', '2019-7-1', 0, NULL);
INSERT INTO `t_movie` VALUES (17, '绿皮书', '/images/movie/hot7.jpg', '皮特·法雷里', '维果·莫腾森', '130分钟', '英语', '一名黑人钢琴家，为前往种族歧视严重的南方巡演，找了一个粗暴的白人混混做司机。在一路开车南下的过程里，截然不同的两人矛盾不断，引发了不少争吵和笑料。但又在彼此最需要的时候，一起共渡难关。行程临近结束，两人也慢慢放下了偏见...... 绿皮书，是一本专为黑人而设的旅行指南，标注了各城市中允许黑人进入的旅店、餐馆。电影由真实故事改编。', '剧情', '2019-3-1', 1, 0.0);
INSERT INTO `t_movie` VALUES (18, '阿丽塔', '/images/movie/hot8.jpg', '罗伯特·罗德里', '罗莎·萨拉查', '123分钟', '英语', '未来26世纪，科技发展，人类与机械改造人共存，弱肉强食是钢铁城唯一的生存法则。依德（克里斯托夫·沃尔兹 饰）是钢铁城著名的改造人医生，他在垃圾场发现了一个半机械少女残躯，依德医生将其拯救后为她取名阿丽塔（罗莎·萨拉扎尔 饰）。阿丽塔虽然重获生命却失去了记忆，如一个新生儿一样对这个世界充满新鲜感。在依德医生与好友雨果（基恩·约翰逊 饰）的帮助下，她逐步适应着新生活和街头险恶。一次偶然的机会，阿丽塔发现自己竟有着惊人的战斗天赋。 一次次猎杀激发着她的觉醒，阿丽塔逐渐明白自己注定为战斗而生，为正义而战。一场揭开自己身世之谜，并打破宇宙旧秩序的史诗级冒险之旅就这样展开。', '动作', '2019-2-22', 0, NULL);
INSERT INTO `t_movie` VALUES (19, '狗眼看人心', '/images/movie/hot9.jpg', '吴楠', '黄磊', '91分钟', '国语', '本片讲述了一桩因“狗咬狗”引发的连锁故事。余峰（黄磊 饰）、亮亮（闫妮 饰）、余一诺（安吉 饰）家的小狗妮蔻，为了救主人被隔壁藏獒咬成重伤，有权有势的藏獒主人却对余峰一家百般刁难。面对种种不公，余峰不再忍气吞声，发誓要为小狗讨回公道，但柴女士（汤唯 饰）等人的出现，却让矛盾进一步激化......狗生不易，小狗愿意用生命守护我们，我们又能为它做什么呢？', '剧情', '2019-4-20', 0, 0.0);
INSERT INTO `t_movie` VALUES (20, '祈祷落幕时', '/images/movie/hot10.jpg', '福泽克雄', '阿部宽', '119分钟', '日语', '在东京都葛饰区小菅的某座公寓里，发现了一具被勒死的女性遗体。被害者是在清洁公司上班、住在滋贺县的押谷道子（中岛博子 饰）。而杀人现场的住户越川睦夫也下落不明。而以松宫（沟端淳平 饰）等警视厅搜查一科的刑警们查不出越川与押谷道子有何交集，案件调查陷入困境。尽管查明押谷道子是为了拜访她的同学，即导演浅居博美（松岛菜菜子 饰）才来东京的，但博美与越川之间也找不出什么交集。这时，案发地点附近发现了被烧死的尸体，松宫怀疑两者有关联。从遗物中，发现了写有日本桥周围12座桥名的文字。知道此事后加贺恭一郎（阿部宽 饰）非常激动，因为那东西与他的亡母大有关联。', '剧情', '2019-4-12', 2, 0.0);
INSERT INTO `t_movie` VALUES (29, '大侦探皮卡丘', '/images/movie/1557131178228.jpg', '卡梅隆', '皮卡丘', '104分钟', '英语', '蒂姆·古德曼（贾斯提斯·史密斯 饰） 为寻找下落不明的父亲来到莱姆市，意外与父亲的前宝可梦搭档大侦探皮卡丘（瑞恩·雷诺兹 配音）相遇，并惊讶地发现自己是唯一能听懂皮卡丘说话的人类，他们决定组队踏上揭开真相的刺激冒险之路。探案过程中他们邂逅了各式各样的宝可梦，并意外发现了一个足以毁灭整个宝可梦宇宙的惊天阴谋。', '冒险', '2019-5-20', 3, 0.0);
INSERT INTO `t_movie` VALUES (33, '罗马', '/images/movie/1557394982584.jpg', '张三', '李四', '1200分钟', '粤语', '嘻嘻嘻嘻嘻', '言情', '2019-5-23', 1, 0.0);
INSERT INTO `t_movie` VALUES (34, '来电狂响', '/images/movie/1557457509601.jpg', '张三', '董大伟', '130分钟', '国语', '七个好友聚餐，有人提议大家玩一个将手机公开的游戏：与在场所有人分享当晚收到的每一条短信、每一个电话，每一个弹窗，由此掀开了一场轩然大波。 一条短信，拆散一对恩爱夫妻；一个电话，推翻多年发小感情……数字时代，小小手机藏了无数秘密，当手机变成锋利的利刃，当聚餐局变成“揭 秘局”，信任危机过后他们能否跨越信任危机，重新思考彼此之间的亲密关系………..', '悬疑', '2019-5-31', 2, 0.0);
INSERT INTO `t_movie` VALUES (35, '雪暴', '/images/movie/1557555972902.jpg', '张三', '李四', '120分钟', '国语', '无', '喜剧', '2019-5-17', 1, 0.0);
INSERT INTO `t_movie` VALUES (36, '一个母亲的复仇', '/images/movie/1563173524205.jpg', '王明', '张三', '118分钟', '国语', '一个母亲的复仇', '悬疑', '2019-11-14', 0, 0.0);
INSERT INTO `t_movie` VALUES (37, '蜘蛛侠：英雄远征', '/images/movie/1563173216299.jpg', '大奔', '蜘蛛', '180分钟', '英语', '故事全面延续“复联4”，蜘蛛侠志承钢铁侠远征欧洲，独挑大梁对抗群敌！新角色“神秘客”穿越多元宇宙霸气登场！神盾局局长尼克·弗瑞回归领军！“漫威新铁三角”组合强势出击！全新蜘蛛战衣酷炫升级！史诗对决燃爆今夏突破想象极限！', '科幻', '2019-7-11', 0, NULL);
INSERT INTO `t_movie` VALUES (38, '银河补习班', '/images/movie/1563180596034.jpg', '李四', '王五', '156分钟', '英语', '银河补习班', '喜剧', '2019-7-11', 0, NULL);

-- ----------------------------
-- Table structure for t_order
-- ----------------------------
DROP TABLE IF EXISTS `t_order`;
CREATE TABLE `t_order`  (
  `order_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单id',
  `user_id` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '用户id',
  `schedule_id` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '影院id',
  `order_phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '下单手机',
  `order_date` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户下单时间',
  `ticket_num` int(1) UNSIGNED NULL DEFAULT NULL COMMENT '购买电影票数',
  `ticket_total_price` decimal(10, 2) UNSIGNED NULL DEFAULT NULL COMMENT '电影票单价',
  `order_seat_info` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '座位信息',
  `pay_type` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '支付方式',
  `phone_code` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '手机取票码',
  PRIMARY KEY (`order_id`) USING BTREE,
  INDEX `t_order_ibfk_1`(`user_id`) USING BTREE,
  INDEX `t_order_ibfk_2`(`schedule_id`) USING BTREE,
  CONSTRAINT `t_order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t_order_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `t_schedule` (`schedule_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 101 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_order
-- ----------------------------
INSERT INTO `t_order` VALUES (73, 1, 69, '13414850282', '2019-5-6', 3, 168.00, '[25,26,35]', '1', '341593');
INSERT INTO `t_order` VALUES (75, 1, 53, '13414850282', '2019-5-7', 3, 294.00, '[26,25,35]', '1', '612368');
INSERT INTO `t_order` VALUES (79, 50, 50, '13672606065', '2019-5-10', 1, 56.00, '[35]', '0', '823445');
INSERT INTO `t_order` VALUES (80, 50, 60, '13672606065', '2019-5-10', 2, 90.00, '[25,24]', '0', '961831');
INSERT INTO `t_order` VALUES (81, 25, 55, '13877777766', '2019-5-10', 3, 168.36, '[25,35,36]', '0', '393432');
INSERT INTO `t_order` VALUES (82, 29, 53, '13482638273', '2019-5-10', 1, 98.00, '[27]', '0', '149857');
INSERT INTO `t_order` VALUES (84, 35, 53, '13457555444', '2019-5-10', 4, 392.00, '[24,5,15,14]', '0', '285591');
INSERT INTO `t_order` VALUES (85, 35, 60, '13457555444', '2019-5-10', 2, 90.00, '[26,36]', '0', '194678');
INSERT INTO `t_order` VALUES (86, 23, 70, '13478565555', '2019-5-11', 3, 168.00, '[25,26,35]', '1', '674698');
INSERT INTO `t_order` VALUES (87, 1, 53, '13414850282', '2019-5-11', 3, 294.00, '[45,46,36]', '0', '897439');
INSERT INTO `t_order` VALUES (88, 1, 54, '13414850282', '2019-5-11', 4, 176.00, '[25,26,36,35]', '0', '481319');
INSERT INTO `t_order` VALUES (90, 1, 64, '13414850282', '2019-7-5', 2, 156.00, '[15,16]', '0', '146745');
INSERT INTO `t_order` VALUES (91, 1, 68, '13414850282', '2019-7-12', 4, 136.00, '[25,26,36,35]', '1', '572118');
INSERT INTO `t_order` VALUES (92, 1, 64, '13414850282', '2019-7-15', 4, 312.00, '[35,26,36,25]', '1', '859679');
INSERT INTO `t_order` VALUES (93, 1, 64, '13414850282', '2019-7-15', 2, 156.00, '[34,37]', '0', '847345');
INSERT INTO `t_order` VALUES (94, 1, 87, '13414850282', '2019-7-15', 4, 308.00, '[25,26,36,35]', '1', '987546');
INSERT INTO `t_order` VALUES (95, 1, 82, '13414850282', '2019-7-15', 4, 260.00, '[25,26,36,35]', '1', '751292');
INSERT INTO `t_order` VALUES (96, 1, 87, '13414850282', '2019-7-15', 2, 154.00, '[45,46]', '0', '135615');
INSERT INTO `t_order` VALUES (97, 1, 87, '13414850282', '2019-7-15', 1, 77.00, '[37]', '1', '586315');
INSERT INTO `t_order` VALUES (98, 1, 87, '13414850282', '2019-7-15', 1, 77.00, '[34]', '1', '666362');
INSERT INTO `t_order` VALUES (99, 1, 67, '13414850282', '2019-7-24', 4, 264.00, '[25,27,46,34]', '1', '323495');
INSERT INTO `t_order` VALUES (100, 1, 80, '13414850282', '2019-7-25', 4, 152.00, '[16,26,25,15]', '1', '577429');
INSERT INTO `t_order` VALUES (101, 1, 80, '13414850282', '2019-8-6', 2, 76.00, '[35,36]', '1', '821579');

-- ----------------------------
-- Table structure for t_schedule
-- ----------------------------
DROP TABLE IF EXISTS `t_schedule`;
CREATE TABLE `t_schedule`  (
  `schedule_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '排片id',
  `movie_id` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '电影id',
  `cinema_id` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '影院id',
  `hall_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '影厅名字',
  `show_date` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '放映日期',
  `show_time` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '放映时间',
  `price` decimal(10, 2) NULL DEFAULT NULL COMMENT '电影售价',
  `seat_info` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL COMMENT '座位信息',
  PRIMARY KEY (`schedule_id`) USING BTREE,
  INDEX `hall_id`(`hall_name`) USING BTREE,
  INDEX `t_schedule_ibfk_1`(`movie_id`) USING BTREE,
  INDEX `t_schedule_ibfk_2`(`cinema_id`) USING BTREE,
  CONSTRAINT `t_schedule_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `t_movie` (`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t_schedule_ibfk_2` FOREIGN KEY (`cinema_id`) REFERENCES `t_cinema` (`cinema_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 102 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_schedule
-- ----------------------------
INSERT INTO `t_schedule` VALUES (50, 20, 5, '1号激光厅', '2019-5-22', '20:05', 56.00, '[35]');
INSERT INTO `t_schedule` VALUES (53, 13, 6, '1号激光厅', '2019-5-31', '12:05', 98.00, '[35,27,24,5,15,14,45,46,36]');
INSERT INTO `t_schedule` VALUES (54, 16, 4, '1号激光厅', '2019-7-10', '20:05', 44.00, '[25,26,36,35]');
INSERT INTO `t_schedule` VALUES (55, 19, 6, '1号激光厅', '2019-5-14', '16:05', 56.12, '[25,35,36]');
INSERT INTO `t_schedule` VALUES (56, 17, 8, '1号激光厅', '2019-5-16', '16:05', 38.10, '[]');
INSERT INTO `t_schedule` VALUES (59, 5, 6, '1号激光厅', '2019-5-24', '16:05', 76.00, NULL);
INSERT INTO `t_schedule` VALUES (60, 6, 2, '1号激光厅', '2019-5-22', '08:05', 45.00, '[25,24,26,36]');
INSERT INTO `t_schedule` VALUES (63, 4, 2, '1号激光厅', '2019-5-23', '08:05', 46.10, NULL);
INSERT INTO `t_schedule` VALUES (64, 8, 7, '1号激光厅', '2019-9-24', '12:05', 78.00, '[15,16,35,26,36,25,34,37]');
INSERT INTO `t_schedule` VALUES (67, 12, 6, '1号激光厅', '2019-11-18', '16:05', 66.00, '[25,27,46,34]');
INSERT INTO `t_schedule` VALUES (68, 15, 1, '1号激光厅', '2019-7-21', '16:05', 34.00, '[25,26,36,35]');
INSERT INTO `t_schedule` VALUES (69, 29, 5, '2号激光厅', '2019-5-20', '20:05', 56.00, '[25,26,35]');
INSERT INTO `t_schedule` VALUES (70, 20, 5, '1号激光厅', '2019-5-24', '16:05', 56.00, '[25,26,35]');
INSERT INTO `t_schedule` VALUES (74, 34, 4, '1号激光厅', '2019-6-26', '12:05', 78.90, NULL);
INSERT INTO `t_schedule` VALUES (75, 3, 6, '1号激光厅', '2019-5-21', '16:05', 36.70, NULL);
INSERT INTO `t_schedule` VALUES (76, 35, 4, '1号激光厅', '2019-5-24', '12:05', 76.00, NULL);
INSERT INTO `t_schedule` VALUES (77, 3, 2, '1号激光厅', '2019-5-31', '12:05', 78.00, NULL);
INSERT INTO `t_schedule` VALUES (78, 13, 2, '1号激光厅', '2019-6-30', '20:05', 78.00, NULL);
INSERT INTO `t_schedule` VALUES (79, 1, 7, '1号激光厅', '2019-7-11', '08:05', 45.00, '[]');
INSERT INTO `t_schedule` VALUES (80, 4, 8, '1号激光厅', '2019-8-14', '20:05', 38.00, '[16,26,25,15,35,36]');
INSERT INTO `t_schedule` VALUES (81, 37, 4, '1号激光厅', '2019-7-30', '12:05', 76.00, NULL);
INSERT INTO `t_schedule` VALUES (82, 16, 1, '1号激光厅', '2019-7-21', '20:05', 65.00, '[25,26,36,35]');
INSERT INTO `t_schedule` VALUES (83, 18, 2, '1号激光厅', '2019-7-30', '12:05', 34.00, NULL);
INSERT INTO `t_schedule` VALUES (84, 36, 7, '1号激光厅', '2019-11-22', '12:05', 78.00, NULL);
INSERT INTO `t_schedule` VALUES (85, 37, 5, '2号激光厅', '2019-7-24', '20:05', 56.00, NULL);
INSERT INTO `t_schedule` VALUES (86, 33, 7, '1号激光厅', '2019-7-30', '16:05', 83.00, NULL);
INSERT INTO `t_schedule` VALUES (87, 13, 8, '1号激光厅', '2019-7-24', '16:05', 77.00, '[25,26,36,35,45,46,37,34]');
INSERT INTO `t_schedule` VALUES (88, 3, 6, '1号激光厅', '2019-7-23', '20:05', 53.00, NULL);
INSERT INTO `t_schedule` VALUES (89, 34, 5, '2号激光厅', '2019-7-31', '20:05', 45.00, NULL);
INSERT INTO `t_schedule` VALUES (90, 10, 2, '1号激光厅', '2019-11-30', '12:05', 56.00, NULL);
INSERT INTO `t_schedule` VALUES (91, 18, 5, '2号激光厅', '2019-7-25', '20:05', 78.00, NULL);
INSERT INTO `t_schedule` VALUES (92, 7, 1, '1号激光厅', '2019-8-31', '16:05', 89.00, NULL);
INSERT INTO `t_schedule` VALUES (93, 8, 6, '1号激光厅', '2019-9-30', '20:05', 49.00, '[]');
INSERT INTO `t_schedule` VALUES (94, 9, 2, '1号激光厅', '2019-7-30', '16:05', 45.00, NULL);
INSERT INTO `t_schedule` VALUES (95, 5, 4, '1号激光厅', '2019-7-25', '12:05', 34.00, NULL);
INSERT INTO `t_schedule` VALUES (96, 35, 2, '1号激光厅', '2019-7-24', '16:05', 34.00, NULL);
INSERT INTO `t_schedule` VALUES (98, 38, 2, '1号激光厅', '2019-7-17', '16:05', 45.00, NULL);
INSERT INTO `t_schedule` VALUES (99, 8, 7, '1号激光厅', '2019-9-30', '16:05', 45.00, NULL);
INSERT INTO `t_schedule` VALUES (100, 8, 7, '1号激光厅', '2019-10-1', '20:05', 40.00, NULL);
INSERT INTO `t_schedule` VALUES (101, 4, 7, '1号激光厅', '2019-8-9', '20:05', 45.00, NULL);

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `user_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `user_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户名',
  `avatar` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户头像',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户密码',
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户手机号码',
  `sex` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户性别',
  `birthday` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户出生年月日',
  `sign` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户签名',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 55 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES (1, 'LyuJ1ong', '/images/avatar/man.jpg', '123456', '13414850282', '男', '2019-8-12', '我命由我不由天');
INSERT INTO `t_user` VALUES (19, '张三', '/images/avatar/1557241550286.jpg', '123', '13423232323', '男', '2019-4-8', '66666');
INSERT INTO `t_user` VALUES (23, '13478565555', '/images/avatar/monkey.png', '123456', '13478565555', '男', NULL, '加油');
INSERT INTO `t_user` VALUES (25, '13877777766', '/images/avatar/monkey.png', '123456', '13877777766', '男', NULL, '生而无畏');
INSERT INTO `t_user` VALUES (29, '13482638273', '/images/avatar/monkey.png', '123456', '13482638273', '女', NULL, '向前跑，用尽全部力气');
INSERT INTO `t_user` VALUES (30, '13428372632', '/images/avatar/monkey.png', '123456', '13428372632', '女', NULL, '生活不止眼前的枸杞，还有诗和远方');
INSERT INTO `t_user` VALUES (35, '13457555444', '/images/avatar/monkey.png', '123456', '13457555444', '男', NULL, 'to be');
INSERT INTO `t_user` VALUES (36, '13415656565', '/images/avatar/monkey.png', '123456', '13415656565', '女', NULL, 'Oh');
INSERT INTO `t_user` VALUES (37, '13428273363', '/images/avatar/monkey.png', '123456', '13428273363', '女', NULL, 'JavaScript');
INSERT INTO `t_user` VALUES (44, '小李', '/images/avatar/monkey.png', '123456', '13414232321', '男', NULL, '一起加油');
INSERT INTO `t_user` VALUES (46, '王大锤', '/images/avatar/1557241132762.jpg', '123456', '13412121211', '男', '1990-06-16', '开心就好');
INSERT INTO `t_user` VALUES (48, '大奔', '/images/avatar/monkey.png', '123456', '13414850215', '男', '2019-5-2', '777777');
INSERT INTO `t_user` VALUES (49, '13414851033', '/images/avatar/monkey.png', '123456', '13414851033', '女', NULL, '99999');
INSERT INTO `t_user` VALUES (50, '13672606065', '/images/avatar/monkey.png', '999999', '13672606065', '男', '', '7777777');
INSERT INTO `t_user` VALUES (51, '王五', '/images/avatar/1557474974747.jpg', '123456', '13478343221', '男', '2019-5-1', '66666666666666666666');
INSERT INTO `t_user` VALUES (52, '老王', '/images/avatar/monkey.png', '123', '13414850242', '女', '2019-7-8', '帅');
INSERT INTO `t_user` VALUES (53, '13411111111', '/images/avatar/monkey.png', '123456', '13411111111', NULL, NULL, NULL);
INSERT INTO `t_user` VALUES (54, '13499090909', '/images/avatar/monkey.png', '123456', '13499090909', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for t_wishmovie
-- ----------------------------
DROP TABLE IF EXISTS `t_wishmovie`;
CREATE TABLE `t_wishmovie`  (
  `wishMovie_id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '想看电影id',
  `user_id` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '用户id',
  `movie_id` int(4) UNSIGNED NULL DEFAULT NULL COMMENT '电影id',
  PRIMARY KEY (`wishMovie_id`) USING BTREE,
  INDEX `t_wishmovie_ibfk_1`(`user_id`) USING BTREE,
  INDEX `t_wishmovie_ibfk_2`(`movie_id`) USING BTREE,
  CONSTRAINT `t_wishmovie_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t_wishmovie_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `t_movie` (`movie_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 118 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_wishmovie
-- ----------------------------
INSERT INTO `t_wishmovie` VALUES (74, 1, 20);
INSERT INTO `t_wishmovie` VALUES (76, 1, 9);
INSERT INTO `t_wishmovie` VALUES (77, 46, 13);
INSERT INTO `t_wishmovie` VALUES (78, 1, 17);
INSERT INTO `t_wishmovie` VALUES (79, 1, 33);
INSERT INTO `t_wishmovie` VALUES (82, 50, 13);
INSERT INTO `t_wishmovie` VALUES (83, 50, 5);
INSERT INTO `t_wishmovie` VALUES (84, 50, 8);
INSERT INTO `t_wishmovie` VALUES (85, 50, 29);
INSERT INTO `t_wishmovie` VALUES (86, 50, 12);
INSERT INTO `t_wishmovie` VALUES (87, 50, 6);
INSERT INTO `t_wishmovie` VALUES (88, 25, 20);
INSERT INTO `t_wishmovie` VALUES (89, 25, 29);
INSERT INTO `t_wishmovie` VALUES (90, 25, 34);
INSERT INTO `t_wishmovie` VALUES (91, 29, 29);
INSERT INTO `t_wishmovie` VALUES (92, 29, 9);
INSERT INTO `t_wishmovie` VALUES (93, 29, 34);
INSERT INTO `t_wishmovie` VALUES (95, 23, 3);
INSERT INTO `t_wishmovie` VALUES (96, 1, 35);
INSERT INTO `t_wishmovie` VALUES (110, 1, 15);
INSERT INTO `t_wishmovie` VALUES (112, 1, 13);
INSERT INTO `t_wishmovie` VALUES (115, 1, 12);
INSERT INTO `t_wishmovie` VALUES (116, 1, 8);
INSERT INTO `t_wishmovie` VALUES (117, 1, 7);
INSERT INTO `t_wishmovie` VALUES (118, 1, 10);

SET FOREIGN_KEY_CHECKS = 1;
