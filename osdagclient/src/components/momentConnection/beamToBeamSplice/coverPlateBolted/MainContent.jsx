import React from 'react'
import { PanelRight, PanelLeft } from 'lucide-react'

const MainContent = ({
  showInputDock,
  setShowInputDock,
  showOutputDock,
  setShowOutputDock,
  toggleItems,
  selectedToggle,
  setSelectedToggle,
}) => {
  return (
    <div className="flex-1 flex flex-col min-w-0 border">
      <div className="bg-gray-200 border-b flex items-center gap-4 px-2 py-0.5 text-xs">
        <button
          onClick={() => setShowInputDock(!showInputDock)}
          className="hover:bg-gray-300 px-0.5"
        >
          <PanelRight size={24} />
        </button>
        <button
          onClick={() => setShowOutputDock(!showOutputDock)}
          className="hover:bg-gray-300 px-0.5"
        >
          <PanelLeft size={24} />
        </button>

        {toggleItems.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-1">
            <input
              type="radio"
              name="toggle"
              checked={selectedToggle === key}
              onChange={() => setSelectedToggle(key)}
            />
            {label}
          </label>
        ))}
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 bg-[#4B0082] relative">
        <div className="absolute bottom-2 right-2 bg-white/90 rounded shadow p-1">
          <div className="grid grid-cols-3 gap-0.5">
            <button className="p-0.5 hover:bg-gray-200"></button>
            <button className="p-0.5 hover:bg-gray-200">↑</button>
            <button className="p-0.5 hover:bg-gray-200">⟲</button>
            <button className="p-0.5 hover:bg-gray-200">←</button>
            <button className="p-0.5 hover:bg-gray-200">●</button>
            <button className="p-0.5 hover:bg-gray-200">→</button>
            <button className="p-0.5 hover:bg-gray-200">⟳</button>
            <button className="p-0.5 hover:bg-gray-200">↓</button>
            <button className="p-0.5 hover:bg-gray-200">⤢</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainContent
