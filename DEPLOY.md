# Vercel 部署指南

## 重要：确认连接的 Git 仓库

你的 Vercel 项目必须连接 **`Leo-610/shiji`**，而不是 Vercel 自动创建的 `leo` 模板仓库。

若部署日志显示 commit 为 `Initial commit — Created from https://vercel.com/new`，说明连错了仓库，构建会失败。

**修复步骤：**

1. 打开 Vercel 项目 → **Settings** → **Git**
2. 点击 **Disconnect** 断开当前仓库
3. 重新连接 **Leo-610/shiji** 仓库
4. 或在 [导入 shiji](https://vercel.com/new/clone?repository-url=https://github.com/Leo-610/shiji) 新建项目

## 一键导入（推荐）

1. 打开 [Vercel 导入项目](https://vercel.com/new/clone?repository-url=https://github.com/Leo-610/shiji)
2. 使用 GitHub 账号登录并授权 `Leo-610/shiji` 仓库
3. 在 **Environment Variables** 中配置以下变量（见下方表格）
4. 点击 **Deploy**

## 环境变量

在 Vercel 项目 → Settings → Environment Variables 中添加：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | Neon Postgres 连接串 | `postgresql://user:pass@host/db?sslmode=require` |
| `AUTH_SECRET` | Auth.js 密钥 | 运行 `openssl rand -base64 32` 生成 |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID | 来自 GitHub Developer Settings |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret | 来自 GitHub Developer Settings |
| `AUTH_RESEND_KEY` | Resend API Key（邮箱验证码登录） | 来自 [Resend API Keys](https://resend.com/api-keys) |
| `AUTH_RESEND_FROM` | 发件人（需验证域名） | `量子余烬 <notify@shiji.ink>` |
| `AUTH_URL` | 生产环境域名 | `https://shiji.ink` |

所有变量请勾选 **Production**、**Preview**、**Development** 三个环境。

## 创建 Neon 数据库

1. 打开 [Neon Console](https://console.neon.tech) 或 Vercel Dashboard → Storage → Create Database → Neon
2. 创建项目后复制 **Connection string**
3. 填入 Vercel 的 `DATABASE_URL`

## 初始化数据库（首次部署后执行一次）

在本地终端运行（将 `DATABASE_URL` 设为 Neon 生产连接串）：

```bash
npm install
export DATABASE_URL="postgresql://..."
npm run db:push
npm run db:seed
```

## 配置 GitHub OAuth

1. 打开 https://github.com/settings/developers → OAuth Apps → New OAuth App
2. **Homepage URL**：`https://你的域名.vercel.app`
3. **Authorization callback URL**：`https://你的域名.vercel.app/api/auth/callback/github`
4. 将 Client ID 和 Secret 填入 Vercel 环境变量

部署后若更换域名，需同步更新 GitHub OAuth 和 `AUTH_URL`，并在 Vercel 中 Redeploy。

## 配置 Resend 邮箱验证码登录

邮箱登录使用 **6 位验证码**（在站内输入，不依赖邮件中的回调链接），适合微信 / QQ 内无法打开魔法链接的场景。

1. 在 [Resend](https://resend.com) 创建 API Key，填入 `AUTH_RESEND_KEY`（Vercel Resend 集成会设置 `RESEND_API_KEY`，同样可用）
2. 在 Resend → **Domains** 添加 `shiji.ink`，按提示添加 DNS 记录（SPF、DKIM 等）
3. 域名验证通过后设置发件人：
   ```
   AUTH_RESEND_FROM=量子余烬 <notify@shiji.ink>
   ```
4. Redeploy 后访问 `/auth/signin` 测试：输入邮箱 → 收信 → 在 `/auth/verify-code` 输入验证码

未验证自定义域名时，可临时使用 Resend 测试地址 `onboarding@resend.dev`，但仅可向你在 Resend 注册的邮箱发信。

本地一键写入 Vercel 环境变量（需已 `vercel link`）：

```bash
export AUTH_RESEND_KEY=re_xxxx
export AUTH_RESEND_FROM='量子余烬 <notify@shiji.ink>'
./scripts/configure-email-auth.sh
```

## 自动部署

推送 `main` 分支到 GitHub 后，Vercel 会自动构建并部署：

```bash
git push origin main
```

## 最快完成清单（约 3 分钟）

1. **登录 Vercel** → 打开 https://vercel.com/new/clone?repository-url=https://github.com/Leo-610/shiji
2. 点击 **Continue with GitHub** 登录，确认仓库为 `Leo-610/shiji`，项目名 `shiji`，点击 **Deploy**
3. 部署开始后进入 **Settings → Environment Variables**，添加：
   - `DATABASE_URL` — 在 Storage 创建 Neon 数据库后复制
   - `AUTH_SECRET` — 运行 `openssl rand -base64 32`
   - `AUTH_URL` — 你的 Vercel 域名，如 `https://shiji.vercel.app`
4. 添加变量后点击 **Redeploy**
5. 本地初始化数据库：
   ```bash
   export DATABASE_URL="你的 Neon 连接串"
   npm install
   ./scripts/setup-production.sh
   ```

若已有 `leo` 项目：在 **Settings → Git** 断开 `leo` 仓库，改为连接 `Leo-610/shiji`，然后 Redeploy。

## 验证部署

部署成功后访问：

- 主页：`https://你的域名.vercel.app`
- 讨论区：`https://你的域名.vercel.app/discussions`
- 登录：`https://你的域名.vercel.app/auth/signin`
