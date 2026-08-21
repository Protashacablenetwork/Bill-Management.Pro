export type NetType = "নেট বিল" | "ডিস বিল" | "নেট সংযোগ" | "বকেয়া বিল";

export type MonthName =
  | "জানুয়ারি"
  | "ফেব্রুয়ারি"
  | "মার্চ"
  | "এপ্রিল"
  | "মে"
  | "জুন"
  | "জুলাই"
  | "আগস্ট"
  | "সেপ্টেম্বর"
  | "অক্টোবর"
  | "নভেম্বর"
  | "ডিসেম্বর";

export type FilterType = "dashboard" | "all" | "paid" | "due" | "partial" | "total";

export type ColorTheme = "orange" | "blue" | "green" | "purple" | "pink" | "teal";

export type Language = "bn" | "en";

export interface BillRecord {
  id: string | null;
  name: string;
  pay: number;
  due: number;
  total: number;
  date: string;
  mob: string;
  address: string;
  status?: string;
  note?: string;
}

export interface MonthSummary {
  month: MonthName;
  netBill: number;
  disBill: number;
  total: number;
}
