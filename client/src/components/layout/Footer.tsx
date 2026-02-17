import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const EXPLORE_LINKS = [
  { label: 'Colleges', to: '/colleges' },
  { label: 'Courses', to: '/courses' },
  { label: 'Exams', to: '/exams' },
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
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                React<span className="text-orange-500">Campus</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted platform for discovering colleges, courses, and exams across India. Make informed decisions about your education.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                info@reactcampus.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                Bangalore, India
              </p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full" />
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {EXPLORE_LINKS.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Colleges */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full" />
              Top Colleges
            </h4>
            <ul className="space-y-2.5 text-sm">
              {TOP_COLLEGES.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Exams */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full" />
              Top Exams
            </h4>
            <ul className="space-y-2.5 text-sm">
              {TOP_EXAMS.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-orange-400 transition-colors">
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
          <p>&copy; {new Date().getFullYear()} ReactCampus. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-orange-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-orange-400 cursor-pointer transition-colors">Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
