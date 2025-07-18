"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation"; // 1. Import the useRouter hook
import { toast, Toaster } from "sonner"; // For user feedback

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // 2. Initialize the router

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPosition, jobDesc, jobExperience }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate interview.");
      }

      const result = await response.json();
      
      // 3. Check for the new interview ID and redirect
      if (result?.mockId) {
        console.log("Interview created, redirecting to:", result.mockId);
        toast.success("Interview created successfully! Redirecting...");
        setOpenDialog(false); // Close the dialog
        router.push(`/dashboard/interview/${result.mockId}`); // Redirect the user
      } else {
        throw new Error("Failed to get a valid interview ID from the server.");
      }

    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error(error.message);
      setLoading(false); // Only set loading to false on error
    }
  };

  return (
    <div>
      {/* Toaster is needed to show the notifications */}
      <Toaster richColors />
      
      <div
        className="p-10 border rounded-lg bg-secondary 
        hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white text-black max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Tell us more about your job interview.
            </DialogTitle>
            <DialogDescription>
              Add details about your job role, description, and experience to help generate tailored interview questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="font-medium">Job Role/Position</label>
              <Input
                placeholder="Ex. Full Stack Developer"
                required
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium">Job Description / Tech Stack</label>
              <Textarea
                placeholder="Ex. Build and maintain apps using React, Node.js, PostgreSQL..."
                required
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium">Years of Experience</label>
              <Input
                type="number"
                placeholder="Ex. 3"
                min="0"
                max="50"
                required
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Generating..." : "Start Interview"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;