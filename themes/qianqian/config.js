/**
 * 千浅主题 v2.0 配置 - 现代化设计升级
 * 参考 dewx.top 风格 - 现代化杂志布局
 */
const CONFIG = {
    // 大陆网络优化：关闭重型特效（可按需开启）
    QIANQIAN_EFFECTS_ENABLE: false,
    PROXIO_WELCOME_COVER_ENABLE: true, //是否显示页面进入的欢迎文字
    PROXIO_WELCOME_TEXT: '进入千逐的构建现场：AI Product · Systems · Community', // 欢迎文字，留空则不启用

    // 英雄区块导航
    PROXIO_HERO_ENABLE: true, // 开启英雄区
    PROXIO_HERO_STATUS_TEXT: '持续构建中 · Product × Systems × Community',
    PROXIO_HERO_SLOGAN: 'AI Product Builder · System Thinker · Community Connector',
    PROXIO_HERO_TITLE_1: '千逐 / qianzhu / Lucien', // 英雄区文字
    PROXIO_HERO_TITLE_2:
        '你好，我是千逐。我在产品、技术与社区的交叉处持续构建：一边做 AI 产品与 MVP，一边亲手搭系统、跑工作流、验证真实场景，也在探索 AI × Web3 与开放协作网络的可能性。', // 英雄区文字
    PROXIO_HERO_MOBILE_SUMMARY:
        '你好，我是千逐。构建 AI 产品、系统与社区，探索 AI × Web3 的开放可能。',
    // 英雄区按钮，如果TEXT留空则隐藏按钮
    PROXIO_HERO_BUTTON_1_TEXT: '关于我', // 英雄区按钮
    PROXIO_HERO_BUTTON_1_URL:
        '#team', // 英雄区按钮，跳转到首页“关于我”区块
    PROXIO_HERO_BUTTON_2_TEXT: '查看文章', // 英雄区按钮
    PROXIO_HERO_BUTTON_2_URL: '#latest', // 英雄区按钮
    PROXIO_HERO_BUTTON_2_ICON: '', // 英雄区按钮2的图标，不需要则留空
    PROXIO_HERO_BUTTON_3_TEXT: '与我连接',
    PROXIO_HERO_BUTTON_3_URL: 'mailto:qianzhuxue@gmail.com',
    PROXIO_HERO_FEATURE_CARDS: [
        {
            title: 'AI Product',
            items: ['需求分析', '链路设计', 'MVP 推进']
        },
        {
            title: 'Agentic Engineering',
            items: ['AI Coding', '工作流搭建', '自动化实验']
        },
        {
            title: 'Community Practice',
            items: ['校园连接', '社群组织', '活动协作']
        },
        {
            title: 'Open Systems',
            items: ['AI × Web3', '去中心化协作', '开放网络探索']
        }
    ],

    // 英雄区配图，如需隐藏，改为空值即可 ''
    PROXIO_HERO_BANNER_IMAGE: '/images/hero-jade.svg', // hero区背景，默认是获取Notion背景，如需另外配置图片可以填写在这里
    // qianqian 风格：提高可读性与质感
    PROXIO_HERO_OVERLAY_ENABLE: true,
    PROXIO_HERO_OVERLAY_COLOR: 'rgba(33,73,68,0.28)',
    PROXIO_HERO_TEXT_SHADOW: true,
    PROXIO_HERO_BANNER_IFRAME_URL: '', // hero背景区内嵌背景网页 ，可以配置一个网页地址，例如动画网页https://my.spline.design/untitled-b0c6e886227646c34afc82cdc6de4ca2/


    // 文章区块
    PROXIO_BLOG_ENABLE: true, // 首页博文区块开关
    PROXIO_BLOG_TITLE: 'Selected Writing',
    PROXIO_BLOG_COUNT: 6, // 首页博文区块展示前6篇文章（两行 * 3列）
    PROXIO_BLOG_TEXT_1: '最近的实践记录与文章',

    // 首页网格交互背景
    PROXIO_GRID_BG_ENABLE: true,

    // 区块默认内容显示文章的summary文本，但也支持用自定义图片或logo德国替换掉占位显示内容
    PROXIO_BLOG_PLACEHOLDER_IMG_URL_1: '', // 填写要替换成的图片，支持图床或直接上传到项目中，示例  /images/feature-1.webp
    PROXIO_BLOG_PLACEHOLDER_IMG_URL_2: '',
    PROXIO_BLOG_PLACEHOLDER_IMG_URL_3: '',
    PROXIO_BLOG_PLACEHOLDER_IMG_URL_4: '',


    PROXIO_ANNOUNCEMENT_ENABLE: true, //公告文字区块

    // 特性区块
    PROXIO_FEATURE_ENABLE: false, // 特性区块开关
    PROXIO_FEATURE_TITLE: '为什么选我',
    PROXIO_FEATURE_TEXT_1: '我能让您的项目焕发光彩',
    PROXIO_FEATURE_TEXT_2:
        '丰富的案例经验，专业的技术服务，优质的沟通效率',

    // 特性1
    PROXIO_FEATURE_1_ICON_CLASS: 'fa-solid fa-stopwatch', // fas图标
    PROXIO_FEATURE_1_ICON_IMG_URL: '', // 图片图标选填，默认是fas图标，如果需要图片图标可以填写图片地址，示例/avatar.png
    PROXIO_FEATURE_1_TITLE_1: '高效工作流程',
    PROXIO_FEATURE_1_TEXT_1: '精简的设计流程确保快速交付，在紧迫的工期下仍能保证品质与细节不打折扣。',

    PROXIO_FEATURE_2_ICON_CLASS: 'fa-solid fa-comments',
    PROXIO_FEATURE_2_ICON_IMG_URL: '', 
    PROXIO_FEATURE_2_TITLE_1: '协作式流程',
    PROXIO_FEATURE_2_TEXT_1: '与你紧密合作，融合反馈意见，打造超越预期的设计',

    PROXIO_FEATURE_3_ICON_CLASS: 'fa-solid fa-search',
    PROXIO_FEATURE_2_ICON_IMG_URL: '',
    PROXIO_FEATURE_3_TITLE_1: '细节把控',
    PROXIO_FEATURE_3_TEXT_1: '精益求精雕琢每个元素，确保成品精致统一，令人过目难忘',

    PROXIO_FEATURE_BUTTON_TEXT: '了解更多', // 按钮文字
    PROXIO_FEATURE_BUTTON_URL: 'https://github.com/tangly1024/NotionNext', // 按钮跳转

    // 首页生涯区块
    PROXIO_CAREER_ENABLE: true, // 区块开关
    PROXIO_CAREER_TITLE: '实践记录',
    PROXIO_CAREER_TEXT:
        '从 AI 产品到开放系统的实践记录',

    // 生涯内容卡牌 ，title是标题 ，bio是备注，text是详情
    PROXIO_CAREERS: [
        {
            title: 'AI Product / MVP',
            bio: '从需求、链路到原型推进',
            text: '关注真实场景与实际可用性，记录从想法到产品的构建过程。'
        },
        {
            title: 'Community / Collaboration',
            bio: '连接校园、社群与活动现场',
            text: '在组织与协作中观察真实需求，让产品、社区与反馈形成闭环。'
        },
        {
            title: 'Open Systems / AI × Web3',
            bio: '探索代理、身份与任务网络',
            text: '关注开放协议、节点协作与去中心化关系，思考系统如何在开放环境中持续生长。'
        }
    ],

    // 首页用户测评区块
    PROXIO_TESTIMONIALS_ENABLE: false, // 测评区块开关
    PROXIO_TESTIMONIALS_TITLE: '用户反馈',
    PROXIO_TESTIMONIALS_TEXT_1: '我们的用户怎么说',
    PROXIO_TESTIMONIALS_TEXT_2:
        '数千位站长选择用NotionNext搭建他们的网站,通过帮助手册、交流社群以及技术咨询，大家成功上线了自己的网站',

    // 用户测评处的跳转按钮
    PROXIO_TESTIMONIALS_BUTTON_URL: '/about',
    PROXIO_TESTIMONIALS_BUTTON_TEXT: '联系我',

    // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
    PROXIO_TESTIMONIALS_ITEMS: [
        {
            PROXIO_TESTIMONIALS_ITEM_TEXT:
                '感谢大佬的方法。之前尝试过Super、Potion等国外的第三方平台，实现效果一般，个性化程度远不如这个方法，已经用起来了！ ',
            PROXIO_TESTIMONIALS_ITEM_AVATAR:
                'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F22de3fcb-d90d-4271-bc01-f815f476122b%2F4FE0A0C0-E487-4C74-BF8E-6F01A27461B8-14186-000008094BC289A6.jpg?table=collection&id=a320a2cc-6ebe-4a8d-95cc-ea94e63bced9&width=200',
            PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'Ryan_G',
            PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: 'Ryan`Log 站长',
            PROXIO_TESTIMONIALS_ITEM_URL: 'https://blog.gaoran.xyz/'
        },
        {
            PROXIO_TESTIMONIALS_ITEM_TEXT:
                '很喜欢这个主题，本代码小白用三天台风假期搭建出来了，还根据大佬的教程弄了自定义域名，十分感谢，已请喝咖啡~',
            PROXIO_TESTIMONIALS_ITEM_AVATAR:
                'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0d33d169-f932-41ff-ac6b-88a923c08e02%2F%25E5%25A4%25B4%25E5%2583%258F.jfif?table=collection&id=7787658d-d5c0-4f34-8e32-60c523dfaba3&width=400',
            PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'Asenkits',
            PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '阿森的百宝袋 站长',
            PROXIO_TESTIMONIALS_ITEM_URL: 'https://asenkits.top/'
        },
        {
            PROXIO_TESTIMONIALS_ITEM_TEXT:
                '呜呜呜，经过一个下午的努力，终于把博客部署好啦，非常感谢Tangly1024大佬的框架和教程，这是我有生之年用过的最好用的博客框架┭┮﹏┭┮。从今之后，我就可以在自己的博客里bb啦，( •̀ ω •́ )y ',
            PROXIO_TESTIMONIALS_ITEM_AVATAR:
                '/avatar.png',
            PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'DWIND',
            PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '且听风吟 站长',
            PROXIO_TESTIMONIALS_ITEM_URL: 'https://www.dwind.top/'
        },
        {
            PROXIO_TESTIMONIALS_ITEM_TEXT:
                '感谢提供这么好的项目哈哈 之前一直不知道怎么部署(别的项目好难好复杂)这个相对非常简单 新手非常友好哦',
            PROXIO_TESTIMONIALS_ITEM_AVATAR:
                'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd52f6766-3e32-4c3d-8529-46e1f214360f%2Ffavicon.svg?table=collection&id=7d76aad5-a2c4-4d9a-887c-c7913fae4eed&width=400',
            PROXIO_TESTIMONIALS_ITEM_NICKNAME: '迪升disheng ',
            PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: 'AI资源分享 Blog',
            PROXIO_TESTIMONIALS_ITEM_URL: 'https://blog.disheng.org/'
        },
        {
            PROXIO_TESTIMONIALS_ITEM_TEXT:
                '灰常感谢大佬的博客项目，能将博客和notion结合起来，这一直是我挺期待的博客模式。',
            PROXIO_TESTIMONIALS_ITEM_AVATAR:
                '/avatar.png',
            PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'AnJhon',
            PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: 'Anjhon`s Blog 站长',
            PROXIO_TESTIMONIALS_ITEM_URL: 'https://www.anjhon.top'
        },
        {
            PROXIO_TESTIMONIALS_ITEM_TEXT: '用好久了，太感谢了',
            PROXIO_TESTIMONIALS_ITEM_AVATAR:
                '/avatar.png',
            PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'LUCEN',
            PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: 'LUCEN考验辅导 站长',
            PROXIO_TESTIMONIALS_ITEM_URL: 'https://www.lucenczz.top/'
        }
    ],

    //   FAQ 常见问题模块
    PROXIO_FAQ_ENABLE: false, // 常见问题模块开关
    PROXIO_FAQ_TITLE: '常见问题解答',
    PROXIO_FAQ_TEXT_1: '有任何问题吗？请看这里',
    PROXIO_FAQ_TEXT_2: '我们收集了常见的用户疑问',
    PROXIO_FAQS: [
        { q: 'NotionNext有帮助文档吗？', a: 'NotionNext提供了<a href="https://docs.tangly1024.com/about" className="underline">帮助文档</a>，操作<a href="https://www.bilibili.com/video/BV1fM4y1L7Qi/" className="underline">演示视频</a>，以及<a href="https://docs.tangly1024.com/article/chat-community" className="underline">交流社群</a>来协助您完成网站的搭建部署' },
        { q: '部署后要如何编写文章？', a: '您可以在Notion中之间添加或修改类型为Post的页面，内容将被实时同步在站点中，详情参考<a className="underline" href="https://docs.tangly1024.com/article/start-to-write">《帮助文档》</a>' },
        { q: '站点部署失败，更新失败？', a: '通常是配置修改错误导致，请检查配置或者重试操作步骤，或者通过Vercel后台的Deployments中找到错误日志，并向网友求助' },
        { q: '文章没有实时同步？', a: '先检查Notion_Page_ID是否正确配置，其次由于博客的每个页面都有独立缓存，刷新网页后即可解决' },
    ],

    // 关于作者区块
    PROXIO_ABOUT_ENABLE: true, // 关于作者区块区块开关
    PROXIO_ABOUT_TITLE: '关于我',
    PROXIO_ABOUT_TEXT_1: '我习惯站在产品、技术与社区的交叉点思考问题',
    PROXIO_ABOUT_TEXT_2:
        '我是千逐，也使用 qianzhu / Lucien 这个名字。我习惯站在产品、技术与社区的交叉点思考问题：既关心需求和用户，也关心系统如何被真正搭起来、跑起来，并在真实反馈中不断迭代。现在我主要关注三件事：AI 产品与 Agentic Engineering、社区驱动的协作实践，以及 AI × Web3 与开放系统探索。',
    PROXIO_ABOUT_PHOTO_URL: 'https://imagehost.qianzhu.online/api/rfile/千逐（卡通版）.jpg',
    PROXIO_ABOUT_KEY_1: 'AI Product',
    PROXIO_ABOUT_VAL_1: '需求分析 · Rapid MVP',
    PROXIO_ABOUT_KEY_2: 'Agentic Engineering',
    PROXIO_ABOUT_VAL_2: 'AI Coding · Workflow Design',
    PROXIO_ABOUT_KEY_3: 'Community Practice',
    PROXIO_ABOUT_VAL_3: '校园连接 · 社群组织',
    PROXIO_ABOUT_KEY_4: 'Open Systems',
    PROXIO_ABOUT_VAL_4: 'AI × Web3 · Networks',

    PROXIO_ABOUT_BUTTON_URL: '',
    PROXIO_ABOUT_BUTTON_TEXT: '',

    // 横向滚动文字
    PROXIO_BRANDS_ENABLE: true, // 滚动文字
    PROXIO_BRANDS: [
        'AI Product',
        'Agentic Engineering',
        'Workflow Design',
        'Rapid MVP',
        'Community Collaboration',
        'Hackathon',
        'Open Systems',
        'AI × Web3',
        'Decentralized Networks',
        'System Thinking'
    ],

    PROXIO_FOOTER_SLOGAN:
        'Building AI-native products, systems, and community-driven networks.',

    // 页脚三列菜单组
    // 页脚菜单
    // 去除作者广告链接，仅保留个人相关内容（若有）
    PROXIO_FOOTER_LINKS: [],

    PROXIO_FOOTER_BLOG_LATEST_TITLE: '最新文章',

    PROXIO_FOOTER_PRIVACY_POLICY_TEXT: '隐私政策',
    PROXIO_FOOTER_PRIVACY_POLICY_URL: '/privacy-policy',

    PROXIO_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: '法律声明',
    PROXIO_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '/legacy-notice',

    PROXIO_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: '服务协议',
    PROXIO_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '/terms-of-use',

    // 页脚显示开关
    PROXIO_FOOTER_POWEREDBY_ENABLE: false, // 是否显示 Powered by NotionNext
    PROXIO_FOOTER_BUSUANZI_ENABLE: true, // 是否显示站点 PV/UV（Busuanzi）

    // 404页面的提示语
    PROXIO_404_TITLE: '我们似乎找不到您要找的页面。',
    PROXIO_404_TEXT: '抱歉！您要查找的页面不存在。可能已经移动或删除。',
    PROXIO_404_BACK: '回到主页',

    // 页面底部的行动呼吁模块
    PROXIO_CTA_ENABLE: true,
    PROXIO_CTA_TITLE: '与我链接',
    PROXIO_CTA_TITLE_2: '一起构建产品、系统与开放协作网络',
    PROXIO_CTA_DESCRIPTION:
        '如果你也在做 AI 产品、工作流自动化、社区实践，或者对 AI × Web3、去中心化协作网络感兴趣，欢迎来聊。我更愿意和真正做事的人一起，把想法推进成可运行的东西。',
    PROXIO_CTA_BUTTON: true, // 是否显示按钮
    PROXIO_CTA_BUTTON_URL:
        'mailto:qianzhuxue@gmail.com',
    PROXIO_CTA_BUTTON_TEXT: '发邮件给我',

    PROXIO_POST_REDIRECT_ENABLE: true, // 默認開啟重定向
    PROXIO_POST_REDIRECT_URL: 'https://blog.tangly1024.com', // 重定向域名
    PROXIO_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_PROXIO_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
