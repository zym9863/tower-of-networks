# 网络之塔：3D交互式体系结构浏览器 (Tower of Networks)

[简体中文](README.md) | [English](README_EN.md)

![网络之塔](https://img.shields.io/badge/Tower%20of%20Networks-3D%20Interactive-4285F4)
![Three.js](https://img.shields.io/badge/Three.js-r176-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF)

一个基于Three.js的3D交互式网络体系结构浏览器，用于可视化OSI七层模型和TCP/IP四层模型，并演示数据包的封装和解封装过程。

## 📋 功能特点

- **3D交互式网络模型**：以3D塔形结构展示OSI七层模型和TCP/IP四层模型
- **详细的网络层信息**：点击任意网络层查看其详细功能、协议和PDU信息
- **数据封装动画**：演示数据如何从应用层向下封装到物理层的过程
- **数据解封装动画**：演示数据如何从物理层向上解封装到应用层的过程
- **完全交互式控制**：使用鼠标旋转、平移和缩放3D视图
- **响应式设计**：适配不同屏幕尺寸的设备

## 🚀 快速开始

### 前提条件

- [Node.js](https://nodejs.org/) (v18.0.0+)
- [npm](https://www.npmjs.com/) (v8.0.0+) 或 [yarn](https://yarnpkg.com/) (v1.22.0+)

### 安装

1. 克隆仓库

```bash
git clone https://github.com/zym9863/tower-of-networks.git
cd tower-of-networks
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

4. 在浏览器中打开 [http://localhost:5173](http://localhost:5173)

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建后的文件将位于 `dist` 目录中。

## 🔍 使用指南

### 基本操作

- **左键拖动**：旋转视图
- **右键拖动**：平移视图
- **滚轮**：缩放视图
- **点击网络层**：查看该层的详细信息

### 切换网络模型

- 点击 **OSI七层模型** 按钮切换到OSI模型
- 点击 **TCP/IP四层模型** 按钮切换到TCP/IP模型

### 播放动画

- 点击 **数据封装动画** 按钮播放数据封装过程
- 点击 **数据解封装动画** 按钮播放数据解封装过程

## 🧩 项目结构

```
tower-of-networks/
├── src/                    # 源代码
│   ├── animations/         # 动画相关代码
│   │   ├── EncapsulationAnimation.ts   # 数据封装动画
│   │   └── DecapsulationAnimation.ts   # 数据解封装动画
│   ├── components/         # UI组件
│   │   ├── Controls.ts     # 控制按钮
│   │   └── InfoPanel.ts    # 信息面板
│   ├── models/             # 3D模型
│   │   ├── NetworkLayers.ts # 网络层定义
│   │   └── NetworkTower.ts  # 网络塔模型
│   ├── main.ts             # 主入口文件
│   └── style.css           # 全局样式
├── index.html              # HTML入口
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript配置
└── vite.config.js          # Vite配置
```

## 🔧 技术栈

- [Three.js](https://threejs.org/) - 3D图形库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript超集
- [Vite](https://vitejs.dev/) - 现代前端构建工具

## 📚 网络模型说明

### OSI七层模型

1. **物理层** - 传输原始比特流
2. **数据链路层** - 提供节点到节点的数据传输
3. **网络层** - 提供路由和寻址功能
4. **传输层** - 提供端到端的连接服务
5. **会话层** - 建立、管理和终止会话
6. **表示层** - 处理数据格式、加密和压缩
7. **应用层** - 为应用程序提供网络服务的接口

### TCP/IP四层模型

1. **网络接口层** - 处理物理网络的访问
2. **互联网层** - 处理数据包路由
3. **传输层** - 提供端到端的连接服务
4. **应用层** - 包含所有高层协议

## 🤝 贡献

欢迎贡献！请随时提交问题或拉取请求。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

- [Three.js](https://threejs.org/) 团队提供的出色3D库
- 所有网络协议和标准的创建者和维护者
