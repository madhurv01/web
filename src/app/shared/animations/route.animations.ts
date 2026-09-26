import { animate, query, style, transition, trigger } from '@angular/animations';

/**
 * Lightweight route-enter animation. Applied to the element wrapping
 * <router-outlet> via [@routeAnimation]="o.isActivated ? o.activatedRoute : ''".
 * Only animates the entering view (no absolute-position leave animation) so
 * layout height never collapses/jumps during navigation.
 */
export const routeAnimation = trigger('routeAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('280ms cubic-bezier(0.22,1,0.36,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ],
      { optional: true }
    ),
  ]),
]);
