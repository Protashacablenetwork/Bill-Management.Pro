import React from "react";
import { Megaphone, AlertTriangle, Zap } from "lucide-react";
import { Language } from "../types";

interface NoticeTickerProps {
  lang: Language;
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ lang }) => {
  return (
    <div
      id="notice-ticker"
      className="my-3 overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-400/20 shadow-xs flex items-center text-slate-100 py-1.5 px-2"
    >
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 shadow-xs">
        <Megaphone className="w-3.5 h-3.5" />
        <span>{lang === "bn" ? "বিজ্ঞপ্তি" : "Notice"}</span>
      </div>

      <div className="flex-1 overflow-hidden ml-3 text-xs font-medium text-slate-200">
        <div className="flex items-center gap-3 whitespace-nowrap animate-marquee">
          <span className="flex items-center gap-1 text-amber-300 font-semibold">
            <Zap className="w-3.5 h-3.5" />
            {lang === "bn"
              ? "দ্রুত বকেয়া বিল আদায় করুন"
              : "Collect pending bills promptly"}
          </span>
          <span className="text-slate-400">➤</span>
          <span>
            {lang === "bn"
              ? "সম্মানিত সকলের অবগতির জন্য জানানো যাচ্ছে যে, নিয়মিত বিলের তথ্য অনলাইন শিট থেকে স্বয়ংক্রিয়ভাবে আপডেট করা হয়।"
              : "Kindly note that billing records are updated live from official spreadsheets."}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600/80 text-white font-bold text-[11px]">
            <AlertTriangle className="w-3 h-3" />
            {lang === "bn" ? "সতর্কতা:" : "Alert:"}
          </span>
          <span>
            {lang === "bn"
              ? "গ্রাহকদের সময়মতো রশিদ প্রদান করুন এবং বকেয়া তাগাদা দিন।"
              : "Issue timely receipts to clients and send due payment reminders."}
          </span>
        </div>
      </div>
    </div>
  );
};
