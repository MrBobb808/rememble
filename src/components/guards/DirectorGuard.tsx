import { useDirectorAccess } from "@/hooks/useDirectorAccess";
import { DirectorGuardLoading } from "./DirectorGuardLoading";

interface DirectorGuardProps {
  children: React.ReactNode;
}

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  const { isLoading, isAuthorized } = useDirectorAccess();

  if (isLoading) {
    return <DirectorGuardLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default DirectorGuard;