'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Home, Trophy, Star, ArrowRight } from 'lucide-react';

import LeaderboardList from './LeaderboardList';

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
        <LeaderboardList webAppUrl={webAppUrl} userName={userName} />
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
