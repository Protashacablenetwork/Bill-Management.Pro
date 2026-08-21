import { BillRecord, NetType } from "../types";

declare global {
  interface Window {
    XLSX?: any;
  }
}

export function parseAmount(val: any): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function formatPhone(s: any): string {
  if (!s || s === "---" || s === "-") return "---";
  let clean = String(s).replace(/\D/g, "");
  if (clean.startsWith("880") && clean.length === 13) {
    clean = "0" + clean.slice(3);
  } else if (clean.length === 11 && clean.startsWith("01")) {
    return clean;
  } else if (clean.length === 10 && !clean.startsWith("0")) {
    clean = "0" + clean;
  }
  return clean.length >= 10 ? clean : String(s);
}

export function parseExcelDate(val: any): string {
  if (!val || val === "-" || val === "---") return "-";
  if (typeof val === "number" && val > 1) {
    const d = new Date((val - 25569) * 86400000);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}/${d.getFullYear()}`;
    }
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    const match = trimmed.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (match) {
      return `${match[3].padStart(2, "0")}/${match[2].padStart(2, "0")}/${match[1]}`;
    }
    const match2 = trimmed.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (match2) {
      return `${match2[1].padStart(2, "0")}/${match2[2].padStart(2, "0")}/${match2[3]}`;
    }
    return trimmed;
  }
  return "-";
}

export function parseExcelWorkbook(workbook: any, netType: NetType): BillRecord[] {
  if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
    return [];
  }

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[][] = window.XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  if (!rows || rows.length < 2) return [];

  const hasId =
    netType === "নেট বিল" || netType === "নেট সংযোগ" || netType === "বকেয়া বিল";

  let startRow = 5;

  // Dynamically inspect header if row 5 is not the data start
  for (let i = 0; i < Math.min(20, rows.length); i++) {
    const r = rows[i];
    if (!r) continue;
    const joined = r.join(" ").toLowerCase();
    if (
      (hasId && (joined.includes("আইডি") || joined.includes("id") || joined.includes("cust"))) ||
      joined.includes("নাম") ||
      joined.includes("গ্রাহক") ||
      joined.includes("name")
    ) {
      startRow = i + 1;
      break;
    }
  }

  const records: BillRecord[] = [];
  const seen = new Set<string>();

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;

    const firstCell = row[0] ? String(row[0]).trim() : "";
    if (
      firstCell.includes("মোট") ||
      firstCell.toLowerCase().includes("total") ||
      firstCell === "0" ||
      firstCell === "০"
    ) {
      continue;
    }

    let uid: string | null = null;
    let name = "";

    if (hasId) {
      uid = row[1] ? String(row[1]).trim() : "";
      name = row[2] ? String(row[2]).trim() : "";
    } else {
      name = row[1] ? String(row[1]).trim() : "";
    }

    // Skip empty dummy rows
    if (!name && !uid) continue;
    if (name.includes("মোট") || name.toLowerCase().includes("total")) continue;

    const uniqueKey = hasId ? `${uid}_${name}_${i}` : `${name}_${i}`;
    if (seen.has(uniqueKey)) continue;
    seen.add(uniqueKey);

    let pay = 0;
    let due = 0;

    if (hasId) {
      pay = parseAmount(row[3]);
      due = parseAmount(row[4]);
    } else {
      pay = parseAmount(row[2]);
      due = parseAmount(row[3]);
    }

    const dateIdx = hasId ? 6 : 5;
    const mobIdx = hasId ? 7 : 6;
    const addrIdx = hasId ? 8 : 7;
    const statusIdx = hasId ? 9 : null;

    records.push({
      id: hasId ? (uid || "-----") : null,
      name: name || "নাম নেই",
      pay,
      due,
      total: pay + due,
      date: parseExcelDate(row[dateIdx]),
      mob: formatPhone(row[mobIdx]),
      address: row[addrIdx] ? String(row[addrIdx]).trim() : "---",
      status:
        (netType === "নেট সংযোগ" || netType === "বকেয়া বিল") &&
        statusIdx !== null &&
        row[statusIdx]
          ? String(row[statusIdx]).trim()
          : undefined,
    });
  }

  return records;
}

export function exportRecordsToExcel(records: BillRecord[], filename: string) {
  if (!window.XLSX) {
    alert("XLSX library is not loaded.");
    return;
  }

  const exportData = records.map((r, index) => ({
    "ক্রমিক (SL)": index + 1,
    "কাস্টমার আইডি": r.id || "---",
    "গ্রাহকের নাম": r.name,
    "পরিশোধিত (৳)": r.pay,
    "বকেয়া (৳)": r.due,
    "সর্বমোট (৳)": r.total,
    "মোবাইল": r.mob,
    "তারিখ": r.date,
    "ঠিকানা": r.address,
    "স্ট্যাটাস": r.status || (r.due === 0 ? "পরিশোধিত" : r.pay > 0 ? "আংশিক" : "বকেয়া"),
  }));

  const worksheet = window.XLSX.utils.json_to_sheet(exportData);
  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");
  window.XLSX.writeFile(workbook, `${filename}.xlsx`);
}
