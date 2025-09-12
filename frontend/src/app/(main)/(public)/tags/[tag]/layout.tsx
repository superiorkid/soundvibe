import React from "react";
import TagHeader from "./_components/tag-header";
import TagTabs from "./_components/tag-tabs";

interface TagsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tag: string }>;
}

const TagsLayout = async ({ children, params }: TagsLayoutProps) => {
  const { tag } = await params;
  return (
    <div>
      <TagHeader tag={tag} />
      <TagTabs tag={tag} />

      <div className="mt-6">{children}</div>
    </div>
  );
};

export default TagsLayout;
