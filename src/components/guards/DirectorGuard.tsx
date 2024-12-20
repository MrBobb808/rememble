import { ReactNode } from "react";
import { DirectorGuardLoading } from "./DirectorGuardLoading";

interface DirectorGuardProps {
  children: ReactNode;
}

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  // In development mode, we'll bypass all checks
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  // For production, we'll only allow mr.bobb12@yahoo.com
  const userEmail = 'mr.bobb12@yahoo.com';
  
  if (userEmail === 'mr.bobb12@yahoo.com') {
    return <>{children}</>;
  }

  return <DirectorGuardLoading />;
};

export default DirectorGuard;