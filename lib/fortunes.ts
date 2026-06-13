export type FortuneTier =
  | "supreme"
  | "great"
  | "good"
  | "fair"
  | "small"
  | "neutral"
  | "ominous";

export interface DailyFortune {
  id: string;
  tier: FortuneTier;
  tierLabel: string;
  name: string;
  oracle: string;
  advice: string;
}

const TIER_WEIGHTS: Record<FortuneTier, number> = {
  supreme: 3,
  great: 10,
  good: 22,
  fair: 28,
  small: 25,
  neutral: 10,
  ominous: 2,
};

export const FORTUNE_TIER_STYLES: Record<
  FortuneTier,
  { border: string; glow: string; label: string }
> = {
  supreme: {
    border: "fortune-tier-supreme",
    glow: "fortune-glow-supreme",
    label: "至尊大吉",
  },
  great: {
    border: "fortune-tier-great",
    glow: "fortune-glow-great",
    label: "大吉",
  },
  good: {
    border: "fortune-tier-good",
    glow: "fortune-glow-good",
    label: "吉",
  },
  fair: {
    border: "fortune-tier-fair",
    glow: "fortune-glow-fair",
    label: "中吉",
  },
  small: {
    border: "fortune-tier-small",
    glow: "fortune-glow-small",
    label: "小吉",
  },
  neutral: {
    border: "fortune-tier-neutral",
    glow: "fortune-glow-neutral",
    label: "末吉",
  },
  ominous: {
    border: "fortune-tier-ominous",
    glow: "fortune-glow-ominous",
    label: "凶",
  },
};

