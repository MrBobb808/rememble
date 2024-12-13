import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  message: string;
}

const UploadProgress = ({ message }: UploadProgressProps) => {
  return (
    <div className="space-y-2">
      <Progress value={100} className="animate-pulse" />
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  );
};

export default UploadProgress;