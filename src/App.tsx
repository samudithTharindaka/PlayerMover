import { GameCanvas } from './components/GameCanvas';
import { UI } from './components/UI';

function App() {
  return (
    <div className="w-screen h-screen bg-gradient-to-b from-slate-900 to-slate-700">
      <GameCanvas />
      <UI />
    </div>
  );
}

export default App;
