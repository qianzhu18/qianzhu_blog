/**
 * 悬浮在网页上的挂件
 */
module.exports = {
  THEME_SWITCH: false, // 是否显示切换主题按钮（根据需求关闭）
  // Chatbase 是否显示chatbase机器人 https://www.chatbase.co/
  CHATBASE_ID: process.env.NEXT_PUBLIC_CHATBASE_ID || null,
  // WebwhizAI 机器人 @see https://github.com/webwhiz-ai/webwhiz
  WEB_WHIZ_ENABLED: process.env.NEXT_PUBLIC_WEB_WHIZ_ENABLED || false, // 是否显示
  WEB_WHIZ_BASE_URL:
    process.env.NEXT_PUBLIC_WEB_WHIZ_BASE_URL || 'https://api.webwhiz.ai', // 可以自建服务器
  WEB_WHIZ_CHAT_BOT_ID: process.env.NEXT_PUBLIC_WEB_WHIZ_CHAT_BOT_ID || null, // 在后台获取ID
  DIFY_CHATBOT_ENABLED: process.env.NEXT_PUBLIC_DIFY_CHATBOT_ENABLED || false,
  DIFY_CHATBOT_BASE_URL: process.env.NEXT_PUBLIC_DIFY_CHATBOT_BASE_URL || '',
  DIFY_CHATBOT_TOKEN: process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN || '',

  // 悬浮挂件
  WIDGET_PET: false, // 是否显示宠物挂件（为大陆网络优化默认关闭）
  WIDGET_PET_LINK:
    'https://cdn.jsdelivr.net/npm/live2d-widget-model-haru@1.0.5/02/assets/haru02.model.json', // 默认使用和风配色的 Haru 模型；可改为任意模型 jsonPath
  WIDGET_PET_SWITCH_THEME:
    process.env.NEXT_PUBLIC_WIDGET_PET_SWITCH_THEME || false, // 点击宠物挂件切换博客主题
  // 是否显示桌宠控制面板（对齐 dewx.top 建议关闭）
  WIDGET_PET_PANEL: process.env.NEXT_PUBLIC_WIDGET_PET_PANEL || false,
  // 水墨风模式：统一黑白灰 + 低饱和
  WIDGET_PET_INK_MODE: process.env.NEXT_PUBLIC_WIDGET_PET_INK_MODE || false,
  // 仅在指定路径前缀显示桌宠（以逗号分隔多个前缀，如：/podcast,/category/播客）空字符串表示全站显示
  WIDGET_PET_PATHS: process.env.NEXT_PUBLIC_WIDGET_PET_PATHS || '',
  // 视觉/行为增强参数
  WIDGET_PET_WIDTH: process.env.NEXT_PUBLIC_WIDGET_PET_WIDTH || 340,
  WIDGET_PET_HEIGHT: process.env.NEXT_PUBLIC_WIDGET_PET_HEIGHT || 380,
  WIDGET_PET_POSITION: process.env.NEXT_PUBLIC_WIDGET_PET_POSITION || 'right', // left|right
  WIDGET_PET_H_OFFSET: process.env.NEXT_PUBLIC_WIDGET_PET_H_OFFSET || 28,
  WIDGET_PET_V_OFFSET: process.env.NEXT_PUBLIC_WIDGET_PET_V_OFFSET || 24,
  WIDGET_PET_DRAGGABLE: process.env.NEXT_PUBLIC_WIDGET_PET_DRAGGABLE || true,
  WIDGET_PET_MOBILE: process.env.NEXT_PUBLIC_WIDGET_PET_MOBILE || false,
  WIDGET_PET_OPACITY: process.env.NEXT_PUBLIC_WIDGET_PET_OPACITY || 0.95,
  WIDGET_PET_FIRST_VISIT_ANIM: process.env.NEXT_PUBLIC_WIDGET_PET_FIRST_VISIT_ANIM || true,
  WIDGET_PET_IDLE_FADE: process.env.NEXT_PUBLIC_WIDGET_PET_IDLE_FADE || true,
  WIDGET_PET_MINIMIZE_BTN: process.env.NEXT_PUBLIC_WIDGET_PET_MINIMIZE_BTN || true,
  // 水墨风默认滤镜（可被 env 覆盖）
  WIDGET_PET_CSS_FILTER: process.env.NEXT_PUBLIC_WIDGET_PET_CSS_FILTER || 'drop-shadow(0 18px 40px rgba(47, 92, 86, 0.28)) hue-rotate(140deg) saturate(1.1) brightness(0.92)',
  // 避免覆盖上面的滤镜，这里默认不再设置 filter，如需阴影请在 Notion 中自定义
  WIDGET_PET_CANVAS_STYLE: process.env.NEXT_PUBLIC_WIDGET_PET_CANVAS_STYLE || '',
  // 交互灵敏度（更克制）
  WIDGET_PET_HOVER_RADIUS: process.env.NEXT_PUBLIC_WIDGET_PET_HOVER_RADIUS || 110,
  WIDGET_PET_HOVER_SCALE: process.env.NEXT_PUBLIC_WIDGET_PET_HOVER_SCALE || 1.03,
  WIDGET_PET_LOOK_AMPLITUDE: process.env.NEXT_PUBLIC_WIDGET_PET_LOOK_AMPLITUDE || 4,

  SPOILER_TEXT_TAG: process.env.NEXT_PUBLIC_SPOILER_TEXT_TAG || '', // Spoiler文本隐藏功能，如Notion中 [sp]希望被spoiler的文字[sp]，填入[sp] 即可

  // 音乐播放插件（默认关闭，避免界面干扰）
  MUSIC_PLAYER: false, // 是否使用音乐播放插件
  MUSIC_PLAYER_VISIBLE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_VISIBLE || false, // 是否在左下角显示播放和切换
  MUSIC_PLAYER_AUTO_PLAY:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_AUTO_PLAY || false, // 是否自动播放（默认关闭）
  MUSIC_PLAYER_LRC_TYPE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_LRC_TYPE || '0', // 歌词显示类型，可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）（前提是有配置歌词路径，对 meting 无效）
  MUSIC_PLAYER_CDN_URL:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_CDN_URL ||
    'https://cdn.jsdelivr.net/npm/aplayer@1.10.0/dist/APlayer.min.js',
  MUSIC_PLAYER_ORDER: process.env.NEXT_PUBLIC_MUSIC_PLAYER_ORDER || 'list', // 默认播放方式，顺序 list，随机 random
  MUSIC_PLAYER_AUDIO_LIST: [
    // 示例音乐列表。除了以下配置外，还可配置歌词，具体配置项看此文档 https://aplayer.js.org/#/zh-Hans/
    {
      name: '风を共に舞う気持ち',
      artist: 'Falcom Sound Team jdk',
      url: 'https://music.163.com/song/media/outer/url?id=731419.mp3',
      cover:
        'https://p2.music.126.net/kn6ugISTonvqJh3LHLaPtQ==/599233837187278.jpg'
    },
    {
      name: '王都グランセル',
      artist: 'Falcom Sound Team jdk',
      url: 'https://music.163.com/song/media/outer/url?id=731355.mp3',
      cover:
        'https://p1.music.126.net/kn6ugISTonvqJh3LHLaPtQ==/599233837187278.jpg'
    }
  ],
  MUSIC_PLAYER_METING: process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING || false, // 是否要开启 MetingJS，从平台获取歌单。会覆盖自定义的 MUSIC_PLAYER_AUDIO_LIST，更多配置信息：https://github.com/metowolf/MetingJS
  MUSIC_PLAYER_METING_SERVER:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_SERVER || 'netease', // 音乐平台，[netease, tencent, kugou, xiami, baidu]
  MUSIC_PLAYER_METING_ID:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_ID || '60198', // 对应歌单的 id
  MUSIC_PLAYER_METING_LRC_TYPE:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_LRC_TYPE || '1', // 已废弃！！！可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）

  // 一个小插件展示你的facebook fan page~ @see https://tw.andys.pro/article/add-facebook-fanpage-notionnext
  FACEBOOK_PAGE_TITLE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_TITLE || null, // 邊欄 Facebook Page widget 的標題欄，填''則無標題欄 e.g FACEBOOK 粉絲團'
  FACEBOOK_PAGE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || null, // Facebook Page 的連結 e.g https://www.facebook.com/tw.andys.pro
  FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '', // Facebook Page ID 來啟用 messenger 聊天功能
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '' // Facebook App ID 來啟用 messenger 聊天功能 获取: https://developers.facebook.com/
}
