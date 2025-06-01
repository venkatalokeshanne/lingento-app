'use client';

import UpdateNotification from '@/components/UpdateNotification';
import InstallPWAPrompt from '@/components/InstallPWAPrompt';
import OfflineIndicator from '@/components/OfflineIndicator';

export default function PWAComponents() {
  return (
    <>
      <UpdateNotification />
      <InstallPWAPrompt />
      <OfflineIndicator />
    </>
  );
}
