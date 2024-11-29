import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();

    useEffect(() => {
      // 检查是否已登录
      const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.replace('/guanli/login');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
}
