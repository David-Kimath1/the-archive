import {
  LayoutDashboard,
  Library,
  BookOpen,
  Bookmark,
  CheckCircle2,
  BookX,
  Quote,
  BarChart3,
  Settings,
} from 'lucide-react';

export const navSections = [
  {
    label: null,
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/library', label: 'My Library', icon: Library },
    ],
  },
  {
    label: 'Reading',
    items: [
      { to: '/currently-reading', label: 'Currently Reading', shortLabel: 'Reading', icon: BookOpen },
      { to: '/want-to-read', label: 'Want to Read', shortLabel: 'Want', icon: Bookmark },
      { to: '/finished', label: 'Finished', icon: CheckCircle2 },
      { to: '/dropped', label: 'Dropped', icon: BookX },
    ],
  },
  {
    label: 'Notebook',
    items: [
      { to: '/quotes', label: 'Quotes', icon: Quote },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/statistics', label: 'Statistics', icon: BarChart3 },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const allNavItems = navSections.flatMap((s) => s.items);

/* Four items in the mobile bottom bar; the rest live in the "More" sheet. */
export const mobilePrimaryItems = [
  navSections[0].items[0], // Dashboard
  navSections[0].items[1], // Library
  navSections[1].items[0], // Currently Reading
  navSections[1].items[1], // Want to Read
];
