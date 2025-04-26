"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { getRoles, updateRole, createRole, deleteRole } from "../actions/roles";
import { getPermissions } from "../../permissions/actions/permissions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

export function RolesForm() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const { toast } = useToast();
  const permissionsList = permissions;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (role: Role) => {
    try {
      await updateRole(role.id, {
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
      toast({
        title: "Role updated",
        description: `The role '${role.name}' was updated successfully.`,
      });
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id);
      await loadData();
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
      setDeleteConfirmation("");
    } catch (err) {
      console.error("Failed to delete role:", err);
    }
  };

  const handleCreate = async () => {
    try {
      if (!newRole.name.trim()) {
        return;
      }
      await createRole(newRole);
      setNewRole({ name: "", description: "" });
      await loadData();
    } catch (err) {
      console.error("Failed to create role:", err);
    }
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    const updatedRoles = roles.map((role) => {
      if (role.id === roleId) {
        const permissions = role.permissions || [];
        const hasPermission = permissions.includes(permissionId);
        const updatedPermissions = hasPermission
          ? permissions.filter((id) => id !== permissionId)
          : [...permissions, permissionId];

        const updatedRole = {
          ...role,
          permissions: updatedPermissions,
        };

        // Update the role in the database
        handleUpdate(updatedRole);
        // Toast notification for permission change
        const perm = permissionsList.find((p) => p.id === permissionId);
        toast({
          title: hasPermission ? "Permission removed" : "Permission added",
          description: perm
            ? `Permission '${perm.name}' was ${
                hasPermission ? "removed from" : "added to"
              } role '${role.name}'.`
            : `Permission was ${
                hasPermission ? "removed from" : "added to"
              } role '${role.name}'.`,
        });
        return updatedRole;
      }
      return role;
    });
    setRoles(updatedRoles);
  };

  const openDeleteDialog = (id: string) => {
    setRoleToDelete(id);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return <div>Loading roles...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>
          Create and manage roles for your users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Create new role form */}
          <div className="space-y-2 p-4 border rounded-lg border-dashed max-w-md mx-auto">
            <h3 className="font-medium">Add New Role</h3>
            <div className="space-y-2">
              <Input
                placeholder="Role name"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
              />
              <Input
                placeholder="Role description"
                value={newRole.description}
                onChange={(e) =>
                  setNewRole({ ...newRole, description: e.target.value })
                }
              />
              <Button
                onClick={handleCreate}
                className="w-full"
                disabled={!newRole.name.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Role
              </Button>
            </div>
          </div>

          {/* List of existing roles */}
          <div className="flex flex-col items-center gap-4">
            {roles.map((role) => (
              <div key={role.id} className="w-full max-w-md mx-auto">
                <div className="flex gap-4 items-center border rounded-lg px-2 py-2 bg-white shadow-sm">
                  <div className="flex items-center text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-4 h-4 cursor-move" />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={role.name}
                      onChange={(e) => {
                        const updatedRoles = roles.map((r) =>
                          r.id === role.id ? { ...r, name: e.target.value } : r
                        );
                        setRoles(updatedRoles);
                      }}
                      className="font-medium text-base px-2 py-1"
                      style={{ minWidth: 0 }}
                      disabled={expandedRole === role.id}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      onClick={() => openDeleteDialog(role.id)}
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() =>
                        setExpandedRole(
                          expandedRole === role.id ? null : role.id
                        )
                      }
                      size="icon"
                      variant="ghost"
                    >
                      {expandedRole === role.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {expandedRole === role.id && (
                  <div className="border rounded-lg mt-2 p-4 bg-gray-50 space-y-4">
                    <Input
                      value={role.description}
                      onChange={(e) => {
                        const updatedRoles = roles.map((r) =>
                          r.id === role.id
                            ? { ...r, description: e.target.value }
                            : r
                        );
                        setRoles(updatedRoles);
                      }}
                      className="text-sm text-muted-foreground"
                      placeholder="Role description"
                    />
                    <Button
                      onClick={() => handleUpdate(role)}
                      size="sm"
                      variant="outline"
                    >
                      Save
                    </Button>
                    {/* Permissions section */}
                    <div className="mt-2 border-t pt-4">
                      <h4 className="font-medium text-sm mb-2">Permissions</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white rounded-md p-2 border">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition text-xs"
                          >
                            <GripVertical className="w-3 h-3 text-gray-300 mr-1" />
                            <Checkbox
                              id={`${role.id}-${permission.id}`}
                              checked={(role.permissions || []).includes(
                                permission.id
                              )}
                              onCheckedChange={() =>
                                togglePermission(role.id, permission.id)
                              }
                              className="scale-90"
                            />
                            <Label
                              htmlFor={`${role.id}-${permission.id}`}
                              className="text-xs cursor-pointer select-none"
                            >
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please type "delete" to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Type 'delete' to confirm"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setRoleToDelete(null);
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmation === "delete" && roleToDelete) {
                  handleDelete(roleToDelete);
                }
              }}
              disabled={deleteConfirmation !== "delete"}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
