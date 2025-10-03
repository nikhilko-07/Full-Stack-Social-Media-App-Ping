import React from "react";
import Sidebar  from "@/Components/Sidebar";
export default function  ClientLayout({children}) {
    return(
        <div style={{ display: "flex", width: "100vw" }}>
            <Sidebar style={{ flex: 1 }} />   {/* Sidebar takes 1 fraction of space */}
            <div style={{ flex: 2}}>{children}</div> {/* Main section takes 2 fractions */}
        </div>
    )
}
