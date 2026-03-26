'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Home, Trophy, Star, ArrowRight } from 'lucide-react';

interface LeaderboardItem {
  username: string;
  finishTime: string;
  score?: number;
}

interface ResultScreenProps {
  userName: string;
  time: string;
  moves: number;
  score: number;
  onRestart: () => void;
  onHome: () => void;
  webAppUrl: string;
}

export default function ResultScreen({ userName, time, moves, score, onRestart, onHome, webAppUrl }: ResultScreenProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(webAppUrl);
        const data = await res.json();
        setLeaderboard(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("랭킹 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (webAppUrl) {
      // 신규 기록이 서버에 반영될 시간을 고려하여 약간의 지연 후 호출
      const timer = setTimeout(fetchLeaderboard, 1500);
      return () => clearTimeout(timer);
    }
  }, [webAppUrl]);

  return (
    <div className="fixed inset-0 bg-[#fbfbf9] z-50 flex flex-col items-center justify-between p-8 animate-in fade-in zoom-in duration-500 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <span className="italic font-bold text-xl text-amber-800">과일 맞추기</span>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-400">⏱</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-400">👤</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-2xl">
        <h1 className="text-6xl font-pixel text-amber-400 mb-2 drop-shadow-[0_4px_0_rgba(251,191,36,0.3)] text-center leading-tight">
          레벨 클리어
        </h1>
        <p className="text-slate-400 font-bold tracking-widest mb-12">미션 완료</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
          {/* Time Box */}
          <div className="bg-slate-50 rounded-[40px] p-10 flex flex-col items-center justify-center border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-200/50 rounded-full"></div>
            <div className="w-12 h-12 bg-amber-800 text-white rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">⏱</span>
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase mb-2">클리어 시간</p>
            <p className="text-5xl font-pixel text-slate-800 tracking-tighter mb-4">{time}</p>
            <p className="text-sky-500 font-bold text-sm">+500 점 보너스</p>
          </div>

          {/* Rating Box */}
          <div className="bg-amber-400 rounded-[40px] p-10 flex flex-col items-center justify-center shadow-lg shadow-amber-200">
            <p className="text-amber-800 text-sm font-bold uppercase mb-4">평가</p>
            <div className="flex gap-2 mb-6">
              <Star className="w-10 h-10 text-amber-800" fill="currentColor" />
              <Star className="w-10 h-10 text-amber-800" fill="currentColor" />
              <Star className="w-10 h-10 text-amber-800" fill="currentColor" />
            </div>
            <button className="bg-white text-amber-800 px-8 py-2 rounded-full font-pixel text-xs tracking-tighter shadow-md">
              완벽해요!
            </button>
          </div>
        </div>

        {/* Live Leaderboard */}
        <div className="w-full bg-slate-50/50 rounded-[40px] p-8 border border-slate-100/50">
          <h3 className="text-slate-800 font-bold text-xl mb-6">🏆 실시간 랭킹 Top 3 (낮은 시간 순)</h3>
          
          {loading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium">기록 불러오는 중...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.length > 0 ? (
                leaderboard.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center px-6 py-5 rounded-3xl transition-all shadow-sm ${
                      item.username === userName 
                        ? 'bg-amber-600 border-4 border-amber-400 shadow-xl scale-[1.02]' 
                        : 'bg-white border border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-pixel text-[10px] ${
                        item.username === userName ? 'bg-amber-400 text-amber-900' : 'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`font-bold uppercase ${item.username === userName ? 'text-white' : 'text-slate-700'}`}>
                        {item.username} {item.username === userName && "(본인)"}
                      </span>
                    </div>
                    <span className={`font-pixel text-sm ${item.username === userName ? 'text-white' : 'text-amber-600'}`}>
                      {item.finishTime}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 font-medium">아직 등록된 기록이 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="w-full max-w-2xl flex gap-4 mt-12 mb-4">
        <button onClick={onRestart} className="btn-serene bg-amber-800 text-white flex-1 py-6 text-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
          다음 단계 <ArrowRight className="w-6 h-6 ml-2" />
        </button>
        <button onClick={onHome} className="btn-serene bg-slate-200 text-slate-700 flex-1 py-6 text-xl shadow-md hover:bg-slate-300 active:scale-95 transition-all">
          메인으로
        </button>
      </div>
    </div>
  );
}
