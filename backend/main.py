from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import json
import os
import subprocess
from typing import List, Optional

app = FastAPI()

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中需要修改为具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 定义数据模型
class User(BaseModel):
    uuid: str
    remark: Optional[str] = None

class UserCreate(BaseModel):
    remark: Optional[str] = None

class XrayConfig:
    def __init__(self, config_path="/etc/xray/config.json"):
        self.config_path = config_path
        self.config = self.load_config()

    def load_config(self):
        try:
            with open(self.config_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {"inbounds": [], "outbounds": []}

    def save_config(self):
        with open(self.config_path, "w") as f:
            json.dump(self.config, f, indent=2)

    def restart_xray(self):
        try:
            subprocess.run(["systemctl", "restart", "xray"], check=True)
            return True
        except subprocess.CalledProcessError:
            return False

# API路由
@app.post("/api/user", response_model=User)
async def create_user(user: UserCreate):
    xray_config = XrayConfig()
    new_uuid = str(uuid.uuid4())
    
    # 添加用户到配置
    new_user = {"id": new_uuid, "remark": user.remark}
    # 这里需要根据实际Xray配置结构进行修改
    
    # 保存配置并重启Xray
    xray_config.save_config()
    if not xray_config.restart_xray():
        raise HTTPException(status_code=500, detail="Failed to restart Xray service")
    
    return User(uuid=new_uuid, remark=user.remark)

@app.get("/api/users", response_model=List[User])
async def get_users():
    xray_config = XrayConfig()
    users = []
    # 从配置中获取用户列表
    # 这里需要根据实际Xray配置结构进行修改
    return users

@app.delete("/api/user/{uuid}")
async def delete_user(uuid: str):
    xray_config = XrayConfig()
    # 从配置中删除用户
    # 这里需要根据实际Xray配置结构进行修改
    
    xray_config.save_config()
    if not xray_config.restart_xray():
        raise HTTPException(status_code=500, detail="Failed to restart Xray service")
    return {"status": "success"}

@app.get("/api/subscribe/clash/{uuid}")
async def get_clash_config(uuid: str):
    # 生成Clash配置
    # 这里需要实现Clash配置生成逻辑
    return {"config": "clash_config_here"}

@app.get("/api/subscribe/v2ray/{uuid}")
async def get_v2ray_config(uuid: str):
    # 生成V2Ray配置
    # 这里需要实现V2Ray配置生成逻辑
    return {"config": "v2ray_config_here"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
