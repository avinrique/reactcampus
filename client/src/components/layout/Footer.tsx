import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const EXPLORE_LINKS = [
  { label: 'Colleges', to: '/colleges' },
  { label: 'Courses', to: '/courses' },
  { label: 'Exams', to: '/exams' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];

const TOP_COLLEGES = [
  { label: 'Engineering Colleges', to: '/colleges?type=engineering' },
  { label: 'Medical Colleges', to: '/colleges?type=medical' },
  { label: 'Management Colleges', to: '/colleges?type=management' },
  { label: 'Law Colleges', to: '/colleges?type=law' },
];

const TOP_EXAMS = [
  { label: 'Engineering Exams', to: '/exams?type=engineering' },
  { label: 'Medical Exams', to: '/exams?type=medical' },
  { label: 'Management Exams', to: '/exams?type=management' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Campus<span className="text-brand-500">Option</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted platform for discovering colleges, courses, and exams across India. Make informed decisions about your education.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                info@campusoption.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                080-42401736
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                4th Floor, Niran Arcade, New BEL Road, Bangalore 560094
              </p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-brand-500 rounded-full" />
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {EXPLORE_LINKS.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Colleges */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-brand-500 rounded-full" />
              Top Colleges
            </h4>
            <ul className="space-y-2.5 text-sm">
              {TOP_COLLEGES.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Exams */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-brand-500 rounded-full" />
              Top Exams
            </h4>
            <ul className="space-y-2.5 text-sm">
              {TOP_EXAMS.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p>&copy; {new Date().getFullYear()} Campus Option. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/pages/privacy-policy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
            <Link to="/pages/terms-of-use" className="hover:text-brand-400 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
