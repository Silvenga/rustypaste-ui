import { useRef, useEffect } from "react";

type SyntaxHighlightEditorProps = {
  value: string;
  onChange: (value: string) => void;
  fileName?: string;
  isFullscreen: boolean;
};

export function SyntaxHighlightEditor({ value, onChange, fileName, isFullscreen }: SyntaxHighlightEditorProps) {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate line numbers
  const lineCount = value.split('\n').length;

  // Sync line numbers scroll with textarea scroll
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbersDiv = lineNumbersRef.current;
    if (!textarea || !lineNumbersDiv) return;

    const handleScroll = () => {
      lineNumbersDiv.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`border border-input rounded-md flex ${isFullscreen ? 'h-full' : 'h-[400px]'}`}
      style={{
        overflow: 'hidden',
      }}
    >
      {/* Line numbers */}
      <div
        ref={lineNumbersRef}
        className="bg-muted/30 text-muted-foreground text-right select-none flex-shrink-0"
        style={{
          width: '3.5em',
          paddingLeft: '0.5em',
          paddingRight: '0.5em',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: '"Fira Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '14px',
            lineHeight: '21px',
            paddingTop: '12px',
            paddingBottom: '12px',
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or type your text here..."
        spellCheck={false}
        className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] resize-none focus:outline-none border-none"
        style={{
          fontFamily: '"Fira Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '14px',
          lineHeight: '21px',
          padding: '12px',
          whiteSpace: 'pre',
          overflow: 'auto',
          height: '100%',
        }}
      />
    </div>
  );
}

