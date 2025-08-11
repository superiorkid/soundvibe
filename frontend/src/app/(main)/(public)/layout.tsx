import AuthDialog from "@/app/_components/auth-dialog";
import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="flex space-x-10">
      <div className="flex-1">{children}</div>

      <aside className="w-96 text-sm text-gray-700">
        <p className="font-medium">You&apos;re not logged in</p>

        <p className="mt-2 text-xs text-gray-500">
          Language{" "}
          <a href="#" className="text-blue-600">
            English (US)
          </a>
        </p>
      </aside>
    </div>
  );
};

export default PublicLayout;
