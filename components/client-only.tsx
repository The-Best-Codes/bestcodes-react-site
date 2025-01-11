"use client";
import React, { ReactNode, useEffect, useState } from "react";
const ClientOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <>{children}</>;
};
export default ClientOnly;
