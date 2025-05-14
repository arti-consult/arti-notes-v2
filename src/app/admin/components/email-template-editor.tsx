
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X, Plus, MoveHorizontal, ArrowRight, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { EmailTemplateBlocks, TemplateContentBlock } from "./email-template-blocks";
import { cn } from "@/lib/utils";

interface EmailTemplateEditorProps {
  template?: {
    id: string;
    name: string;
    subject: string;
    content: string;
  };
  onSave: (template: { id: string; name: string; subject: string; content: string }) => void;
  onCancel: () => void;
}

const EmailTemplateEditor = ({ template, onSave, onCancel }: EmailTemplateEditorProps) => {
  const [name, setName] = useState(template?.name || "");
  const [subject, setSubject] = useState(template?.subject || "");
  const [id, setId] = useState(template?.id || `template-${Date.now()}`);
  const [activeTab, setActiveTab] = useState<"design" | "code">("design");
  const [blocks, setBlocks] = useState<string[]>([]);
  const [rawHtml, setRawHtml] = useState(template?.content || "");
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Process existing content into blocks when template changes
  useEffect(() => {
    if (template) {
      setName(template.name);
      setSubject(template.subject);
      setId(template.id);
      setRawHtml(template.content);
      
      // Try to parse content into blocks
      if (template.content) {
        try {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = template.content;
          
          const extractedBlocks: string[] = [];
          Array.from(tempDiv.children).forEach(child => {
            extractedBlocks.push(child.outerHTML);
          });
          
          if (extractedBlocks.length > 0) {
            setBlocks(extractedBlocks);
          } else {
            // If no blocks detected, treat entire content as one block
            setBlocks([template.content]);
          }
        } catch (error) {
          console.error("Error parsing template content:", error);
          setBlocks([template.content]);
        }
      } else {
        setBlocks([]);
      }
    } else {
      setName("");
      setSubject("");
      setId(`template-${Date.now()}`);
      setRawHtml("<p>Enter your template content here...</p>");
      setBlocks(["<p>Enter your template content here...</p>"]);
    }
  }, [template]);

  // Update raw HTML when blocks change
  useEffect(() => {
    const newContent = blocks.join("");
    setRawHtml(newContent);
  }, [blocks]);

  const handleAddBlock = (blockContent: string) => {
    setBlocks([...blocks, blockContent]);
    toast.success("Block added to template");
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const handleMoveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length) return;
    
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, removed);
    setBlocks(newBlocks);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("bg-primary/10", "ring-2");
    }
    
    const blockContent = e.dataTransfer.getData("text/plain");
    if (blockContent) {
      handleAddBlock(blockContent);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("bg-primary/10", "ring-2");
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("bg-primary/10", "ring-2");
    }
  };

  const handleSave = () => {
    if (!name.trim() || !subject.trim()) return;
    
    onSave({
      id,
      name: name.trim(),
      subject: subject.trim(),
      content: rawHtml
    });
  };

  const updateRawHtml = (html: string) => {
    setRawHtml(html);
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      const extractedBlocks: string[] = [];
      Array.from(tempDiv.children).forEach(child => {
        extractedBlocks.push(child.outerHTML);
      });
      
      if (extractedBlocks.length > 0) {
        setBlocks(extractedBlocks);
      } else {
        setBlocks([html]);
      }
    } catch (error) {
      console.error("Error parsing HTML:", error);
      setBlocks([html]);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] min-h-[600px]">
          {/* Sidebar with blocks */}
          <div className="w-full md:w-64 border-r bg-muted/30">
            <EmailTemplateBlocks onSelectBlock={handleAddBlock} />
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-background sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-medium">
                  {template ? "Edit Template" : "Create New Template"}
                </h3>
              </div>
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Template info */}
            <div className="p-4 border-b bg-background">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter template name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="template-subject">Email Subject</Label>
                  <Input
                    id="template-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            {/* Editor tabs */}
            <div className="border-b px-4 bg-background">
              <Tabs defaultValue="design" value={activeTab} onValueChange={(value) => setActiveTab(value as "design" | "code")}>
                <TabsList>
                  <TabsTrigger value="design" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span>Design</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                    <span>HTML</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Editor content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "design" ? (
                <div 
                  ref={dropZoneRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    "min-h-full p-6 transition-all duration-200 ring-primary",
                    blocks.length === 0 && "flex items-center justify-center"
                  )}
                >
                  {blocks.length > 0 ? (
                    <div className="max-w-3xl mx-auto">
                      {blocks.map((block, index) => (
                        <TemplateContentBlock
                          key={index}
                          content={block}
                          onRemove={() => handleRemoveBlock(index)}
                          onMoveUp={() => handleMoveBlock(index, index - 1)}
                          onMoveDown={() => handleMoveBlock(index, index + 1)}
                          isFirst={index === 0}
                          isLast={index === blocks.length - 1}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-muted/40 rounded-lg border-2 border-dashed border-muted-foreground/20">
                      <MoveHorizontal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Drag blocks here</h3>
                      <p className="text-muted-foreground mb-4">
                        Drag elements from the sidebar or click the button below to add content
                      </p>
                      <Button
                        onClick={() => handleAddBlock("<p>Enter your content here</p>")}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Paragraph
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6">
                  <div className="border rounded-md overflow-hidden">
                    <div className="p-3 bg-muted text-xs font-mono">HTML Editor</div>
                    <textarea
                      value={rawHtml}
                      onChange={(e) => updateRawHtml(e.target.value)}
                      className="w-full h-[400px] p-3 font-mono text-sm focus:outline-none focus:ring-0 border-0"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="p-4 border-t bg-background flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={!name.trim() || !subject.trim() || blocks.length === 0}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTemplateEditor;
