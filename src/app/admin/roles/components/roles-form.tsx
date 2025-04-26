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
import { Trash2, Plus } from "lucide-react";
import { getRoles, updateRole, createRole, deleteRole } from "../actions/roles";

interface Role {
  id: string;
  name: string;
  description: string;
}

export function RolesForm() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ name: "", description: "" });

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      setError("Failed to load roles");
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
      });
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id);
      await loadRoles();
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
      await loadRoles();
    } catch (err) {
      console.error("Failed to create role:", err);
    }
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
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate(role)}
                    size="sm"
                    variant="outline"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => handleDelete(role.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
