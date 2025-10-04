import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';

const StorytellingLanding = dynamic(() => import('@/components/landing/StorytellingLanding'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <StorytellingLanding />
    </Suspense>
  );
}
