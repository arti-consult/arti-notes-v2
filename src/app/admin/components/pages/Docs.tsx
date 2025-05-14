"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Code,
  Database,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the documentation structure
const documentationSections = [
  {
    title: "Getting Started",
    icon: <FileText className="h-4 w-4" />,
    subsections: [
      { title: "Introduction", id: "introduction" },
      { title: "Installation", id: "installation" },
      { title: "Basic Configuration", id: "basic-configuration" },
    ],
  },
  {
    title: "Core Concepts",
    icon: <BookOpen className="h-4 w-4" />,
    subsections: [
      { title: "Dashboard Overview", id: "dashboard-overview" },
      { title: "User Roles & Permissions", id: "user-roles" },
      { title: "Data Management", id: "data-management" },
    ],
  },
  {
    title: "Features & Modules",
    icon: <Code className="h-4 w-4" />,
    subsections: [
      { title: "Customer Management", id: "customer-management" },
      { title: "Role Management", id: "role-management" },
      { title: "Workflow Automation", id: "automation" },
    ],
  },
  {
    title: "API Reference",
    icon: <Database className="h-4 w-4" />,
    subsections: [
      { title: "Endpoints", id: "api-endpoints" },
      { title: "Data Models", id: "data-models" },
      { title: "Authentication", id: "api-authentication" },
    ],
  },
];

export function Docs() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Getting Started",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      className="flex min-h-[calc(100vh-4rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Sidebar - Navigation */}
      <div className="hidden md:block w-64 bg-card border-r border-border p-4 overflow-y-auto">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full h-9 pl-8 pr-3 text-sm rounded-md bg-background border border-input focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <nav className="space-y-1">
          {documentationSections.map((section) => (
            <div key={section.title} className="mb-2">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </span>
                {expandedSections.includes(section.title) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {expandedSections.includes(section.title) && (
                <div className="pl-5 mt-1 space-y-1">
                  {section.subsections.map((subsection) => (
                    <button
                      key={subsection.id}
                      onClick={() => setActiveSection(subsection.id)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                        activeSection === subsection.id
                          ? "bg-primary text-white font-medium"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      {subsection.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto px-4 py-8 lg:px-8">
          {activeSection === "introduction" && (
            <DocSection title="Introduction" version="v1.2.0">
              <p className="text-lg mb-6">
                Welcome to the Customer CRM documentation. This comprehensive
                guide will help you understand how to use and configure the
                system.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-2">
                Overview
              </h3>
              <p className="mb-4">
                Customer CRM is a complete solution for managing customer
                relationships, tracking interactions, and automating workflows.
                Built with modern web technologies, it provides an intuitive
                interface for managing all aspects of customer data.
              </p>

              <div className="p-4 border rounded-md bg-muted/30 my-6">
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Centralized customer management</li>
                  <li>Role-based access control</li>
                  <li>Visual workflow automation</li>
                  <li>Advanced filtering and search</li>
                  <li>Data visualization and reporting</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-2">
                System Requirements
              </h3>
              <p className="mb-4">
                The Customer CRM is a web-based application that works in modern
                browsers. For optimal performance, we recommend:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-md p-3">
                  <h4 className="font-semibold mb-1">Recommended Browsers</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Chrome (latest)</li>
                    <li>Firefox (latest)</li>
                    <li>Edge (latest)</li>
                    <li>Safari (latest)</li>
                  </ul>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-semibold mb-1">Minimum Resolution</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Desktop: 1280×720</li>
                    <li>Tablet: 768×1024</li>
                    <li>Mobile: 375×667</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-2">
                Getting Support
              </h3>
              <p className="mb-4">
                If you encounter any issues or have questions about the Customer
                CRM, you can:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Check the troubleshooting section in this documentation</li>
                <li>Contact our support team at support@customercrm.example</li>
                <li>Visit our knowledge base for additional resources</li>
              </ul>

              <div className="bg-card border rounded-md p-4 mb-8">
                <h4 className="font-semibold mb-2">Next Steps</h4>
                <p className="mb-3">
                  Ready to get started? Check out these guides:
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <Button variant="outline" size="sm" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Installation Guide
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Core Concepts
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground border-t pt-4 mt-8">
                <p>Last updated: May 2, 2025</p>
              </div>
            </DocSection>
          )}

          {activeSection === "installation" && (
            <DocSection title="Installation" version="v1.2.0">
              <p className="text-lg mb-6">
                The Customer CRM installation process is straightforward and
                user-friendly. Follow our installation guide for detailed steps.
              </p>

              <div className="bg-card border rounded-md p-6 my-6">
                <h3 className="text-xl font-semibold mb-4">
                  Installation Guide
                </h3>
                <p className="mb-4">
                  Our detailed installation guide walks you through every step
                  of getting the Customer CRM up and running on your system.
                </p>
                <Link href="/installation-guide">
                  <Button size="lg">
                    <FileText className="mr-2 h-4 w-4" />
                    View Installation Guide
                  </Button>
                </Link>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-2">
                Quick Installation
              </h3>
              <p className="mb-4">
                If you prefer a quick installation, you can use the following
                commands:
              </p>

              <div className="bg-card border rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                <pre>$ npm install customer-crm</pre>
                <pre>$ npx customer-crm init</pre>
                <pre>$ npx customer-crm start</pre>
              </div>

              <div className="text-sm text-muted-foreground border-t pt-4 mt-8">
                <p>Last updated: May 2, 2025</p>
              </div>
            </DocSection>
          )}

          {activeSection === "basic-configuration" && (
            <DocSection title="Basic Configuration" version="v1.2.0">
              <p className="text-lg mb-6">
                Learn how to configure the basic settings of your Customer CRM
                instance.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-2">
                Configuration Files
              </h3>
              <p className="mb-4">
                The main configuration file is located at{" "}
                <code>config.json</code> in your project root. Here's a basic
                example:
              </p>

              <div className="bg-card border rounded-md p-4 mb-6 font-mono text-sm overflow-x-auto">
                <pre>{`{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "customer_crm"
  },
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "security": {
    "jwt_secret": "your-secret-key",
    "session_timeout": 3600
  }
}`}</pre>
              </div>

              <div className="text-sm text-muted-foreground border-t pt-4 mt-8">
                <p>Last updated: May 2, 2025</p>
              </div>
            </DocSection>
          )}
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </motion.div>
  );
}

const DocSection = ({
  title,
  version,
  children,
}: {
  title: string;
  version?: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {version && (
          <span className="px-2 py-1 text-sm bg-muted rounded-md">
            {version}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};
