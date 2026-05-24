// components/ProtectedRoute.js
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/signin');
    }
  }, [currentUser, router]);

  return currentUser ? children : null;
};

export default ProtectedRoute;