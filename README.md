# 3D Box Movement Game

A web-based 3D game built with React, Three.js, and Tailwind CSS where you can control a 3D box using keyboard inputs.

## Technologies Used

- **React 19** with TypeScript
- **Vite** - Fast build tool and dev server
- **React Three Fiber** (@react-three/fiber) - React renderer for Three.js
- **Three.js** - 3D graphics library (WebGL)
- **Tailwind CSS v3** - Utility-first styling

## Features

✅ 3D rendered box with smooth movement  
✅ Keyboard controls (WASD and Arrow keys)  
✅ Wireframe ground plane for spatial reference  
✅ Beautiful lighting and shadows  
✅ UI overlay with control instructions  
✅ 60fps smooth rendering  

## Controls

- **W** or **↑** - Move Forward
- **S** or **↓** - Move Backward
- **A** or **←** - Move Left
- **D** or **→** - Move Right

## Getting Started

### Prerequisites

- Node.js 20.13.1 or higher
- npm 10.8.0 or higher

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Running the Game

The development server is running at:

**http://localhost:5173/**

To start it manually:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── GameCanvas.tsx    # 3D scene setup with R3F
│   ├── Player.tsx        # Controllable 3D box component
│   └── UI.tsx           # Instructions overlay
├── hooks/
│   └── useMovement.ts   # Keyboard input handler
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Tailwind CSS styles
```

## How It Works

1. **GameCanvas** sets up the Three.js scene using React Three Fiber
2. **Player** component renders a 3D box and uses the movement hook
3. **useMovement** hook listens to keyboard events and updates position
4. **useFrame** from R3F provides smooth 60fps animation loop
5. **GroundPlane** provides a wireframe grid for visual reference

## Future Enhancements

- Add boundaries/collision detection
- Multiple boxes or obstacles
- Jump mechanics
- Score system
- Different camera modes
- Multiplayer support

## License

MIT

---

Enjoy playing! 🎮
