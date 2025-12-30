export const UI = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="p-6">
        <div className="bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg max-w-sm">
          <h1 className="text-2xl font-bold mb-3">3D Box Game</h1>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Controls:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>W / ↑</div>
              <div>Move Forward</div>
              <div>S / ↓</div>
              <div>Move Backward</div>
              <div>A / ←</div>
              <div>Move Left</div>
              <div>D / →</div>
              <div>Move Right</div>
              <div>Shift</div>
              <div>Hold to Run</div>
            </div>
            <p className="text-xs text-gray-300 mt-2">Use keyboard to move the purple box</p>
          </div>
        </div>
      </div>
    </div>
  );
};