/** Built-in daily fortune pool — sci-fi themed for 量子余烬 */
export const DAILY_FORTUNES: DailyFortune[] = [
  {
    id: "quantum-blessing",
    tier: "supreme",
    tierLabel: "至尊大吉",
    name: "量子神谕",
    oracle: "意识与余烬同频，今日你所思之事将借概率之潮靠岸。",
    advice: "把最想写的一句台词发出来，宇宙会帮你补全后半段。",
  },
  {
    id: "entropy-reversal",
    tier: "supreme",
    tierLabel: "至尊大吉",
    name: "熵逆奇点",
    oracle: "混乱退潮，灵感如恒星坍缩后重生，亮得刺眼。",
    advice: "适合开新帖、抛脑洞，读者反馈会格外热烈。",
  },
  {
    id: "soul-backup",
    tier: "great",
    tierLabel: "大吉",
    name: "灵魂备份",
    oracle: "你的观点将被更多人记住，像数据写入不可擦除的晶格。",
    advice: "认真回复一条长评，可能收获意外共鸣。",
  },
  {
    id: "nebula-rain",
    tier: "great",
    tierLabel: "大吉",
    name: "星云落雨",
    oracle: "今日运势如星尘洒落，小事顺心，大事有转机。",
    advice: "去讨论区逛逛，容易遇见投缘的读者。",
  },
  {
    id: "chrono-fold",
    tier: "great",
    tierLabel: "大吉",
    name: "时褶折叠",
    oracle: "时间在你面前弯了一下，拖延已久的事适合今天推进。",
    advice: "把囤了很久的章节想法整理成帖。",
  },
  {
    id: "photon-trail",
    tier: "great",
    tierLabel: "大吉",
    name: "光子尾迹",
    oracle: "言语有光，你发出的评论会像信标一样被看见。",
    advice: "点赞之余留一句有温度的留言。",
  },
  {
    id: "dark-matter-gift",
    tier: "good",
    tierLabel: "吉",
    name: "暗物质馈赠",
    oracle: "看不见的支持正在聚拢，沉默的读者也在关注你。",
    advice: "不必焦虑数据，持续输出即可。",
  },
  {
    id: "orbit-stable",
    tier: "good",
    tierLabel: "吉",
    name: "轨道稳态",
    oracle: "心绪平稳，适合深度阅读与冷静讨论。",
    advice: "翻翻世界观帖，可能有新启发。",
  },
  {
    id: "code-aurora",
    tier: "good",
    tierLabel: "吉",
    name: "代码极光",
    oracle: "逻辑与想象力同时在线，吐槽也能吐得漂亮。",
    advice: "试试用一句话概括今日阅读感受。",
  },
  {
    id: "wormhole-whisper",
    tier: "good",
    tierLabel: "吉",
    name: "虫洞低语",
    oracle: "远方传来好消息的预兆，可能是章节或设定的惊喜。",
    advice: "关注作者动态，也别忘了表达期待。",
  },
  {
    id: "memory-crystal",
    tier: "good",
    tierLabel: "吉",
    name: "记忆晶体",
    oracle: "旧梗会焕发新意，复读也是一种致敬。",
    advice: "可以回顾早期章节讨论串。",
  },
  {
    id: "gravity-lens",
    tier: "good",
    tierLabel: "吉",
    name: "引力透镜",
    oracle: "你看问题的角度会折射他人未见之光。",
    advice: "适合提出反常识的温和疑问。",
  },
  {
    id: "signal-lock",
    tier: "fair",
    tierLabel: "中吉",
    name: "信号锁定",
    oracle: "运势中等偏上，努力可见，随缘亦可。",
    advice: "签到已完成，去刷两条帖子就算圆满。",
  },
  {
    id: "phase-shift",
    tier: "fair",
    tierLabel: "中吉",
    name: "相位偏移",
    oracle: "小波折不碍大局，像量子噪声里的一次跃迁。",
    advice: "遇到争议评论，先喝口水再回复。",
  },
  {
    id: "stellar-wind",
    tier: "fair",
    tierLabel: "中吉",
    name: "恒星风",
    oracle: "顺风不大，但足以托起一片帆。",
    advice: "适合收藏好帖，改日细读。",
  },
  {
    id: "byte-tide",
    tier: "fair",
    tierLabel: "中吉",
    name: "字节潮汐",
    oracle: "信息流里藏着一条对你有用的线索。",
    advice: "多看「剧情」分类的新讨论。",
  },
  {
    id: "nano-hope",
    tier: "fair",
    tierLabel: "中吉",
    name: "纳米希望",
    oracle: "微小的善意会叠加成可见的幸运。",
    advice: "给新人的评论点个赞。",
  },
  {
    id: "relay-station",
    tier: "fair",
    tierLabel: "中吉",
    name: "中继站",
    oracle: "你不是终点，而是传递火种的节点。",
    advice: "转发好观点，帮帖子保持热度。",
  },
  {
    id: "soft-boot",
    tier: "small",
    tierLabel: "小吉",
    name: "软启动",
    oracle: "运势轻轻抬头，不宜激进，宜小步试探。",
    advice: "发短评即可，不必强求长篇。",
  },
  {
    id: "idle-spin",
    tier: "small",
    tierLabel: "小吉",
    name: "怠速自旋",
    oracle: "能量在积蓄，表面平静内里运转。",
    advice: "今日适合潜水观察，少杠多思。",
  },
  {
    id: "dust-glow",
    tier: "small",
    tierLabel: "小吉",
    name: "尘光",
    oracle: "普通的一天，但普通本身也是一种安稳。",
    advice: "把签到经验攒着，等级会慢慢涨。",
  },
  {
    id: "cache-hit",
    tier: "small",
    tierLabel: "小吉",
    name: "缓存命中",
    oracle: "重复的旧问题，今天可能突然想通。",
    advice: "翻翻自己以前的评论。",
  },
  {
    id: "low-orbit",
    tier: "small",
    tierLabel: "小吉",
    name: "低轨巡航",
    oracle: "运势平平，但轨道安全，无大碍。",
    advice: "按时签到，别断连续天数。",
  },
  {
    id: "echo-delay",
    tier: "neutral",
    tierLabel: "末吉",
    name: "回声延迟",
    oracle: "回应来得慢，不代表没有被听见。",
    advice: "耐心等待，或换帖再试。",
  },
  {
    id: "static-field",
    tier: "neutral",
    tierLabel: "末吉",
    name: "静电场",
    oracle: "小事烦躁，像显示器上的噪点，擦一擦就好。",
    advice: "别在疲惫时参与论战。",
  },
  {
    id: "grey-dawn",
    tier: "neutral",
    tierLabel: "平",
    name: "灰晓",
    oracle: "吉凶难辨，宜守不宜攻，宜读不宜写。",
    advice: "做读者也很好，今日可只看不评。",
  },
  {
    id: "standby-mode",
    tier: "neutral",
    tierLabel: "平",
    name: "待机模式",
    oracle: "宇宙今天让你休息，充电比输出重要。",
    advice: "看看小说正文，论坛可以晚点再来。",
  },
  {
    id: "bit-flip",
    tier: "ominous",
    tierLabel: "凶",
    name: "比特翻转",
    oracle: "运势低迷，言辞易误解，像错位的校验位。",
    advice: "发言前三读，必要时删了重写。",
  },
  {
    id: "void-glitch",
    tier: "ominous",
    tierLabel: "凶",
    name: "虚空 glitch",
    oracle: "今日不宜硬刚设定，容易撞墙。",
    advice: "把尖锐吐槽记进备忘录，改日再发。",
  },
  {
    id: "red-shift",
    tier: "great",
    tierLabel: "大吉",
    name: "红移祝福",
    oracle: "远离之物反而照亮你，旧友或旧帖可能带来惊喜。",
    advice: "去翻「写作建议」区，可能有宝藏。",
  },
  {
    id: "blue-giant",
    tier: "good",
    tierLabel: "吉",
    name: "蓝巨星",
    oracle: "热情应被看见，你的存在本身就有亮度。",
    advice: "给喜欢的角色写一句应援。",
  },
  {
    id: "tensor-bloom",
    tier: "fair",
    tierLabel: "中吉",
    name: "张量花开",
    oracle: "复杂问题会展开成清晰路径，像多维展平。",
    advice: "适合梳理时间线或人物关系。",
  },
  {
    id: "parity-even",
    tier: "small",
    tierLabel: "小吉",
    name: "宇称守恒",
    oracle: "得失对称，少一分运气，多一分清醒。",
    advice: "保持平常心，连续签到最赚。",
  },
  {
    id: "cosmic-latte",
    tier: "good",
    tierLabel: "吉",
    name: "宇宙拿铁",
    oracle: "温吞的好日子，适合慢读与闲聊。",
    advice: "在评论区聊点轻松的。",
  },
  {
    id: "antimatter-joke",
    tier: "fair",
    tierLabel: "中吉",
    name: "反物质笑话",
    oracle: "冷幽默运势上升，梗会意外好笑。",
    advice: "可以发一条不那么严肃的帖。",
  },
  {
    id: "hologram-fish",
    tier: "great",
    tierLabel: "大吉",
    name: "全息鱼群",
    oracle: "众人想法同向游动，你很容易融入讨论浪潮。",
    advice: "参与热门帖，存在感 +1。",
  },
  {
    id: "zero-point",
    tier: "supreme",
    tierLabel: "至尊大吉",
    name: "零点涨落",
    oracle: "真空不空，幸运从最微小的涨落中诞生。",
    advice: "今日第一次尝试的事，成功率意外高。",
  },
  {
    id: "library-ark",
    tier: "good",
    tierLabel: "吉",
    name: "图书馆方舟",
    oracle: "知识运势极佳，读到的都会留下印记。",
    advice: "收藏一篇深度分析帖细读。",
  },
  {
    id: "pulse-star",
    tier: "small",
    tierLabel: "小吉",
    name: "脉冲星",
    oracle: "节奏忽快忽慢，按自己的频率就好。",
    advice: "不必跟风，发你想发的。",
  },
  {
    id: "mirror-universe",
    tier: "neutral",
    tierLabel: "末吉",
    name: "镜像宇宙",
    oracle: "世界略显错位，适合旁观而非下场。",
    advice: "看看就好，别急着站队。",
  },
  {
    id: "solar-sail",
    tier: "fair",
    tierLabel: "中吉",
    name: "太阳帆",
    oracle: "借风力前行，合作比单打独斗更顺。",
    advice: "回复别人时引用原话，讨论更顺。",
  },
  {
    id: "event-horizon",
    tier: "ominous",
    tierLabel: "凶",
    name: "视界边缘",
    oracle: "越接近争议中心，越容易卷入引力乱流。",
    advice: "远离引战话题，保护好心情。",
  },
  {
    id: "fractal-dream",
    tier: "great",
    tierLabel: "大吉",
    name: "分形梦境",
    oracle: "一个灵感可分裂出无数精彩枝杈。",
    advice: "把梦到的设定碎片写下来。",
  },
  {
    id: "quantum-entangle",
    tier: "good",
    tierLabel: "吉",
    name: "量子纠缠",
    oracle: "与某位读者频率莫名同步，互动会很顺。",
    advice: "多回复你常遇见的熟面孔。",
  },
  {
    id: "iron-star",
    tier: "small",
    tierLabel: "小吉",
    name: "铁核星",
    oracle: "运势朴实坚硬，稳扎稳打即可。",
    advice: "经验靠日积月累，别急。",
  },
  {
    id: "data-moss",
    tier: "neutral",
    tierLabel: "平",
    name: "数据苔藓",
    oracle: "缓慢生长的一天，无声但仍在积累。",
    advice: "签到 + 浏览，也算参与论坛生态。",
  },
];

