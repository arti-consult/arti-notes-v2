"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Mail,
  Plus,
  Clock,
  LayoutList,
  CalendarRange,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailComposer from "@/components/email-composer";
import { isValidEmail } from "@/services/emailService";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: number;
}

export function EmailSender() {
  // State for email
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // State for templates
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    const storedTemplates = localStorage.getItem("emailTemplates");
    return storedTemplates ? JSON.parse(storedTemplates) : [];
  });
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<EmailTemplate | null>(
    null
  );
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateSubject, setNewTemplateSubject] = useState("");
  const [newTemplateBody, setNewTemplateBody] = useState("");

  // Active tab
  const [activeTab, setActiveTab] = useState("compose");

  // Save templates to local storage
  useEffect(() => {
    localStorage.setItem("emailTemplates", JSON.stringify(templates));
  }, [templates]);

  const handleSendEmail = (emailContent: string, emailSubject: string) => {
    if (!to.trim()) {
      toast.error("Please enter a recipient email address");
      return;
    }

    if (!isValidEmail(to)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSending(true);

    // Simulate sending email
    setTimeout(() => {
      toast.success(`Email sent to ${to}`);
      setIsSending(false);
      setShowComposer(false);
      setTo("");
      setSubject("");
      setBody("");
    }, 1500);
  };

  const handleUseTemplate = (template: EmailTemplate) => {
    setSubject(template.subject);
    setBody(template.body);
    setShowComposer(true);
    toast.success(`Template "${template.name}" applied`);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setTemplateToEdit(template);
    setNewTemplateName(template.name);
    setNewTemplateSubject(template.subject);
    setNewTemplateBody(template.body);
    setShowTemplateEditor(true);
  };

  const handleTemplateCreate = () => {
    setTemplateToEdit(null);
    setNewTemplateName("");
    setNewTemplateSubject("");
    setNewTemplateBody("");
    setShowTemplateEditor(true);
  };

  const handleSaveTemplate = () => {
    if (
      !newTemplateName.trim() ||
      !newTemplateSubject.trim() ||
      !newTemplateBody.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (templateToEdit) {
      const updatedTemplate = {
        ...templateToEdit,
        name: newTemplateName,
        subject: newTemplateSubject,
        body: newTemplateBody,
      };
      setTemplates(
        templates.map((t) =>
          t.id === updatedTemplate.id ? updatedTemplate : t
        )
      );
      toast.success(`Template "${updatedTemplate.name}" updated`);
    } else {
      const newTemplate: EmailTemplate = {
        id: uuidv4(),
        name: newTemplateName,
        subject: newTemplateSubject,
        body: newTemplateBody,
        createdAt: Date.now(),
      };
      setTemplates([...templates, newTemplate]);
      toast.success(`Template "${newTemplate.name}" created`);
    }
    setShowTemplateEditor(false);
    setTemplateToEdit(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
    toast.success("Template deleted");
  };

  const handleNewEmail = () => {
    setTo("");
    setSubject("");
    setBody("");
    setShowComposer(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Email Management</CardTitle>
              <CardDescription>Compose and manage your emails</CardDescription>
            </div>
            <Button
              onClick={handleNewEmail}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              New Email
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Email Tools</CardTitle>
              <CardDescription>Manage your email tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("compose")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Compose
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("templates")}
                >
                  <LayoutList className="h-4 w-4 mr-2" />
                  Templates
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => toast.info("Schedule feature coming soon")}
                >
                  <CalendarRange className="h-4 w-4 mr-2" />
                  Scheduled
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => toast.info("Campaign feature coming soon")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Campaigns
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-9">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full mb-4">
              <TabsTrigger value="compose" className="flex-1">
                Compose Email
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex-1">
                Email Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="mt-0">
              {showComposer ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Input
                        placeholder="Recipient email"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <EmailComposer
                      recipient={to}
                      onSend={handleSendEmail}
                      onCancel={() => setShowComposer(false)}
                      isSending={isSending}
                      initialSubject={subject}
                      initialContent={body}
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
                    <Mail className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-medium mb-2">
                      Start a New Email
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Create a new email or select a template to get started
                    </p>
                    <Button
                      onClick={handleNewEmail}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Email
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Email Templates</CardTitle>
                      <CardDescription>
                        Manage your email templates
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleTemplateCreate}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {templates.length === 0 ? (
                      <div className="text-center py-8">
                        <LayoutList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No Templates Yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first email template to get started
                        </p>
                        <Button
                          onClick={handleTemplateCreate}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Create Template
                        </Button>
                      </div>
                    ) : (
                      templates.map((template) => (
                        <div
                          key={template.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {template.subject}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUseTemplate(template)}
                            >
                              Use
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditTemplate(template)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleDeleteTemplate(template.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Template Editor Dialog */}
      <Dialog open={showTemplateEditor} onOpenChange={setShowTemplateEditor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {templateToEdit ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription>
              {templateToEdit
                ? "Edit your email template"
                : "Create a new email template"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Name</label>
              <Input
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={newTemplateSubject}
                onChange={(e) => setNewTemplateSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Body</label>
              <EmailComposer
                recipient=""
                onSend={() => {}}
                onCancel={() => {}}
                isSending={false}
                initialSubject={newTemplateSubject}
                initialContent={newTemplateBody}
                onChange={(content) => setNewTemplateBody(content)}
                isTemplate={true}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTemplateEditor(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              {templateToEdit ? "Save Changes" : "Create Template"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
