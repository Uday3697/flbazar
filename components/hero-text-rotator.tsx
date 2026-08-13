"use client";

import { useEffect, useState } from "react";

const lines = [
  {
    lang: "en",
    heading: "Premium Sample Packs, Loops & FLP Projects",
    sub: "Buy high-quality paid sounds, beats & production tools — instant download after payment.",
  },
  {
    lang: "hi",
    heading: "प्रीमियम सैंपल पैक्स, लूप्स और FLP प्रोजेक्ट्स",
    sub: "हाई-क्वालिटी पेड साउंड्स, बीट्स और प्रोडक्शन टूल्स खरीदें — पेमेंट के बाद तुरंत डाउनलोड।",
  },
  {
    lang: "bn",
    heading: "প্রিমিয়াম স্যাম্পল প্যাক, লুপস ও FLP প্রজেক্ট",
    sub: "উচ্চমানের পেইড সাউন্ড, বিটস ও প্রোডাকশন টুলস কিনুন — পেমেন্টের পরে তাৎক্ষণিক ডাউনলোড।",
  },
];

export default function HeroTextRotator() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % lines.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const current = lines[index];

  return (
    <div
      style={{
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-[0.02em] text-slate-900 md:text-7xl">
        {current.heading}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{current.sub}</p>
    </div>
  );
}
