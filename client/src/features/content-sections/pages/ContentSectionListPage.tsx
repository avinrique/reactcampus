import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useContentSections, useCreateContentSection, useUpdateContentSection, useDeleteContentSection } from '../hooks/useContentSections';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { CONTENT_TYPES } from '@/config/constants';
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import type { ContentSection } from '@/types/contentSection';

const TAB_OPTIONS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Courses & Fees', value: 'courses-fee' },
  { label: 'Placements', value: 'placements' },
  { label: 'Admission', value: 'admission' },
  { label: 'Cutoff', value: 'cutoff' },
  { label: 'Scholarship', value: 'scholarship' },
  { label: 'Faculty', value: 'faculty' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Custom...', value: '__custom__' },
];

export default function ContentSectionListPage() {
  const { collegeId } = useParams();
  const { data: sections, isLoading } = useContentSections(collegeId || '');
  const createSection = useCreateContentSection();
  const updateSection = useUpdateContentSection();
  const deleteSection = useDeleteContentSection();
  const [editSection, setEditSection] = useState<ContentSection | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [collapsedTabs, setCollapsedTabs] = useState<Set<string>>(new Set());
  const [selectedTab, setSelectedTab] = useState('overview');
  const [customKey, setCustomKey] = useState('');
  const [form, setForm] = useState({ sectionKey: '', title: '', contentType: 'richtext', content: '', order: 0 });

  const grouped = useMemo(() => {
    if (!sections) return {};
    const groups: Record<string, ContentSection[]> = {};
    for (const s of sections) {
      if (!groups[s.sectionKey]) groups[s.sectionKey] = [];
      groups[s.sectionKey].push(s);
    }
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.order - b.order);
    }
    return groups;
  }, [sections]);

  const tabOrder = ['overview', 'courses-fee', 'placements', 'admission', 'cutoff', 'scholarship', 'faculty', 'infrastructure'];
  const sortedKeys = useMemo(() => {
    const keys = Object.keys(grouped);
    return keys.sort((a, b) => {
      const ai = tabOrder.indexOf(a);
      const bi = tabOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [grouped]);

  const tabLabel = (key: string) => {
    const found = TAB_OPTIONS.find(t => t.value === key);
    return found ? found.label : key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
  };

  const toggleTab = (key: string) => {
    setCollapsedTabs(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const openCreate = () => {
    setSelectedTab('overview');
    setCustomKey('');
    setForm({ sectionKey: '', title: '', contentType: 'richtext', content: '', order: 0 });
    setShowCreate(true);
  };

  const handleCreate = () => {
    const sectionKey = selectedTab === '__custom__' ? customKey.trim().toLowerCase().replace(/\s+/g, '-') : selectedTab;
    if (!sectionKey) return;
    createSection.mutate(
      { college: collegeId!, sectionKey, title: form.title, contentType: form.contentType as any, content: form.content, order: form.order },
      { onSuccess: () => { setShowCreate(false); setForm({ sectionKey: '', title: '', contentType: 'richtext', content: '', order: 0 }); } }
    );
  };

  const handleUpdate = () => {
    if (!editSection) return;
    updateSection.mutate(
      { id: editSection._id, data: { title: form.title, contentType: form.contentType as any, content: form.content, order: form.order } },
      { onSuccess: () => setEditSection(null) }
    );
  };

  const openEdit = (s: ContentSection) => {
    setEditSection(s);
    setForm({
      sectionKey: s.sectionKey,
      title: s.title,
      contentType: s.contentType,
      content: typeof s.content === 'string' ? s.content : JSON.stringify(s.content, null, 2),
      order: s.order,
    });
  };

  const getContentPlaceholder = (type: string) => {
    switch (type) {
      case 'richtext': return '<p>Your HTML content here...</p>';
      case 'table': return '{"headers":["Col1","Col2"],"rows":[["A","B"]]}';
      case 'faq': return '{"items":[{"question":"Q?","answer":"A."}]}';
      case 'list': return '{"items":["Item 1","Item 2"]}';
      case 'gallery': return '{"images":[{"url":"...","caption":"..."}]}';
      default: return '';
    }
  };

  if (isLoading) return <LoadingOverlay />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Content Sections</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Section</Button>
      </div>

      {sortedKeys.length === 0 && (
        <Card><p className="text-gray-500 text-center py-8">No content sections yet. Click "Add Section" to create one.</p></Card>
      )}

      {sortedKeys.map(key => {
        const items = grouped[key];
        const isCollapsed = collapsedTabs.has(key);
        return (
          <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleTab(key)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {isCollapsed ? <ChevronRight className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                <span className="font-semibold text-gray-800">{tabLabel(key)}</span>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{items.length} block{items.length !== 1 ? 's' : ''}</span>
              </div>
              <span className="text-xs text-gray-400 font-mono">{key}</span>
            </button>
            {!isCollapsed && (
              <div className="divide-y divide-gray-100">
                {items.map((s) => (
                  <div key={s._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-300" />
                      <div>
                        <h3 className="font-medium text-sm">{s.title}</h3>
                        <p className="text-xs text-gray-500">
                          {s.contentType} &middot; Order: {s.order}
                          {!s.isVisible && <span className="ml-2 text-orange-500">(hidden)</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => updateSection.mutate({ id: s._id, data: { isVisible: !s.isVisible } })}
                      >
                        {s.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(s._id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Modal
        isOpen={showCreate || !!editSection}
        onClose={() => { setShowCreate(false); setEditSection(null); }}
        title={editSection ? 'Edit Section' : 'New Section'}
        size="lg"
      >
        <div className="space-y-4">
          {!editSection && (
            <>
              <Select
                label="Tab (Section Key)"
                options={TAB_OPTIONS}
                value={selectedTab}
                onChange={e => setSelectedTab(e.target.value)}
              />
              {selectedTab === '__custom__' && (
                <Input
                  label="Custom Section Key"
                  placeholder="e.g. hostel-life"
                  value={customKey}
                  onChange={e => setCustomKey(e.target.value)}
                />
              )}
            </>
          )}
          {editSection && (
            <div className="text-sm text-gray-500">Tab: <span className="font-mono font-medium">{form.sectionKey}</span></div>
          )}
          <Input
            label="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <Select
            label="Content Type"
            options={CONTENT_TYPES.map(t => ({ label: t, value: t }))}
            value={form.contentType}
            onChange={e => setForm(f => ({ ...f, contentType: e.target.value }))}
          />
          <Input
            label="Order"
            type="number"
            value={form.order}
            onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
          />
          <div>
            <Textarea
              label="Content"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={10}
              placeholder={getContentPlaceholder(form.contentType)}
            />
            <p className="text-xs text-gray-400 mt-1">
              {form.contentType === 'richtext' && 'Enter HTML content. Use <p>, <strong>, <ul>, <li> tags.'}
              {form.contentType === 'table' && 'Enter JSON: {"headers": [...], "rows": [[...], ...]}'}
              {form.contentType === 'faq' && 'Enter JSON: {"items": [{"question": "...", "answer": "..."}]}'}
              {form.contentType === 'list' && 'Enter JSON: {"items": ["Item 1", "Item 2"]}'}
              {form.contentType === 'gallery' && 'Enter JSON: {"images": [{"url": "...", "caption": "..."}]}'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={editSection ? handleUpdate : handleCreate}
              isLoading={createSection.isPending || updateSection.isPending}
            >
              {editSection ? 'Update' : 'Create'}
            </Button>
            <Button variant="secondary" onClick={() => { setShowCreate(false); setEditSection(null); }}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteSection.mutate(deleteId); setDeleteId(null); } }}
        title="Delete Section"
        message="Are you sure you want to delete this content section?"
        confirmLabel="Delete"
      />
    </div>
  );
}
