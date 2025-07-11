import { FC, useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import QRCode from 'react-qr-code'

interface User {
  uuid: string
  remark: string
}

const UserList: FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [newUserRemark, setNewUserRemark] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error('获取用户列表失败:', error)
    }
  }

  const addUser = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/user', {
        remark: newUserRemark,
      })
      setUsers([...users, response.data])
      setNewUserRemark('')
    } catch (error) {
      console.error('添加用户失败:', error)
    }
  }

  const deleteUser = async (uuid: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/user/${uuid}`)
      setUsers(users.filter(user => user.uuid !== uuid))
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          添加新用户
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newUserRemark}
            onChange={(e) => setNewUserRemark(e.target.value)}
            placeholder="输入用户备注"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={addUser}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            添加用户
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            用户列表
          </h3>
          <div className="mt-5">
            <div className="flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <li key={user.uuid} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.remark || '未命名用户'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.uuid}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          查看详情
                        </button>
                        <button
                          onClick={() => deleteUser(user.uuid)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              用户详情
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">VLESS链接：</p>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`vless://${selectedUser.uuid}@your-domain:443`}
                    className="flex-1 rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(`vless://${selectedUser.uuid}@your-domain:443`)}
                    className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    复制
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <QRCode
                  value={`vless://${selectedUser.uuid}@your-domain:443`}
                  size={200}
                  className="dark:bg-white p-2 rounded"
                />
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserList
