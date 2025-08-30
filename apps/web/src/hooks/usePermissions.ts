import { useAuth } from '../contexts/AuthContext';

export interface Permission {
  action: string;
  resource: string;
  roles: ('PARENT' | 'TEACHER' | 'CHILD')[];
}

export const PERMISSIONS = {
  // Permissions pour les parents
  VIEW_PARENT_DASHBOARD: { action: 'view', resource: 'parent_dashboard', roles: ['PARENT'] },
  MANAGE_CHILDREN: { action: 'manage', resource: 'children', roles: ['PARENT'] },
  VIEW_CHILD_PROGRESS: { action: 'view', resource: 'child_progress', roles: ['PARENT'] },
  CREATE_CALENDAR: { action: 'create', resource: 'calendar', roles: ['PARENT'] },
  
  // Permissions pour les enseignants
  VIEW_TEACHER_DASHBOARD: { action: 'view', resource: 'teacher_dashboard', roles: ['TEACHER'] },
  MANAGE_COURSES: { action: 'manage', resource: 'courses', roles: ['TEACHER'] },
  VIEW_STUDENT_PROGRESS: { action: 'view', resource: 'student_progress', roles: ['TEACHER'] },
  CREATE_LESSONS: { action: 'create', resource: 'lessons', roles: ['TEACHER'] },
  
  // Permissions pour les enfants
  VIEW_CHILD_DASHBOARD: { action: 'view', resource: 'child_dashboard', roles: ['CHILD'] },
  ACCESS_COURSES: { action: 'access', resource: 'courses', roles: ['CHILD'] },
  SUBMIT_ASSIGNMENTS: { action: 'submit', resource: 'assignments', roles: ['CHILD'] },
  
  // Permissions communes
  VIEW_PROFILE: { action: 'view', resource: 'profile', roles: ['PARENT', 'TEACHER', 'CHILD'] },
  UPDATE_PROFILE: { action: 'update', resource: 'profile', roles: ['PARENT', 'TEACHER'] },
} as const;

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return permission.roles.includes(user.role);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccessResource = (resource: string, action: string = 'view'): boolean => {
    const permission = Object.values(PERMISSIONS).find(
      p => p.resource === resource && p.action === action
    );
    return permission ? hasPermission(permission) : false;
  };

  const getUserRole = (): string | null => {
    return user?.role || null;
  };

  const isParent = (): boolean => {
    return user?.role === 'PARENT';
  };

  const isTeacher = (): boolean => {
    return user?.role === 'TEACHER';
  };

  const isChild = (): boolean => {
    return user?.role === 'CHILD';
  };

  const isAuthenticated = (): boolean => {
    return !!user;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessResource,
    getUserRole,
    isParent,
    isTeacher,
    isChild,
    isAuthenticated,
    user,
    PERMISSIONS
  };
}
