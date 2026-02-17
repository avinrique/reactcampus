import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, GraduationCap, BookOpen, FileText, MapPin,
  Building2, ArrowRight, Award, TrendingUp, Users, Star,
} from 'lucide-react';
import { usePublicColleges } from '@/features/public-colleges/hooks/usePublicColleges';
import { usePublicCourses } from '@/features/public-courses/hooks/usePublicCourses';
import { usePublicExams } from '@/features/public-exams/hooks/usePublicExams';
import { Spinner } from '@/components/ui/Spinner';

// ─── Category Pills ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Engineering', icon: '🏗️', to: '/colleges?type=engineering' },
  { label: 'Medical', icon: '🏥', to: '/colleges?type=medical' },
  { label: 'Management', icon: '💼', to: '/colleges?type=management' },
  { label: 'Law', icon: '⚖️', to: '/colleges?type=law' },
  { label: 'Arts', icon: '🎨', to: '/colleges?type=arts' },
  { label: 'Science', icon: '🔬', to: '/colleges?type=science' },
];

const STATS = [
  { label: 'Colleges', value: '1000+', icon: Building2, color: 'text-orange-500' },
  { label: 'Courses', value: '500+', icon: BookOpen, color: 'text-green-500' },
  { label: 'Exams', value: '100+', icon: FileText, color: 'text-blue-500' },
  { label: 'Students Helped', value: '50K+', icon: Users, color: 'text-purple-500' },
];

// ─── Home Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: collegesData } = usePublicColleges({ limit: 6 });
  const { data: coursesData } = usePublicCourses({ limit: 6 });
  const { data: examsData } = usePublicExams({ limit: 6 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-20 w-48 h-48 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 border-2 border-white rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
              Find the Right College
              <br />
              <span className="text-orange-100">for Your Future</span>
            </h1>
            <p className="text-orange-100 text-base md:text-lg mb-8 max-w-xl mx-auto">
              Explore thousands of colleges, courses, and exams. Compare, shortlist, and make the right choice.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-xl shadow-lg flex items-center overflow-hidden">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search colleges, courses, exams..."
                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none text-sm md:text-base"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 md:px-8 py-4 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors text-sm md:text-base flex-shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.label}
                  to={cat.to}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors border border-white/20"
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Counter ───────────────────────────────────────────────── */}
      <section className="relative -mt-6 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {STATS.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center justify-center gap-3 py-5 px-4">
                  <Icon className={`w-8 h-8 ${stat.color} flex-shrink-0`} />
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Colleges ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pt-14 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-1.5 h-7 bg-orange-500 rounded-full" />
            Featured Colleges
          </h2>
          <Link
            to="/colleges"
            className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {!collegesData ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {collegesData.data.map((college) => (
              <Link
                key={college._id}
                to={`/colleges/${college.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Card top accent */}
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-orange-400" />
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Logo */}
                    {college.logo ? (
                      <img src={college.logo} alt="" className="w-12 h-12 rounded-lg border border-gray-200 object-contain bg-white flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                        {college.name}
                      </h3>
                      {college.location && (
                        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {college.location.city}{college.location.state ? `, ${college.location.state}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Info chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full font-medium capitalize">
                      {college.type}
                    </span>
                    {college.ranking && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        #{college.ranking}
                      </span>
                    )}
                    {college.established && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        Estd {college.established}
                      </span>
                    )}
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {college.fees?.max > 0 ? (
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        Fees: ₹{college.fees.max >= 100000
                          ? `${(college.fees.max / 100000).toFixed(1)}L`
                          : `${(college.fees.max / 1000).toFixed(0)}K`}
                      </span>
                    ) : (
                      <span />
                    )}
                    {(college as any).accreditation && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {(college as any).accreditation}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Popular Courses ─────────────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-1.5 h-7 bg-orange-500 rounded-full" />
              Popular Courses
            </h2>
            <Link
              to="/courses"
              className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {!coursesData ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coursesData.data.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course.slug}`}
                  className="group flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-all"
                >
                  <div className="w-11 h-11 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                      {course.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-500 capitalize">{course.level}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-xs text-gray-500">{course.duration.value} {course.duration.unit}</span>
                      {course.stream && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-xs text-gray-500 capitalize">{course.stream}</span>
                        </>
                      )}
                    </div>
                    {course.fees?.amount > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-1.5">
                        ₹{(course.fees.amount / 100000).toFixed(1)}L / {course.fees.per}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 mt-1 flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Popular Exams ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-1.5 h-7 bg-orange-500 rounded-full" />
            Popular Exams
          </h2>
          <Link
            to="/exams"
            className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {!examsData ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {examsData.data.map((exam) => (
              <Link
                key={exam._id}
                to={`/exams/${exam.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                      {exam.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full font-medium capitalize">
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
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Need Help Choosing the Right College?
          </h2>
          <p className="text-orange-100 mb-6 max-w-xl mx-auto">
            Get personalized recommendations based on your preferences, budget, and career goals.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/colleges"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors text-sm"
            >
              <Star className="w-4 h-4" />
              Explore Colleges
            </Link>
            <Link
              to="/exams"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm"
            >
              <FileText className="w-4 h-4" />
              Browse Exams
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
