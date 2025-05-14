"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-muted-foreground mb-4">
            Manage your account settings and preferences.
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">Account settings will be available soon.</p>
          </div>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="bg-card p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <p className="text-muted-foreground mb-4">
            Configure your notification preferences.
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">
              Notification settings will be available soon.
            </p>
          </div>
        </TabsContent>

        <TabsContent
          value="appearance"
          className="bg-card p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
          <p className="text-muted-foreground mb-4">
            Customize the look and feel of your dashboard.
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">
              Appearance settings will be available soon.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="security" className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          <p className="text-muted-foreground mb-4">
            Manage your account security and privacy.
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">Security settings will be available soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
