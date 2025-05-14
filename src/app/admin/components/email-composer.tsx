
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Image,
  Text, 
  Send
} from "lucide-react";
import { motion } from "framer-motion";

interface EmailComposerProps {
  recipient: string;
  onSend: (content: string, subject: string) => void;
  onCancel: () => void;
  isSending: boolean;
  initialSubject?: string;
  initialContent?: string;
}

// Icons and their commands for the editor toolbar
const EDITOR_BUTTONS = [
  { icon: Bold, title: "Bold", cmd: "bold" },
  { icon: Italic, title: "Italic", cmd: "italic" },
  { icon: Underline, title: "Underline", cmd: "underline" },
  { icon: Link, title: "Insert Link", cmd: "createLink" },
  { icon: Image, title: "Insert Image", cmd: "insertImage" },
  { icon: Text, title: "Plain Text", cmd: "removeFormat" },
];

// Font sizes for the dropdown
const FONT_SIZES = [
  { value: "1", label: "Small" },
  { value: "2", label: "Normal" },
  { value: "3", label: "Medium" },
  { value: "4", label: "Large" },
  { value: "5", label: "X-Large" },
  { value: "6", label: "XX-Large" },
  { value: "7", label: "XXX-Large" },
];

const EmailComposer = ({ 
  recipient, 
  onSend, 
  onCancel, 
  isSending, 
  initialSubject = "", 
  initialContent = ""
}: EmailComposerProps) => {
  const [subject, setSubject] = useState(initialSubject);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Initialize editor content when initialContent changes
  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);
  
  // Handle toolbar button clicks
  const handleFormatClick = (cmd: string, value: string = '') => {
    if (cmd === "insertImage") {
      setShowImageInput(true);
      return;
    }
    
    if (cmd === "createLink") {
      setShowLinkInput(true);
      return;
    }
    
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  // Insert image into the editor
  const handleInsertImage = () => {
    if (imageUrl.trim()) {
      document.execCommand('insertImage', false, imageUrl);
      setImageUrl('');
      setShowImageInput(false);
      editorRef.current?.focus();
    }
  };

  // Insert link into the editor
  const handleInsertLink = () => {
    if (linkUrl.trim()) {
      document.execCommand('createLink', false, linkUrl);
      setLinkUrl('');
      setLinkText('');
      setShowLinkInput(false);
      editorRef.current?.focus();
    }
  };

  // Handle font size change
  const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    document.execCommand('fontSize', false, event.target.value);
    editorRef.current?.focus();
  };

  // Handle font family change
  const handleFontFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    document.execCommand('fontName', false, event.target.value);
    editorRef.current?.focus();
  };

  // Handle sending the email
  const handleSend = () => {
    if (editorRef.current) {
      onSend(editorRef.current.innerHTML, subject);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Recipient */}
      <div className="flex items-center gap-2">
        <Label className="w-24">To:</Label>
        <Input value={recipient} readOnly className="bg-muted/50" />
      </div>

      {/* Subject */}
      <div className="flex items-center gap-2">
        <Label className="w-24">Subject:</Label>
        <Input 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          placeholder="Enter email subject" 
          autoFocus
        />
      </div>
      
      {/* Formatting Toolbar */}
      <div className="border rounded-t-md bg-muted/20 p-1 flex flex-wrap items-center gap-1">
        <div className="flex items-center gap-1 p-1">
          <select 
            onChange={handleFontSizeChange} 
            defaultValue="3" 
            className="h-8 rounded bg-background text-sm px-2 border"
          >
            {FONT_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
          
          <select 
            onChange={handleFontFamilyChange} 
            defaultValue="Arial" 
            className="h-8 rounded bg-background text-sm px-2 border"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        
        <div className="h-6 w-px bg-border mx-1" />
        
        {EDITOR_BUTTONS.map((button) => (
          <motion.button
            key={button.cmd}
            type="button"
            title={button.title}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFormatClick(button.cmd)}
            className="p-1.5 rounded hover:bg-muted transition-colors"
          >
            <button.icon className="h-4 w-4" />
          </motion.button>
        ))}
      </div>
      
      {/* Image URL Input */}
      {showImageInput && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex gap-2 p-2 bg-muted/20 border-x"
        >
          <Input 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder="Enter image URL" 
            className="flex-grow"
            autoFocus
          />
          <Button onClick={handleInsertImage}>Insert</Button>
          <Button 
            variant="outline" 
            onClick={() => setShowImageInput(false)}
          >
            Cancel
          </Button>
        </motion.div>
      )}
      
      {/* Link URL Input */}
      {showLinkInput && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex gap-2 p-2 bg-muted/20 border-x flex-wrap"
        >
          <Input 
            value={linkUrl} 
            onChange={(e) => setLinkUrl(e.target.value)} 
            placeholder="Enter URL" 
            className="flex-grow"
            autoFocus
          />
          <Input 
            value={linkText} 
            onChange={(e) => setLinkText(e.target.value)} 
            placeholder="Link text (optional)" 
            className="flex-grow"
          />
          <Button onClick={handleInsertLink}>Insert</Button>
          <Button 
            variant="outline" 
            onClick={() => setShowLinkInput(false)}
          >
            Cancel
          </Button>
        </motion.div>
      )}
      
      {/* Email Content Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="border border-input rounded-b-md min-h-[300px] p-4 focus:outline-none focus:ring-1 focus:ring-ring overflow-auto"
        style={{ lineHeight: '1.5' }}
      />
      
      {/* Actions */}
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" onClick={onCancel} disabled={isSending}>
          Cancel
        </Button>
        <Button 
          onClick={handleSend} 
          disabled={isSending || !subject.trim()} 
          className="flex items-center gap-2"
        >
          {isSending ? 'Sending...' : 'Send Email'}
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EmailComposer;
