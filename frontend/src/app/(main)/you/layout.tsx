import React from "react";
import UserStatTabs from "./_components/user-stat-tabs";

interface UserStatLayoutProps {
  children: React.ReactNode;
}

const UserStatLayout = ({ children }: UserStatLayoutProps) => {
  return (
    <div className="mt-5">
      <UserStatTabs />
      <div className="mt-6">{children}</div>
    </div>
  );
};

export default UserStatLayout;