const fortuneById = new Map(DAILY_FORTUNES.map((f) => [f.id, f]));

export function getFortuneById(id: string | null | undefined): DailyFortune | null {
  if (!id) return null;
  return fortuneById.get(id) ?? null;
}

function seededUnit(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

/** Deterministic weighted draw — same user + date always yields same card. */
export function pickDailyFortune(userId: string, date: string): DailyFortune {
  const roll = seededUnit(`${userId}:${date}:fortune`);
  const tiers = Object.keys(TIER_WEIGHTS) as FortuneTier[];
  const totalWeight = tiers.reduce((sum, t) => sum + TIER_WEIGHTS[t], 0);
  let cursor = roll * totalWeight;

  let chosenTier: FortuneTier = "fair";
  for (const tier of tiers) {
    cursor -= TIER_WEIGHTS[tier];
    if (cursor <= 0) {
      chosenTier = tier;
      break;
    }
  }

  const pool = DAILY_FORTUNES.filter((f) => f.tier === chosenTier);
  const index = Math.floor(
    seededUnit(`${userId}:${date}:${chosenTier}`) * pool.length
  );
  return pool[index] ?? DAILY_FORTUNES[0];
}

export function serializeFortune(fortune: DailyFortune) {
  return {
    id: fortune.id,
    tier: fortune.tier,
    tierLabel: fortune.tierLabel,
    name: fortune.name,
    oracle: fortune.oracle,
    advice: fortune.advice,
  };
}
