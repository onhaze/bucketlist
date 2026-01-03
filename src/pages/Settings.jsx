import React, { useState } from 'react';

// 1. 기본 테마 프리셋 데이터
const PRESETS = [
  { id: 'pink', name: 'Pastel Pink', headerBg: '#FFB7B2', headerText: '#fff', successBtn: '#FF8B94', bg: '#FFF5F5', sidebarBg: '#fffafaff', modalBg: '#FFFFFF', border: 'none' },
  { id: 'blue', name: 'Pastel Blue', headerBg: '#B2CEFE', headerText: '#fff', successBtn: '#88ABFF', bg: '#F0F5FF', sidebarBg: '#E6F0FF', modalBg: '#FFFFFF', border: 'none' },
  { id: 'lavender', name: 'Pastel Lavender', headerBg: '#D1C4E9', headerText: '#fff', successBtn: '#9575CD', bg: '#F3E5F5', sidebarBg: '#fef5ffff', modalBg: '#FFFFFF', border: 'none' },
  { id: 'mint', name: 'Pastel Mint', headerBg: '#B2F7EF', headerText: '#444', successBtn: '#7BDFF2', bg: '#F0FFF4', sidebarBg: '#E6FFFA', modalBg: '#FFFFFF', border: 'none' },
];

function Settings({ isOpen, onClose, theme, setTheme, savedThemes, setSavedThemes, sidebarSide, setSidebarSide }) {
  const [activeTab, setActiveTab] = useState('테마');
  const [newThemeName, setNewThemeName] = useState('');

  if (!isOpen) return null;

  const updateTheme = (updates) => setTheme({ ...theme, ...updates });

  const handleSaveTheme = () => {
    if (!newThemeName.trim()) return alert("테마 이름을 입력하세요!");
    const themeToSave = { ...theme, id: Date.now(), name: newThemeName };
    setSavedThemes([themeToSave, ...savedThemes]);
    setNewThemeName('');
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={{ ...modalContentStyle, backgroundColor: theme.modalBg }}>
        {/* 헤더 영역 */}
        <div style={{ ...headerStyle, borderBottom: `1px solid rgba(0,0,0,0.05)` }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: theme.headerBg }}>스타일 관리</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: theme.headerBg }}>&times;</button>
        </div>

        {/* 탭 바 */}
        <div style={{ ...tabBar, borderBottom: `1px solid rgba(0,0,0,0.05)` }}>
          {['테마', '사이드바', '배너', '글씨체'].map(t => (
            <div 
              key={t} 
              onClick={() => setActiveTab(t)} 
              style={{ 
                ...tabItem, 
                borderBottom: activeTab === t ? `2px solid ${theme.successBtn}` : 'none',
                color: activeTab === t ? theme.headerBg : '#aaa',
                fontWeight: activeTab === t ? 'bold' : 'normal'
              }}
            >
              {t}
            </div>
          ))}
        </div>

        <div style={{ padding: '20px', maxHeight: '520px', overflowY: 'auto' }}>
          {activeTab === '테마' && (
            <>
              <h4 style={labelStyle}>테마 목록 (기본 + 커스텀)</h4>
              <div style={presetGrid}>
                {PRESETS.map(p => (
                  <ThemePreviewCard key={p.id} p={p} currentTheme={theme} onClick={() => setTheme({...p, subtitle: theme.subtitle, fontFamily: theme.fontFamily})} />
                ))}
                {savedThemes && savedThemes.map(p => (
                  <div key={p.id} style={{ position: 'relative' }}>
                    <ThemePreviewCard p={p} currentTheme={theme} onClick={() => setTheme({...p, subtitle: theme.subtitle, fontFamily: theme.fontFamily})} />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSavedThemes(savedThemes.filter(t => t.id !== p.id)); }} 
                      style={deleteBadge}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div style={saveSection}>
                <input value={newThemeName} onChange={(e) => setNewThemeName(e.target.value)} placeholder="현재 테마 저장 이름" style={inputStyle} />
                <button onClick={handleSaveTheme} style={{ ...saveBtn, backgroundColor: theme.successBtn }}>저장</button>
              </div>

              <h4 style={labelStyle}>배경 색상 세부 설정</h4>
              <div style={customGrid}>
                <div style={colorItem}><span>메인 배경</span><input type="color" value={theme.bg} onChange={e => updateTheme({ bg: e.target.value })} /></div>
                <div style={colorItem}><span>사이드 배경</span><input type="color" value={theme.sidebarBg} onChange={e => updateTheme({ sidebarBg: e.target.value })} /></div>
                <div style={colorItem}><span>설정창 배경</span><input type="color" value={theme.modalBg} onChange={e => updateTheme({ modalBg: e.target.value })} /></div>
              </div>

              <h4 style={labelStyle}>포인트 색상 세부 설정</h4>
              <div style={customGrid}>
                <div style={colorItem}><span>헤더 배경</span><input type="color" value={theme.headerBg} onChange={e => updateTheme({ headerBg: e.target.value })} /></div>
                <div style={colorItem}><span>성공 버튼</span><input type="color" value={theme.successBtn} onChange={e => updateTheme({ successBtn: e.target.value })} /></div>
                <div style={colorItem}><span>헤더 글씨</span><input type="color" value={theme.headerText} onChange={e => updateTheme({ headerText: e.target.value })} /></div>
              </div>
            </>
          )}

          {activeTab === '사이드바' && (
            <div>
              <h4 style={labelStyle}>사이드바 위치</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setSidebarSide('left')} style={{ ...actionButtonStyle, backgroundColor: sidebarSide === 'left' ? theme.successBtn : '#eee', color: sidebarSide === 'left' ? '#fff' : '#333' }}>왼쪽</button>
                <button onClick={() => setSidebarSide('right')} style={{ ...actionButtonStyle, backgroundColor: sidebarSide === 'right' ? theme.successBtn : '#eee', color: sidebarSide === 'right' ? '#fff' : '#333' }}>오른쪽</button>
              </div>
            </div>
          )}

          {activeTab === '배너' && (
            <div>
              <h4 style={labelStyle}>배너 문구</h4>
              <input value={theme.subtitle} onChange={e => updateTheme({ subtitle: e.target.value })} style={inputStyle} placeholder="문구를 입력하세요" />
            </div>
          )}

          {activeTab === '글씨체' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: 'bold' }}>폰트 스타일</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'ThinRounded', name: '얇은둥근모체 (레트로)', desc: '아기자기하고 귀여운 느낌' },
                    { id: 'PyeojinGothic', name: '펴진고딕 (세련)', desc: '깔끔하고 현대적인 느낌' },
                    { id: 'sans-serif', name: '기본체 (심플)', desc: '가독성이 좋은 시스템 기본 폰트' }
                  ].map((font) => (
                    <div 
                      key={font.id}
                      onClick={() => updateTheme({ fontFamily: font.id })}
                      style={{
                        padding: '15px', borderRadius: '12px', cursor: 'pointer',
                        border: `2px solid ${theme.fontFamily === font.id ? theme.successBtn : '#f0f0f0'}`,
                        backgroundColor: theme.fontFamily === font.id ? `${theme.successBtn}10` : '#fff',
                        transition: '0.2s'
                      }}
                    >
                      <div style={{ fontFamily: font.id, fontSize: '18px', color: theme.fontFamily === font.id ? theme.successBtn : '#333', marginBottom: '4px', fontWeight: 'bold' }}>
                        {font.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{font.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: 'bold' }}>미리보기</h4>
                <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#f9f9f9', textAlign: 'center', fontSize: '16px', border: '1px dashed #ddd', fontFamily: theme.fontFamily }}>
                  "꿈을 기록하면 목표가 되고, <br/> 실행하면 현실이 된다."
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThemePreviewCard({ p, currentTheme, onClick }) {
  const isSelected = currentTheme.headerBg === p.headerBg && currentTheme.bg === p.bg;
  return (
    <div onClick={onClick} style={{ ...cardStyle, border: isSelected ? `2px solid ${p.successBtn}` : '1px solid #ddd' }}>
      <div style={{ display: 'flex', height: '35px' }}>
        <div style={{ flex: 1, backgroundColor: p.successBtn }} />
        <div style={{ flex: 1, backgroundColor: p.headerBg }} />
        <div style={{ flex: 1, backgroundColor: p.sidebarBg }} />
        <div style={{ flex: 1, backgroundColor: p.bg }} />
      </div>
      <div style={{ padding: '6px', fontSize: '11px', textAlign: 'center', backgroundColor: '#fff', color: '#333' }}>{p.name}</div>
    </div>
  );
}

// 스타일 정의 (이전과 동일)
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalContentStyle = { width: '460px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' };
const headerStyle = { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const tabBar = { display: 'flex', padding: '0 20px', gap: '10px' };
const tabItem = { padding: '12px 5px', cursor: 'pointer', fontSize: '14px' };
const presetGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' };
const cardStyle = { borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: '0.2s' };
const labelStyle = { fontSize: '13px', color: '#888', margin: '18px 0 8px', fontWeight: 'bold' };
const saveSection = { display: 'flex', gap: '10px', margin: '20px 0', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px' };
const inputStyle = { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' };
const saveBtn = { padding: '10px 18px', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const customGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' };
const colorItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '8px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.4)' };
const deleteBadge = { position: 'absolute', top: '1px', right: '-7px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'transparent', color: '#333', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' };
const actionButtonStyle = { flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default Settings;