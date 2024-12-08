# 1.项目目录结构

├── public/            # 静态资源文件夹 (不经过 webpack 处理)

│  ├── index.html         # 入口 HTML 文件

│  ├── favicon.ico        # 网站图标

│  └── robots.txt        # 搜索引擎爬虫协议 (可选)

├── src/              # 源代码文件夹

│  ├── assets/          # 静态资源文件夹 (经过 webpack 处理)

│  │  ├── images/        # 图片资源

│  │  │  ├── banner/      # Banner 图片

│  │  │  ├── scenic/      # 校园风光图片

│  │  │  ├── architecture/   # 建筑风貌图片

│  │  │  ├── activities/    # 文化活动图片

│  │  │  ├── achievements/   # 学术成果图片

│  │  │  └── common/      # 公共图片 (logo, 图标等)

│  │  ├── styles/        # 样式文件

│  │  │  ├── common/      # 公共样式 (全局样式，变量，mixins)

│  │  │  │  ├── _variables.scss # SCSS 变量

│  │  │  │  ├── _mixins.scss   # SCSS mixins

│  │  │  │  ├── _reset.scss   # 重置样式

│  │  │  │  └── index.scss    # 公共样式入口

│  │  │  ├── components/    # 组件样式

│  │  │  │  ├── Carousel.scss

│  │  │  │  ├── ImageGallery.scss

│  │  │  │  └── ...

│  │  │  ├── views/       # 页面样式

│  │  │  │  ├── Home.scss

│  │  │  │  ├── ScenicCampus.scss

│  │  │  │  └── ...

│  │  │  └── main.scss     # 主样式入口文件

│  │  └── fonts/        # 字体文件

│  ├── components/        # 可复用组件文件夹

│  │  ├── common/        # 通用组件

│  │  │  ├── AppHeader.vue   # 头部导航

│  │  │  ├── AppFooter.vue   # 页脚

│  │  │  ├── Loading.vue    # 加载中组件

│  │  │  ├── ErrorMessage.vue  # 错误提示组件

│  │  │  └── ...

│  │  ├── Carousel.vue      # 轮播图组件

│  │  ├── ImageGallery.vue    # 图片画廊组件

│  │  ├── MapNavigation.vue   # 地图导航组件

│  │  ├── NewsList.vue      # 新闻列表组件

│  │  ├── BuildingCard.vue    # 建筑卡片组件

│  │  ├── ActivityCard.vue    # 活动卡片组件

│  │  ├── AchievementCard.vue  # 学术成果卡片组件

│  │  └── ...          # 其他业务相关组件

│  ├── views/          # 页面组件文件夹

│  │  ├── Home.vue        # 首页

│  │  ├── ScenicCampus.vue    # 校园风光

│  │  ├── ArchitecturalStyle.vue  # 建筑风貌

│  │  ├── CulturalActivities.vue  # 校园文化活动

│  │  ├── AcademicAchievements.vue # 学术成果

│  │  ├── CampusMap.vue      # 校园地图

│  │  ├── About.vue        # 关于我们 (可选)

│  │  ├── Contact.vue       # 联系我们 (可选)

│  │  └── ...          # 其他页面

│  ├── router/          # 路由配置文件夹

│  │  ├── index.js       # 路由配置文件

│  │  └── routes.js       # 路由配置 (可选，拆分路由配置)

│  ├── store/           # Vuex 状态管理 (可选)

│  │  ├── index.js

│  │  ├── modules/

│  │  │  ├── scenic.js     # 校园风光状态模块

│  │  │  ├── architecture.js  # 建筑风貌状态模块

│  │  │  ├── activity.js    # 文化活动状态模块

│  │  │  ├── achievement.js   # 学术成果状态模块

│  │  │  └── ...

│  │  ├── getters.js       # getters

│  │  ├── actions.js       # actions

│  │  ├── mutations.js      # mutations

│  │  └── types.js        # mutation types

│  ├── services/         # API 服务封装文件夹

│  │  ├── api.js        # API 接口封装

│  │  ├── scenic.js       # 校园风光相关 API

│  │  ├── architecture.js    # 建筑风貌相关 API

│  │  ├── activity.js      # 文化活动相关 API

│  │  ├── achievement.js     # 学术成果相关 API

│  │  └── ...

│  ├── utils/          # 工具函数文件夹

│  │  ├── request.js      # 封装 axios 请求

│  │  ├── auth.js        # 认证相关 (可选)

│  │  ├── validate.js      # 表单验证 (可选)

│  │  ├── date.js        # 日期格式化 (可选)

│  │  └── ...

│  ├── App.vue         # 根组件

│  ├── main.js         # 入口文件

│  └── permission.js       # 权限控制 (可选)

├── .env.development       # 开发环境配置文件

├── .env.production        # 生产环境配置文件

├── vue.config.js         # Vue CLI 配置文件

├── babel.config.js        # Babel 配置文件

├── postcss.config.js       # PostCSS 配置文件 (可选)

├── package.json

├── package-lock.json

# 2.项目运行命令

```bash\
npm run serve
```

![image-20241208094738377](./../../../AppData/Roaming/Typora/typora-user-images/image-20241208094738377.png)
