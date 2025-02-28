"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const { slug } = React.use(params);
  // const { slug } = params;

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post("/api/verify-email", {
          token: slug,
        });
        setResult(res.data);
      } catch (error: unknown) {
        console.error(error);
        setResult({ success: false, message: "Verification failed" });
      }
    };

    if (slug) {
      verifyEmail();
    }
  }, [slug]);

  return (
    <div>
      {slug}
      <h1>Verifying Email...</h1>
      {result && <p>{result.message || "Verification in progress..."}</p>}
    </div>
  );
}
