import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, BookOpen, ArrowRight, SlidersHorizontal,
  ChevronRight, Home, X, Clock, IndianRupee,
} from 'lucide-react';
import { usePublicCourses } from '../hooks/usePublicCourses';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { COURSE_LEVELS } from '@/config/constants';

export default function CourseListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const level = searchParams.get('level') || '';
  const stream = searchParams.get('stream') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [showFilters, setShowFilters] = useState(false);

  const params: Record<string, any> = { page, limit: 12 };
  if (search) params.search = search;
  if (level) params.level = level;
  if (stream) params.stream = stream;

  const { data, isLoading } = usePublicCourses(params);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const hasFilters = search || level || stream;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-orange-100 mb-4">
            <Link to="/" className="hover:text-white transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Courses</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Explore Courses</h1>
          <p className="text-orange-100 text-sm md:text-base">
            Browse {data?.pagination?.total ? `${data.pagination.total}+` : ''} courses. Filter by level, stream, and more.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search courses by name..."
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button type="submit" className="px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                Search
              </button>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                showFilters || hasFilters
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && (
                <span className="w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {[level, stream, search].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Level</label>
                  <select
                    value={level}
                    onChange={(e) => updateParam('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent capitalize"
                  >
                    <option value="">All Levels</option>
                    {COURSE_LEVELS.map((l) => (
                      <option key={l} value={l} className="capitalize">{l}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Stream</label>
                  <input
                    type="text"
                    value={stream}
                    onChange={(e) => updateParam('stream', e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active Filter Tags */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-gray-500 font-medium">Active:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200">
                &ldquo;{search}&rdquo;
                <button onClick={() => { updateParam('search', ''); setSearchInput(''); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {level && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200 capitalize">
                {level}
                <button onClick={() => updateParam('level', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {stream && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200 capitalize">
                {stream}
                <button onClick={() => updateParam('stream', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        {data?.pagination && (
          <p className="text-sm text-gray-500 mb-4">
            Showing <span className="font-medium text-gray-700">{data.data.length}</span> of{' '}
            <span className="font-medium text-gray-700">{data.pagination.total}</span> courses
          </p>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : !data?.data.length ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No courses found</h3>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {data.data.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="h-1.5 bg-gradient-to-r from-orange-500 to-orange-400" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors mt-1" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors mb-2">
                      {course.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full font-medium capitalize">
                        {course.level}
                      </span>
                      {course.stream && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium capitalize">
                          {course.stream}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration.value} {course.duration.unit}
                      </span>
                      {course.fees?.amount > 0 && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <IndianRupee className="w-3 h-3" />
                          {(course.fees.amount / 100000).toFixed(1)}L / {course.fees.per}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {data.pagination && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <Pagination
                  page={data.pagination.page}
                  totalPages={data.pagination.pages}
                  onPageChange={(p) => {
                    const next = new URLSearchParams(searchParams);
                    next.set('page', String(p));
                    setSearchParams(next);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
