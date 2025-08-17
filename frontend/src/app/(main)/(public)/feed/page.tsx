"use client";

import { getSession } from "@/server/auth";
import { useEffect } from "react";

const FeedPage = () => {
  useEffect(() => {
    const session = async () => {
      const ses = await getSession();
      console.log("session from effect", ses);
    };

    session();
  }, []);

  return <div>FeedPage</div>;
};

export default FeedPage;
