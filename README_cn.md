# RSC 指纹检测器

一款用于检测网页中 React Server Components (RSC) 和 Next.js App Router 指纹的 Firefox 浏览器扩展。

## ⚠️ 重要提醒

此扩展仅用于**教育和安全研究目的**。包含的功能可能用于测试安全漏洞。**仅在您拥有或明确授权测试的系统上使用此扩展**。未经授权的使用可能是非法和不道德的。

## 功能特性

### 🔍 被动检测
- 自动扫描网页中的 RSC 指标
- 检测 Next.js App Router 模式
- 监控页面内容中的 RSC 特定标记
- 检测到 RSC 时更新扩展徽章

### 🎯 主动指纹识别
- 发送受控的 RSC 探测请求
- 分析服务器响应的 RSC 特征
- 识别指示 RSC 使用的 Content-Type 头
- 检测包含 'RSC' 的 Vary 头

### 📊 检测方法

扩展使用多种检测技术：

1. **Content-Type 分析**: 检测 `text/x-component` 响应
2. **模式匹配**: 识别 `window.__next_f` 和 RSC 相关模式
3. **头信息检查**: 分析 Vary 头中的 RSC 指标
4. **响应结构**: 检查 React Flight 协议模式

## 安装

### 从源码安装
1. 克隆此仓库：
   ```bash
   git clone https://github.com/Junner1st/RSC_Detector_Firefox.git
   cd RSC_Detector_Firefox
   ```

2. 在 Firefox 中加载扩展：
   - 打开 Firefox 并访问 `about:debugging#/runtime/this-firefox`
   - 点击"临时加载附加组件…"
   - 选择 RSC_Detector_Firefox/manifest.json

## 使用方法

1. **自动检测**: 扩展在浏览时自动扫描页面
2. **手动探测**: 点击扩展图标并使用"开始指纹探测"按钮
3. **查看结果**: 在弹出窗口中查看检测结果和详细信息

### 截图展示

![插件运行截图](images/img1.png)

以上截图展示了插件在检测到 RSC 时的运行状态，包括被动检测结果和主动探测功能。

## 文件结构

```
RSC_Detector/
├── manifest.json          # 扩展配置文件
├── content.js             # 主要检测逻辑
├── popup.html             # 扩展弹出界面
├── popup.js               # 弹出窗口功能
├── background.js          # 后台服务工作线程
├── rules.json             # 网络请求规则
├── images/
│   └── img1.png          # 扩展运行截图
├── README.md             # 英文文档
└── README_cn.md          # 中文文档（本文件）
```

## 技术详情

### 检测模式

扩展查找以下指标：

- **Content-Type**: `text/x-component`
- **全局变量**: `window.__next_f`
- **库引用**: `react-server-dom-webpack`
- **响应头**: `Vary: RSC`
- **协议模式**: React Flight Response 格式

### 权限要求

扩展需要以下权限：
- `activeTab` - 访问当前标签页内容
- `scripting` - 在页面中执行脚本
- `declarativeNetRequest` - 修改网络请求
- `<all_urls>` - 在所有网站上工作

## 贡献

欢迎贡献代码。请确保任何更改：
- 保持教育/研究重点
- 包含适当的文档

## 许可证

本项目仅用于教育目的。请负责任地使用，并遵守适用的法律和法规。

## 免责声明

此工具旨在用于合法的安全研究和教育目的。用户有责任确保在测试任何系统之前获得适当的授权。作者不对本软件的误用承担责任。

---

**⚠️ 仅用于授权安全测试**