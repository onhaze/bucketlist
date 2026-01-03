import { useState, useEffect } from 'react';
import '../App.css';
import Settings from './Settings';
import Sidebar from './Sidebar';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- 개별 아이템 컴포넌트 ---
function SortableItem({ item, index, toggleSuccess, deleteTarget, theme }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
    padding: '12px',
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: isDragging ? '#f9f9f9' : 'white',
    borderRadius: '12px',
    opacity: item.isDone ? 0.6 : 1,
    zIndex: isDragging ? 10 : 1,
    width: '100%',
    boxSizing: 'border-box',
    border: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
    fontFamily: 'inherit' // 부모로부터 폰트 상속
  };

  return (
    <li ref={setNodeRef} style={style}>
      <span {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: '12px', color: '#ccc', flexShrink: 0 }}>⠿</span>
      <span style={{ marginRight: '8px', fontWeight: 'bold', minWidth: '25px', flexShrink: 0 }}>{index + 1}.</span>
      <span style={{ flexGrow: 1, textDecoration: item.isDone ? 'line-through' : 'none', color: '#333', wordBreak: 'break-all', whiteSpace: 'normal', lineHeight: '1.5' }}>
        {item.content}
      </span>
      <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
        <button 
          onClick={() => toggleSuccess(item.id)} 
          style={{ outline: 'none', boxShadow: 'none', transform: item.isDone ? 'translateY(-2px)' : 'translateY(-4px)', backgroundColor: 'transparent', color: theme.successBtn, border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 8px', fontFamily: 'inherit' }}
        >
          {item.isDone ? '↺' : '✓'}
        </button>
        <button onClick={() => deleteTarget(item.id)} style={{ outline: 'none', boxShadow: 'none', backgroundColor: 'transparent', WebkitTextStroke: `1px ${theme.headerBg}`, color: theme.headerText, border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 5px', transform: 'translateY(-2px)', alignItems: 'center', fontFamily: 'inherit' }}>&times;</button>
      </div>
    </li>
  );
}

function Mains() {
  const [list, setList] = useState(() => JSON.parse(localStorage.getItem('bucket-list')) || []);
  const [text, setText] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarSide, setSidebarSide] = useState(() => localStorage.getItem('sidebar-side') || 'right');
  
  // 1. 테마 상태 (⭐ fontFamily 추가)
  const [theme, setTheme] = useState(() => JSON.parse(localStorage.getItem('app-theme')) || {
    headerBg: '#FFB7B2',
    headerText: '#fff',
    successBtn: '#FF8B94',
    bg: '#FFF5F5',
    sidebarBg: '#FFF0F0',
    modalBg: '#FFFFFF',
    border: 'none',
    subtitle: '☆*: .｡. o(≧▽≦)o .｡.:*☆',
    fontFamily: 'ThinRounded' // 기본값 설정
  });

  const [savedThemes, setSavedThemes] = useState(() => {
    return JSON.parse(localStorage.getItem('custom-themes')) || [];
  });

  useEffect(() => {
    localStorage.setItem('bucket-list', JSON.stringify(list));
    localStorage.setItem('app-theme', JSON.stringify(theme));
    localStorage.setItem('sidebar-side', sidebarSide);
    localStorage.setItem('custom-themes', JSON.stringify(savedThemes));
    
    // ⭐ 앱 이름(Title) 실시간 업데이트
    const doneCount = list.filter(item => item.isDone).length;
    document.title = list.length > 0 ? `버킷리스트 (${doneCount}/${list.length})` : "버킷리스트";
  }, [list, theme, sidebarSide, savedThemes]);

  const addTarget = () => {
    if (!text.trim()) return;
    setList([...list, { id: String(Date.now()), content: text, isDone: false }]);
    setText('');
  };

  const deleteTarget = (id) => setList(list.filter(item => item.id !== id));
  const toggleSuccess = (id) => setList(list.map(item => item.id === id ? { ...item, isDone: !item.isDone } : item));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setList((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const doingList = list.filter(item => !item.isDone);
  const doneList = list.filter(item => item.isDone);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: theme.bg, 
      overflow: 'hidden', 
      transition: 'all 0.3s ease',
      // ⭐ 선택된 폰트 적용
      fontFamily: theme.fontFamily || 'ThinRounded' 
    }}>
      <header style={{ height: '60px', backgroundColor: theme.headerBg, color: theme.headerText, display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between', flexShrink: 0 }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '22px', 
          WebkitTextStroke: theme.fontFamily === 'PyeojinGothic' ? '0px' : `0.8px ${theme.headerText}`,
          fontWeight: 'bold' 
        }}>
          버킷리스트
        </h1>
        <div style={{ fontSize: '14px', fontWeight: 'bold', opacity: 1}}>{theme.subtitle}</div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {isSidebarOpen && sidebarSide === 'left' && <Sidebar isOpen={true} doneCount={doneList.length} totalCount={list.length} theme={theme} side="left" />}
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ padding: '15px 30px', display: 'flex', borderBottom: theme.border !== 'none' ? `1px solid ${theme.border}` : 'none', background: 'white' }}>
            <input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && addTarget()} 
              placeholder="목표 추가하기" 
              style={{ fontSize: '18px', flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'inherit' }} 
            />
            <button onClick={addTarget} style={{ outline: 'none', boxShadow: 'none', marginLeft: '10px', padding: '10px 20px', backgroundColor: 'transparent', color: theme.successBtn, border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '20px' }}>✚</button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ outline: 'none', boxShadow: 'none',  marginLeft: '10px', cursor: 'pointer', background: 'transparent', border: 'none', borderRadius: '4px' , color: theme.successBtn, fontSize: '20px' }}>{isSidebarOpen ? '☁' : '☀'}</button>
            <button onClick={() => setIsSettingsOpen(true)} style={{ outline: 'none', boxShadow: 'none',  marginLeft: '10px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: theme.successBtn }}>🛠</button>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <h2 style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>진행 중 ({doingList.length})</h2>
                <SortableContext items={doingList} strategy={verticalListSortingStrategy}>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {doingList.map((item, index) => <SortableItem key={item.id} item={item} index={index} toggleSuccess={toggleSuccess} deleteTarget={deleteTarget} theme={theme} />)}
                  </ul>
                </SortableContext>
              </div>
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <h2 style={{ fontSize: '14px', color: '#999', marginBottom: '15px' }}>완료 ({doneList.length})</h2>
                {doneList.map((item, index) => <SortableItem key={item.id} item={item} index={doingList.length + index} toggleSuccess={toggleSuccess} deleteTarget={deleteTarget} theme={theme} />)}
              </div>
            </DndContext>
          </div>
        </div>

        {isSidebarOpen && sidebarSide === 'right' && <Sidebar isOpen={true} doneCount={doneList.length} totalCount={list.length} theme={theme} side="right" />}
      </div>

      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={theme} 
        setTheme={setTheme}
        savedThemes={savedThemes}
        setSavedThemes={setSavedThemes}
        sidebarSide={sidebarSide}
        setSidebarSide={setSidebarSide}
      />
    </div>
  );
}

export default Mains;