import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, BookOpen, FileText, MapPin,
  Building2, ArrowRight, Award, TrendingUp, Users, Star,
  GraduationCap, CheckCircle, Phone, Stethoscope, Scale, Palette, FlaskConical,
  Briefcase, Calculator,
} from 'lucide-react';
import { usePublicColleges } from '@/features/public-colleges/hooks/usePublicColleges';
import { usePublicCourses } from '@/features/public-courses/hooks/usePublicCourses';
import { usePublicExams } from '@/features/public-exams/hooks/usePublicExams';
import { usePublicSiteSettings } from '../hooks/useSiteSettings';
import { PageFormOverlay } from '@/features/public-forms/components/PageFormOverlay';
import { Spinner } from '@/components/ui/Spinner';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  building: Building2,
  book: BookOpen,
  file: FileText,
  users: Users,
  star: Star,
};

const DEFAULT_CATEGORIES = [
  { label: 'Engineering', icon: '', to: '/colleges?type=engineering' },
  { label: 'Medical', icon: '', to: '/colleges?type=medical' },
  { label: 'Management', icon: '', to: '/colleges?type=management' },
  { label: 'Law', icon: '', to: '/colleges?type=law' },
  { label: 'Arts', icon: '', to: '/colleges?type=arts' },
  { label: 'Science', icon: '', to: '/colleges?type=science' },
];

const DEFAULT_STATS = [
  { label: 'Colleges Listed', value: '2,400+', icon: 'building', color: 'text-brand-600' },
  { label: 'Courses', value: '500+', icon: 'book', color: 'text-green-600' },
  { label: 'Entrance Exams', value: '100+', icon: 'file', color: 'text-blue-600' },
  { label: 'Students Helped', value: '35,000+', icon: 'users', color: 'text-purple-600' },
];

const STREAMS = [
  { label: 'Engineering', icon: Calculator, color: 'bg-blue-50 text-blue-600', to: '/colleges?type=engineering' },
  { label: 'Medical', icon: Stethoscope, color: 'bg-red-50 text-red-600', to: '/colleges?type=medical' },
  { label: 'Management', icon: Briefcase, color: 'bg-amber-50 text-amber-600', to: '/colleges?type=management' },
  { label: 'Law', icon: Scale, color: 'bg-emerald-50 text-emerald-600', to: '/colleges?type=law' },
  { label: 'Arts', icon: Palette, color: 'bg-purple-50 text-purple-600', to: '/colleges?type=arts' },
  { label: 'Science', icon: FlaskConical, color: 'bg-cyan-50 text-cyan-600', to: '/colleges?type=science' },
];

