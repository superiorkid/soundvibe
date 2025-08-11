import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="flex space-x-10">
      <div className="flex-1">{children}</div>
      <div className="w-96">
        <div>aggreements</div>
        <p>
          Language: <a href="#">English (US)</a>
        </p>
      </div>
    </div>
  );
};

export default PublicLayout;
