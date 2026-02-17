import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Building2, ClipboardList, ChevronRight, Home, FileText,
  ArrowRight, ExternalLink, Monitor, Clock, Award, CheckCircle, Globe,
} from 'lucide-react';
import { usePublicExam } from '../hooks/usePublicExams';
import { Spinner } from '@/components/ui/Spinner';

export default function ExamDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: exam, isLoading } = usePublicExam(slug!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-16">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Exam not found</h2>
        <p className="text-gray-500 mb-4">The exam you're looking for doesn't exist or has been removed.</p>
        <Link to="/exams" className="text-orange-500 hover:text-orange-600 font-medium text-sm">
          ← Back to Exams
        </Link>
      </div>
    );
  }

  const quickInfoParts: string[] = [];
  if (exam.examType) quickInfoParts.push(exam.examType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()));
  if (exam.conductedBy) quickInfoParts.push(exam.conductedBy);
  if (exam.pattern?.mode) quickInfoParts.push(exam.pattern.mode.charAt(0).toUpperCase() + exam.pattern.mode.slice(1));

  const stats: { label: string; value: string; color: string; icon: any }[] = [];
  if (exam.pattern?.mode) {
    stats.push({ label: 'Mode', value: exam.pattern.mode.charAt(0).toUpperCase() + exam.pattern.mode.slice(1), color: 'bg-blue-500', icon: Monitor });
  }
  if (exam.pattern?.duration) {
    stats.push({ label: 'Duration', value: exam.pattern.duration, color: 'bg-green-500', icon: Clock });
  }
  if (exam.pattern?.totalMarks) {
    stats.push({ label: 'Total Marks', value: String(exam.pattern.totalMarks), color: 'bg-orange-500', icon: Award });
  }
  if (exam.importantDates?.length) {
    stats.push({ label: 'Key Dates', value: `${exam.importantDates.length}`, color: 'bg-purple-500', icon: Calendar });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap">
            <Link to="/" className="hover:text-orange-500 transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/exams" className="hover:text-orange-500 transition-colors">Exams</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-800 font-medium truncate max-w-[250px]">{exam.name}</span>
          </nav>

          {/* Header card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-400" />
            <div className="p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{exam.name}</h1>
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
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                      <ClipboardList className="w-3.5 h-3.5" />
                      Register Now
                    </button>
                    {exam.website && (
                      <a
                        href={exam.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Official Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stat boxes */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 border-t border-gray-100">
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
            {exam.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-orange-500 rounded-full flex-shrink-0" />
                  About {exam.name}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">{exam.description}</p>
              </div>
            )}

            {/* Eligibility */}
            {exam.eligibility && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-orange-500 rounded-full flex-shrink-0" />
                  Eligibility Criteria
                </h2>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">{exam.eligibility}</p>
                </div>
              </div>
            )}

            {/* Exam Pattern */}
            {exam.pattern && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-orange-500 rounded-full flex-shrink-0" />
                  Exam Pattern
                </h2>

                {/* Pattern summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {exam.pattern.mode && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <Monitor className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-[11px] text-gray-500">Mode</div>
                        <div className="text-sm font-medium text-gray-900 capitalize">{exam.pattern.mode}</div>
                      </div>
                    </div>
                  )}
                  {exam.pattern.duration && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="text-[11px] text-gray-500">Duration</div>
                        <div className="text-sm font-medium text-gray-900">{exam.pattern.duration}</div>
                      </div>
                    </div>
                  )}
                  {exam.pattern.totalMarks && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <Award className="w-4 h-4 text-orange-500" />
                      <div>
                        <div className="text-[11px] text-gray-500">Total Marks</div>
                        <div className="text-sm font-medium text-gray-900">{exam.pattern.totalMarks}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sections table */}
                {exam.pattern.sections?.length > 0 && (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-orange-500">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Section</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Questions</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase">Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {exam.pattern.sections.map((section: any, i: number) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-orange-50/40'}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{section.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{section.questions || '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{section.marks || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Important Dates */}
            {exam.importantDates?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-orange-500 rounded-full flex-shrink-0" />
                  Important Dates
                </h2>
                <div className="space-y-3">
                  {exam.importantDates.map((date: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-orange-200 transition-colors">
                      <div className="bg-orange-500 text-white rounded-lg px-3 py-2 text-center flex-shrink-0 min-w-[70px]">
                        <div className="text-lg font-bold leading-none">
                          {new Date(date.date).toLocaleDateString('en-IN', { day: 'numeric' })}
                        </div>
                        <div className="text-[10px] mt-0.5 opacity-90">
                          {new Date(date.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{date.event}</p>
                        {date.description && <p className="text-xs text-gray-500 mt-0.5">{date.description}</p>}
                      </div>
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
              <h3 className="font-semibold text-gray-900 mb-1">Preparing for {exam.name.length > 20 ? exam.name.slice(0, 20) + '...' : exam.name}?</h3>
              <p className="text-xs text-gray-500 mb-4">Get exam pattern, syllabus, and preparation tips</p>
              <button className="w-full py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium mb-2">
                Register Now
              </button>
              {exam.website && (
                <a
                  href={exam.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium text-center"
                >
                  Official Website
                </a>
              )}
            </div>

            {/* Exam Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-500 rounded-full" />
                Exam Details
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between gap-3">
                  <dt className="text-xs text-gray-500">Exam Type</dt>
                  <dd className="text-xs font-medium text-gray-900 capitalize">{exam.examType?.replace('_', ' ')}</dd>
                </div>
                {exam.conductedBy && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-xs text-gray-500">Conducted By</dt>
                    <dd className="text-xs font-medium text-gray-900">{exam.conductedBy}</dd>
                  </div>
                )}
                {exam.pattern?.mode && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-xs text-gray-500">Mode</dt>
                    <dd className="text-xs font-medium text-gray-900 capitalize">{exam.pattern.mode}</dd>
                  </div>
                )}
                {exam.pattern?.duration && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-xs text-gray-500">Duration</dt>
                    <dd className="text-xs font-medium text-gray-900">{exam.pattern.duration}</dd>
                  </div>
                )}
                {exam.pattern?.totalMarks && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-xs text-gray-500">Total Marks</dt>
                    <dd className="text-xs font-medium text-gray-900">{exam.pattern.totalMarks}</dd>
                  </div>
                )}
                {exam.website && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-xs text-gray-500">Website</dt>
                    <dd>
                      <a href={exam.website} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-orange-500 hover:text-orange-600">
                        Visit Website
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-500 rounded-full" />
                Explore More
              </h3>
              <div className="space-y-1">
                <Link
                  to="/exams"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  All Exams
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  to="/colleges"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Colleges
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  to="/courses"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Courses
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
