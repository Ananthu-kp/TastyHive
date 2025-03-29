import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SignupUser from './components/users/SignupUser'
import LoginUser from './components/users/LoginUser'
import LoginPage from './components/admin/LoginPage'
import MenuEditor from './components/admin/MenuEditor'
import UsersList from './components/admin/UsersList'
import HomePage from './components/users/HomePage'
import { Toaster } from 'sonner';
import ProtectedRoute from './components/users/ProtectedRoute'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import Profile from './components/users/Profile'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/signup' element={<SignupUser />} />
          <Route path='/login' element={<LoginUser />} />
          <Route path='/' element={<ProtectedRoute> <HomePage /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />

          <Route path='/admin/login' element={<LoginPage />} />
          <Route path='/admin' element={<ProtectedAdminRoute> <MenuEditor /></ProtectedAdminRoute>} />
          <Route path='/admin/users' element={<ProtectedAdminRoute> <UsersList /></ProtectedAdminRoute>} />
        </Routes>
      </Router>
      <Toaster position="top-left" />
    </>
  )
}

export default App
