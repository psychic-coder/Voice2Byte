
import CustomerProfile from '@/src/components/CustomerProfile'

import ProtectedRoute from '@/src/components/ProtectedProfileRoute'
import React from 'react'
import { useSelector } from 'react-redux'

const profile = () => {
    const {currentUser}=useSelector((state) => state.user)
  return (
    <ProtectedRoute>
  {currentUser && currentUser.user && (
    <>
    <CustomerProfile/>
    </>
  )}
</ProtectedRoute>
  )
}

export default profile