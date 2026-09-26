import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  published_at: string;
  image_url: string | null;
  summary: string | null;
}

const NEWS_FN_URL = `${environment.supabaseUrl}/functions/v1/fetch-water-news`;

/** Pure, dependency-free relative-time formatter ("3h ago", "2d ago", etc). */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h1 class="text-2xl md:text-3xl font-bold dash-text">📰 Top 10 Water News — India</h1>
        <button class="btn-secondary !px-4 !py-2 text-sm" (click)="load()" [disabled]="loading">
          @if (loading) {
            <span class="spinner"></span>
          }
          {{ loading ? 'Refreshing…' : '↻ Refresh' }}
        </button>
      </div>
      <p class="dash-text-muted mb-8">Curated, auto-updating headlines on water supply, sanitation and policy from across India.</p>

      @if (loading && items.length === 0) {
        <div class="space-y-6">
          <div class="skeleton h-64 w-full"></div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (i of skeletonRows; track i) {
              <div class="skeleton h-56 w-full"></div>
            }
          </div>
        </div>
      }

      @if (!loading && errorMessage) {
        <div class="empty-state glass-card !py-16">
          <span class="text-4xl mb-3">📡</span>
          <p>Couldn't load the latest news right now.</p>
          <button class="btn-primary mt-4" (click)="load()">Retry</button>
        </div>
      }

      @if (!loading && !errorMessage && items.length === 0) {
        <div class="empty-state glass-card !py-16">
          <span class="text-4xl mb-3">💧</span>
          <p>No water news available right now. Check back soon.</p>
        </div>
      }

      @if (!loading && !errorMessage && items.length > 0) {
        <div class="space-y-8 animate-fade-in-up">
          <!-- Lead story -->
          <a
            [href]="items[0].link"
            target="_blank"
            rel="noopener noreferrer"
            class="lead-card glass-card block overflow-hidden hover-lift group"
          >
            <div class="grid md:grid-cols-2">
              <div class="relative h-56 md:h-full overflow-hidden">
                @if (items[0].image_url && !failedImages.has(items[0].link)) {
                  <img
                    [src]="items[0].image_url"
                    [alt]="items[0].title"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    (error)="onImageError(items[0].link)"
                  />
                } @else {
                  <div class="w-full h-full flex items-center justify-center placeholder-tile">
                    <span class="text-5xl">💧</span>
                  </div>
                }
              </div>
              <div class="p-6 flex flex-col justify-center">
                <div class="flex items-center gap-2 mb-2 text-xs dash-text-muted uppercase tracking-wide">
                  <span class="font-semibold dash-code">{{ items[0].source }}</span>
                  <span>·</span>
                  <span>{{ timeAgo(items[0].published_at) }}</span>
                </div>
                <h2 class="text-xl md:text-2xl font-bold dash-text mb-2 leading-snug group-hover:underline">
                  {{ items[0].title }}
                </h2>
                @if (items[0].summary) {
                  <p class="dash-text-muted text-sm line-clamp-3">{{ items[0].summary }}</p>
                }
              </div>
            </div>
          </a>

          <!-- Grid of the rest -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (item of items.slice(1); track item.link) {
              <a
                [href]="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="news-card glass-card flex flex-col overflow-hidden hover-lift group"
              >
                <div class="relative h-36 overflow-hidden">
                  @if (item.image_url && !failedImages.has(item.link)) {
                    <img
                      [src]="item.image_url"
                      [alt]="item.title"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      (error)="onImageError(item.link)"
                    />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center placeholder-tile">
                      <span class="text-3xl">💧</span>
                    </div>
                  }
                </div>
                <div class="p-4 flex flex-col flex-1">
                  <div class="flex items-center gap-2 mb-1.5 text-xs dash-text-muted uppercase tracking-wide">
                    <span class="font-semibold dash-code">{{ item.source }}</span>
                    <span>·</span>
                    <span>{{ timeAgo(item.published_at) }}</span>
                  </div>
                  <h3 class="font-semibold dash-text text-sm leading-snug mb-1.5 line-clamp-2 group-hover:underline">
                    {{ item.title }}
                  </h3>
                  @if (item.summary) {
                    <p class="dash-text-muted text-xs line-clamp-2 mt-auto">{{ item.summary }}</p>
                  }
                </div>
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .placeholder-tile {
      background: linear-gradient(135deg, var(--soft-bg), var(--soft-bg-strong));
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
})
export class NewsComponent implements OnInit {
  items: NewsItem[] = [];
  loading = true;
  errorMessage: string | null = null;
  failedImages = new Set<string>();
  skeletonRows = [0, 1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.load();
  }

  async load(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;
    try {
      const res = await fetch(NEWS_FN_URL, {
        method: 'GET',
        headers: {
          apikey: environment.supabaseAnonKey,
          Authorization: `Bearer ${environment.supabaseAnonKey}`,
        },
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      if (!data?.ok || !Array.isArray(data.items)) throw new Error('Unexpected response shape');
      this.items = data.items as NewsItem[];
      this.failedImages.clear();
    } catch (e) {
      this.errorMessage = 'Failed to load news.';
      if (this.items.length === 0) {
        this.items = [];
      }
    } finally {
      this.loading = false;
    }
  }

  onImageError(link: string): void {
    this.failedImages.add(link);
  }

  timeAgo(iso: string): string {
    return timeAgo(iso);
  }
}
