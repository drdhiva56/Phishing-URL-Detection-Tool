
import React from 'react';
import { FullAnalysis } from '../types';
import { getRiskColor, getRiskBg } from '../services/urlAnalyzer';

interface Props {
  analysis: FullAnalysis;
}

const AnalysisResult: React.FC<Props> = ({ analysis }) => {
  const { heuristics, ai, url } = analysis;
  const riskColor = getRiskColor(heuristics.score);
  const riskBg = getRiskBg(heuristics.score);

  return (
    <div className={`mt-8 p-6 rounded-2xl border ${riskBg} transition-all duration-500 animate-in fade-in slide-in-from-bottom-4`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-1">Target Analysis</h2>
          <p className="mono text-lg font-medium text-white break-all">{url}</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${riskColor}`}>{heuristics.score}%</div>
          <div className="text-xs text-slate-400 font-medium">THREAT SCORE</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heuristic Breakdown */}
        <div className="bg-slate-900/50 rounded-xl p-5 border border-white/5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Structural Indicators
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span className="text-slate-400">HTTPS Protocol</span>
              <span className={heuristics.hasHttps ? 'text-emerald-400' : 'text-red-400'}>
                {heuristics.hasHttps ? 'Valid' : 'Missing'}
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-slate-400">URL Length</span>
              <span className={heuristics.isTooLong ? 'text-red-400' : 'text-emerald-400'}>
                {heuristics.length} chars ({heuristics.isTooLong ? 'Suspicious' : 'Normal'})
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Sensitive Keywords</span>
              <span className={heuristics.suspiciousKeywordsFound.length > 0 ? 'text-red-400' : 'text-emerald-400'}>
                {heuristics.suspiciousKeywordsFound.length > 0 ? heuristics.suspiciousKeywordsFound.join(', ') : 'None'}
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Special Characters (@)</span>
              <span className={heuristics.hasSpecialChars ? 'text-red-400' : 'text-emerald-400'}>
                {heuristics.hasSpecialChars ? 'Detected' : 'None'}
              </span>
            </li>
          </ul>
        </div>

        {/* AI Insight */}
        {ai && (
          <div className="bg-slate-900/50 rounded-xl p-5 border border-white/5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Deep Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 ${
                  ai.riskLevel === 'CRITICAL' || ai.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  RISK: {ai.riskLevel}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{ai.summary}"</p>
              </div>
              {ai.techniquesDetected.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Techniques Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {ai.techniquesDetected.map((t, i) => (
                      <span key={i} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2 border-t border-white/5">
                <p className="text-xs text-blue-400">
                  <span className="font-bold">Advice:</span> {ai.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
