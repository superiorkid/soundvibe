import React from "react";

interface PersonalStatLayoutProps {
  children: React.ReactNode;
}

const PersonalStatLayout = ({ children }: PersonalStatLayoutProps) => {
  return (
    <div>
      <header>This is from layout</header>
      {children}
    </div>
  );
};

export default PersonalStatLayout;
