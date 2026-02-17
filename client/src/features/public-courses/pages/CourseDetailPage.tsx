import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, DollarSign, GraduationCap } from 'lucide-react';
import { usePublicCourse } from '../hooks/usePublicCourses';
import { Spinner } from '@/components/ui/Spinner';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = usePublicCourse(slug!);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!course) return <div className="text-center py-16 text-gray-500">Course not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.name}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full capitalize">
            <GraduationCap className="w-4 h-4" /> {course.level}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {course.duration.value} {course.duration.unit}
          </span>
          {course.stream && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> {course.stream}
            </span>
          )}
        </div>

        {course.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About this Course</h2>
            <p className="text-gray-700">{course.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {course.fees && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                <DollarSign className="w-4 h-4" /> Fees
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                {course.fees.amount > 0 && <p>{course.fees.currency || '₹'}{course.fees.amount.toLocaleString()} / {course.fees.per}</p>}
              </div>
            </div>
          )}

          {course.eligibility && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Eligibility</h3>
              <p className="text-sm text-gray-600">{course.eligibility}</p>
            </div>
          )}
        </div>

        {course.specializations?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {course.specializations.map((spec: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
