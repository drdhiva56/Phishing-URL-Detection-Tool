
import React, { useState } from 'react';
import { FullAnalysis } from './types';
import { analyzeHeuristics } from './services/urlAnalyzer';
import { analyzeUrlWithAI } from './services/geminiService';
import AnalysisResult from './components/AnalysisResult';

const App: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<FullAnalysis[]>([]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let formattedUrl = urlInput.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const heuristics = analyzeHeuristics(formattedUrl);
      const aiResult = await analyzeUrlWithAI(formattedUrl);

      const fullResult: FullAnalysis = {
        url: formattedUrl,
        timestamp: Date.now(),
        heuristics,
        ai: aiResult
      };

      setAnalysis(fullResult);
      setHistory(prev => [fullResult, ...prev.slice(0, 4)]);
      setIsAnalyzing(false);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please check the URL and try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 bg-[#0f172a] text-slate-200">
      {/* Header */}
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Phishing URL Detection v2.5
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          PhishGuard <span className="text-blue-500">AI</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Deploy deep heuristic analysis and generative AI to detect malicious URLs before they compromise your data.
        </p>
      </div>

      {/* Main Input Section */}
      <div className="max-w-3xl w-full">
        <form onSubmit={handleAnalyze} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col sm:flex-row gap-3 bg-slate-900 p-2 rounded-2xl border border-white/10 shadow-2xl">
            <input
              type="text"
              placeholder="Paste suspicious URL (e.g., security-update-bank.tk)"
              className="flex-1 bg-transparent px-4 py-3 outline-none text-white mono placeholder:text-slate-600 text-sm sm:text-base"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button
              disabled={isAnalyzing}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                isAnalyzing 
                  ? 'bg-slate-700 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 active:scale-95'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  Scan URL
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Results */}
        {analysis && <AnalysisResult analysis={analysis} />}

        {/* Logic Explanation Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
              Heuristic Filtering
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              We check for technical red flags like non-HTTPS connections, IP-based hosting, and deceptive subdomains.
            </p>
          </div>
          <div className="p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">2</span>
              Semantic Analysis
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Detection of high-risk keywords used in social engineering, such as 'login', 'verify', or brand names.
            </p>
          </div>
          <div className="p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">3</span>
              AI Reasoning
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Gemini AI analyzes the domain reputation and identifies sophisticated typosquatting (e.g., 'g00gle.com').
            </p>
          </div>
        </div>
      </div>

      {/* Footer / History */}
      {history.length > 0 && (
        <div className="max-w-4xl w-full mt-20 pt-10 border-t border-white/5">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-6">Recent Scans</h3>
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => setAnalysis(item)}
              >
                <span className="mono text-xs text-slate-300 truncate max-w-[70%]">{item.url}</span>
                <span className={`text-xs font-bold ${getRiskColor(item.heuristics.score)}`}>
                  {item.heuristics.score}% RISK
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for history colors
const getRiskColor = (score: number) => {
  if (score < 30) return 'text-emerald-400';
  if (score < 60) return 'text-yellow-400';
  if (score < 85) return 'text-orange-500';
  return 'text-red-500';
};

export default App;
