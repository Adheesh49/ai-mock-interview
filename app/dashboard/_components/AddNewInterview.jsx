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
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobPosition,
          jobDesc,
          jobExperience,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions. Server responded with an error.");
      }

      const result = await response.json();
      console.log("Generated Questions:", result.questions);
      setOpenDialog(false); // Close dialog on success
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("There was an error generating your interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

          {/* ✅ Moved form outside of DialogDescription */}
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
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
              >
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