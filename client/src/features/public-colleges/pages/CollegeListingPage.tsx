import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { usePublicColleges } from '../hooks/usePublicColleges';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { COLLEGE_TYPES } from '@/config/constants';

export default function CollegeListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const city = searchParams.get('city') || '';
  const state = searchParams.get('state') || '';

  const [searchInput, setSearchInput] = useState(search);

  const params: Record<string, any> = { page, limit: 12 };
  if (search) params.search = search;
  if (type) params.type = type;
  if (city) params['location.city'] = city;
  if (state) params['location.state'] = state;

  const { data, isLoading } = usePublicColleges(params);

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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Colleges</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[250px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search colleges..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Search
            </button>
          </form>
          <select
            value={type}
            onChange={(e) => updateParam('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {COLLEGE_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
          <input
            type="text"
            value={city}
            onChange={(e) => updateParam('city', e.target.value)}
            placeholder="City"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={state}
            onChange={(e) => updateParam('state', e.target.value)}
            placeholder="State"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : !data?.data.length ? (
        <div className="text-center py-16 text-gray-500">No colleges found matching your criteria.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.data.map((college) => (
              <Link
                key={college._id}
                to={`/colleges/${college.slug}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{college.name}</h3>
                  {college.location && (
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {college.location.city}{college.location.state ? `, ${college.location.state}` : ''}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded capitalize">{college.type}</span>
                    {college.ranking && <span>Rank #{college.ranking}</span>}
                  </div>
                  {college.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{college.description}</p>
                  )}
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
