# 部署指南

本文档详细说明如何将 GitHub Stars View 应用部署到 Vercel。

## 前置要求

- GitHub 账户
- Vercel 账户
- Node.js 18+ 环境

## 步骤 1: 创建 GitHub OAuth 应用

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: `GitHub Stars View` (或自定义)
   - **Homepage URL**: `http://localhost:3000` (本地开发)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. 点击 "Register application"
5. 保存生成的 **Client ID** 和 **Client Secret**

### 生产环境配置

部署到 Vercel 后，需要更新回调 URL：
- **Homepage URL**: `https://your-app.vercel.app`
- **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`

## 步骤 2: 配置环境变量

### 本地开发

在项目根目录创建 `.env.local` 文件：

```env
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

生成 `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Vercel 部署

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 说明 | 示例 |
|---------|------|--------|
| `GITHUB_ID` | GitHub OAuth Client ID | `ghp_xxxxx` |
| `GITHUB_SECRET` | GitHub OAuth Client Secret | `ghp_xxxxx` |
| `NEXTAUTH_SECRET` | NextAuth 密钥 | 生成的随机字符串 |
| `NEXTAUTH_URL` | 应用 URL | `https://your-app.vercel.app` |

## 步骤 3: 部署到 Vercel

### 方法 1: 使用 Vercel CLI

1. 安装 Vercel CLI:
```bash
npm install -g vercel
```

2. 登录 Vercel:
```bash
vercel login
```

3. 部署:
```bash
vercel
```

4. 按照提示配置项目：
   - 选择正确的项目目录
   - 确认构建命令
   - 添加环境变量

### 方法 2: 使用 Git 集成

1. 将代码推送到 GitHub
2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 点击 "Add New Project"
4. 导入你的 GitHub 仓库
5. 配置项目：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. 添加环境变量（见步骤 2）
7. 点击 "Deploy"

## 步骤 4: 更新 GitHub OAuth 回调 URL

部署完成后：

1. 访问部署的网站（如 `https://your-app.vercel.app`）
2. 记录实际的 URL
3. 回到 GitHub OAuth 应用设置
4. 更新 **Authorization callback URL** 为:
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```
5. 点击 "Update application"

## 验证部署

1. 访问部署的 URL
2. 点击 "登录" 按钮
3. 使用 GitHub 账户授权
4. 应该能看到你的 stars 列表
5. 测试搜索、取消 star 等功能

## 常见问题

### 授权失败

**问题**: OAuth 授权失败或回调错误

**解决**:
- 检查 `NEXTAUTH_URL` 是否正确
- 确认 GitHub OAuth 应用的回调 URL 配置正确
- 清除浏览器 Cookie 并重试

### 无法加载 Stars

**问题**: 登录成功但无法加载 stars

**解决**:
- 检查浏览器控制台的错误信息
- 确认 `GITHUB_SECRET` 配置正确
- 验证 GitHub OAuth 应用有足够的权限（需要 `repo` scope）

### 环境变量未生效

**问题**: 更新环境变量后无效果

**解决**:
- Vercel 需要重新部署以应用新的环境变量
- 触发一次新的部署或在设置中点击 "Redeploy"

### 类型错误

**问题**: TypeScript 编译错误

**解决**:
```bash
rm -rf node_modules .next
npm install
npm run build
```

## 性能优化建议

### 1. 启用 Edge Functions

在 `vercel.json` 中配置：

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 2. 配置缓存

在 `next.config.js` 中添加：

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}
```

### 3. 启用压缩

Vercel 自动处理静态资源压缩，确保：
- 静态文件使用 `.gz` 或 `.br` 格式
- 启用 Brotli 压缩

## 监控和维护

### 使用 Vercel Analytics

1. 在 Vercel Dashboard 中启用 Analytics
2. 在项目中安装：

```bash
npm install @vercel/analytics
```

3. 在 `app/layout.tsx` 中添加：

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 错误日志

查看 Vercel Dashboard 的 Functions Logs：
- 实时监控 API 错误
- 调试认证和 API 调用问题

## 安全最佳实践

1. **永远不要**提交 `.env.local` 文件到 Git
2. 使用强随机字符串作为 `NEXTAUTH_SECRET`
3. 定期轮换 GitHub OAuth 密钥
4. 限制 OAuth 应用的访问范围（仅使用必要的权限）
5. 启用 Vercel 的 HTTPS（默认启用）

## 本地开发

运行开发服务器：

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`

## 生产构建

测试生产构建：

```bash
npm run build
npm start
```

访问 `http://localhost:3000`（生产模式）

## 更新部署

部署新版本：

```bash
# 方法 1: Vercel CLI
vercel --prod

# 方法 2: Git 推送
git add .
git commit -m "Update"
git push origin main
```

Vercel 会自动检测到推送并重新部署。

## 支持

如遇到问题：

1. 查看项目的 [GitHub Issues](../../issues)
2. 检查 [NextAuth.js 文档](https://next-auth.js.org/)
3. 查看 [Next.js 文档](https://nextjs.org/docs)
4. 检查 [Vercel 文档](https://vercel.com/docs)
