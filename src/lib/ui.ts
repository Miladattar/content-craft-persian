import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button variants
export const buttonVariants = {
  primary: "gradient-primary text-white hover:shadow-glow transition-smooth font-medium px-6 py-3 rounded-lg",
  secondary: "bg-secondary hover:bg-secondary-hover text-secondary-foreground transition-smooth font-medium px-6 py-3 rounded-lg",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth font-medium px-6 py-3 rounded-lg",
  ghost: "hover:bg-muted text-foreground transition-smooth font-medium px-4 py-2 rounded-lg",
  hero: "gradient-hero text-white hover:shadow-glow transition-smooth font-bold px-8 py-4 rounded-xl text-lg shadow-medium",
  sm: "px-4 py-2 text-sm rounded-lg",
  lg: "px-8 py-4 text-lg rounded-xl"
};

// Card variants
export const cardVariants = {
  default: "gradient-card border border-border rounded-lg shadow-soft p-6",
  elevated: "gradient-card border border-border rounded-lg shadow-medium p-6 hover:shadow-strong transition-smooth",
  interactive: "gradient-card border border-border rounded-lg shadow-soft p-6 hover:shadow-medium hover:border-primary/30 transition-smooth cursor-pointer",
  compact: "gradient-card border border-border rounded-lg shadow-soft p-4",
  hero: "gradient-card border border-border rounded-xl shadow-strong p-8"
};

// Input variants
export const inputVariants = {
  default: "w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-fast",
  error: "w-full px-4 py-3 border-2 border-destructive rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive focus:border-transparent transition-fast"
};

// Typography variants
export const textVariants = {
  h1: "text-4xl font-bold text-foreground mb-4",
  h2: "text-3xl font-bold text-foreground mb-3",
  h3: "text-2xl font-semibold text-foreground mb-2",
  h4: "text-xl font-semibold text-foreground mb-2",
  body: "text-base text-foreground leading-relaxed",
  small: "text-sm text-muted-foreground",
  label: "text-sm font-medium text-foreground mb-2 block"
};

// Form component helpers
export const formFieldVariants = {
  wrapper: "space-y-2",
  label: "text-sm font-medium text-foreground",
  error: "text-sm text-destructive mt-1"
};

// Progress indicators
export const progressVariants = {
  bar: "w-full bg-muted rounded-full h-2",
  fill: "h-2 bg-primary rounded-full transition-all duration-300"
};

// Badge variants
export const badgeVariants = {
  default: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground",
  secondary: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground",
  outline: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-border text-foreground",
  success: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success text-success-foreground",
  warning: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning text-warning-foreground",
  destructive: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-destructive text-destructive-foreground"
};

// Animation helpers
export const animationVariants = {
  fadeIn: "animate-fade-in",
  scaleIn: "animate-scale-in"
};

// Layout helpers
export const layoutVariants = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-12 sm:py-16",
  grid: "grid gap-6",
  gridCols: {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }
};