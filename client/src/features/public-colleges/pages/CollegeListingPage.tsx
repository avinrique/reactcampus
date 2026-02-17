import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, Building2, Award, TrendingUp, SlidersHorizontal,
  ChevronRight, Home, X, GraduationCap,
} from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);

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

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const hasFilters = search || type || city || state;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-orange-100 mb-4">
            <Link to="/" className="hover:text-white transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Colleges</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Explore Top Colleges in India</h1>
          <p className="text-orange-100 text-sm md:text-base">
            Browse {data?.pagination?.total ? `${data.pagination.total}+` : ''} colleges across India. Filter by type, location, and more.
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
                  placeholder="Search colleges by name..."
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
                  {[type, city, state, search].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">College Type</label>
                  <select
                    value={type}
                    onChange={(e) => updateParam('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {COLLEGE_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => updateParam('city', e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => updateParam('state', e.target.value)}
                    placeholder="e.g. Karnataka"
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
            {type && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200 capitalize">
                {type}
                <button onClick={() => updateParam('type', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200">
                {city}
                <button onClick={() => updateParam('city', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {state && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200">
                {state}
                <button onClick={() => updateParam('state', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        {data?.pagination && (
          <p className="text-sm text-gray-500 mb-4">
            Showing <span className="font-medium text-gray-700">{data.data.length}</span> of{' '}
            <span className="font-medium text-gray-700">{data.pagination.total}</span> colleges
          </p>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : !data?.data.length ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No colleges found</h3>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {data.data.map((college) => (
                <Link
                  key={college._id}
                  to={`/colleges/${college.slug}`}
                  className="group block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="hidden sm:block w-1.5 bg-gradient-to-b from-orange-500 to-orange-400 flex-shrink-0" />
                    <div className="flex-1 p-5">
                      <div className="flex items-start gap-4">
                        {college.logo ? (
                          <img src={college.logo} alt="" className="w-14 h-14 rounded-lg border border-gray-200 object-contain bg-white flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-7 h-7 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors text-base">
                                {college.name}
                              </h3>
                              {college.location && (
                                <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  {college.location.city}{college.location.state ? `, ${college.location.state}` : ''}
                                </p>
                              )}
                            </div>
                            {(college as any).accreditation && (
                              <span className="flex-shrink-0 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                {(college as any).accreditation}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            <span className="px-2.5 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full font-medium capitalize">
                              {college.type}
                            </span>
                            {college.ranking && (
                              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1">
                                <Award className="w-3 h-3" /> NIRF #{college.ranking}
                              </span>
                            )}
                            {college.established && (
                              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                Estd {college.established}
                              </span>
                            )}
                            {college.fees?.max > 0 && (
                              <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                ₹{college.fees.max >= 100000
                                  ? `${(college.fees.max / 100000).toFixed(1)}L`
                                  : `${(college.fees.max / 1000).toFixed(0)}K`}
                              </span>
                            )}
                          </div>

                          {college.description && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{college.description}</p>
                          )}
                        </div>
                      </div>
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
