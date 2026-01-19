
import { HeuristicAnalysis } from '../types';
import { SUSPICIOUS_KEYWORDS, MAX_SAFE_LENGTH } from '../constants';

export const analyzeHeuristics = (url: string): HeuristicAnalysis => {
  let score = 0;
  const lowerUrl = url.toLowerCase();
  
  // 1. HTTPS Check
  const hasHttps = lowerUrl.startsWith('https://');
  if (!hasHttps) score += 30;

  // 2. Length Check
  const length = url.length;
  const isTooLong = length > MAX_SAFE_LENGTH;
  if (isTooLong) score += 15;

  // 3. Keywords Check
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter(keyword => lowerUrl.includes(keyword));
  score += foundKeywords.length * 10;

  // 4. Special Characters Check (@ is a big red flag for hiding the real host)
  const hasSpecialChars = url.includes('@') || url.includes('//', 8);
  if (url.includes('@')) score += 40;
  if (url.includes('//', 8)) score += 20;

  // 5. IP Address detection (using regex for simple IPv4)
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  const isIpAddress = ipRegex.test(url);
  if (isIpAddress) score += 35;

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    hasHttps,
    length,
    isTooLong,
    suspiciousKeywordsFound: foundKeywords,
    hasSpecialChars,
    isIpAddress,
    score
  };
};

export const getRiskColor = (score: number) => {
  if (score < 30) return 'text-emerald-400';
  if (score < 60) return 'text-yellow-400';
  if (score < 85) return 'text-orange-500';
  return 'text-red-500';
};

export const getRiskBg = (score: number) => {
  if (score < 30) return 'bg-emerald-500/10 border-emerald-500/20';
  if (score < 60) return 'bg-yellow-500/10 border-yellow-500/20';
  if (score < 85) return 'bg-orange-500/10 border-orange-500/20';
  return 'bg-red-500/10 border-red-500/20';
};
