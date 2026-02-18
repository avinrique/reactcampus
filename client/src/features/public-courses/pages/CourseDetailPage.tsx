import { useParams, Link } from 'react-router-dom';
import {
  Clock, BookOpen, GraduationCap, IndianRupee, ChevronRight, Home,
  ArrowRight, ExternalLink, Award, CheckCircle, Building2,
} from 'lucide-react';
import { usePublicCourse } from '../hooks/usePublicCourses';
import { PageFormOverlay } from '@/features/public-forms/components/PageFormOverlay';
import { Spinner } from '@/components/ui/Spinner';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = usePublicCourse(slug!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-16">
        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Course not found</h2>
        <p className="text-gray-500 mb-4">The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses" className="text-brand-500 hover:text-brand-600 font-medium text-sm">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  const quickInfoParts: string[] = [];
  if (course.level) quickInfoParts.push(course.level.charAt(0).toUpperCase() + course.level.slice(1));
  if (course.duration) quickInfoParts.push(`${course.duration.value} ${course.duration.unit}`);
  if (course.stream) quickInfoParts.push(course.stream.charAt(0).toUpperCase() + course.stream.slice(1));

  const stats: { label: string; value: string; color: string; icon: any }[] = [];
  if (course.duration) {
    stats.push({ label: 'Duration', value: `${course.duration.value} ${course.duration.unit}`, color: 'bg-blue-500', icon: Clock });
  }
  if (course.fees?.amount > 0) {
    stats.push({
      label: 'Fees',
      value: `₹${(course.fees.amount / 100000).toFixed(1)}L/${course.fees.per}`,
      color: 'bg-green-500',
      icon: IndianRupee,
    });
  }
  if (course.specializations?.length) {
    stats.push({ label: 'Specializations', value: `${course.specializations.length}+`, color: 'bg-brand-500', icon: Award });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap">
            <Link to="/" className="hover:text-brand-500 transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/courses" className="hover:text-brand-500 transition-colors">Courses</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-800 font-medium truncate max-w-[250px]">{course.name}</span>
          </nav>

          {/* Header card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-400" />
            <div className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{course.name}</h1>
                  {quickInfoParts.length > 0 && (
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
                      {quickInfoParts.map((part, i) => (
                        <span key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          {i > 0 && <span className="text-gray-300">|</span>}
                          {part}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Apply Now
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-500 text-brand-500 rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Download Brochure
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat boxes */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 border-t border-gray-100">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-l border-gray-100' : ''}`}>
                      <div className={`${stat.color} w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                        <div className="text-[11px] text-gray-500">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* About */}
            {course.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                  About this Course
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">{course.description}</p>
              </div>
            )}

            {/* Eligibility */}
            {course.eligibility && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                  Eligibility Criteria
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">{course.eligibility}</p>
              </div>
            )}

            {/* Fees */}
            {course.fees?.amount > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                  Fee Structure
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-brand-500">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Fee Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Tuition Fee</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {course.fees.currency || '₹'}{course.fees.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 capitalize">{course.fees.per}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Specializations */}
            {course.specializations?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-brand-500 rounded-full flex-shrink-0" />
                  Specializations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.specializations.map((spec: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2.5 bg-brand-50 rounded-lg border border-brand-100">
                      <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <span className="text-sm text-gray-800 font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
            {/* CTA Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Interested in this course?</h3>
              <p className="text-xs text-gray-500 mb-4">Get details on fees, eligibility, and colleges</p>
              <button className="w-full py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium mb-2">
                Apply Now
              </button>
              <button className="w-full py-2.5 border border-brand-500 text-brand-500 rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium">
                Download Brochure
              </button>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-500 rounded-full" />
                Course Details
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between gap-3">
                  <dt className="text-xs text-gray-500">Level</dt>
                  <dd className="text-xs font-medium text-gray-900 capitalize">{course.level}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-xs text-gray-500">Duration</dt>
                  <dd className="text-xs font-medium text-gray-900">{course.duration.value} {course.duration.unit}</dd>
                </div>
                {course.stream && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-xs text-gray-500">Stream</dt>
                    <dd className="text-xs font-medium text-gray-900 capitalize">{course.stream}</dd>
                  </div>
                )}
                {course.fees?.amount > 0 && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-xs text-gray-500">Fees</dt>
                    <dd className="text-xs font-medium text-gray-900">
                      {course.fees.currency || '₹'}{course.fees.amount.toLocaleString()} / {course.fees.per}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-500 rounded-full" />
                Explore More
              </h3>
              <div className="space-y-1">
                <Link
                  to="/courses"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  All Courses
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  to="/colleges"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  Colleges
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  to="/exams"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  Entrance Exams
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {course && <PageFormOverlay pageType="course" entityId={course._id} />}
    </div>
  );
}
