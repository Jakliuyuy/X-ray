import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-gray-900 min-h-screen">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<UserList />} />
              <Route path="/user/:uuid" element={<UserDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
