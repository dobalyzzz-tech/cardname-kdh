'use client';

import { useState, useEffect } from 'react';

interface LeaderboardItem {
  username: string;
  finishTime: string;
  score?: number;
}

interface LeaderboardListProps {
  webAppUrl: string;
  userName?: string;
}

// 시간 포맷을 MM:SS 형식으로 정제하는 함수 (매우 견고한 버전)
export const cleanTimeFormat = (val: any) => {
  if (val === undefined || val === null || val === '') return "00:00";
  
  if (typeof val === 'number') {
    const m = Math.floor(val / 60);
    const s = Math.floor(val % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  let str = String(val).trim();
  
  if (str.includes('T')) {
    const d = new Date(str);
    let offset = 30472000; 
    
    if (new Date(d.getTime() + 32400000).getUTCSeconds() === 0 && new Date(d.getTime() + 30472000).getUTCSeconds() !== 0) {
      offset = 32400000;
    } else if (new Date(d.getTime() + 28800000).getUTCSeconds() === 0 && new Date(d.getTime() + 30472000).getUTCSeconds() !== 0) {
      offset = 28800000;
    }

    const localMs = d.getTime() + offset;
    const localD = new Date(localMs);
    
    const hh = localD.getUTCHours();
    const mm = localD.getUTCMinutes();
    const ss = localD.getUTCSeconds();
    
    if (ss === 0) {
      return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    } else {
      return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    }
  }
  
  if (!str.includes(':')) {
    const secs = parseInt(str, 10);
    if (!isNaN(secs)) {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return "00:00";
  }
  
  const parts = str.split(':');
  if (parts.length >= 3) {
    return `${parts[parts.length - 2].padStart(2, '0')}:${parts[parts.length - 1].padStart(2, '0')}`;
  } else if (parts.length === 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  
  return str.substring(0, 5);
};

export const timeToSeconds = (val: any) => {
  if (typeof val === 'number') return val;
  const cleaned = cleanTimeFormat(val);
  const [mins, secs] = cleaned.split(':').map(Number);
  return (mins || 0) * 60 + (secs || 0);
};

export default function LeaderboardList({ webAppUrl, userName }: LeaderboardListProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // 브라우저 캐시를 강제로 무효화하여 항상 최신 랭킹 데이터를 가져옵니다.
        const res = await fetch(`${webAppUrl}?t=${new Date().getTime()}`, {
          cache: 'no-store'
        });
        const data = await res.json();
        
        const rawItems = Array.isArray(data) ? data : [];
        const validItems = rawItems.filter(item => item && typeof item === 'object');

        const sortedData = validItems
          .sort((a, b) => timeToSeconds(a?.finishTime) - timeToSeconds(b?.finishTime))
          .slice(0, 3);
          
        setLeaderboard(sortedData);
      } catch (err) {
        console.error("랭킹 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (webAppUrl) {
      const timer = setTimeout(fetchLeaderboard, 1500);
      return () => clearTimeout(timer);
    }
  }, [webAppUrl]);

  return (
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
                  String(item.username || '').trim() === String(userName || '').trim() 
                    ? 'bg-amber-600 border-4 border-amber-400 shadow-xl scale-[1.02]' 
                    : 'bg-white border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-pixel text-[10px] ${
                    String(item.username || '').trim() === String(userName || '').trim() ? 'bg-amber-400 text-amber-900' : 'bg-slate-50 text-slate-400 border border-slate-100'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`font-bold uppercase ${String(item.username || '').trim() === String(userName || '').trim() ? 'text-white' : 'text-slate-700'}`}>
                    {item.username} {String(item.username || '').trim() === String(userName || '').trim() && "(본인)"}
                  </span>
                </div>
                <span className={`font-pixel text-sm ${String(item.username || '').trim() === String(userName || '').trim() ? 'text-white' : 'text-amber-600'}`}>
                  {cleanTimeFormat(item.finishTime)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 font-medium">아직 등록된 기록이 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
