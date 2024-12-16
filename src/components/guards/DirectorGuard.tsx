interface DirectorGuardProps {
  children: React.ReactNode;
}

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  // Remove all guards and simply render children
  return <>{children}</>;
};

export default DirectorGuard;