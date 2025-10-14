import { UserRoleType } from '@enout/shared';

export type Permission = 
  | 'event.create'
  | 'event.edit'
  | 'event.delete'
  | 'event.view'
  | 'attendee.create'
  | 'attendee.edit'
  | 'attendee.delete'
  | 'attendee.invite'
  | 'attendee.export'
  | 'message.create'
  | 'message.send'
  | 'room.assign';

const rolePermissions: Record<UserRoleType, Permission[]> = {
  admin: [
    'event.create',
    'event.edit',
    'event.delete',
    'event.view',
    'attendee.create',
    'attendee.edit',
    'attendee.delete',
    'attendee.invite',
    'attendee.export',
    'message.create',
    'message.send',
    'room.assign',
  ],
  hr: [
    'event.view',
    'attendee.create',
    'attendee.edit',
    'attendee.invite',
    'attendee.export',
    'message.create',
    'room.assign',
  ],
};

export function hasPermission(userRole: UserRoleType, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) ?? false;
}
