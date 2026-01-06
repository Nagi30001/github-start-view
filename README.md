# GitHub Stars View

一个用于查看和管理您的 GitHub stars 收藏的全栈 Web 应用程序。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)

## 功能特性

- ✅ **用户认证** - 使用 GitHub OAuth 登录
- 📋 **Stars 列表** - 查看所有收藏的仓库
- 🔍 **搜索功能** - 按仓库名称、描述或语言搜索
- ⭐ **取消 Star** - 直接在应用中取消收藏
- 📊 **详细信息** - 显示 star 数、fork 数、更新时间等
- 📄 **分页加载** - 高效浏览大量仓库
- 🎨 **现代 UI** - 使用 Tailwind CSS 和 shadcn/ui
- 📱 **响应式设计** - 完美支持移动端和桌面端

## 技术栈

- **前端框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **编程语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式方案**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件库**: [shadcn/ui](https://ui.shadcn.com/)
- **认证**: [NextAuth.js](https://next-auth.js/)
- **数据获取**: [GitHub REST API](https://docs.github.com/en/rest)
- **状态管理**: React Hooks + SWR
- **部署平台**: [Vercel](https://vercel.com/)

## 快速开始

### 前置要求

- Node.js 18.0 或更高版本
- npm 或 yarn 或 pnpm

### 安装

1. 克隆仓库
```bash
git clone https://github.com/Nagi30001/github-start-view.git
cd github-start-view
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量

复制 `.env.local.example` 为 `.env.local`:
```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填写你的 GitHub OAuth 凭据：
```env
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

4. 启动开发服务器
```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 配置 GitHub OAuth

### 创建 OAuth 应用

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写信息：
   - **Application name**: `GitHub Stars View`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. 点击 "Register application"
5. 复制 **Client ID** 和生成新的 **Client Secret**
6. 添加到你的 `.env.local` 文件

### 生成 NEXTAUTH_SECRET

使用以下命令生成随机密钥：
```bash
openssl rand -base64 32
```

## 项目结构

```
github-start-view/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/          # NextAuth 认证
│   │   ├── stars/         # Stars API
│   │   └── unstar/        # 取消 star API
│   ├── components/         # React 组件
│   │   ├── layout/        # 布局组件
│   │   ├── repository/    # 仓库相关组件
│   │   └── ui/           # shadcn/ui 组件
│   └── lib/              # 工具库
│       ├── auth.ts         # 认证配置
│       ├── github.ts       # GitHub API 客户端
│       └── utils.ts       # 通用工具
├── components/            # 共享组件
├── docs/                # 文档
├── public/              # 静态资源
└── types/               # TypeScript 类型定义
```

## 核心功能说明

### 用户认证

- 使用 NextAuth.js 实现 GitHub OAuth
- 支持会话管理和令牌刷新
- 自动处理登录/登出流程

### Stars 获取

- 使用 GitHub REST API 获取用户的 stars
- 实现分页加载（每页 30 个仓库）
- 支持缓存以提高性能

### 搜索功能

- 客户端过滤已加载的仓库
- 按名称、描述和编程语言搜索
- 实时搜索反馈

### 取消 Star

- 直接调用 GitHub API 取消收藏
- 更新 UI 状态
- 错误处理和用户反馈

## 部署

### Vercel 部署

详细部署指南请查看 [部署文档](docs/DEPLOYMENT.md)。

快速部署步骤：

1. 推送代码到 GitHub
2. 导入项目到 [Vercel](https://vercel.com/new)
3. 配置环境变量
4. 部署

### 环境变量

| 变量名 | 说明 | 必需 |
|---------|------|--------|
| `GITHUB_ID` | GitHub OAuth Client ID | 是 |
| `GITHUB_SECRET` | GitHub OAuth Client Secret | 是 |
| `NEXTAUTH_SECRET` | NextAuth 加密密钥 | 是 |
| `NEXTAUTH_URL` | 应用完整 URL | 是 |

## 开发指南

### 可用脚本

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm start       # 启动生产服务器
npm run lint     # 运行 ESLint
```

### 添加新功能

1. 在 `app/` 目录下创建新路由
2. 在 `components/` 中添加新组件
3. 使用 `lib/` 中的服务层处理业务逻辑
4. 在 `types/` 中添加类型定义

### 代码规范

- 使用 TypeScript 编写所有代码
- 遵循 ESLint 规则
- 使用 Tailwind CSS 类进行样式设计
- 保持组件单一职责

## 性能优化

- **图片优化**: 使用 Next.js Image 组件
- **代码分割**: 动态导入大型组件
- **缓存**: API 响应缓存（60 秒）
- **懒加载**: 分页加载仓库列表

## 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- **GitHub**: [@Nagi30001](https://github.com/Nagi30001)
- **Issue Tracker**: [GitHub Issues](../../issues)

## 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js/)
- [Lucide Icons](https://lucide.dev/)
- [GitHub API](https://docs.github.com/en/rest)
