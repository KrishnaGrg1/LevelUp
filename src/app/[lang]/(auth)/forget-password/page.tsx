"use client";

import React from "react";

interface ForgetPasswordPageProps {
  params: Promise<{ lang: string }>;
}

const ForgetPasswordPage: React.FC<ForgetPasswordPageProps> = ({
  params: _params,
}) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Forgot Password</h1>
        <p className="text-slate-400">This feature is coming soon...</p>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
