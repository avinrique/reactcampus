import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface ListEditorProps {
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
}

export function ListEditor({ value = [], onChange, disabled }: ListEditorProps) {
  const addItem = () => onChange([...value, '']);
  const removeItem = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  const updateItem = (idx: number, text: string) => {
    const items = [...value];
    items[idx] = text;
    onChange(items);
  };

  if (disabled) {
    return (
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        {value.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
        {value.length === 0 && <p className="text-gray-400">No list items</p>}
      </ul>
    );
  }

  return (
    <div className="space-y-2">
      {value.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-blue-500 text-sm flex-shrink-0">&#9679;</span>
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(idx, e.target.value)}
            placeholder={`Item ${idx + 1}...`}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
      </Button>
    </div>
  );
}
