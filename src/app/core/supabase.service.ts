import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Complaint, ComplaintStatus, Profile } from './models';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;

  private sessionSubject = new BehaviorSubject<Session | null>(null);
  readonly session$: Observable<Session | null> = this.sessionSubject.asObservable();

  private profileSubject = new BehaviorSubject<Profile | null>(null);
  readonly profile$: Observable<Profile | null> = this.profileSubject.asObservable();

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    this.client.auth.getSession().then(({ data }) => {
      this.sessionSubject.next(data.session);
      if (data.session?.user) {
        this.loadProfile(data.session.user.id);
      }
    });

    this.client.auth.onAuthStateChange((_event, session) => {
      this.sessionSubject.next(session);
      if (session?.user) {
        this.loadProfile(session.user.id);
      } else {
        this.profileSubject.next(null);
      }
    });
  }

  get currentSession(): Session | null {
    return this.sessionSubject.value;
  }

  get currentUserId(): string | null {
    return this.sessionSubject.value?.user?.id ?? null;
  }

  get currentProfile(): Profile | null {
    return this.profileSubject.value;
  }

  // ---------- Auth ----------

  /**
   * The `amrit_profiles` row is created server-side by a database trigger on
   * `auth.users` (see migration `amrit_profile_auto_create_trigger`), fed by
   * this signup's `options.data`. That trigger runs with elevated privilege,
   * so it works even when email confirmation is required and no session
   * exists yet on the client right after signup (RLS would otherwise block a
   * client-side insert with no authenticated `auth.uid()`).
   */
  async signUp(email: string, password: string, name: string, role: 'citizen' | 'government' = 'citizen') {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (error) throw error;

    if (data.session && data.user) {
      await this.loadProfile(data.user.id);
    }
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      await this.loadProfile(data.user.id);
    }
    return data;
  }

  async signOut() {
    await this.client.auth.signOut();
    this.profileSubject.next(null);
  }

  // ---------- Profile ----------

  async loadProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.client
      .from('amrit_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.error('Failed to load profile', error);
      this.profileSubject.next(null);
      return null;
    }
    this.profileSubject.next(data as Profile | null);
    return data as Profile | null;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.client
      .from('amrit_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  }

  // ---------- Complaints ----------

  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createComplaint(complaint: Omit<Complaint, 'code' | 'status'>): Promise<Complaint> {
    const userId = this.currentUserId;
    let lastError: any = null;

    for (let attempt = 0; attempt < 8; attempt++) {
      const code = this.generateCode();
      const payload: Complaint = {
        ...complaint,
        user_id: userId ?? null,
        code,
        status: 'Active',
      };
      const { data, error } = await this.client
        .from('amrit_complaints')
        .insert(payload)
        .select()
        .single();

      if (!error) {
        return data as Complaint;
      }
      lastError = error;
      // 23505 = unique_violation, retry with a new code
      if (error.code !== '23505') {
        throw error;
      }
    }
    throw lastError;
  }

  async getComplaintByCode(code: string): Promise<Complaint | null> {
    const { data, error } = await this.client
      .rpc('amrit_track_complaint', { p_code: code })
      .maybeSingle();
    if (error) throw error;
    return data as Complaint | null;
  }

  async getComplaintById(id: string): Promise<Complaint | null> {
    const { data, error } = await this.client
      .from('amrit_complaints')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Complaint | null;
  }

  async getMineForUser(): Promise<Complaint[]> {
    const userId = this.currentUserId;
    if (!userId) return [];
    const { data, error } = await this.client
      .from('amrit_complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as Complaint[]) ?? [];
  }

  async getAllForGov(): Promise<Complaint[]> {
    const { data, error } = await this.client
      .from('amrit_complaints')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as Complaint[]) ?? [];
  }

  async updateStatus(id: string, status: ComplaintStatus): Promise<void> {
    const { error } = await this.client
      .from('amrit_complaints')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  }

  // ---------- Stats ----------

  async getPublicStats() {
    const { data, error } = await this.client.rpc('amrit_public_stats').maybeSingle();
    if (error) throw error;
    return data;
  }
}
