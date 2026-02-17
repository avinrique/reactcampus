import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, GraduationCap, BookOpen, FileText } from 'lucide-react';
import { usePublicColleges } from '@/features/public-colleges/hooks/usePublicColleges';
import { usePublicCourses } from '@/features/public-courses/hooks/usePublicCourses';
import { usePublicExams } from '@/features/public-exams/hooks/usePublicExams';
import { Spinner } from '@/components/ui/Spinner';

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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Perfect College
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore thousands of colleges, courses, and exams to find the right path for your education journey.
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search colleges, courses, exams..."
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Featured Colleges
          </h2>
          <Link to="/colleges" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {!collegesData ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collegesData.data.map((college) => (
              <Link
                key={college._id}
                to={`/colleges/${college.slug}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{college.name}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  {college.location?.city}{college.location?.state ? `, ${college.location.state}` : ''}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="capitalize">{college.type}</span>
                  {college.ranking && <span>Rank #{college.ranking}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular Courses */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-600" />
              Popular Courses
            </h2>
            <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          {!coursesData ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.data.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course.slug}`}
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="capitalize">{course.level}</span>
                    <span>{course.duration.value} {course.duration.unit}</span>
                    {course.stream && <span className="capitalize">{course.stream}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Exams */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            Popular Exams
          </h2>
          <Link to="/exams" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {!examsData ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examsData.data.map((exam) => (
              <Link
                key={exam._id}
                to={`/exams/${exam.slug}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.name}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="capitalize">{exam.examType?.replace('_', ' ')}</span>
                  {exam.conductedBy && <span>{exam.conductedBy}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
