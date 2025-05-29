
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
      {currentUser.user.role === "CUSTOMER" && <CustomerProfile/>}
      {/* {currentUser.user.role === "COMPANY_ADMIN" && <CompanyAdminProfile/>}
      {currentUser.user.role === "HOTEL_ADMIN" && <HotelAdminProfile/>} */}
    </>
  )}
</ProtectedRoute>
  )
}

export default profile