'use client';
import LandingPage from '@/components/LandingPage';
import { useRouter } from 'next/navigation';

export const LandingPage = ({ onGetStarted }) => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/create');
  };
  
  return <LandingPage onGetStarted={handleGetStarted} />;
}
