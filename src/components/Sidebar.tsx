import React from "react";
import {
  LayoutDashboard,
  Receipt,
  CheckCircle2,
  AlertCircle,
  CircleDollarSign,
  User,
  X,
} from "lucide-react";
import { ColorTheme, FilterType, Language } from "../types";
import { TRANSLATIONS } from "../constants/links";

interface SidebarProps {
  currentFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  colorTheme: ColorTheme;
  onSelectColorTheme: (theme: ColorTheme) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentFilter,
  onSelectFilter,
  colorTheme,
  onSelectColorTheme,
  isOpenMobile,
  onCloseMobile,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const themes: { id: ColorTheme; bg: string; name: string }[] = [
    { id: "orange", bg: "bg-orange-600", name: "অরেঞ্জ" },
    { id: "blue", bg: "bg-blue-600", name: "নীল" },
    { id: "green", bg: "bg-green-600", name: "সবুজ" },
    { id: "purple", bg: "bg-purple-600", name: "বেগুনি" },
    { id: "pink", bg: "bg-pink-600", name: "গোলাপি" },
    { id: "teal", bg: "bg-teal-600", name: "টিল" },
  ];

  const navItems = [
    {
      id: "dashboard" as FilterType,
      label: t.dashboard,
      icon: LayoutDashboard,
    },
    {
      id: "all" as FilterType,
      label: t.allBills,
      icon: Receipt,
    },
    {
      id: "paid" as FilterType,
      label: t.paidBills,
      icon: CheckCircle2,
    },
    {
      id: "due" as FilterType,
      label: t.dueBills,
      icon: AlertCircle,
    },
    {
      id: "total" as FilterType,
      label: t.totalBills,
      icon: CircleDollarSign,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 flex flex-col justify-between
          ${
            isOpenMobile
              ? "translate-x-0 w-64 p-4"
              : "-translate-x-full md:translate-x-0 md:w-20 md:p-3"
          }`}
      >
        {/* Top Logo */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black flex items-center justify-center shadow-md shadow-orange-500/20 text-lg">
                বিল
              </div>
              <div className={`leading-tight ${isOpenMobile ? "block" : "md:hidden"}`}>
                <div className="font-bold text-slate-800 dark:text-white text-base">
                  {t.appTitle}
                </div>
                <div className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold tracking-wider uppercase">
                  {t.proBadge} Edition
                </div>
              </div>
            </div>
            {isOpenMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentFilter === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    onSelectFilter(item.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                    ${
                      isActive
                        ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-orange-600 dark:text-orange-400" : ""
                    }`}
                  />
                  <span
                    className={`${
                      isOpenMobile ? "inline-block" : "md:hidden"
                    } text-xs font-semibold`}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-orange-600 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Themes & Developer Credit */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Color Palette Dots */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {themes.map((th) => (
              <button
                key={th.id}
                title={th.name}
                onClick={() => onSelectColorTheme(th.id)}
                className={`w-4 h-4 rounded-full ${th.bg} transition-transform hover:scale-125 ${
                  colorTheme === th.id
                    ? "ring-2 ring-offset-2 ring-slate-800 dark:ring-offset-slate-900 scale-110"
                    : "opacity-75"
                }`}
              />
            ))}
          </div>

          {/* Dev Info */}
          <div className="text-center">
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {t.developer}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 mt-0.5">
              <User className="w-3 h-3 text-orange-500" />
              <span>Md Riad Mia</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
