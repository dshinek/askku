import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <Topbar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
    