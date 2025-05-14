"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RoleStatistics } from "@/components/role-statistics";
import { RoleUsersTable } from "@/components/role-users-table";
import { CustomerRole } from "@/types/customer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  UserPlus,
  Download,
  Upload,
  Settings,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Permission types
type PermissionStatus = "enabled" | "limited" | "disabled";

// Permission interface
interface Permission {
  name: string;
  status: PermissionStatus;
  description?: string;
}

// Role permissions structure
interface RolePermissions {
  [key: string]: Permission[];
}

// Role template interface
interface RoleTemplate {
  id: string;
  name: string;
  description: string;
}

const roleTemplates: RoleTemplate[] = [
  {
    id: "sales-team",
    name: "Sales Team",
    description: "Permissions for sales team members",
  },
  {
    id: "support-team",
    name: "Support Team",
    description: "Permissions for customer support agents",
  },
  {
    id: "billing-team",
    name: "Billing Team",
    description: "Permissions for billing and finance",
  },
];

// Define default roles that cannot be deleted
const DEFAULT_ROLES = ["admin", "user"];

export function Roles() {
  const [selectedRole, setSelectedRole] = useState<CustomerRole | "all">("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleTemplate, setNewRoleTemplate] = useState("");
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initial permissions by role
  const [permissions, setPermissions] = useState<RolePermissions>({
    admin: [
      { name: "Full system access", status: "enabled" },
      { name: "Manage user accounts", status: "enabled" },
      { name: "Configure system settings", status: "enabled" },
    ],
    manager: [
      { name: "View all customer data", status: "enabled" },
      { name: "Edit customer records", status: "enabled" },
      { name: "System configuration", status: "disabled" },
    ],
    user: [
      { name: "View assigned customer data", status: "enabled" },
      { name: "Edit customer records", status: "limited" },
      { name: "System configuration", status: "disabled" },
    ],
  });

  const handleRoleSelect = (role: CustomerRole | "all") => {
    setSelectedRole(role);
  };

  const handlePermissionChange = (
    role: string,
    permissionName: string,
    status: PermissionStatus
  ) => {
    setPermissions((prev) => {
      const updatedPermissions = { ...prev };
      const permissionIndex = updatedPermissions[role].findIndex(
        (p) => p.name === permissionName
      );

      if (permissionIndex !== -1) {
        updatedPermissions[role][permissionIndex] = {
          ...updatedPermissions[role][permissionIndex],
          status,
        };
      }

      toast(`Updated "${permissionName}" for ${role} role to ${status}`);
      return updatedPermissions;
    });
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error("Role name cannot be empty");
      return;
    }

    const roleKey = newRoleName.toLowerCase().replace(/\s+/g, "-");

    // Add new role with default permissions
    setPermissions((prev) => ({
      ...prev,
      [roleKey]: [
        { name: "View customer data", status: "limited" },
        { name: "Edit customer data", status: "disabled" },
        { name: "System configuration", status: "disabled" },
      ],
    }));

    toast.success(`New role "${newRoleName}" created successfully`);
    setShowCreateRole(false);
    setNewRoleName("");
    setNewRoleTemplate("");
  };

  const handleDeleteRole = (roleKey: string) => {
    if (DEFAULT_ROLES.includes(roleKey)) {
      toast.error(
        `Cannot delete the "${roleKey}" role as it is a default system role`
      );
      return;
    }

    setRoleToDelete(roleKey);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRole = () => {
    if (!roleToDelete || DEFAULT_ROLES.includes(roleToDelete)) {
      toast.error(
        `Cannot delete the "${roleToDelete}" role as it is a default system role`
      );
      setShowDeleteConfirm(false);
      return;
    }

    setPermissions((prev) => {
      const updatedPermissions = { ...prev };
      delete updatedPermissions[roleToDelete];

      // If the currently selected role was deleted, reset to "all"
      if (selectedRole === roleToDelete) {
        setSelectedRole("all");
      }

      toast.success(`Role "${roleToDelete}" deleted successfully`);
      setShowDeleteConfirm(false);
      return updatedPermissions;
    });
  };

  const handleApplyTemplate = (roleKey: string, templateId: string) => {
    // In a real app, this would fetch template permissions from the server
    // For demo purposes, we'll just simulate applying different permissions

    let newPermissions: Permission[] = [];

    if (templateId === "sales-team") {
      newPermissions = [
        { name: "View customer data", status: "enabled" },
        { name: "Edit customer data", status: "limited" },
        { name: "Manage deals", status: "enabled" },
        { name: "Access reports", status: "limited" },
      ];
    } else if (templateId === "support-team") {
      newPermissions = [
        { name: "View customer data", status: "enabled" },
        { name: "Edit customer data", status: "limited" },
        { name: "Access knowledge base", status: "enabled" },
        { name: "Manage tickets", status: "enabled" },
      ];
    } else if (templateId === "billing-team") {
      newPermissions = [
        { name: "View customer data", status: "limited" },
        { name: "Access billing info", status: "enabled" },
        { name: "Process payments", status: "enabled" },
        { name: "Generate invoices", status: "enabled" },
      ];
    }

    setPermissions((prev) => ({
      ...prev,
      [roleKey]: newPermissions,
    }));

    toast.success(`Applied ${templateId} template to ${roleKey} role`);
  };

  const isDefaultRole = (role: string) => DEFAULT_ROLES.includes(role);

  // Sort roles to have default roles first
  const getSortedRoles = () => {
    const roles = Object.keys(permissions);
    return [
      ...roles.filter((role) => DEFAULT_ROLES.includes(role)),
      ...roles.filter((role) => !DEFAULT_ROLES.includes(role)),
    ];
  };

  const renderPermissionControls = (role: string, permission: Permission) => {
    return (
      <div className="flex items-center space-x-4">
        <RadioGroup
          value={permission.status}
          onValueChange={(value) =>
            handlePermissionChange(
              role,
              permission.name,
              value as PermissionStatus
            )
          }
          className="flex space-x-2 rounded-md px-4 py-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem
              value="enabled"
              id={`${role}-${permission.name}-enabled`}
            />
            <Label
              htmlFor={`${role}-${permission.name}-enabled`}
              className="text-xs text-green-600"
            >
              Enabled
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem
              value="limited"
              id={`${role}-${permission.name}-limited`}
            />
            <Label
              htmlFor={`${role}-${permission.name}-limited`}
              className="text-xs text-yellow-600"
            >
              Limited
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem
              value="disabled"
              id={`${role}-${permission.name}-disabled`}
            />
            <Label
              htmlFor={`${role}-${permission.name}-disabled`}
              className="text-xs text-red-600"
            >
              Disabled
            </Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Create a new role with custom permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input
                    id="role-name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Enter role name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role Template</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newRoleTemplate}
                    onChange={(e) => setNewRoleTemplate(e.target.value)}
                  >
                    <option value="">Select a template</option>
                    {roleTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateRole(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Roles</CardTitle>
                <CardDescription>Number of roles in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {Object.keys(permissions).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Default Roles</CardTitle>
                <CardDescription>System default roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {DEFAULT_ROLES.map((role) => (
                    <Badge key={role} variant="secondary" className="mr-2">
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Custom Roles</CardTitle>
                <CardDescription>User-created roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.keys(permissions)
                    .filter((role) => !DEFAULT_ROLES.includes(role))
                    .map((role) => (
                      <Badge key={role} variant="outline" className="mr-2">
                        {role}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Role Statistics</CardTitle>
              <CardDescription>Overview of role distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <RoleStatistics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Manage permissions for each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {getSortedRoles().map((role) => (
                  <AccordionItem key={role} value={role}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{role}</span>
                        {isDefaultRole(role) && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">
                              Role Template
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Apply a predefined set of permissions
                            </p>
                          </div>
                          <select
                            className="w-48 rounded-md border border-input bg-background px-3 py-2"
                            onChange={(e) =>
                              handleApplyTemplate(role, e.target.value)
                            }
                            value=""
                          >
                            <option value="">Select template</option>
                            {roleTemplates.map((template) => (
                              <option key={template.id} value={template.id}>
                                {template.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-4">
                          {permissions[role].map((permission) => (
                            <div
                              key={permission.name}
                              className="flex items-center justify-between border-b pb-4 last:border-0"
                            >
                              <div className="space-y-1">
                                <h4 className="text-sm font-medium">
                                  {permission.name}
                                </h4>
                                {permission.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                              {renderPermissionControls(role, permission)}
                            </div>
                          ))}
                        </div>
                        {!isDefaultRole(role) && (
                          <div className="flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteRole(role)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Role
                            </Button>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
              <CardDescription>
                View and manage users assigned to each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleUsersTable
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              role and remove all associated permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRole}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
