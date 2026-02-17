import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BookOpen, Star, MessageSquare, Phone, ExternalLink, ChevronDown, Building2 } from 'lucide-react';
import { usePublicCollege, usePublicCollegeReviews, usePublicCollegeSections } from '../hooks/usePublicColleges';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Spinner } from '@/components/ui/Spinner';
import { StarRating } from '@/components/ui/StarRating';
import { Pagination } from '@/components/ui/Pagination';
import type { ContentSection } from '@/types/contentSection';

const TAB_LABELS: Record<string, string> = {
  overview: 'Overview',
  'courses-fee': 'Courses & Fees',
  placements: 'Placements',
  admission: 'Admission',
  cutoff: 'Cutoff',
  scholarship: 'Scholarship',
  faculty: 'Faculty',
  infrastructure: 'Infrastructure',
};

function SectionRenderer({ section }: { section: ContentSection }) {
  const content = section.content as any;
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set());

  const toggleFaq = (i: number) => {
    setFaqOpen(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>

      {section.contentType === 'richtext' && (
        <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: content?.body || '' }} />
      )}

      {section.contentType === 'table' && content?.headers && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-orange-50">
              <tr>
                {content.headers.map((h: string, i: number) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {content.rows?.map((row: string[], ri: number) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell: string, ci: number) => (
                    <td key={ci} className={`px-4 py-3 text-sm ${ci === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.contentType === 'faq' && (
        <div className="space-y-2">
          {content?.items?.map((item: any, i: number) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left"
              >
                <span className="font-medium text-sm text-gray-900">{item.question}</span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${faqOpen.has(i) ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen.has(i) && (
                <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {section.contentType === 'list' && (
        <ul className="space-y-2">
          {content?.items?.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      )}

      {section.contentType === 'gallery' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content?.images?.map((img: any, i: number) => (
            <div key={i}>
              <img src={img.url} alt={img.caption || ''} className="w-full h-48 object-cover rounded-lg" />
              {img.caption && <p className="text-xs text-gray-500 mt-1">{img.caption}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CollegeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: college, isLoading } = usePublicCollege(slug!);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewPage, setReviewPage] = useState(1);
  const { data: reviewsData } = usePublicCollegeReviews(slug!, { page: reviewPage });
  const { data: sections } = usePublicCollegeSections(slug!);

  const [reviewForm, setReviewForm] = useState({
    authorName: '', authorEmail: '', rating: 5, title: '', content: '',
  });
  const submitReview = useMutation({
    mutationFn: (data: typeof reviewForm) => api.post(`/public/reviews`, { ...data, college: college?._id }),
  });

  // Build dynamic tabs from content sections
  const { contentTabs, sectionsByTab } = useMemo(() => {
    if (!sections?.length) return { contentTabs: [], sectionsByTab: {} };
    const byTab: Record<string, ContentSection[]> = {};
    for (const s of sections) {
      if (!s.isVisible) continue;
      if (!byTab[s.sectionKey]) byTab[s.sectionKey] = [];
      byTab[s.sectionKey].push(s);
    }
    for (const key of Object.keys(byTab)) {
      byTab[key].sort((a, b) => a.order - b.order);
    }
    return { contentTabs: Object.keys(byTab), sectionsByTab: byTab };
  }, [sections]);

  const tabs = useMemo(() => {
    const tabList: { key: string; label: string }[] = [];
    const tabOrder = ['overview', 'courses-fee', 'placements', 'admission', 'cutoff', 'scholarship', 'faculty', 'infrastructure'];

    // Add content-driven tabs in order
    const sorted = [...contentTabs].sort((a, b) => {
      const ai = tabOrder.indexOf(a);
      const bi = tabOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    for (const key of sorted) {
      tabList.push({ key, label: TAB_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ') });
    }

    // Add static tabs
    if (!tabList.find(t => t.key === 'courses')) {
      tabList.push({ key: 'courses', label: 'Courses' });
    }
    tabList.push({ key: 'reviews', label: 'Reviews' });

    return tabList;
  }, [contentTabs]);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!college) return <div className="text-center py-16 text-gray-500">College not found.</div>;

  const currentYear = new Date().getFullYear();
  const col = college as any;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {college.coverImage && (
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <img src={college.coverImage} alt="" className="w-full h-full object-cover opacity-40" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {college.logo ? (
                <img src={college.logo} alt={college.name} className="w-20 h-20 rounded-lg border border-gray-200 object-contain bg-white" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{college.name}</h1>
              <p className="text-sm text-gray-500 mb-3">
                Ranking, Admissions {currentYear}, Placements, Fees & Cutoff
              </p>

              {college.location && (
                <p className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {college.location.city}{college.location.state ? `, ${college.location.state}` : ''}
                </p>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {college.established && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500">Established</p>
                    <p className="text-sm font-semibold text-gray-900">{college.established}</p>
                  </div>
                )}
                {col.accreditation && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500">Accreditation</p>
                    <p className="text-sm font-semibold text-gray-900">{col.accreditation}</p>
                  </div>
                )}
                {col.affiliation && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500">Affiliation</p>
                    <p className="text-sm font-semibold text-gray-900">{col.affiliation}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{college.type}</p>
                </div>
                {college.ranking && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500">NIRF Ranking</p>
                    <p className="text-sm font-semibold text-gray-900">#{college.ranking}</p>
                  </div>
                )}
                {(college.fees?.min > 0 || college.fees?.max > 0) && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500">Fees Range</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {college.fees.currency === 'INR' ? '₹' : college.fees.currency}
                      {college.fees.min > 0 ? `${(college.fees.min / 100000).toFixed(1)}L` : '0'}
                      {' - '}
                      {college.fees.max > 0 ? `${(college.fees.max / 100000).toFixed(1)}L` : '0'}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  onClick={() => {
                    const el = document.getElementById('review-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setActiveTab('reviews');
                  }}
                >
                  <Phone className="w-4 h-4" />
                  Contact College
                </button>
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Facilities */}
          {col.facilities?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Facilities</p>
              <div className="flex flex-wrap gap-2">
                {col.facilities.map((f: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex -mb-px min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Dynamic content tabs */}
        {sectionsByTab[activeTab] && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            {sectionsByTab[activeTab].map((section) => (
              <SectionRenderer key={section._id} section={section} />
            ))}
          </div>
        )}

        {/* Courses tab */}
        {activeTab === 'courses' && !sectionsByTab['courses'] && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" /> Courses Offered
            </h2>
            {!college.courses?.length ? (
              <p className="text-gray-500">No courses listed yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {college.courses.map((course: any) => (
                  <Link
                    key={course._id}
                    to={`/courses/${course.slug}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{course.name}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="capitalize">{course.level}</span> · {course.duration?.value} {course.duration?.unit}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6" id="review-section">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Write a Review
              </h2>
              {submitReview.isSuccess ? (
                <p className="text-green-600 font-medium">Thank you! Your review has been submitted for moderation.</p>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); submitReview.mutate(reviewForm); }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text" required placeholder="Your Name"
                      value={reviewForm.authorName}
                      onChange={(e) => setReviewForm(p => ({ ...p, authorName: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="email" required placeholder="Your Email"
                      value={reviewForm.authorEmail}
                      onChange={(e) => setReviewForm(p => ({ ...p, authorEmail: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <StarRating rating={reviewForm.rating} interactive onChange={(v) => setReviewForm(p => ({ ...p, rating: v }))} />
                  </div>
                  <input
                    type="text" required placeholder="Review Title"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <textarea
                    required placeholder="Write your review..."
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm(p => ({ ...p, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    disabled={submitReview.isPending}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                  >
                    {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                  </button>
                  {submitReview.isError && (
                    <p className="text-sm text-red-600">Failed to submit review. Please try again.</p>
                  )}
                </form>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" /> Reviews
              </h2>
              {!reviewsData?.data.length ? (
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviewsData.data.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{review.authorName}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>}
                      <p className="text-sm text-gray-600">{review.content}</p>
                    </div>
                  ))}
                  {reviewsData.pagination && (
                    <Pagination
                      page={reviewsData.pagination.page}
                      totalPages={reviewsData.pagination.pages}
                      onPageChange={setReviewPage}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
