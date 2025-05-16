"use client";

import { siteConfig } from "@/lib/config";
import { ArrowRight, Star, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CompanyShowcase() {
  const { companyShowcase, testimonials } = siteConfig;
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  const getRandomTestimonial = () => {
    const randomIndex = Math.floor(Math.random() * testimonials.length);
    return testimonials[randomIndex];
  };

  return (
    <section
      id="company"
      className="flex flex-col items-center justify-center gap-10 py-10 pt-20 w-full relative px-6"
    >
      <p className="text-muted-foreground font-medium">
        Brukt og stolt på av rasktvoksende oppstartsselskaper
      </p>
      <div className="grid w-full max-w-7xl grid-cols-2 md:grid-cols-4 overflow-hidden border-y border-border items-center justify-center z-20">
        {companyShowcase.companyLogos.map((logo) => (
          <div
            key={logo.id}
            className="group w-full h-28 flex items-center justify-center relative p-4 before:absolute before:-left-1 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-1 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-['']"
          >
            <div className="transition-all duration-200 [cubic-bezier(0.165, 0.84, 0.44, 1)] translate-y-0 group-hover:-translate-y-4 duration-300 flex items-center justify-center w-full h-full">
              {logo.logo}
            </div>
            <button
              onClick={() => setSelectedCompany(logo.id)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-4 transition-all duration-300 ease-[cubic-bezier(0.165, 0.84, 0.44, 1)]"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                Les mer <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCompany !== null && (
          <Dialog
            open={selectedCompany !== null}
            onOpenChange={() => setSelectedCompany(null)}
          >
            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
              <DialogHeader className="px-6 pt-6 pb-4">
                <DialogTitle className="text-2xl font-semibold">
                  Customer Success Story
                </DialogTitle>
                <DialogDescription className="text-base">
                  Here's how we helped one of our customers achieve their goals
                </DialogDescription>
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                {(() => {
                  const testimonial = getRandomTestimonial();
                  return (
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <Image
                          src={testimonial.img}
                          alt={testimonial.name}
                          width={64}
                          height={64}
                          className="rounded-full ring-2 ring-primary/20"
                        />
                        <div>
                          <h4 className="font-semibold text-lg">
                            {testimonial.name}
                          </h4>
                          <p className="text-muted-foreground">
                            {testimonial.role}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-primary text-primary"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-base leading-relaxed">
                        {testimonial.description}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                        <Button className="flex-1" size="lg">
                          Schedule a Demo
                        </Button>
                        <Button variant="outline" className="flex-1" size="lg">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
