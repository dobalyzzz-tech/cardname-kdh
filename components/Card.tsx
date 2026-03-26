'use client';

interface CardProps {
  id: number;
  value: { id: string; type: string; value: string };
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function Card({ value, isFlipped, isMatched, onClick }: CardProps) {
  return (
    <div 
      className={`relative w-24 h-24 sm:w-28 sm:h-28 cursor-pointer transition-transform duration-700 preserve-3d ${isFlipped || isMatched ? 'flipped' : ''}`}
      onClick={!isMatched && !isFlipped ? onClick : undefined}
    >
      {/* Front of card (Dotted pattern) */}
      <div className="card-face card-front dotted-pattern flex items-center justify-center border-2 border-green-500/10">
        <span className="text-3xl font-black text-green-500/20 italic select-none">?</span>
      </div>
      
      {/* Back of card (Revealed fruit) */}
      <div className={`card-face card-back bg-white rounded-2xl flex items-center justify-center overflow-hidden border-2 ${isMatched ? 'border-amber-500/50' : 'border-green-500'}`}>
        {value.type === 'image' ? (
          <div className="w-full h-full p-3 flex items-center justify-center">
            <img 
              src={value.value} 
              alt={value.id} 
              className="max-w-full max-h-full object-contain pointer-events-none"
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl leading-none select-none">{value.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
