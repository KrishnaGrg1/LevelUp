"use client";

import React from "react";

interface VerifyPageProps {
  params: Promise<{ lang: string }>;
}

const VerifyPage: React.FC<VerifyPageProps> = ({ params: _params }) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Verify Account</h1>
        <p className="text-slate-400">This feature is coming soon...</p>
      </div>
    </div>
  );
};

export default VerifyPage;
