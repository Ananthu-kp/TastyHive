import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SignupUser from './components/users/SignupUser'
import LoginUser from './components/users/LoginUser'
import LoginPage from './components/admin/LoginPage'
import MenuEditor from './components/admin/MenuEditor'
import UsersList from './components/admin/UsersList'
import HomePage from './components/users/HomePage'
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/signup' element={<SignupUser />} />
          <Route path='/login' element={<LoginUser />} />
          <Route path='/' element={<HomePage />} />

          <Route path='/admin/login' element={<LoginPage />} />
          <Route path='/admin' element={<MenuEditor />} />
          <Route path='/admin/users' element={<UsersList />} />
        </Routes>
      </Router>
      <Toaster position="top-left" />
    </>
  )
}

export default App
