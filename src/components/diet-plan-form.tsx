"use client"

import { redirect } from 'next/navigation'

// This page is not used in this version of the app.
// Redirecting to the dashboard.
export function DietPlanForm() {
  redirect('/dashboard');
  return null;
}
