import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { usePublicPage } from '../hooks/usePublicPages';
import { Spinner } from '@/components/ui/Spinner';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading } = usePublicPage(slug!);
  const [descExpanded, setDescExpanded] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!page) {
    return <div className="text-center py-16 text-gray-500">Page not found.</div>;
  }

  const toggleFaq = (blockIdx: number, faqIdx: number) => {
    const key = blockIdx * 1000 + faqIdx;
    setExpandedFaqs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sortedBlocks = [...(page.contentBlocks || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{page.title}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Column */}
        <div className="flex-1 lg:w-[70%] space-y-6">
          {/* Description */}
          {page.description && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div
                className={descExpanded ? '' : 'line-clamp-4'}
                dangerouslySetInnerHTML={{ __html: page.description }}
              />
              {page.description.length > 300 && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="text-blue-600 text-sm mt-2 flex items-center gap-1 hover:underline"
                >
                  {descExpanded ? (
                    <>
                      Read Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Content Blocks */}
          {sortedBlocks.map((block, blockIdx) => (
            <div key={blockIdx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {block.title && (
                <div className="bg-blue-600 text-white px-6 py-3">
                  <h2 className="text-lg font-semibold">{block.title}</h2>
                </div>
              )}
              <div className="p-6">
                {block.contentType === 'richtext' && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: typeof block.content === 'string' ? block.content : '' }}
                  />
                )}

                {block.contentType === 'table' && <TableRenderer content={block.content} />}

                {block.contentType === 'faq' && (
                  <FaqRenderer content={block.content} blockIdx={blockIdx} expandedFaqs={expandedFaqs} toggleFaq={toggleFaq} />
                )}

                {block.contentType === 'list' && <ListRenderer content={block.content} />}
              </div>
            </div>
          ))}

          {/* College Listing */}
          {page.collegeFilter?.enabled && (page as any).colleges?.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-600 text-white px-6 py-3">
                <h2 className="text-lg font-semibold">Colleges</h2>
              </div>
              <div className="p-6 space-y-4">
                {(page as any).colleges.map((college: any) => (
                  <Link
                    key={college._id}
                    to={`/colleges/${college.slug}`}
                    className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{college.name}</h3>
                        {college.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {college.location.city}
                            {college.location.state ? `, ${college.location.state}` : ''}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        {college.ranking && (
                          <span className="text-blue-600 font-medium">Rank #{college.ranking}</span>
                        )}
                        {college.established && (
                          <p className="text-gray-500">Est. {college.established}</p>
                        )}
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded capitalize text-xs">
                          {college.type}
                        </span>
                      </div>
                    </div>
                    {college.fees && (college.fees.min > 0 || college.fees.max > 0) && (
                      <p className="text-sm text-gray-600 mt-2">
                        Fees: {college.fees.min?.toLocaleString()} - {college.fees.max?.toLocaleString()} INR
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {page.sidebarLinks && page.sidebarLinks.length > 0 && (
          <aside className="lg:w-[30%] space-y-4">
            {page.sidebarLinks.map((group, gIdx) => (
              <div key={gIdx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {group.title && (
                  <div className="bg-gray-100 px-4 py-3 border-b">
                    <h3 className="font-semibold text-gray-800 text-sm">{group.title}</h3>
                  </div>
                )}
                <ul className="divide-y divide-gray-100">
                  {group.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        to={link.url}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}

function TableRenderer({ content }: { content: unknown }) {
  if (!content) return null;

  let tableData: { headers?: string[]; rows?: string[][] };
  try {
    tableData = typeof content === 'string' ? JSON.parse(content) : (content as any);
  } catch {
    return <div className="text-gray-500 text-sm">Invalid table data</div>;
  }

  if (!tableData.headers && !tableData.rows) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {tableData.headers && (
          <thead>
            <tr className="bg-gray-50">
              {tableData.headers.map((h, i) => (
                <th key={i} className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {tableData.rows?.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FaqRenderer({
  content,
  blockIdx,
  expandedFaqs,
  toggleFaq,
}: {
  content: unknown;
  blockIdx: number;
  expandedFaqs: Record<number, boolean>;
  toggleFaq: (blockIdx: number, faqIdx: number) => void;
}) {
  if (!content) return null;

  let faqs: { question: string; answer: string }[];
  try {
    faqs = typeof content === 'string' ? JSON.parse(content) : (content as any);
  } catch {
    return <div className="text-gray-500 text-sm">Invalid FAQ data</div>;
  }

  if (!Array.isArray(faqs)) return null;

  return (
    <div className="space-y-2">
      {faqs.map((faq, fIdx) => {
        const key = blockIdx * 1000 + fIdx;
        const isOpen = expandedFaqs[key];
        return (
          <div key={fIdx} className="border rounded-lg">
            <button
              onClick={() => toggleFaq(blockIdx, fIdx)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </button>
            {isOpen && (
              <div className="px-4 pb-3 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ListRenderer({ content }: { content: unknown }) {
  if (!content) return null;

  let items: string[];
  try {
    items = typeof content === 'string' ? JSON.parse(content) : (content as any);
  } catch {
    return <div className="text-gray-500 text-sm">Invalid list data</div>;
  }

  if (!Array.isArray(items)) return null;

  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-gray-700">
          <span className="text-blue-500 mt-1.5 text-xs">&#9679;</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}
