import React, { useState } from 'react'

const MenuBar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

    const handleMenuClick = (menu) => {
        if (activeMenu === menu) {
            setActiveMenu(null);
        } else {
            setActiveMenu(menu);
        }
    };

    const menuItems = {
        File: ['New', 'Open', 'Save', 'Export'],
        Edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'],
        Graphics: ['Pan', 'Zoom', 'Rotate', 'Reset View'],
        Database: ['Connect', 'Import', 'Export'],
        Help: ['Documentation', 'About']
    };
  return (
    <div className="bg-gray-200 px-1 py-0.5 flex gap-2 text-xs border-b border-gray-300"
    style={{ height: '3vh' }}>
      {Object.keys(menuItems).map((menu) => (
        <div key={menu} className="relative">
          <button
            className={`px-1.5 py-0.5 hover:bg-gray-300 ${activeMenu === menu ? 'bg-gray-300' : ''}`}
            onClick={() => handleMenuClick(menu)}
          >
            {menu}
          </button>
          {activeMenu === menu && (
            <div className="absolute top-full left-0 bg-white shadow-md mt-0.5 py-0.5 min-w-[100px] z-50">
              {menuItems[menu].map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-2 py-0.5 hover:bg-gray-100 text-xs"
                  onClick={() => setActiveMenu(null)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default MenuBar
