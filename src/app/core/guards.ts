import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { UserRole } from './models';

export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const { data } = await supabase.client.auth.getSession();
  if (!data.session) {
    return router.createUrlTree(['/login']);
  }
  return true;
};

export function roleGuard(role: UserRole): CanActivateFn {
  return async () => {
    const supabase = inject(SupabaseService);
    const router = inject(Router);

    const { data } = await supabase.client.auth.getSession();
    if (!data.session) {
      return router.createUrlTree([role === 'government' ? '/gov-login' : '/login']);
    }

    const profile = await supabase.getProfile(data.session.user.id);
    if (!profile || profile.role !== role) {
      // redirect based on the profile's actual role
      if (profile?.role === 'government') {
        return router.createUrlTree(['/gov-dashboard']);
      }
      if (profile?.role === 'citizen') {
        return router.createUrlTree(['/dashboard']);
      }
      return router.createUrlTree(['/']);
    }
    return true;
  };
}
