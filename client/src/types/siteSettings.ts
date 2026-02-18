export interface CategoryPill {
  label: string;
  icon: string;
  to: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface CtaButton {
  label: string;
  to: string;
  variant: 'primary' | 'outline';
  icon: string;
}

export interface SiteSettings {
  _id: string;
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: CategoryPill[];
  };
  stats: StatItem[];
  featuredColleges: any[];
  featuredCourses: any[];
  featuredExams: any[];
  cta: {
    title: string;
    subtitle: string;
    buttons: CtaButton[];
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    mapEmbedUrl: string;
  };
  about: {
    content: string;
    mission: string;
    vision: string;
  };
  updatedBy?: { _id: string; firstName: string; lastName: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSiteSettingsRequest {
  hero?: Partial<SiteSettings['hero']>;
  stats?: StatItem[];
  featuredColleges?: string[];
  featuredCourses?: string[];
  featuredExams?: string[];
  cta?: Partial<SiteSettings['cta']>;
  contact?: Partial<SiteSettings['contact']>;
  about?: Partial<SiteSettings['about']>;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
