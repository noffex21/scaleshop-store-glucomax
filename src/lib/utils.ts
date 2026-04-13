import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function maskName(name: string) {
  if (!name) return "";
  return name.split(" ").map(word => {
    if (word.length <= 1) return word;
    if (word.length === 2) return word[0] + "**";
    return word[0] + "**" + word[word.length - 1];
  }).join(" ");
}

export function formatSoldCount(value: string | number | undefined): string {
  if (!value && value !== 0) return "0";
  const str = String(value).trim().toLowerCase();
  
  const hasPlus = str.includes('+');
  
  let numStr = str.replace(/[^\d.,]/g, '');
  numStr = numStr.replace(',', '.');
  
  let numVal = parseFloat(numStr);
  if (isNaN(numVal)) return str;
  
  if (str.includes('k') || (str.includes('m') && !str.includes('mil'))) {
     numVal = numVal * 1000;
  } else if (str.includes('mil')) {
     numVal = numVal * 1000;
  } else if (str.split('.').length === 2 && str.split('.')[1].length === 3) {
     numVal = parseFloat(str.replace('.', ''));
  }

  if (numVal >= 1000) {
     const formattedInfo = (numVal / 1000).toFixed(1).replace('.', ',');
     const result = formattedInfo.endsWith(',0') ? formattedInfo.slice(0, -2) : formattedInfo;
     return `${result} mil${hasPlus ? '+' : ''}`;
  }

  return `${numVal}${hasPlus ? '+' : ''}`;
}
