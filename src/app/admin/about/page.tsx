"use client";

import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">About Customer CRM</h1>
      <div className="grid gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Our Platform</h2>
          <p className="text-muted-foreground mb-6">
            Customer CRM is a modern platform designed to help businesses manage
            their customer relationships effectively. With intuitive tools for
            tracking customer interactions, analyzing data, and optimizing your
            sales process, we make it easy to build stronger customer
            relationships.
          </p>

          <h3 className="text-lg font-medium mb-2">Key Features</h3>
          <ul className="list-disc pl-5 space-y-2 mb-6 text-muted-foreground">
            <li>Customer data management</li>
            <li>Interactive dashboards</li>
            <li>Performance analytics</li>
            <li>Role-based access control</li>
            <li>Customizable workflows</li>
          </ul>

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">Version 1.0.0 | Released April 2025</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
