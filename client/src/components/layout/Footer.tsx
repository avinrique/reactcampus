import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { usePublicSiteSettings } from '@/features/public-home/hooks/useSiteSettings';
import type { FooterSettings } from '@/types/siteSettings';

const DEFAULT_FOOTER: FooterSettings = {
  tagline: 'Your trusted platform for discovering colleges, courses, and exams across India.',
  sections: [
    {
      title: 'Explore',
      links: [
        { label: 'Colleges', to: '/colleges' },
        { label: 'Courses', to: '/courses' },
        { label: 'Exams', to: '/exams' },
        { label: 'Loan', to: '/loan' },
        { label: 'About Us', to: '/about' },
        { label: 'Contact Us', to: '/contact' },
      ],
    },
    {
      title: 'Top Colleges',
      links: [
        { label: 'Engineering Colleges', to: '/colleges?category=engineering' },
        { label: 'Medical Colleges', to: '/colleges?category=medical' },
        { label: 'Management Colleges', to: '/colleges?category=management' },
        { label: 'Law Colleges', to: '/colleges?category=law' },
      ],
    },
    {
      title: 'Top Courses',
      links: [
        { label: 'B.Tech', to: '/courses?level=undergraduate' },
        { label: 'MBA', to: '/courses?level=postgraduate' },
        { label: 'MBBS', to: '/courses?stream=medical' },
        { label: 'B.Com', to: '/courses?stream=commerce' },
      ],
    },
    {
      title: 'Top Exams',
      links: [
        { label: 'Engineering Exams', to: '/exams?category=engineering' },
        { label: 'Medical Exams', to: '/exams?category=medical' },
        { label: 'Management Exams', to: '/exams?category=management' },
      ],
    },
  ],
  socialLinks: [
    { platform: 'facebook', url: '#', label: 'fb' },
    { platform: 'linkedin', url: '#', label: 'in' },
    { platform: 'twitter', url: '#', label: 'X' },
    { platform: 'youtube', url: '#', label: 'yt' },
  ],
  bottomLinks: [
    { label: 'Privacy Policy', to: '/pages/privacy-policy' },
    { label: 'Terms of Use', to: '/pages/terms-of-use' },
  ],
  copyrightText: '',
  newsletter: {
    enabled: true,
    title: 'Stay Updated',
    subtitle: 'Get the latest college news, exam dates & counselling tips.',
  },
};

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-white font-semibold mb-5 uppercase text-xs tracking-widest">
      {children}
      <span className="block w-8 h-0.5 bg-accent-500 rounded-full mt-2" />
    </h4>
  );
}

export function Footer() {
  const { data: settings } = usePublicSiteSettings();
  const [email, setEmail] = useState('');

  const footer = settings?.footer || DEFAULT_FOOTER;
  const contact = settings?.contact;
  const newsletter = footer.newsletter ?? DEFAULT_FOOTER.newsletter;
  const sections = footer.sections?.length ? footer.sections : DEFAULT_FOOTER.sections;
  const socialLinks = footer.socialLinks?.length ? footer.socialLinks : DEFAULT_FOOTER.socialLinks;
  const bottomLinks = footer.bottomLinks?.length ? footer.bottomLinks : DEFAULT_FOOTER.bottomLinks;
  const tagline = footer.tagline || DEFAULT_FOOTER.tagline;
  const copyrightText = footer.copyrightText || `\u00A9 ${new Date().getFullYear()} Campus Option. All rights reserved.`;

  return (
    <footer>
      {/* Newsletter Strip */}
      {newsletter.enabled && (
        <div className="bg-gradient-to-r from-accent-500 via-accent-400 to-accent-500">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-white text-center md:text-left">
                <h3 className="font-bold text-lg">{newsletter.title}</h3>
                <p className="text-white/80 text-sm mt-0.5">{newsletter.subtitle}</p>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
                className="flex w-full md:w-auto gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 md:w-72 px-4 py-2.5 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                >
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="bg-gray-950 bg-noise text-gray-400 relative">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Campus<span className="text-gradient">Option</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed mb-5">
                {tagline}
              </p>
              <div className="space-y-2.5 text-sm">
                {contact?.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent-400 flex-shrink-0" />
                    {contact.email}
                  </p>
                )}
                {contact?.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-accent-400 flex-shrink-0" />
                    {contact.phone}
                  </p>
                )}
                {contact?.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                    {contact.address}
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Sections */}
            {sections.map((section) => (
              <div key={section.title}>
                <ColumnHeading>{section.title}</ColumnHeading>
                <ul className="space-y-2.5 text-sm">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="hover:text-white hover:translate-x-1 transition-all inline-block">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social links row */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 mt-10">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"
                >
                  {social.label || social.platform.charAt(0).toUpperCase()}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Gradient divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

        {/* Bottom bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p>{copyrightText}</p>
          {bottomLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {bottomLinks.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
