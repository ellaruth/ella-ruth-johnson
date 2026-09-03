export type PageTab = 
  | 'home' 
  | 'about' 
  | 'ministry' 
  | 'coaching' 
  | 'teaching' 
  | 'events' 
  | 'gallery' 
  | 'get-involved' 
  | 'contact';

export interface MinistryProgram {
  id: string;
  title: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  image: string;
  impactHighlight: string;
  keyServices: string[];
  location: string;
}

export interface SermonTeaching {
  id: string;
  title: string;
  scripture: string;
  series: string;
  date: string;
  duration: string;
  summary: string;
  corePoints: string[];
  reflectionPrayer: string;
  featuredQuote: string;
  audioPreviewAvailable?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'Conference' | 'Community Dinner' | 'Youth & Family' | 'Teaching Session' | 'Outreach';
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  isUpcoming: boolean;
  registrationRequired?: boolean;
  recapNotes?: string;
  photosCount?: number;
  attendeesCount?: number;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  album: 'ministry' | 'banquets' | 'youth' | 'mombasa' | 'family';
  tag: string;
  dateStr: string;
  featured?: boolean;
}

export interface DonationFund {
  id: string;
  name: string;
  icon: string;
  description: string;
  impactQuote: string;
  suggestedAmounts: number[];
  defaultAmount: number;
}

export interface PrayerRequest {
  id: string;
  authorName: string;
  cityState: string;
  requestText: string;
  date: string;
  isPrivate: boolean;
  prayedCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  category: 'wellness' | 'ministry' | 'reentry' | 'conference';
  avatar?: string;
}

export interface AnnouncementItem {
  id: string;
  text: string;
  highlight: string;
  linkTab: PageTab;
  date: string;
  active: boolean;
}
