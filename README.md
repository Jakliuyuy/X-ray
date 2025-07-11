# Xray 代理管理系统

这是一个基于 Xray-core 的代理管理系统，提供了用户管理、节点信息生成和订阅功能。

## 功能特点

- 用户管理（添加/删除用户）
- 自动生成 UUID
- VLESS 链接生成和二维码显示
- Clash 和 V2Ray 订阅支持
- 响应式界面设计
- 深色模式支持

## 技术栈

### 前端
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- react-qr-code

### 后端
- Python
- FastAPI
- Pydantic
- uvicorn

## 开发环境设置

1. 克隆项目
```bash
git clone https://your-repository-url.git
cd xray-manager
```

2. 设置前端
```bash
cd frontend
npm install
npm run dev
```

3. 设置后端
```bash
cd backend
python -m venv venv
source venv/bin/activate  # 在Windows上使用: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## API 端点

- `POST /api/user` - 创建新用户
- `GET /api/users` - 获取所有用户列表
- `DELETE /api/user/{uuid}` - 删除指定用户
- `GET /api/subscribe/clash/{uuid}` - 获取Clash订阅配置
- `GET /api/subscribe/v2ray/{uuid}` - 获取V2Ray订阅配置

## 生产环境部署

1. 构建前端
```bash
cd frontend
npm run build
```

2. 将构建的文件部署到Nginx

3. 配置后端服务
```bash
sudo cp xray-manager.service /etc/systemd/system/
sudo systemctl enable xray-manager
sudo systemctl start xray-manager
```

4. 配置Nginx反向代理

## 注意事项

- 在生产环境中需要配置适当的CORS设置
- 确保正确设置Xray配置文件权限
- 建议启用HTTPS以保护API通信安全

## 许可证

MIT
