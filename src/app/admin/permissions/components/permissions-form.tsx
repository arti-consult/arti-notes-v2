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
import {
  getPermissions,
  updatePermission,
  createPermission,
  deletePermission,
} from "../actions/permissions";

interface Permission {
  id: string;
  name: string;
  description: string;
}

export function PermissionsForm() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPermission, setNewPermission] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadPermissions();
  }, []);

  async function loadPermissions() {
    try {
      const data = await getPermissions();
      setPermissions(data);
    } catch (err) {
      setError("Failed to load permissions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (permission: Permission) => {
    try {
      await updatePermission(permission.id, {
        name: permission.name,
        description: permission.description,
      });
    } catch (err) {
      console.error("Failed to update permission:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePermission(id);
      await loadPermissions();
    } catch (err) {
      console.error("Failed to delete permission:", err);
    }
  };

  const handleCreate = async () => {
    try {
      if (!newPermission.name.trim()) {
        return;
      }
      await createPermission(newPermission);
      setNewPermission({ name: "", description: "" });
      await loadPermissions();
    } catch (err) {
      console.error("Failed to create permission:", err);
    }
  };

  if (loading) {
    return <div>Loading permissions...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Management</CardTitle>
        <CardDescription>
          Create and manage permissions for your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Create new permission form */}
          <div className="space-y-2 p-4 border rounded-lg border-dashed">
            <h3 className="font-medium">Add New Permission</h3>
            <div className="space-y-2">
              <Input
                placeholder="Permission name"
                value={newPermission.name}
                onChange={(e) =>
                  setNewPermission({ ...newPermission, name: e.target.value })
                }
              />
              <Input
                placeholder="Permission description"
                value={newPermission.description}
                onChange={(e) =>
                  setNewPermission({
                    ...newPermission,
                    description: e.target.value,
                  })
                }
              />
              <Button
                onClick={handleCreate}
                className="w-full"
                disabled={!newPermission.name.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Permission
              </Button>
            </div>
          </div>

          {/* List of existing permissions */}
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className="space-y-2 p-4 border rounded-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <Input
                  value={permission.name}
                  onChange={(e) => {
                    const updatedPermissions = permissions.map((p) =>
                      p.id === permission.id
                        ? { ...p, name: e.target.value }
                        : p
                    );
                    setPermissions(updatedPermissions);
                  }}
                  className="font-medium"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate(permission)}
                    size="sm"
                    variant="outline"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => handleDelete(permission.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Input
                value={permission.description}
                onChange={(e) => {
                  const updatedPermissions = permissions.map((p) =>
                    p.id === permission.id
                      ? { ...p, description: e.target.value }
                      : p
                  );
                  setPermissions(updatedPermissions);
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
