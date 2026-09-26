/**
 * Maps raw Supabase Auth error messages/codes to friendly, actionable text.
 * Falls back to a generic message rather than surfacing raw provider errors.
 */
export function friendlyAuthError(e: any, fallback = 'Something went wrong. Please try again.'): string {
  const raw: string = (e?.message || e?.error_description || '').toLowerCase();
  const status: number | undefined = e?.status;

  if (raw.includes('invalid login credentials') || raw.includes('invalid credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (raw.includes('email not confirmed')) {
    return 'Please confirm your email address before logging in — check your inbox.';
  }
  if (raw.includes('user already registered') || raw.includes('already registered')) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (raw.includes('password should be at least') || raw.includes('password')) {
    return 'Password does not meet the minimum requirements.';
  }
  if (raw.includes('rate limit') || status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (raw.includes('network') || raw.includes('fetch')) {
    return 'Network error — please check your connection and try again.';
  }
  if (raw.includes('does not have government access')) {
    return e.message;
  }
  return e?.message && e.message.length < 120 ? e.message : fallback;
}
