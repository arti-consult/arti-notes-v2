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
          <div className="space-y-2 p-4 border rounded-lg border-dashed">
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
          {roles.map((role) => (
            <div key={role.id} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className="cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <Input
                    value={role.name}
                    onChange={(e) => {
                      const updatedRoles = roles.map((r) =>
                        r.id === role.id ? { ...r, name: e.target.value } : r
                      );
                      setRoles(updatedRoles);
                    }}
                    className="font-medium"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate(role)}
                    size="sm"
                    variant="outline"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => openDeleteDialog(role.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() =>
                      setExpandedRole(expandedRole === role.id ? null : role.id)
                    }
                    size="sm"
                    variant="outline"
                  >
                    {expandedRole === role.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Input
                value={role.description}
                onChange={(e) => {
                  const updatedRoles = roles.map((r) =>
                    r.id === role.id ? { ...r, description: e.target.value } : r
                  );
                  setRoles(updatedRoles);
                }}
                className="text-sm text-muted-foreground"
              />

              {/* Permissions section */}
              {expandedRole === role.id && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  <h4 className="font-medium text-sm mb-2">Permissions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${role.id}-${permission.id}`}
                          checked={(role.permissions || []).includes(
                            permission.id
                          )}
                          onCheckedChange={() =>
                            togglePermission(role.id, permission.id)
                          }
                        />
                        <Label
                          htmlFor={`${role.id}-${permission.id}`}
                          className="text-sm"
                        >
                          {permission.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
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
