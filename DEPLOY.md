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
| `AUTH_URL` | 生产环境域名 | `https://shiji.vercel.app`（部署后替换为实际域名） |

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

## 自动部署

推送 `main` 分支到 GitHub 后，Vercel 会自动构建并部署：

```bash
git push origin main
```

## 验证部署

部署成功后访问：

- 主页：`https://你的域名.vercel.app`
- 讨论区：`https://你的域名.vercel.app/discussions`
- 登录：`https://你的域名.vercel.app/auth/signin`
