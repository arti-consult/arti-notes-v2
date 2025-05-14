'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, ArrowRight, Monitor, Database, Shield, Award, Download, HelpCircle, Users, FileText, BarChart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/hooks/use-mobile"

export function Installation() {
  const [activeStep, setActiveStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [activeTab, setActiveTab] = useState("setup")
  const [activeTutorial, setActiveTutorial] = useState(0)
  const isMobile = useIsMobile()

  const totalSteps = 4

  useEffect(() => {
    setProgress((activeStep / totalSteps) * 100)
  }, [activeStep])

  const handleNextStep = () => {
    if (activeStep < totalSteps) {
      setActiveStep(prev => prev + 1)
      toast.success("Installation step completed successfully!")
    } else {
      toast.success("Installation completed! You're all set!")
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const features = [
    {
      icon: Monitor,
      title: "Dashboard Analytics",
      description: "Real-time customer insights and visualization tools",
      installed: true
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Centralized database for all customer information",
      installed: true
    },
    {
      icon: Shield,
      title: "Security Features",
      description: "Role-based access control and data encryption",
      installed: true
    },
    {
      icon: Award,
      title: "Premium Features",
      description: "Advanced reporting and AI-powered insights",
      installed: false
    }
  ]

  const tutorialSteps = [
    {
      title: "Welcome to Customer CRM",
      description: "This tutorial will guide you through the basics of using the Customer CRM system. Let's get started!",
      icon: HelpCircle,
      content: (
        <div className="space-y-4">
          <p>Welcome to the Customer CRM system! This tutorial will walk you through the essential features and functionality of the platform, helping you get up and running quickly.</p>
          <p>Our CRM (Customer Relationship Management) system is designed to help you manage all aspects of your customer relationships, from tracking leads to managing customer data and monitoring sales performance.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Easy to use with intuitive interface designed for users at all technical levels</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">All the tools you need to manage customers, from lead generation to relationship maintenance</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Powerful</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Advanced analytics and reporting features to drive business decisions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Dashboard Overview",
      description: "Learn how to navigate and use the main dashboard to access key information at a glance.",
      icon: Monitor,
      content: (
        <div className="space-y-4">
          <p>The Dashboard is your command center, providing a quick overview of all essential metrics and activities.</p>

          <div className="bg-card border rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Key Areas on the Dashboard:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Customer Statistics:</span>
                <p className="text-sm text-muted-foreground">View total customer count, active customers, and new customers this month.</p>
              </li>
              <li>
                <span className="font-medium">Recent Activities:</span>
                <p className="text-sm text-muted-foreground">See the most recent interactions with customers.</p>
              </li>
              <li>
                <span className="font-medium">Performance Charts:</span>
                <p className="text-sm text-muted-foreground">Visualize key metrics like sales trends and customer growth.</p>
              </li>
              <li>
                <span className="font-medium">Quick Actions:</span>
                <p className="text-sm text-muted-foreground">Access commonly used functions like adding a new customer or creating a task.</p>
              </li>
            </ul>
          </div>

          <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 rounded-md">
            <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">Tip: You can customize your dashboard widgets by clicking on the settings icon in the top-right corner of each widget.</p>
          </div>

          <div className="border border-dashed rounded-md p-4 mt-4 bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Dashboard Preview</h4>
              <Badge variant="secondary">Interactive</Badge>
            </div>
            <div className="h-48 flex items-center justify-center bg-card rounded-md">
              <p className="text-muted-foreground text-sm">Interactive dashboard preview will be available after setup completion</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Managing Customers",
      description: "Learn how to add, view, edit, and organize customer information effectively.",
      icon: Users,
      content: (
        <div className="space-y-4">
          <p>The Customers section is where you'll manage all your customer data. Here's how to make the most of it:</p>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Adding a New Customer</CardTitle>
              <CardDescription>Follow these simple steps to add a new customer to the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-primary/10 text-primary">
                  <span className="h-5 w-5 flex items-center justify-center font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Navigate to Customers</h4>
                  <p className="text-sm text-muted-foreground">Click on the "Dashboard" link in the sidebar, then select "Customers" from the menu.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-primary/10 text-primary">
                  <span className="h-5 w-5 flex items-center justify-center font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Click "Add Customer"</h4>
                  <p className="text-sm text-muted-foreground">Look for the "+ Add Customer" button in the top-right corner of the page.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-primary/10 text-primary">
                  <span className="h-5 w-5 flex items-center justify-center font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Fill in Customer Details</h4>
                  <p className="text-sm text-muted-foreground">Enter the customer's information in the form fields provided.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-primary/10 text-primary">
                  <span className="h-5 w-5 flex items-center justify-center font-medium">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Save the Customer</h4>
                  <p className="text-sm text-muted-foreground">Click "Save" to add the customer to your database.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Viewing Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Click on any customer's name in the list to view their complete profile, including contact information, purchase history, and interaction timeline.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Organizing Customers</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Use tags, categories, and custom fields to organize customers based on your business needs. Filter and search functionality makes finding specific customers easy.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Roles and Permissions",
      description: "Understand how user roles control access to different parts of the CRM.",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p>Role management is essential for controlling who can access and modify different parts of your CRM system. This ensures data security and appropriate access levels for your team members.</p>

          <div className="bg-card border rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Default Roles:</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <Badge className="mt-0.5 mr-2">Admin</Badge>
                <span className="text-sm">Full access to all features, including system configuration and user management.</span>
              </div>
              <div className="flex items-start">
                <Badge className="mt-0.5 mr-2" variant="outline">Manager</Badge>
                <span className="text-sm">Can manage customers, view reports, and perform most day-to-day operations.</span>
              </div>
              <div className="flex items-start">
                <Badge className="mt-0.5 mr-2" variant="outline">User</Badge>
                <span className="text-sm">Can view and interact with customers but has limited editing capabilities.</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Managing Roles</CardTitle>
              <CardDescription>How to create and modify user roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-primary/10 text-primary">
                  <span className="h-5 w-5 flex items-center justify-center font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Access Role Settings</h4>
                  <p className="text-sm text-muted-foreground">Go to Settings > User Management > Roles</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-primary/10 text-primary">
                  <span className="h-5 w-5 flex items-center justify-center font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Create New Role</h4>
                  <p className="text-sm text-muted-foreground">Click "Create Role" and define permissions for the new role</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-primary/10 text-primary">
                  <span className="h-5 w-5 flex items-center justify-center font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Assign Users</h4>
                  <p className="text-sm text-muted-foreground">Assign users to roles based on their responsibilities</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 rounded-md">
            <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">Security Tip: Regularly review and update role permissions to ensure they align with your organization's security policies.</p>
          </div>
        </div>
      )
    }
  ]

  const handleNextTutorial = () => {
    if (activeTutorial < tutorialSteps.length - 1) {
      setActiveTutorial(prev => prev + 1)
    }
  }

  const handlePrevTutorial = () => {
    if (activeTutorial > 0) {
      setActiveTutorial(prev => prev - 1)
    }
  }

  const renderTutorialIcon = () => {
    const Icon = tutorialSteps[activeTutorial].icon
    return <Icon className="h-6 w-6" />
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Installation Progress</CardTitle>
              <CardDescription>Complete the setup to start using Customer CRM</CardDescription>
            </div>
            <Button onClick={handleNextStep} className="flex items-center gap-2">
              Next Step
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span>Step {activeStep} of {totalSteps}</span>
              <span className="text-muted-foreground">Almost there!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="setup" className="flex-1">Setup</TabsTrigger>
              <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
              <TabsTrigger value="tutorial" className="flex-1">Tutorial</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Step 1: Download */}
                <motion.div variants={itemVariants}>
                  <Card className={activeStep >= 1 ? "border-primary/50" : ""}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className={`rounded-full p-2 ${activeStep > 1 ? "bg-primary" : "bg-primary/20"}`}>
                        {activeStep > 1 ? (
                          <Check className="h-5 w-5 text-primary-foreground" />
                        ) : (
                          <Download className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">Download the Package</CardTitle>
                        <CardDescription>Get the latest version of our software</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="pl-12">
                        <p className="mb-4">Download the installation package from our official website or repository:</p>

                        <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                          $ npm install customer-crm
                        </div>

                        {activeStep === 1 && (
                          <Button onClick={handleNextStep} className="mt-2">
                            Continue to Next Step <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Step 2: Setup */}
                <motion.div variants={itemVariants}>
                  <Card className={activeStep >= 2 ? "border-primary/50" : "opacity-70"}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className={`rounded-full p-2 ${activeStep > 2 ? "bg-primary" : activeStep >= 2 ? "bg-primary/20" : "bg-muted"}`}>
                        {activeStep > 2 ? (
                          <Check className="h-5 w-5 text-primary-foreground" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary/80" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">Initial Setup</CardTitle>
                        <CardDescription>Configure your environment</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="pl-12">
                        {activeStep >= 2 ? (
                          <>
                            <p className="mb-4">Create a configuration file with your basic settings:</p>

                            <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                              $ npx customer-crm init
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">This will create a <code>crm-config.json</code> file in your project directory.</p>

                            {activeStep === 2 && (
                              <Button onClick={handleNextStep} className="mt-2">
                                Continue to Next Step <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground">Please complete the previous step first.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Step 3: Database Setup */}
                <motion.div variants={itemVariants}>
                  <Card className={activeStep >= 3 ? "border-primary/50" : "opacity-70"}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className={`rounded-full p-2 ${activeStep > 3 ? "bg-primary" : activeStep >= 3 ? "bg-primary/20" : "bg-muted"}`}>
                        {activeStep > 3 ? (
                          <Check className="h-5 w-5 text-primary-foreground" />
                        ) : (
                          <Database className="h-5 w-5 text-primary/80" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">Database Configuration</CardTitle>
                        <CardDescription>Connect to your database</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="pl-12">
                        {activeStep >= 3 ? (
                          <>
                            <p className="mb-4">Configure your database connection:</p>

                            <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                              $ npx customer-crm setup-db
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 p-3 rounded-md text-sm mb-4">
                              <p>The setup wizard will guide you through connecting to your preferred database.</p>
                            </div>

                            {activeStep === 3 && (
                              <Button onClick={handleNextStep} className="mt-2">
                                Continue to Next Step <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground">Please complete the previous steps first.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Step 4: Final Configuration */}
                <motion.div variants={itemVariants}>
                  <Card className={activeStep >= 4 ? "border-primary/50" : "opacity-70"}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className={`rounded-full p-2 ${activeStep === 4 ? "bg-primary/20" : "bg-muted"}`}>
                        {activeStep > 4 ? (
                          <Check className="h-5 w-5 text-primary-foreground" />
                        ) : (
                          <Settings className="h-5 w-5 text-primary/80" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">Finalize Setup</CardTitle>
                        <CardDescription>Complete the installation process</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="pl-12">
                        {activeStep >= 4 ? (
                          <>
                            <p className="mb-4">Launch the application for the first time:</p>

                            <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                              $ npx customer-crm start
                            </div>

                            <div className="bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-300 p-3 rounded-md text-sm mb-4">
                              <p>Congratulations! Your Customer CRM is now running at <code>http://localhost:3000</code></p>
                            </div>

                            {activeStep === 4 && (
                              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <Button onClick={() => toast.success("Installation completed!")}>
                                  Finish Installation
                                </Button>
                                <Button variant="outline" onClick={() => window.location.href = "/docs"}>
                                  Read Documentation
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground">Please complete the previous steps first.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="features" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <feature.icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant={feature.installed ? "default" : "outline"}>
                          {feature.installed ? "Installed" : "Not Installed"}
                        </Badge>
                        {!feature.installed && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Install
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tutorial" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-primary/10 text-primary">
                      {renderTutorialIcon()}
                    </div>
                    <div>
                      <CardTitle>{tutorialSteps[activeTutorial].title}</CardTitle>
                      <CardDescription>{tutorialSteps[activeTutorial].description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {tutorialSteps[activeTutorial].content}
                  </ScrollArea>
                </CardContent>
                <CardContent className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevTutorial}
                    disabled={activeTutorial === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextTutorial}
                    disabled={activeTutorial === tutorialSteps.length - 1}
                  >
                    Next
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Helpful resources to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart className="h-4 w-4 mr-2" />
                Analytics Guide
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Get support from our team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <HelpCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
