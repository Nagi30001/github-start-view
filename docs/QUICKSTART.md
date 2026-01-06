# 快速开始指南

## 环境准备

确保已安装：
- Node.js 18.0+
- npm

## 步骤 1: 获取 GitHub OAuth 凭据

### 创建 OAuth 应用

1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写以下信息：
   - Application name: `GitHub Stars View`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. 点击 "Register application"
5. 保存 **Client ID** 和生成新的 **Client Secret**

### 生成密钥

```bash
openssl rand -base64 32
```

## 步骤 2: 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
GITHUB_ID=your_client_id_here
GITHUB_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated_secret_here
```

将上面步骤中的实际值替换掉占位符。

## 步骤 3: 安装依赖并启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 步骤 4: 访问应用

打开浏览器访问：http://localhost:3000

1. 点击 "登录" 按钮
2. 使用 GitHub 账户授权
3. 查看和管理您的 stars

## 功能说明

### 搜索功能
- 在搜索框输入关键词
- 支持搜索仓库名称、描述和编程语言
- 实时过滤显示结果

### 取消 Star
- 点击任意仓库卡片上的 "取消 Star" 按钮
- 确认后该仓库将从列表中移除
- 可以在 GitHub 上验证

### 分页浏览
- 底部显示分页控件
- 点击页码或左右箭头导航
- 每页显示 30 个仓库

## 故障排除

### 问题：无法登录

**原因**：OAuth 配置错误

**解决**：
- 检查 `.env.local` 中的 Client ID 和 Secret 是否正确
- 确认回调 URL 配置正确
- 查看浏览器控制台的错误信息

### 问题：加载失败

**原因**：API 调用失败

**解决**：
- 确认网络连接正常
- 检查 GitHub API 服务是否正常
- 查看终端的错误日志

### 问题：TypeScript 错误

**解决**：
```bash
rm -rf node_modules .next
npm install
npm run build
```

## 下一步

- 查看 [部署文档](./DEPLOYMENT.md) 了解如何部署到生产环境
- 查看 [完整文档](../README.md) 了解更多功能
- 查看 [项目计划](../plans/plan.md) 了解架构设计

## 常见命令

```bash
# 开发
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 项目结构

```
github-start-view/
├── app/                 # Next.js App Router
├── components/          # React 组件
├── lib/               # 工具库和 API 服务
├── types/             # TypeScript 类型
├── docs/              # 文档
├── public/            # 静态资源
└── *.config.js       # 配置文件
```

## 获取帮助

如遇到问题：
1. 查看项目的 GitHub Issues
2. 检查控制台错误信息
3. 参考 Next.js 和 NextAuth.js 文档