const TRUST_POINTS = [
  { title: 'Verified Information', desc: 'All college data is verified and regularly updated by our research team.' },
  { title: 'Compare & Decide', desc: 'Compare colleges side by side on fees, placements, rankings, and more.' },
  { title: 'Expert Guidance', desc: 'Get free counselling from our education experts to choose the right path.' },
  { title: 'Real Reviews', desc: 'Read authentic reviews from students and alumni of colleges across India.' },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: settings } = usePublicSiteSettings();
  const { data: collegesData } = usePublicColleges({ limit: 6 });
  const { data: coursesData } = usePublicCourses({ limit: 6 });
  const { data: examsData } = usePublicExams({ limit: 6 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const heroTitle = settings?.hero?.title || 'Discover Colleges, Courses';
  const heroHighlight = settings?.hero?.titleHighlight || '& Entrance Exams';
  const heroSubtitle = settings?.hero?.subtitle || 'Get genuine information about admissions, fees, placements, and rankings for colleges across India.';
  const heroPlaceholder = settings?.hero?.searchPlaceholder || 'Search colleges, courses, exams...';
  const categories = settings?.hero?.categories?.length ? settings.hero.categories : DEFAULT_CATEGORIES;
  const stats = settings?.stats?.length ? settings.stats : DEFAULT_STATS;

  const colleges = settings?.featuredColleges?.length ? settings.featuredColleges : collegesData?.data;
  const courses = settings?.featuredCourses?.length ? settings.featuredCourses : coursesData?.data;
  const exams = settings?.featuredExams?.length ? settings.featuredExams : examsData?.data;

  const ctaTitle = settings?.cta?.title || 'Need Help Choosing the Right College?';
  const ctaSubtitle = settings?.cta?.subtitle || 'Get personalized recommendations based on your preferences, budget, and career goals.';

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-brand-800 to-brand-900 text-white overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left - Text */}
            <div>
              <p className="text-brand-300 text-sm font-medium tracking-wide uppercase mb-3">
                India's Trusted Education Platform
              </p>
              <h1 className="text-3xl md:text-[2.75rem] font-bold leading-tight tracking-tight">
                {heroTitle}{' '}
                <span className="text-brand-300">{heroHighlight}</span>
              </h1>
              <p className="text-brand-200/80 text-base mt-4 leading-relaxed max-w-lg">
                {heroSubtitle}
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="mt-7">
                <div className="flex bg-white rounded-lg overflow-hidden shadow-lg shadow-brand-950/20">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={heroPlaceholder}
                      className="w-full pl-12 pr-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick links */}
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="text-brand-400 text-xs self-center mr-1">Popular:</span>
                {categories.map(cat => (
                  <Link
                    key={cat.label}
                    to={cat.to}
                    className="px-3 py-1 text-xs font-medium text-brand-200 bg-brand-800/60 border border-brand-700/50 rounded-full hover:bg-brand-700 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right - Stats cards */}
            <div className="hidden md:grid grid-cols-2 gap-3">
              {stats.map(stat => {
                const Icon = ICON_MAP[stat.icon] || Building2;
                return (
                  <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                    <Icon className="w-8 h-8 text-brand-300 mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-brand-300 mt-0.5">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats - visible on small screens */}
      <section className="md:hidden border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {stats.map(stat => {
              const Icon = ICON_MAP[stat.icon] || Building2;
              return (
                <div key={stat.label} className="flex items-center gap-2.5 py-4 px-3">
                  <Icon className={`w-5 h-5 ${stat.color} flex-shrink-0`} />
                  <div>
                    <div className="text-base font-bold text-gray-900">{stat.value}</div>
                    <div className="text-[11px] text-gray-500">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Stream */}
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Browse by Stream</h2>
            <p className="text-gray-500 text-sm mt-1.5">Find colleges in your preferred field of study</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {STREAMS.map(stream => {
              const Icon = stream.icon;
              const [bgColor, textColor] = stream.color.split(' ');
              return (
                <Link
                  key={stream.label}
                  to={stream.to}
                  className="group flex flex-col items-center gap-2.5 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-6 h-6 ${textColor}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-brand-600 transition-colors">{stream.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Colleges</h2>
              <p className="text-gray-500 text-sm mt-1">Top-rated colleges handpicked for you</p>
            </div>
            <Link
              to="/colleges"
              className="hidden sm:flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {!colleges ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {colleges.map((college: any) => (
                <Link
                  key={college._id}
                  to={`/colleges/${college.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50 transition-all overflow-hidden"
                >
                  {/* Card header band */}
                  <div className="h-1 bg-gradient-to-r from-brand-400 to-brand-600" />
                  <div className="p-5">
                    <div className="flex items-start gap-3.5">
                      {college.logo ? (
                        <img src={college.logo} alt="" className="w-14 h-14 rounded-lg border border-gray-200 object-contain bg-white flex-shrink-0 p-1" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-brand-500" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
                          {college.name}
                        </h3>
                        {college.location && (
                          <p className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            {college.location.city}{college.location.state ? `, ${college.location.state}` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium capitalize">
                        {college.type}
                      </span>
                      {college.ranking && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-md font-medium flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Rank #{college.ranking}
                        </span>
                      )}
                      {college.accreditation && (
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-md font-medium">
                          {college.accreditation}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      {college.fees?.max > 0 ? (
                        <span className="text-sm text-gray-700 font-medium flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                          ₹{college.fees.max >= 100000
                            ? `${(college.fees.max / 100000).toFixed(1)}L`
                            : `${(college.fees.max / 1000).toFixed(0)}K`}
                          <span className="text-xs text-gray-400 font-normal">/ year</span>
                        </span>
                      ) : (
                        <span />
                      )}
                      {college.established && (
                        <span className="text-xs text-gray-500">
                          Est. {college.established}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link
            to="/colleges"
            className="sm:hidden flex items-center justify-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold mt-5"
          >
            View All Colleges <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="bg-gray-50 border-y border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular Courses</h2>
              <p className="text-gray-500 text-sm mt-1">Explore courses across all streams and levels</p>
            </div>
            <Link
              to="/courses"
              className="hidden sm:flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {!courses ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course: any) => (
                <Link
                  key={course._id}
                  to={`/courses/${course.slug}`}
                  className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-brand-200 hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-brand-600 transition-colors">
                      {course.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                      <span className="text-xs text-gray-500 capitalize">{course.level}</span>
                      {course.duration && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-xs text-gray-500">{course.duration.value} {course.duration.unit}</span>
                        </>
                      )}
                      {course.stream && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-xs text-gray-500 capitalize">{course.stream}</span>
                        </>
                      )}
                    </div>
                    {course.fees?.amount > 0 && (
                      <p className="text-xs text-green-600 font-semibold mt-2">
                        ₹{(course.fees.amount / 100000).toFixed(1)}L / {course.fees.per}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 mt-1 flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          )}
          <Link
            to="/courses"
            className="sm:hidden flex items-center justify-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold mt-5"
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Popular Exams */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular Exams</h2>
              <p className="text-gray-500 text-sm mt-1">Upcoming entrance exams you should know about</p>
            </div>
            <Link
              to="/exams"
              className="hidden sm:flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {!exams ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map((exam: any) => (
                <Link
                  key={exam._id}
                  to={`/exams/${exam.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-brand-200 hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-brand-600 transition-colors">
                        {exam.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-md font-medium capitalize">
                          {exam.examType?.replace('_', ' ')}
                        </span>
                        {exam.conductedBy && (
                          <span className="text-xs text-gray-500">by {exam.conductedBy}</span>
                        )}
                      </div>
                      {exam.pattern?.mode && (
                        <p className="text-xs text-gray-500 mt-1.5 capitalize">
                          Mode: {exam.pattern.mode}
                          {exam.pattern.duration ? ` · ${exam.pattern.duration}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link
            to="/exams"
            className="sm:hidden flex items-center justify-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-semibold mt-5"
          >
            View All Exams <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-brand-50/50 border-y border-brand-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Why Choose Campus Option?</h2>
            <p className="text-gray-500 text-sm mt-1.5">Trusted by thousands of students across India</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_POINTS.map(point => (
              <div key={point.title} className="bg-white rounded-xl p-5 border border-gray-200">
                <CheckCircle className="w-8 h-8 text-brand-500 mb-3" />
                <h3 className="font-semibold text-gray-900 text-[15px] mb-1.5">{point.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-800 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <GraduationCap className="w-12 h-12 text-brand-300 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold">{ctaTitle}</h2>
            <p className="text-brand-200/80 text-base mt-3 max-w-lg mx-auto">{ctaSubtitle}</p>
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              <Link
                to="/colleges"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 rounded-lg font-semibold hover:bg-brand-50 transition-colors text-sm"
              >
                <Building2 className="w-4 h-4" />
                Explore Colleges
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-brand-400 text-brand-200 rounded-lg font-semibold hover:bg-brand-700 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                Talk to Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
      <PageFormOverlay pageType="homepage" />
    </div>
  );
}
