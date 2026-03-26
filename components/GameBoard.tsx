'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, Home, Timer as TimerIcon, BarChart2, Settings, History } from 'lucide-react';
import Card from './Card';
import ResultScreen from './ResultScreen';

const FRUITS = [
  { id: 'apple', type: 'image', value: '/assets/fruits/apple.png' },
  { id: 'banana', type: 'image', value: '/assets/fruits/banana.png' },
  { id: 'grapes', type: 'image', value: '/assets/fruits/grapes.png' },
  { id: 'strawberry', type: 'image', value: '/assets/fruits/strawberry.png' },
  { id: 'cherry', type: 'image', value: '/assets/fruits/cherry.png' },
  { id: 'pineapple', type: 'image', value: '/assets/fruits/pineapple.png' },
  { id: 'kiwi', type: 'emoji', value: '🥝' },
  { id: 'watermelon', type: 'emoji', value: '🍉' },
];

interface GameBoardProps {
  userName: string;
  onHome: () => void;
}

export default function GameBoard({ userName, onHome }: GameBoardProps) {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 여기에 구글 앱스 스크립트 웹 앱 URL을 입력하세요.
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwlGI58qZJdW5RWw-U2_Ufoj7rGcmfz9zLsoouDp0rOd7jMDjkd1zNhvHwlU16goCT_/exec"; 

  const saveToSpreadsheet = useCallback(async (finalTime: string, finalScore: number) => {
    if (!WEB_APP_URL || isSaving) return;
    setIsSaving(true);
    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Apps Script doPost handles this
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
          finishTime: finalTime,
          score: finalScore
        })
      });
      console.log("Result saved successfully via no-cors");
    } catch (e) {
      console.error("Failed to save to spreadsheet", e);
    } finally {
      setIsSaving(false);
    }
  }, [userName, isSaving]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initGame = useCallback(() => {
    const deck = [...FRUITS, ...FRUITS]
      .sort(() => Math.random() - 0.5)
      .map((fruit, index) => ({ ...fruit, uniqueId: index }));
    setCards(deck);
    setFlipped([]);
    setMatches([]);
    setTime(0);
    setIsPaused(false);
    setIsFinished(false);
    setMoves(0);
    setScore(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval: any;
    if (!isPaused && !isFinished) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isFinished]);

  const handleCardClick = (index: number) => {
    if (isPaused || isFinished || flipped.includes(index) || matches.includes(index) || flipped.length >= 2) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].id === cards[second].id) {
        setMatches((m) => [...m, first, second]);
        setScore(s => s + 200 - (moves > 10 ? (moves - 10) * 5 : 0));
        setFlipped([]);
        if (matches.length + 2 === cards.length) {
          setIsFinished(true);
          // 게임이 완료되면 결과를 스프레드시트에 전송
          saveToSpreadsheet(formatTime(time), score + 200 - (moves > 10 ? (moves - 10) * 5 : 0));
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  if (isFinished) {
    return (
      <ResultScreen 
        userName={userName}
        time={formatTime(time)}
        moves={moves}
        score={score}
        onRestart={initGame}
        onHome={onHome}
        webAppUrl={WEB_APP_URL}
      />
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl px-4 animate-in fade-in duration-700 pb-24">
      {/* Top Navigation Simulation */}
      <div className="w-full flex justify-between items-center mb-10 h-16 px-4">
        <span className="logo-text text-green-500 italic font-black">네온 매치</span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">플레이어</span>
            <span className="text-green-500 font-black uppercase text-sm">{userName}</span>
          </div>
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm shadow-sm">
            <TimerIcon className="w-4 h-4" /> {formatTime(time)}
          </div>
          <History className="w-5 h-5 text-slate-400 cursor-pointer hover:text-green-500 transition-colors" />
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Title & Stats */}
        <div className="w-full flex justify-between items-end mb-8 px-4">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-800 leading-tight">과일 프렌지</h2>
            <p className="text-slate-400 font-medium">레벨 4 • 열대 과일 짝을 맞추세요</p>
          </div>
          <div className="flex gap-3">
            <div className="stat-pill bg-purple-50 border-purple-100 min-w-[80px]">
              <span className="text-[10px] font-bold text-purple-400 uppercase">이동</span>
              <span className="text-2xl font-bold text-slate-800 leading-none">{moves}</span>
            </div>
            <div className="stat-pill bg-orange-50 border-orange-100 min-w-[80px]">
              <span className="text-[10px] font-bold text-orange-400 uppercase">점수</span>
              <span className="text-2xl font-bold text-slate-800 leading-none">{score}</span>
            </div>
          </div>
        </div>

        {/* Grid Container */}
        <div className="bg-white/40 p-4 rounded-[40px] shadow-inner-lg backdrop-blur-sm border border-white/50 mb-10">
          <div className="grid grid-cols-4 gap-4 p-2">
            {cards.map((card, index) => (
              <Card
                key={card.uniqueId}
                id={index}
                value={card}
                isFlipped={flipped.includes(index)}
                isMatched={matches.includes(index)}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full px-4 mb-4">
          <div className="flex justify-between text-[11px] font-black tracking-widest text-slate-400 uppercase mb-3">
            <span>나의 진행 상황</span>
            <span>{matches.length / 2} / 8</span>
          </div>
          <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden p-1 shadow-inner">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out shadow-sm" 
              style={{ width: `${(matches.length / 16) * 100}%`, backgroundColor: '#78350f' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Control Overlay when Paused */}
      {isPaused && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-xl z-[60] flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="glass p-12 flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8 text-slate-800">일시 정지</h2>
            <div className="flex flex-col gap-4 w-64">
              <button onClick={() => setIsPaused(false)} className="btn-serene btn-start py-4">
                <Play className="w-5 h-5" fill="currentColor" /> 계속하기
              </button>
              <button onClick={initGame} className="btn-serene bg-slate-100 text-slate-600 py-4 hover:bg-slate-200">
                <RotateCcw className="w-5 h-5" /> 다시 시작
              </button>
              <button onClick={onHome} className="btn-serene bg-slate-100 text-slate-600 py-4 hover:bg-slate-200">
                <Home className="w-5 h-5" /> 메인 화면
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar Simulation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900 border-t border-slate-800/50 flex items-center justify-around px-4 z-50">
        <div 
          onClick={() => setIsPaused(!isPaused)}
          className="flex flex-col items-center gap-1 text-purple-400 cursor-pointer"
        >
          <div className="w-1/3 h-1 bg-purple-400 absolute top-0"></div>
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          <span className="text-[10px] uppercase font-bold">플레이</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors cursor-pointer">
          <BarChart2 className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold">랭킹</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors cursor-pointer">
          <Settings className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold">설정</span>
        </div>
      </div>
    </div>
  );
}
