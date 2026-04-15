import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ value, onChange, disabled, placeholder, minHeight = '200px' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInitRef.current) {
      editorRef.current.innerHTML = value || '';
      isInitRef.current = true;
    }
  }, [value]);

  const execCommand = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  if (disabled) {
    return (
      <div
        className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-sm prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: value || '<span class="text-gray-400">No content</span>' }}
      />
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <button type="button" onClick={() => execCommand('bold')} className="p-1.5 rounded hover:bg-gray-200 text-sm font-bold" title="Bold">B</button>
        <button type="button" onClick={() => execCommand('italic')} className="p-1.5 rounded hover:bg-gray-200 text-sm italic" title="Italic">I</button>
        <button type="button" onClick={() => execCommand('underline')} className="p-1.5 rounded hover:bg-gray-200 text-sm underline" title="Underline">U</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('formatBlock', 'h2')} className="p-1.5 rounded hover:bg-gray-200 text-xs font-bold" title="Heading 2">H2</button>
        <button type="button" onClick={() => execCommand('formatBlock', 'h3')} className="p-1.5 rounded hover:bg-gray-200 text-xs font-bold" title="Heading 3">H3</button>
        <button type="button" onClick={() => execCommand('formatBlock', 'p')} className="p-1.5 rounded hover:bg-gray-200 text-xs" title="Paragraph">P</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 rounded hover:bg-gray-200 text-xs" title="Bullet List">&#8226; List</button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 rounded hover:bg-gray-200 text-xs" title="Numbered List">1. List</button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) execCommand('createLink', url);
          }}
          className="p-1.5 rounded hover:bg-gray-200 text-xs"
          title="Insert Link"
        >
          Link
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="p-3 text-sm prose prose-sm max-w-none focus:outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder || 'Start typing...'}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
      />
    </div>
  );
}
