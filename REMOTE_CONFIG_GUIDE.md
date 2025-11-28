# 远程配置使用说明

## 问题修复

### 1. ✅ 服务器地址连接问题
- 修复了 Android 上 HTTP 连接被阻止的问题
- 添加了 URL 自动清理和验证
- 改进了错误提示

### 2. ✅ APK 安装失败问题
- 每次构建自动增加版本号
- 使用 `npm run build:android` 会自动更新版本

## 使用步骤

### 1. 启动配置服务器

在显示设备（电脑/树莓派）上运行：

```powershell
npm run server
```

你会看到：
```
🚀 Config server running on http://0.0.0.0:3001
🌐 Web UI: http://localhost:3001
📱 App API: http://<your-ip>:3001/api/config
```

### 2. 查找服务器 IP 地址

**Windows:**
```powershell
ipconfig
# 找到 IPv4 地址，例如: 192.168.1.100
```

**Linux/Mac:**
```bash
ifconfig
# 或
ip addr show
```

### 3. 在 Android App 中配置

1. 打开 App，点击右上角 ⚙️ 设置图标
2. 滚动到"远程配置"部分
3. 开启"远程配置"开关
4. 输入服务器地址，格式：`http://192.168.1.100:3001`
   - ⚠️ 必须包含 `http://`
   - ⚠️ 使用实际的 IP 地址，不要用 `localhost`
   - ⚠️ 端口号默认是 3001
5. 点击"保存配置"

### 4. 验证连接

- 如果连接成功，设置图标旁边不会显示红点
- App 会每 30 秒自动同步配置
- 在 Web 管理界面修改配置后，App 会自动更新

## Web 管理界面

浏览器访问：`http://192.168.1.100:3001`

**功能：**
- 🏠 配置 Home Assistant 连接
- 🎬 切换演示模式
- ⚡ 快速切换天气（晴天/大雨/大雪/雷雨）
- 🔄 自动刷新配置

## 常见问题

### Q: 服务器地址打不开？

**检查清单：**
1. ✅ 确保服务器正在运行（`npm run server`）
2. ✅ 手机和电脑在同一个 WiFi 网络
3. ✅ 使用正确的 IP 地址（不是 localhost）
4. ✅ 地址格式：`http://192.168.1.100:3001`（包含 http://）
5. ✅ 防火墙允许 3001 端口

**测试方法：**
```powershell
# 在手机浏览器中打开
http://192.168.1.100:3001

# 应该能看到配置管理界面
```

### Q: APK 安装失败？

**原因：** Android 不允许安装相同或更低版本的 APK

**解决方法：**
1. 卸载旧版本 App
2. 或使用新的构建命令（自动增加版本号）：
   ```powershell
   npm run build:android
   ```

### Q: 配置不同步？

**检查：**
1. 远程配置开关是否开启
2. 服务器地址是否正确
3. 查看设置图标是否有红点（表示连接错误）
4. 等待 30 秒让自动同步生效

## 构建新版本

```powershell
# 完整构建流程（自动增加版本号）
npm run build:android

# 打开 Android Studio
npm run cap:open

# 在 Android Studio 中构建 APK
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

## 示例配置

**服务器地址格式：**
- ✅ `http://192.168.1.100:3001`
- ✅ `http://192.168.0.50:3001`
- ❌ `localhost:3001` （手机无法访问）
- ❌ `192.168.1.100:3001` （缺少 http://）
- ❌ `https://192.168.1.100:3001` （除非配置了 HTTPS）

## 网络要求

- 📱 手机和服务器必须在同一局域网
- 🔓 服务器端口 3001 必须开放
- 📡 WiFi 连接（不支持移动数据）
