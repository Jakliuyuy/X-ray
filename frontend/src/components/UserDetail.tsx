import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import QRCode from 'react-qr-code'

interface User {
  uuid: string
  remark: string
}

const UserDetail: FC = () => {
  const { uuid } = useParams<{ uuid: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [clashConfig, setClashConfig] = useState('')
  const [v2rayConfig, setV2rayConfig] = useState('')

  useEffect(() => {
    if (uuid) {
      fetchUserDetails()
    }
  }, [uuid])

  const fetchUserDetails = async () => {
    try {
      // 获取用户详情
      const userResponse = await axios.get(`http://localhost:8000/api/user/${uuid}`)
      setUser(userResponse.data)

      // 获取 Clash 配置
      const clashResponse = await axios.get(`http://localhost:8000/api/subscribe/clash/${uuid}`)
      setClashConfig(clashResponse.data.config)

      // 获取 V2Ray 配置
      const v2rayResponse = await axios.get(`http://localhost:8000/api/subscribe/v2ray/${uuid}`)
      setV2rayConfig(v2rayResponse.data.config)
    } catch (error) {
      console.error('获取用户详情失败:', error)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            用户详情
          </h3>
          <div className="mt-5 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                UUID
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  readOnly
                  value={user.uuid}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                备注
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  readOnly
                  value={user.remark || '未命名用户'}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                VLESS 链接
              </label>
              <div className="mt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`vless://${user.uuid}@your-domain:443`}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `vless://${user.uuid}@your-domain:443`
                      )
                    }
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    复制
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                二维码
              </label>
              <div className="mt-1 flex justify-center">
                <QRCode
                  value={`vless://${user.uuid}@your-domain:443`}
                  size={200}
                  className="dark:bg-white p-2 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Clash 订阅
              </label>
              <div className="mt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`http://localhost:8000/api/subscribe/clash/${user.uuid}`}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `http://localhost:8000/api/subscribe/clash/${user.uuid}`
                      )
                    }
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    复制
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                V2Ray 订阅
              </label>
              <div className="mt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`http://localhost:8000/api/subscribe/v2ray/${user.uuid}`}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `http://localhost:8000/api/subscribe/v2ray/${user.uuid}`
                      )
                    }
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    复制
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail
