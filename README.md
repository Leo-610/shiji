# SHIJI — 科幻小说讨论论坛

赛博朋克风格的科幻小说读者讨论论坛 MVP。读者可以匿名或登录后发帖、评论，为作者的小说创作提供建议。

## 功能

- 赛博朋克风格主页（霓虹光效、网格背景、Glitch 标题）
- 讨论区按分类筛选（世界观、章节、角色、剧情、写作建议）
- 发帖与评论（支持 Markdown）
- 可选 GitHub 登录，匿名也可发言
- 登录用户可删除自己的帖子和评论

## 技术栈

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Neon Postgres + Drizzle ORM
- Auth.js v5 (GitHub OAuth)

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写：

```bash
cp .env.example .env.local
```

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | Neon Postgres 连接串 |
| `AUTH_SECRET` | 生成：`openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `AUTH_URL` | `http://localhost:3000` |

### 3. 创建 GitHub OAuth App

1. 打开 https://github.com/settings/developers
2. New OAuth App
3. Homepage URL: `http://localhost:3000`
4. Callback URL: `http://localhost:3000/api/auth/callback/github`

### 4. 初始化数据库

```bash
# 推送 schema 到 Neon
npm run db:push

# 或使用 migration
npm run db:migrate

# 填充预置分类
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit: sci-fi novel discussion forum MVP"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 打开 https://vercel.com/new
2. 导入 GitHub 仓库
3. Framework Preset 选择 Next.js（自动检测）

### 3. 配置 Neon 数据库

1. 在 Vercel 项目 Dashboard → Storage → Create Database → Neon
2. 或手动在 [Neon Console](https://console.neon.tech) 创建项目
3. 将 `DATABASE_URL` 添加到 Vercel 环境变量

### 4. 配置环境变量

在 Vercel Project Settings → Environment Variables 添加：

```
DATABASE_URL=postgresql://...
AUTH_SECRET=<openssl rand -base64 32>
AUTH_GITHUB_ID=<github-client-id>
AUTH_GITHUB_SECRET=<github-client-secret>
AUTH_URL=https://your-domain.vercel.app
```

更新 GitHub OAuth App 的 Callback URL 为：
`https://your-domain.vercel.app/api/auth/callback/github`

### 5. 运行生产数据库 migration

```bash
# 本地设置 DATABASE_URL 为生产数据库后执行
npm run db:push
npm run db:seed
```

### 6. 重新部署

Vercel 会自动在 push 后部署。首次部署后访问你的域名验证功能。

## 项目结构

```
app/                  # 页面与 Server Actions
components/
  cyber/              # 赛博朋克 UI 组件
  discussion/         # 讨论相关组件
  layout/             # 布局组件
  ui/                 # shadcn 基础组件
lib/
  db/                 # Drizzle schema 与 client
  auth.ts             # Auth.js 配置
  queries.ts          # 数据查询
drizzle/              # 数据库 migration
scripts/seed.ts       # 分类种子数据
```

## 后续扩展

- 小说章节展示页
- 作者公告板
- 读者建议投票
- 全文搜索
- 邮件通知
