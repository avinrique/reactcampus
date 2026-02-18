import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Settings2, Layout, BarChart3, Star, Phone, Info } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSettings } from '../hooks/useSiteSettings';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSIONS } from '@/config/permissions';
import { Spinner } from '@/components/ui/Spinner';
import type { SiteSettings, UpdateSiteSettingsRequest, StatItem, CtaButton, CategoryPill } from '@/types/siteSettings';

const TABS = [
  { key: 'hero', label: 'Hero', icon: Layout },
  { key: 'stats', label: 'Stats', icon: BarChart3 },
  { key: 'featured', label: 'Featured', icon: Star },
  { key: 'cta', label: 'CTA', icon: Settings2 },
  { key: 'contact', label: 'Contact', icon: Phone },
  { key: 'about', label: 'About', icon: Info },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function SiteSettingsPage() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const { hasPermission } = useAuth();
  const canEdit = hasPermission(PERMISSIONS.SITE_SETTINGS_UPDATE);
  const [activeTab, setActiveTab] = useState<TabKey>('hero');

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage homepage content, contact info, and about page.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {settings && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'hero' && <HeroTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'stats' && <StatsTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'featured' && <FeaturedTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'cta' && <CtaTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'contact' && <ContactTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
          {activeTab === 'about' && <AboutTab settings={settings} onSave={updateMutation} canEdit={canEdit} />}
        </div>
      )}
    </div>
  );
}

// ─── Hero Tab ──────────────────────────────────────────────────────────────────

function HeroTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [title, setTitle] = useState(settings.hero?.title || '');
  const [titleHighlight, setTitleHighlight] = useState(settings.hero?.titleHighlight || '');
  const [subtitle, setSubtitle] = useState(settings.hero?.subtitle || '');
  const [searchPlaceholder, setSearchPlaceholder] = useState(settings.hero?.searchPlaceholder || '');
  const [categories, setCategories] = useState<CategoryPill[]>(settings.hero?.categories || []);

  useEffect(() => {
    setTitle(settings.hero?.title || '');
    setTitleHighlight(settings.hero?.titleHighlight || '');
    setSubtitle(settings.hero?.subtitle || '');
    setSearchPlaceholder(settings.hero?.searchPlaceholder || '');
    setCategories(settings.hero?.categories || []);
  }, [settings]);

  const handleSave = () => {
    onSave.mutate({ hero: { title, titleHighlight, subtitle, searchPlaceholder, categories } });
  };

  const addCategory = () => {
    setCategories([...categories, { label: '', icon: '', to: '' }]);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof CategoryPill, value: string) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title Highlight (second line)</label>
          <input type="text" value={titleHighlight} onChange={(e) => setTitleHighlight(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search Placeholder</label>
        <input type="text" value={searchPlaceholder} onChange={(e) => setSearchPlaceholder(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Category Pills</label>
          {canEdit && (
            <button onClick={addCategory} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={cat.label} onChange={(e) => updateCategory(i, 'label', e.target.value)} placeholder="Label" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              <input type="text" value={cat.icon} onChange={(e) => updateCategory(i, 'icon', e.target.value)} placeholder="Icon (emoji)" readOnly={!canEdit} className="w-24 border rounded-lg px-3 py-1.5 text-sm" />
              <input type="text" value={cat.to} onChange={(e) => updateCategory(i, 'to', e.target.value)} placeholder="Link" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              {canEdit && (
                <button onClick={() => removeCategory(i)} className="text-red-500 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── Stats Tab ─────────────────────────────────────────────────────────────────

function StatsTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [stats, setStats] = useState<StatItem[]>(settings.stats || []);

  useEffect(() => { setStats(settings.stats || []); }, [settings]);

  const handleSave = () => { onSave.mutate({ stats }); };

  const addStat = () => {
    setStats([...stats, { label: '', value: '', icon: 'building', color: 'text-brand-500' }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Stats Counter Items</label>
        {canEdit && (
          <button onClick={addStat} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </button>
        )}
      </div>
      <div className="space-y-3">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
            <input type="text" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="Value (e.g. 1000+)" readOnly={!canEdit} className="w-32 border rounded-lg px-3 py-1.5 text-sm" />
            <select value={stat.icon} onChange={(e) => updateStat(i, 'icon', e.target.value)} disabled={!canEdit} className="w-32 border rounded-lg px-3 py-1.5 text-sm">
              <option value="building">Building</option>
              <option value="book">Book</option>
              <option value="file">File</option>
              <option value="users">Users</option>
            </select>
            <select value={stat.color} onChange={(e) => updateStat(i, 'color', e.target.value)} disabled={!canEdit} className="w-40 border rounded-lg px-3 py-1.5 text-sm">
              <option value="text-brand-500">Orange</option>
              <option value="text-green-500">Green</option>
              <option value="text-blue-500">Blue</option>
              <option value="text-purple-500">Purple</option>
              <option value="text-red-500">Red</option>
            </select>
            {canEdit && (
              <button onClick={() => removeStat(i)} className="text-red-500 hover:text-red-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── Featured Tab ──────────────────────────────────────────────────────────────

function FeaturedTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [collegeIds, setCollegeIds] = useState('');
  const [courseIds, setCourseIds] = useState('');
  const [examIds, setExamIds] = useState('');

  useEffect(() => {
    setCollegeIds((settings.featuredColleges || []).map((c: any) => c._id || c).join(', '));
    setCourseIds((settings.featuredCourses || []).map((c: any) => c._id || c).join(', '));
    setExamIds((settings.featuredExams || []).map((c: any) => c._id || c).join(', '));
  }, [settings]);

  const parseIds = (str: string) => str.split(',').map((s) => s.trim()).filter(Boolean);

  const handleSave = () => {
    onSave.mutate({
      featuredColleges: parseIds(collegeIds),
      featuredCourses: parseIds(courseIds),
      featuredExams: parseIds(examIds),
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Enter comma-separated MongoDB ObjectIDs. Leave empty to show the latest items on the homepage.
      </p>

      {/* Current featured items */}
      {settings.featuredColleges?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Featured Colleges</label>
          <div className="flex flex-wrap gap-2">
            {settings.featuredColleges.map((c: any) => (
              <span key={c._id || c} className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded-full">
                {c.name || c._id || c}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Featured College IDs</label>
        <textarea value={collegeIds} onChange={(e) => setCollegeIds(e.target.value)} rows={2} placeholder="id1, id2, id3..." readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
      </div>

      {settings.featuredCourses?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Featured Courses</label>
          <div className="flex flex-wrap gap-2">
            {settings.featuredCourses.map((c: any) => (
              <span key={c._id || c} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                {c.name || c._id || c}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Course IDs</label>
        <textarea value={courseIds} onChange={(e) => setCourseIds(e.target.value)} rows={2} placeholder="id1, id2, id3..." readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
      </div>

      {settings.featuredExams?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Featured Exams</label>
          <div className="flex flex-wrap gap-2">
            {settings.featuredExams.map((c: any) => (
              <span key={c._id || c} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                {c.name || c._id || c}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Exam IDs</label>
        <textarea value={examIds} onChange={(e) => setExamIds(e.target.value)} rows={2} placeholder="id1, id2, id3..." readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
      </div>

      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── CTA Tab ───────────────────────────────────────────────────────────────────

function CtaTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [title, setTitle] = useState(settings.cta?.title || '');
  const [subtitle, setSubtitle] = useState(settings.cta?.subtitle || '');
  const [buttons, setButtons] = useState<CtaButton[]>(settings.cta?.buttons || []);

  useEffect(() => {
    setTitle(settings.cta?.title || '');
    setSubtitle(settings.cta?.subtitle || '');
    setButtons(settings.cta?.buttons || []);
  }, [settings]);

  const handleSave = () => { onSave.mutate({ cta: { title, subtitle, buttons } }); };

  const addButton = () => {
    setButtons([...buttons, { label: '', to: '', variant: 'primary', icon: '' }]);
  };

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const updateButton = (index: number, field: keyof CtaButton, value: string) => {
    const updated = [...buttons];
    updated[index] = { ...updated[index], [field]: value } as CtaButton;
    setButtons(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CTA Subtitle</label>
        <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Buttons</label>
          {canEdit && (
            <button onClick={addButton} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Button
            </button>
          )}
        </div>
        <div className="space-y-2">
          {buttons.map((btn, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={btn.label} onChange={(e) => updateButton(i, 'label', e.target.value)} placeholder="Label" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              <input type="text" value={btn.to} onChange={(e) => updateButton(i, 'to', e.target.value)} placeholder="Link" readOnly={!canEdit} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
              <select value={btn.variant} onChange={(e) => updateButton(i, 'variant', e.target.value)} disabled={!canEdit} className="w-28 border rounded-lg px-3 py-1.5 text-sm">
                <option value="primary">Primary</option>
                <option value="outline">Outline</option>
              </select>
              {canEdit && (
                <button onClick={() => removeButton(i)} className="text-red-500 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── Contact Tab ───────────────────────────────────────────────────────────────

function ContactTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [email, setEmail] = useState(settings.contact?.email || '');
  const [phone, setPhone] = useState(settings.contact?.phone || '');
  const [address, setAddress] = useState(settings.contact?.address || '');
  const [mapEmbedUrl, setMapEmbedUrl] = useState(settings.contact?.mapEmbedUrl || '');

  useEffect(() => {
    setEmail(settings.contact?.email || '');
    setPhone(settings.contact?.phone || '');
    setAddress(settings.contact?.address || '');
    setMapEmbedUrl(settings.contact?.mapEmbedUrl || '');
  }, [settings]);

  const handleSave = () => {
    onSave.mutate({ contact: { email, phone, address, mapEmbedUrl } });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
        <input type="text" value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} placeholder="https://www.google.com/maps/embed?..." readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── About Tab ─────────────────────────────────────────────────────────────────

function AboutTab({ settings, onSave, canEdit }: { settings: SiteSettings; onSave: any; canEdit: boolean }) {
  const [content, setContent] = useState(settings.about?.content || '');
  const [mission, setMission] = useState(settings.about?.mission || '');
  const [vision, setVision] = useState(settings.about?.vision || '');

  useEffect(() => {
    setContent(settings.about?.content || '');
    setMission(settings.about?.mission || '');
    setVision(settings.about?.vision || '');
  }, [settings]);

  const handleSave = () => {
    onSave.mutate({ about: { content, mission, vision } });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">About Content (HTML)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
        <textarea value={mission} onChange={(e) => setMission(e.target.value)} rows={3} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
        <textarea value={vision} onChange={(e) => setVision(e.target.value)} rows={3} readOnly={!canEdit} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>
      {canEdit && <SaveButton onClick={handleSave} loading={onSave.isPending} />}
    </div>
  );
}

// ─── Save Button ───────────────────────────────────────────────────────────────

function SaveButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <div className="pt-4 border-t">
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <Save className="w-4 h-4" />
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
