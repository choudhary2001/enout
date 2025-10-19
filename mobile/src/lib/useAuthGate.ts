import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { api } from './api';

export function useAuthGate() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Check if user is authenticated by trying to get invite
        const inviteResponse = await api.getInvite();
        
        if (inviteResponse.inviteStatus === 'pending') {
          // User is authenticated but invite is pending
          router.replace('/(public)/invite');
        } else if (inviteResponse.inviteStatus === 'accepted') {
          // Check if tasks are complete
          const tasksComplete = await checkTasksComplete();
          
          if (tasksComplete) {
            // All tasks done, go to main app
            router.replace('/(app)/inbox');
          } else {
            // Tasks incomplete, go to tasks
            router.replace('/(public)/tasks');
          }
        } else {
          // Not authenticated, stay on current screen
          console.log('User not authenticated, staying on current screen');
        }
      } catch (error) {
        console.error('Auth gate error:', error);
        // If there's an error, assume not authenticated
      }
    };

    checkAuthAndRedirect();
  }, [router]);
}

async function checkTasksComplete(): Promise<boolean> {
  try {
    // In a real app, you'd check the actual task status
    // For now, we'll use the mock store to check
    const { mockApi } = await import('../mocks/mobileMocks');
    const store = mockApi.getStore();
    
    return (
      store.tasks.idUpload === 'done' &&
      store.tasks.form === 'done' &&
      store.tasks.phone === 'done'
    );
  } catch (error) {
    console.error('Error checking tasks:', error);
    return false;
  }
}
