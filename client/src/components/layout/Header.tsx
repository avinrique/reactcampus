import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Search, Menu, X, ChevronDown, GraduationCap, BookOpen, FileText, LayoutDashboard, LogIn, Info, Banknote } from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Colleges',
    to: '/colleges',
    icon: GraduationCap,
    sub: [
      { label: 'All Colleges', to: '/colleges' },
      { label: 'Engineering', to: '/colleges?category=engineering' },
      { label: 'Medical', to: '/colleges?category=medical' },
      { label: 'Management', to: '/colleges?category=management' },
    ],
  },
  {
    label: 'Courses',
    to: '/courses',
    icon: BookOpen,
    sub: [
      { label: 'All Courses', to: '/courses' },
      { label: 'B.Tech', to: '/courses?level=undergraduate' },
      { label: 'MBA', to: '/courses?level=postgraduate' },
    ],
  },
  {
    label: 'Exams',
    to: '/exams',
    icon: FileText,
    sub: [
      { label: 'All Exams', to: '/exams' },
      { label: 'Engineering', to: '/exams?category=engineering' },
      { label: 'Medical', to: '/exams?category=medical' },
    ],
  },
  {
    label: 'Loan',
    to: '/loan',
    icon: Banknote,
    sub: [],
  },
  {
    label: 'More',
    to: '/about',
    icon: Info,
    sub: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
];

export function Header() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setSearchExpanded(false);
    }
  };

  return (
    <>
      {/* Sentinel for scroll detection */}
      <div ref={sentinelRef} className="h-0 w-full absolute top-0 left-0" />

      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Campus<span className="text-gradient">Option</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.sub.length > 0 ? setOpenDropdown(item.label) : undefined}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={item.to}
                    className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors group"
                  >
                    {item.label}
                    {item.sub.length > 0 && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    )}
                    {/* Animated underline */}
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-brand-500 transition-transform origin-left ${
                      openDropdown === item.label ? 'scale-x-100' : 'scale-x-0'
                    }`} />
                  </Link>
                  {openDropdown === item.label && item.sub.length > 0 && (
                    <div className="absolute top-full left-0 w-52 bg-white rounded-lg shadow-xl border border-gray-100 border-t-2 border-t-brand-500 py-1.5 mt-0 z-50 animate-scale-in">
                      {item.sub.map(sub => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search + Auth */}
            <div className="flex items-center gap-3">
              {/* Desktop Search - expandable */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className={`relative flex items-center transition-all duration-300 ${searchExpanded ? 'w-56 lg:w-64' : 'w-9'}`}>
                  <button
                    type="button"
                    onClick={() => setSearchExpanded(!searchExpanded)}
                    className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                      searchExpanded ? 'text-brand-600' : 'text-gray-500 hover:text-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className={`absolute left-9 top-0 h-9 border border-gray-200 rounded-lg text-sm pl-3 pr-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-300 ${
                      searchExpanded ? 'w-[calc(100%-2.25rem)] opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    }`}
                    onBlur={() => { if (!search) setSearchExpanded(false); }}
                  />
                </div>
              </form>

              {/* Auth Button */}
              {isAuthenticated ? (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-in-left">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-3 md:hidden animate-fade-in-up">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search colleges, courses, exams..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </form>
              {NAV_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={`animate-fade-in-up-delay-${Math.min(idx + 1, 4)}`}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
