
import { useState } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDraggable } from "@/hooks/use-draggable";

const TEXT_BLOCKS = [
  {
    id: "heading",
    name: "Heading",
    content: "<h1 style='font-size: 24px; margin-bottom: 16px;'>Your Heading Here</h1>",
    preview: "Heading",
  },
  {
    id: "paragraph",
    name: "Paragraph",
    content: "<p style='margin-bottom: 16px;'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>",
    preview: "Paragraph text",
  },
  {
    id: "bullet-list",
    name: "Bullet List",
    content: "<ul style='margin-bottom: 16px;'><li>First item</li><li>Second item</li><li>Third item</li></ul>",
    preview: "• Bullet List",
  },
  {
    id: "quote",
    name: "Quote",
    content: "<blockquote style='border-left: 4px solid #e2e8f0; padding-left: 16px; margin-bottom: 16px; font-style: italic;'>This is a quote or testimonial that stands out.</blockquote>",
    preview: "Quote block",
  }
];

const LAYOUT_BLOCKS = [
  {
    id: "spacer",
    name: "Spacer",
    content: "<div style='height: 32px;'></div>",
    preview: "Spacing (32px)",
  },
  {
    id: "divider",
    name: "Divider",
    content: "<hr style='border: 0; height: 1px; background-color: #e2e8f0; margin: 20px 0;' />",
    preview: "Divider line",
  },
  {
    id: "two-column",
    name: "Two Columns",
    content: "<table width='100%' cellspacing='0' cellpadding='0'><tr><td width='50%' style='padding-right: 8px;'><p>Left column content.</p></td><td width='50%' style='padding-left: 8px;'><p>Right column content.</p></td></tr></table>",
    preview: "Two columns layout",
  }
];

const MEDIA_BLOCKS = [
  {
    id: "image",
    name: "Image",
    content: "<img src='https://via.placeholder.com/600x200' alt='Placeholder' style='max-width: 100%; height: auto; margin-bottom: 16px;' />",
    preview: "Image placeholder",
  },
  {
    id: "button",
    name: "Button",
    content: "<a href='#' style='display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; margin-bottom: 16px;'>Call to Action</a>",
    preview: "Button",
  },
  {
    id: "social-links",
    name: "Social Links",
    content: "<div style='margin-bottom: 16px;'><a href='#' style='text-decoration: none; margin-right: 16px;'>Twitter</a><a href='#' style='text-decoration: none; margin-right: 16px;'>Facebook</a><a href='#' style='text-decoration: none;'>LinkedIn</a></div>",
    preview: "Social media links",
  }
];

interface BlockGroupProps {
  title: string;
  blocks: {
    id: string;
    name: string;
    content: string;
    preview: string;
  }[];
  onDragStart: (content: string) => void;
}

const BlockGroup = ({ title, blocks, onDragStart }: BlockGroupProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-1 gap-2">
        {blocks.map((block) => (
          <div 
            key={block.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", block.content);
              onDragStart(block.content);
            }}
            className="border rounded-md p-2 bg-background flex items-center gap-2 cursor-move hover:bg-muted/50 transition-colors"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{block.preview}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TemplateContentBlockProps {
  content: string;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const TemplateContentBlock = ({ 
  content, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast 
}: TemplateContentBlockProps) => {
  const { isDragging, dragRef } = useDraggable();

  return (
    <div 
      className={cn(
        "relative border rounded-md mb-2 overflow-hidden group",
        isDragging && "opacity-50"
      )}
      ref={dragRef}
    >
      <div 
        className="p-3"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="absolute top-0 right-0 bg-background/80 backdrop-blur-sm p-1 opacity-0 group-hover:opacity-100 transition-opacity flex rounded-bl-md shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up">
            <path d="m5 12 7-7 7 7"/>
            <path d="M12 19V5"/>
          </svg>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={onMoveDown}
          disabled={isLast}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down">
            <path d="M12 5v14"/>
            <path d="m19 12-7 7-7-7"/>
          </svg>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-destructive hover:text-destructive" 
          onClick={onRemove}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export const EmailTemplateBlocks = ({ onSelectBlock }: { onSelectBlock: (content: string) => void }) => {
  return (
    <div className="h-full overflow-auto p-4">
      <h2 className="font-medium mb-4">Email Blocks</h2>
      <BlockGroup 
        title="Text Elements" 
        blocks={TEXT_BLOCKS} 
        onDragStart={onSelectBlock}
      />
      <BlockGroup 
        title="Layout Elements" 
        blocks={LAYOUT_BLOCKS} 
        onDragStart={onSelectBlock}
      />
      <BlockGroup 
        title="Media Elements" 
        blocks={MEDIA_BLOCKS} 
        onDragStart={onSelectBlock}
      />
    </div>
  );
};
