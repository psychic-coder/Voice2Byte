import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedCompanyRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || !currentUser.user || currentUser.user.role !== "COMPANY_ADMIN") {
      router.push('/signin');
    }
  }, [currentUser, router]);

  return currentUser?.user?.role === "COMPANY_ADMIN" ? children : null;
};

export default ProtectedCompanyRoute;
