import { CreateCvForm } from "@/components/cv-builder/create-cv-form";
import { Card, CardContent } from "@/components/ui/card";

export function ResumeEmptyState() {
  return (
    <Card className="border-slate-200/90">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:py-14">
        <h3 className="text-xl font-semibold text-slate-900">
          Create your first resume
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          Start from scratch and build a professional resume with the editor,
          templates, and AI assistance.
        </p>
        <div className="mt-8">
          <CreateCvForm
            buttonLabel="Create Your First Resume"
            size="lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}
