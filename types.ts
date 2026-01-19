
export interface HeuristicAnalysis {
  hasHttps: boolean;
  length: number;
  isTooLong: boolean;
  suspiciousKeywordsFound: string[];
  hasSpecialChars: boolean;
  isIpAddress: boolean;
  score: number; // 0 to 100 (0 safe, 100 danger)
}

export interface AIAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  threatActors?: string;
  techniquesDetected: string[];
  recommendation: string;
}

export interface FullAnalysis {
  url: string;
  timestamp: number;
  heuristics: HeuristicAnalysis;
  ai?: AIAnalysis;
}
