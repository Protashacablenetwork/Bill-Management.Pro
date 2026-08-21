import React, { useRef } from "react";
import {
  Menu,
  Moon,
  Sun,
  Languages,
  RotateCw,
  Upload,
  Download,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { ALL_MONTHS, TRANSLATIONS } from "../constants/links";
import { Language, MonthName, NetType } from "../types";

interface TopHeaderProps {
  onToggleMobileMenu: () => void;
  currentNet: NetType;
  onChangeNet: (net: NetType) => void;
  currentMonth: MonthName;
  onChangeMonth: (month: MonthName) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lang: Language;
  onToggleLanguage: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  onFileUpload: (file: File) => void;
  onExport: () => void;
  hasRecords: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleMobileMenu,
  currentNet,
  onChangeNet,
  currentMonth,
  onChangeMonth,
  isDarkMode,
  onToggleDarkMode,
  lang,
  onToggleLanguage,
  onRefresh,
  isLoading,
  onFileUpload,
  onExport,
  hasRecords,
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
      e.target.value = "";
    }
  };

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Mobile Menu & App Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-btn"
              onClick={onToggleMobileMenu}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <span>{t.appTitle}</span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" />
                    {t.proBadge}
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Quick theme & lang toggles on mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "EN" : "বাং"}</span>
            </button>
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Side: Filters, Selectors, and Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Net Type Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
            <select
              id="net-type-select"
              value={currentNet}
              onChange={(e) => onChangeNet(e.target.value as NetType)}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer pr-1"
            >
              <option value="নেট বিল" className="bg-white dark:bg-slate-900">
                নেট বিল (Net Bill)
              </option>
              <option value="ডিস বিল" className="bg-white dark:bg-slate-900">
                ডিস বিল (Dish Bill)
              </option>
              <option value="নেট সংযোগ" className="bg-white dark:bg-slate-900">
                নেট সংযোগ (Connection)
              </option>
              <option value="বকেয়া বিল" className="bg-white dark:bg-slate-900">
                বকেয়া বিল (Due Bill)
              </option>
            </select>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
            <select
              id="month-select"
              value={currentMonth}
              onChange={(e) => onChangeMonth(e.target.value as MonthName)}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer pr-1"
            >
              {ALL_MONTHS.map((m) => (
                <option key={m} value={m} className="bg-white dark:bg-slate-900">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            id="refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
            title={t.refreshing}
            className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors border border-orange-200 dark:border-orange-900/50 disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Custom File Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title={t.importFile}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.importFile}</span>
          </button>

          {/* Export Excel */}
          {hasRecords && (
            <button
              onClick={onExport}
              title={t.exportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.exportExcel}</span>
            </button>
          )}

          {/* Desktop Language Switch */}
          <button
            onClick={onToggleLanguage}
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-orange-500" />
            <span>{lang === "bn" ? "🇧🇩 বাংলা" : "🇬🇧 English"}</span>
          </button>

          {/* Desktop Theme Switch */}
          <button
            onClick={onToggleDarkMode}
            className="hidden md:inline-flex items-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
