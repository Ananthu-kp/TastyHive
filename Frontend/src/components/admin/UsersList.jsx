import React from 'react'
import AdminSidebar from './AdminSidebar'

const UsersList = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold">Users List</h1>
        <p className="mt-4">This is the users list page.</p>
      </div>
    </div>
  )
}

export default UsersList
