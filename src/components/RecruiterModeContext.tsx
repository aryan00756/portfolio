"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface RecruiterModeCtx {
    active: boolean;
    toggle: () => void;
}

const RecruiterModeContext = createContext<RecruiterModeCtx>({
    active: false,
    toggle: () => { },
});

export const useRecruiterMode = () => useContext(RecruiterModeContext);

export function RecruiterModeProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState(false);

    // Restore from sessionStorage + LinkedIn auto-detect
    useEffect(() => {
        const saved = sessionStorage.getItem("recruiterMode");
        if (saved === "true") {
            setActive(true);
        } else if (
            typeof document !== "undefined" &&
            document.referrer.includes("linkedin")
        ) {
            setActive(true);
            sessionStorage.setItem("recruiterMode", "true");
        }
    }, []);

    const toggle = () => {
        setActive((prev) => {
            const next = !prev;
            sessionStorage.setItem("recruiterMode", next ? "true" : "false");
            return next;
        });
    };

    return (
        <RecruiterModeContext.Provider value={{ active, toggle }}>
            {children}
        </RecruiterModeContext.Provider>
    );
}
