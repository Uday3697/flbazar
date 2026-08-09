"use client";

import { useEffect } from "react";

const gradients = ["bg-gradient-1", "bg-gradient-2", "bg-gradient-3", "bg-gradient-4"];

export default function RandomBg() {
  useEffect(() => {
    const pick = gradients[Math.floor(Math.random() * gradients.length)];
    document.body.classList.add(pick);
    return () => document.body.classList.remove(pick);
  }, []);

  return null;
}
