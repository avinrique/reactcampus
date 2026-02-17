import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePublicExams } from '../hooks/usePublicExams';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { EXAM_TYPES } from '@/config/constants';

export default function ExamListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const examType = searchParams.get('examType') || '';

  const [searchInput, setSearchInput] = useState(search);

  const params: Record<string, any> = { page, limit: 12 };
  if (search) params.search = search;
  if (examType) params.examType = examType;

  const { data, isLoading } = usePublicExams(params);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Exams</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[250px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search exams..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Search
            </button>
          </form>
          <select
            value={examType}
            onChange={(e) => updateParam('examType', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {EXAM_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : !data?.data.length ? (
        <div className="text-center py-16 text-gray-500">No exams found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.data.map((exam) => (
              <Link
                key={exam._id}
                to={`/exams/${exam.slug}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded capitalize">
                    {exam.examType?.replace('_', ' ')}
                  </span>
                  {exam.conductedBy && <span>{exam.conductedBy}</span>}
                </div>
              </Link>
            ))}
          </div>
          {data.pagination && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.pages}
              onPageChange={(p) => {
                const next = new URLSearchParams(searchParams);
                next.set('page', String(p));
                setSearchParams(next);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
