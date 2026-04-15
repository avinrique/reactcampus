import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqEditorProps {
  value: FaqItem[];
  onChange: (v: FaqItem[]) => void;
  disabled?: boolean;
}

export function FaqEditor({ value = [], onChange, disabled }: FaqEditorProps) {
  const addItem = () => onChange([...value, { question: '', answer: '' }]);

  const removeItem = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  const updateItem = (idx: number, field: 'question' | 'answer', text: string) => {
    const items = value.map((item, i) => (i === idx ? { ...item, [field]: text } : item));
    onChange(items);
  };

  if (disabled) {
    return (
      <div className="space-y-3">
        {value.map((item, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <p className="font-medium text-sm text-gray-800">Q: {item.question}</p>
            <p className="text-sm text-gray-600 mt-1">A: {item.answer}</p>
          </div>
        ))}
        {value.length === 0 && <p className="text-gray-400 text-sm">No FAQ items</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {value.map((item, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1">Q{idx + 1}</span>
            <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1" title="Remove FAQ">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <input
            type="text"
            value={item.question}
            onChange={(e) => updateItem(idx, 'question', e.target.value)}
            placeholder="Enter question..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
          />
          <textarea
            value={item.answer}
            onChange={(e) => updateItem(idx, 'answer', e.target.value)}
            placeholder="Enter answer..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Add FAQ Item
      </Button>
    </div>
  );
}
