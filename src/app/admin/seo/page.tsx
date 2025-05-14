"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Globe, Tags, Share2, Apple, Map } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// Form schema
const seoFormSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(60, {
      message: "Title should not exceed 60 characters for best SEO practices.",
    }),
  description: z
    .string()
    .min(50, {
      message: "Description must be at least 50 characters.",
    })
    .max(160, {
      message:
        "Description should not exceed 160 characters for best SEO practices.",
    }),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  faviconURL: z.string().url().optional().or(z.literal("")),
  appleIconURL: z.string().url().optional().or(z.literal("")),
  sitemapFrequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  sitemapPriority: z.string().optional(),
  robotsTxt: z.string().optional(),
});

type SeoFormValues = z.infer<typeof seoFormSchema>;

const defaultValues: Partial<SeoFormValues> = {
  title: "",
  description: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  canonical: "",
  faviconURL: "",
  appleIconURL: "",
  sitemapFrequency: "weekly",
  sitemapPriority: "0.8",
  robotsTxt: "User-agent: *\nAllow: /",
};

export default function SEO() {
  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues,
  });

  function onSubmit(data: SeoFormValues) {
    console.log(data);
    toast.success("SEO settings saved successfully!");
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SEO Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page SEO Configuration</CardTitle>
          <CardDescription>
            Configure SEO settings for your website pages to improve search
            engine ranking and visibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-6 mb-6">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span>General</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="social"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Social Media</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="keywords"
                    className="flex items-center gap-2"
                  >
                    <Tags className="h-4 w-4" />
                    <span>Keywords</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="favicon"
                    className="flex items-center gap-2"
                  >
                    <Apple className="h-4 w-4" />
                    <span>Icons</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="sitemap"
                    className="flex items-center gap-2"
                  >
                    <Map className="h-4 w-4" />
                    <span>Sitemap</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Advanced</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your page title"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed in browser tabs and search
                          results.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a concise description of your page"
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A good description should be between 50-160
                          characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ogTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Open Graph title for social sharing"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The title that will appear when your page is shared on
                          social media.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ogDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Open Graph description for social sharing"
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The description that will appear when your page is
                          shared on social media.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ogImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://your-image-url.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The image that will appear when your page is shared on
                          social media.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="keywords" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter keywords separated by commas"
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          While less important than they once were, keywords can
                          still help with search engine categorization.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="favicon" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="faviconURL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Favicon URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://your-website.com/favicon.png"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The small icon shown in browser tabs (16x16 or 32x32
                            pixels). PNG format recommended.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appleIconURL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apple Touch Icon URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://your-website.com/apple-touch-icon.png"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The icon used when adding your site to the iOS home
                            screen (180x180 pixels).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">
                      Preview HTML Output
                    </h3>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`<link rel="icon" href="${form.watch("faviconURL") || "example.png"}" type="image/png">
<link rel="apple-touch-icon" href="${form.watch("appleIconURL") || "apple-touch-icon.png"}">`}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="sitemap" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="sitemapFrequency">Change Frequency</Label>
                      <select
                        id="sitemapFrequency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...form.register("sitemapFrequency")}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                      <p className="text-sm text-muted-foreground mt-1">
                        How frequently the page is likely to change.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="sitemapPriority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority (0.0 to 1.0)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="1"
                              placeholder="0.8"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The priority of this URL relative to other URLs on
                            your site.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">
                      Sitemap XML Example
                    </h3>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${form.watch("sitemapFrequency") || "weekly"}</changefreq>
    <priority>${form.watch("sitemapPriority") || "0.8"}</priority>
  </url>
</urlset>`}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="canonical"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Canonical URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://your-website.com/page"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The canonical URL helps prevent duplicate content
                          issues.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="robotsTxt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>robots.txt Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="User-agent: *\nAllow: /"
                            className="resize-none min-h-[120px] font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Controls how search engine bots crawl your site.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button type="submit">Save SEO Settings</Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-muted/50 text-sm text-muted-foreground">
          <p>Last updated: May 2, 2025</p>
        </CardFooter>
      </Card>
    </div>
  );
}
