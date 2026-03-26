'use client';

import { useState } from 'react';
import { Play, Pencil, BarChart2, HelpCircle, X } from 'lucide-react';
import LeaderboardList from './LeaderboardList';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8tPRDvHZqciSWLs30fG2t9Rg5Xn1Pr3mfHYFxBp2XuqPBuJJQKP7pWeLkX-VZy756/exec";

interface LobbyProps {
  onStart: (name: string) => void;
}

export default function Lobby({ onStart }: LobbyProps) {
  const [name, setName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl px-4 animate-in fade-in duration-1000">
      {/* Logo Area */}
      <div className="mb-12 flex items-center gap-2">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-2.5 h-2.5 bg-white/40"></div>
            <div className="w-2.5 h-2.5 bg-white/40"></div>
            <div className="w-2.5 h-2.5 bg-white/40"></div>
            <div className="w-2.5 h-2.5 bg-white/40"></div>
          </div>
        </div>
        <span className="logo-text">NEON MATCH</span>
      </div>

      {/* Main Card */}
      <div className="glass p-12 w-full max-w-2xl flex flex-col items-center bg-white/95">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-500/50 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-500/50 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
          </div>
        </div>

        <h1 className="text-5xl font-extrabold mb-4 text-slate-800 tracking-tight">고요한 매치</h1>
        <p className="text-slate-500 text-center mb-10 text-lg">
          집중력을 발휘하세요. 본질을 찾으세요.<br/>마음을 비우는 과일 맞추기 체험.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100/50 border-none rounded-2xl py-5 px-6 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-slate-800 text-lg placeholder:text-slate-400 text-center"
              required
              autoFocus
            />
            <Pencil className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
          </div>
          
          <button
            type="submit"
            className="btn-serene btn-start w-full text-xl py-5"
            disabled={!name.trim()}
          >
            게임 시작 <Play className="w-5 h-5" fill="currentColor" />
          </button>
        </form>

        <div className="flex gap-8 mt-10">
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-green-600 transition-colors"
          >
            <BarChart2 className="w-5 h-5" /> 랭킹 보기
          </button>
          <button className="flex items-center gap-2 text-slate-500 font-bold hover:text-green-600 transition-colors">
            <HelpCircle className="w-5 h-5" /> 게임 방법
          </button>
        </div>
      </div>

      {/* Navbar Simulation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900 border-t border-slate-800/50 flex items-center justify-around px-4">
        <div className="flex flex-col items-center gap-1 text-purple-400">
          <div className="w-full h-1 bg-purple-400 absolute top-0 left-0 w-1/2"></div>
          <Play className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold">플레이</span>
        </div>
        <button 
          onClick={() => setShowLeaderboard(true)}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors"
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold">랭킹</span>
        </button>
      </div>

      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#fbfbf9] rounded-[40px] w-full max-w-lg relative overflow-hidden shadow-2xl">
            <button 
              onClick={() => setShowLeaderboard(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2 pt-6">
              <LeaderboardList webAppUrl={WEB_APP_URL} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
