import React, { useRef, useEffect, useState } from 'react';
import './App.css';

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Set default canvas properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
  }, []);

  // Update canvas properties when color or brush size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
    }
  }, [currentColor, brushSize]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setLastX(pos.x);
    setLastY(pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getMousePos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    setLastX(pos.x);
    setLastY(pos.y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🎨 Simple Drawing App
        </h1>
        
        {/* Drawing Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* Color Picker */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">Colors</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    currentColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Brush Size */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Brush Size: {brushSize}px
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Clear Button */}
          <div className="flex flex-col items-center justify-end">
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
            >
              Clear Canvas
            </button>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-300 rounded-lg cursor-crosshair bg-white shadow-inner"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            Click and drag on the canvas to draw. Use the controls above to change colors and brush size.
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <DrawingApp />
    </div>
  );
}

export default App;