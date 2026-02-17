import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { usePage, useCreatePage, useUpdatePage } from '../hooks/usePages';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { CreatePageRequest, PageContentBlock, PageSidebarGroup } from '@/types/page';

interface PageFormData {
  title: string;
  description: string;
  contentBlocks: PageContentBlock[];
  collegeFilter: {
    enabled: boolean;
    filterBy: string;
    courses: string;
    exams: string;
    collegeType: string;
    state: string;
    city: string;
  };
  sidebarLinks: PageSidebarGroup[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const CONTENT_TYPE_OPTIONS = [
  { label: 'Rich Text', value: 'richtext' },
  { label: 'Table', value: 'table' },
  { label: 'FAQ', value: 'faq' },
  { label: 'List', value: 'list' },
];

const FILTER_BY_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Course', value: 'course' },
  { label: 'Exam', value: 'exam' },
  { label: 'Type', value: 'type' },
  { label: 'State', value: 'state' },
  { label: 'City', value: 'city' },
];

export default function PageFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: page, isLoading } = usePage(id || '');
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();

  const { register, handleSubmit, reset, control, watch } = useForm<PageFormData>({
    defaultValues: {
      title: '',
      description: '',
      contentBlocks: [],
      collegeFilter: { enabled: false, filterBy: 'all', courses: '', exams: '', collegeType: '', state: '', city: '' },
      sidebarLinks: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
  });

  const {
    fields: blockFields,
    append: appendBlock,
    remove: removeBlock,
    swap: swapBlocks,
  } = useFieldArray({ control, name: 'contentBlocks' });

  const {
    fields: sidebarFields,
    append: appendSidebar,
    remove: removeSidebar,
  } = useFieldArray({ control, name: 'sidebarLinks' });

  const collegeFilterEnabled = watch('collegeFilter.enabled');
  const filterBy = watch('collegeFilter.filterBy');

  useEffect(() => {
    if (page) {
      reset({
        title: page.title,
        description: page.description || '',
        contentBlocks: page.contentBlocks || [],
        collegeFilter: {
          enabled: page.collegeFilter?.enabled || false,
          filterBy: page.collegeFilter?.filterBy || 'all',
          courses: (page.collegeFilter?.courses || []).join(', '),
          exams: (page.collegeFilter?.exams || []).join(', '),
          collegeType: page.collegeFilter?.collegeType || '',
          state: page.collegeFilter?.state || '',
          city: page.collegeFilter?.city || '',
        },
        sidebarLinks: page.sidebarLinks || [],
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || '',
        metaKeywords: (page.metaKeywords || []).join(', '),
      });
    }
  }, [page, reset]);

  const onSubmit = (data: PageFormData) => {
    const payload: CreatePageRequest = {
      title: data.title,
      description: data.description || '',
      contentBlocks: data.contentBlocks.map((b, i) => ({ ...b, order: i })),
      collegeFilter: {
        enabled: data.collegeFilter.enabled,
        filterBy: data.collegeFilter.filterBy as any,
        courses: data.collegeFilter.courses ? data.collegeFilter.courses.split(',').map((s) => s.trim()).filter(Boolean) : [],
        exams: data.collegeFilter.exams ? data.collegeFilter.exams.split(',').map((s) => s.trim()).filter(Boolean) : [],
        collegeType: data.collegeFilter.collegeType || '',
        state: data.collegeFilter.state || '',
        city: data.collegeFilter.city || '',
      },
      sidebarLinks: data.sidebarLinks,
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      metaKeywords: data.metaKeywords ? data.metaKeywords.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };

    if (isEdit) {
      updatePage.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/admin/pages') });
    } else {
      createPage.mutate(payload, { onSuccess: () => navigate('/admin/pages') });
    }
  };

  if (isEdit && isLoading) return <LoadingOverlay />;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Page' : 'Create Page'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <Input label="Title" {...register('title', { required: true })} />
            <Textarea label="Description (HTML supported)" {...register('description')} />
          </div>
        </Card>

        {/* Content Blocks */}
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Content Blocks</h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  appendBlock({ title: '', contentType: 'richtext', content: '', order: blockFields.length })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Block
              </Button>
            </div>

            {blockFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Block {index + 1}</span>
                  <div className="flex gap-1">
                    {index > 0 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => swapBlocks(index, index - 1)}>
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index < blockFields.length - 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => swapBlocks(index, index + 1)}>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    )}
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeBlock(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <Input label="Section Title" {...register(`contentBlocks.${index}.title`)} />
                <Select
                  label="Content Type"
                  options={CONTENT_TYPE_OPTIONS}
                  {...register(`contentBlocks.${index}.contentType`)}
                />
                <Textarea
                  label="Content (HTML for richtext, JSON for table/faq/list)"
                  {...register(`contentBlocks.${index}.content`)}
                />
              </div>
            ))}

            {blockFields.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No content blocks yet. Click "Add Block" to start.</p>
            )}
          </div>
        </Card>

        {/* College Listing Config */}
        <Card>
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">College Listing</h2>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('collegeFilter.enabled')} className="rounded" />
              <span className="text-sm">Enable college listing on this page</span>
            </label>

            {collegeFilterEnabled && (
              <div className="space-y-3">
                <Select label="Filter By" options={FILTER_BY_OPTIONS} {...register('collegeFilter.filterBy')} />
                {filterBy === 'course' && (
                  <Input label="Course IDs (comma-separated)" {...register('collegeFilter.courses')} />
                )}
                {filterBy === 'exam' && (
                  <Input label="Exam IDs (comma-separated)" {...register('collegeFilter.exams')} />
                )}
                {filterBy === 'type' && (
                  <Input label="College Type (e.g. public, private)" {...register('collegeFilter.collegeType')} />
                )}
                {filterBy === 'state' && <Input label="State" {...register('collegeFilter.state')} />}
                {filterBy === 'city' && <Input label="City" {...register('collegeFilter.city')} />}
              </div>
            )}
          </div>
        </Card>

        {/* Sidebar Links */}
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Sidebar Links</h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => appendSidebar({ title: '', links: [{ label: '', url: '' }] })}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Group
              </Button>
            </div>

            {sidebarFields.map((group, groupIndex) => (
              <SidebarGroupEditor
                key={group.id}
                groupIndex={groupIndex}
                register={register}
                control={control}
                onRemove={() => removeSidebar(groupIndex)}
              />
            ))}

            {sidebarFields.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No sidebar groups yet.</p>
            )}
          </div>
        </Card>

        {/* SEO Meta */}
        <Card>
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">SEO Meta</h2>
            <Input label="Meta Title" {...register('metaTitle')} />
            <Textarea label="Meta Description" {...register('metaDescription')} />
            <Input label="Meta Keywords (comma-separated)" {...register('metaKeywords')} />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" isLoading={createPage.isPending || updatePage.isPending}>
            {isEdit ? 'Update Page' : 'Create Page'}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/pages')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

function SidebarGroupEditor({
  groupIndex,
  register,
  control,
  onRemove,
}: {
  groupIndex: number;
  register: any;
  control: any;
  onRemove: () => void;
}) {
  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({ control, name: `sidebarLinks.${groupIndex}.links` });

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Group {groupIndex + 1}</span>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      <Input label="Group Title" {...register(`sidebarLinks.${groupIndex}.title`)} />

      {linkFields.map((link, linkIndex) => (
        <div key={link.id} className="flex gap-2 items-end">
          <div className="flex-1">
            <Input label="Label" {...register(`sidebarLinks.${groupIndex}.links.${linkIndex}.label`)} />
          </div>
          <div className="flex-1">
            <Input label="URL" {...register(`sidebarLinks.${groupIndex}.links.${linkIndex}.url`)} />
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => removeLink(linkIndex)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="secondary" size="sm" onClick={() => appendLink({ label: '', url: '' })}>
        <Plus className="h-4 w-4 mr-1" /> Add Link
      </Button>
    </div>
  );
}
