import { ReactNode } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DirectorGuardLoading } from "./DirectorGuardLoading";

interface DirectorGuardProps {
  children: ReactNode;
}

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  // In development, bypass the guard
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return <DirectorGuardLoading />;
  }

  if (profile?.relationship !== 'director') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-memorial-beige-light">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DirectorGuard;