import { useRef, useState, useEffect, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client'

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface UseRightClickReturn {
  ref: RefObject<HTMLDivElement>; // 绑定的元素的 ref
}

const useRightClick = (menuItems: MenuItem[]): UseRightClickReturn => {
  const ref = useRef<HTMLDivElement>(null); // 用于绑定的 DOM 节点
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event: MouseEvent) => {
    if (ref.current && ref.current.contains(event.target as Node)) {
      event.preventDefault(); // 阻止默认右键菜单
      setMenuPosition({ x: event.pageX, y: event.pageY });
      setMenuVisible(true);
    } else {
      setMenuVisible(false); // 点击非绑定区域隐藏菜单
    }
  };

  const handleClick = () => {
    setMenuVisible(false); // 点击页面其他地方关闭菜单
  };

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (!menuVisible) return;

    const menu = createPortal(
      <div
        style={{
          position: 'absolute',
          top: menuPosition.y,
          left: menuPosition.x,
          background: 'white',
          border: '1px solid #ccc',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
        }}
      >
        {menuItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              borderBottom: index < menuItems.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}
            onClick={(e) => {
              e.stopPropagation(); // 防止触发关闭
              item.onClick();
              setMenuVisible(false);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>,
      document.body
    );

    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container!);
    root.render(menu)

    return () => {
      root.unmount()
      document.body.removeChild(container);
    };
  }, [menuVisible, menuPosition, menuItems]);

  return {
    ref, // 供调用方绑定的 ref
  };
};

export default useRightClick;