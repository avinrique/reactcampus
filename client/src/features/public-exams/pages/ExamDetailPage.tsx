import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, ClipboardList } from 'lucide-react';
import { usePublicExam } from '../hooks/usePublicExams';
import { Spinner } from '@/components/ui/Spinner';

export default function ExamDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: exam, isLoading } = usePublicExam(slug!);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!exam) return <div className="text-center py-16 text-gray-500">Exam not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/exams" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Exams
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.name}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full capitalize">
            {exam.examType?.replace('_', ' ')}
          </span>
          {exam.conductedBy && (
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" /> {exam.conductedBy}
            </span>
          )}
        </div>

        {exam.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About this Exam</h2>
            <p className="text-gray-700">{exam.description}</p>
          </div>
        )}

        {exam.eligibility && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h2 className="font-medium text-gray-900 mb-2">Eligibility</h2>
            <p className="text-sm text-gray-600">{exam.eligibility}</p>
          </div>
        )}

        {/* Exam Pattern */}
        {exam.pattern && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Exam Pattern
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-700">
              {exam.pattern.totalMarks && <p><span className="font-medium">Total Marks:</span> {exam.pattern.totalMarks}</p>}
              {exam.pattern.duration && <p><span className="font-medium">Duration:</span> {exam.pattern.duration}</p>}
              {exam.pattern.mode && <p><span className="font-medium">Mode:</span> <span className="capitalize">{exam.pattern.mode}</span></p>}
              {exam.pattern.sections?.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium mb-2">Sections:</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Section</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Subject</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Questions</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {exam.pattern.sections.map((section: any, i: number) => (
                          <tr key={i}>
                            <td className="px-3 py-2">{section.name}</td>
                            <td className="px-3 py-2">{section.subject || '-'}</td>
                            <td className="px-3 py-2">{section.questions || '-'}</td>
                            <td className="px-3 py-2">{section.marks || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Important Dates */}
        {exam.importantDates?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Important Dates
            </h2>
            <div className="space-y-3">
              {exam.importantDates.map((date: any, i: number) => (
                <div key={i} className="flex items-start gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="bg-blue-100 text-blue-700 rounded-lg px-3 py-1 text-sm font-medium whitespace-nowrap">
                    {new Date(date.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{date.event}</p>
                    {date.description && <p className="text-sm text-gray-600 mt-0.5">{date.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
