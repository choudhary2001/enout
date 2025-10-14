import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { hasPermission, type Permission } from './rbac';

export function useCan(permission: Permission): boolean {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: api.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!user) return false;
  
  return hasPermission(user.role, permission);
}
