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
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
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

// Mock roles data for demonstration
const mockRoles = [
  { id: "1", name: "Admin", permissions: ["perm1", "perm2"] },
  { id: "2", name: "Editor", permissions: ["perm2"] },
  { id: "3", name: "Viewer", permissions: ["perm3"] },
];

export function PermissionsForm() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPermission, setNewPermission] = useState({
    name: "",
    description: "",
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
          <div className="space-y-2 p-4 border rounded-lg border-dashed max-w-md mx-auto">
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
          <div className="flex flex-col items-center gap-2">
            {permissions.map((permission) => {
              const isExpanded = expandedId === permission.id;
              const connectedRoles = mockRoles.filter((role) =>
                role.permissions.includes(permission.id)
              );
              return (
                <div key={permission.id} className="w-full max-w-md mx-auto">
                  <div className="flex items-center border rounded px-2 py-1 bg-white shadow-sm gap-2">
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
                      className="font-medium text-sm px-2 py-1 flex-1"
                      style={{ minWidth: 0 }}
                      disabled={isExpanded}
                    />
                    <Button
                      onClick={() => handleUpdate(permission)}
                      size="icon"
                      variant="ghost"
                      className="text-green-600 hover:bg-green-100"
                      disabled={isExpanded}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => handleDelete(permission.id)}
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-100"
                      disabled={isExpanded}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : permission.id)
                      }
                      size="icon"
                      variant="ghost"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {isExpanded && (
                    <div className="border rounded mt-1 p-2 bg-gray-50 text-xs">
                      <div className="mb-1 text-gray-700 font-semibold">
                        Description:
                      </div>
                      <div className="mb-2 text-gray-600">
                        {permission.description || (
                          <span className="italic text-gray-400">
                            No description
                          </span>
                        )}
                      </div>
                      <div className="mb-1 text-gray-700 font-semibold">
                        Used in roles:
                      </div>
                      {connectedRoles.length > 0 ? (
                        <ul className="list-disc list-inside ml-2">
                          {connectedRoles.map((role) => (
                            <li key={role.id}>{role.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-400 italic">
                          No roles use this permission
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
