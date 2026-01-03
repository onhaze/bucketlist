import React from 'react';

function Sidebar({ isOpen, totalCount, doneCount, side, theme }) {
  if (isOpen === false) return null;

  // 성공률 계산
  const successRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const dynamicSidebarStyle = {
    width: '240px',
    padding: '25px 25px',
    // 사이드바 경계 테두리 제거 (border: 'none')
    borderLeft: 'none',
    borderRight: 'none',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.sidebarBg || '#fff', 
    height: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={dynamicSidebarStyle}>
      <h3 style={{ 
        fontSize: '18px', 
        marginBottom: '20px', 
        fontWeight: 'bold', 
        color: theme.successBtn
      }}>
        성공 현황 (oﾟvﾟ)ノ❤
      </h3>
      
      {/* 1. 히트맵 영역: border를 제거하고 gap으로만 구분 */}
      <div style={heatmapGridStyle}>
        {Array.from({ length: totalCount }).map((_, i) => (
          <div 
            key={i}
            style={{
              width: '40px', 
              height: '40px', 
              borderRadius: '6px',
              backgroundColor: i < doneCount ? theme.successBtn : 'rgba(0,0,0,0.08)',
              border: 'none', // 테두리 제거
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </div>

      <div style={{ 
        ...infoStyle, 
        borderTop: `1px solid ${theme.border}33`, // 구분선도 투명도 조절하여 연하게
        paddingTop: '15px',
        color: '#666'
      }}>
        {/* 2. 진행도 막대그래프 영역 */}
        <div style={{ marginTop: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#666' }}>
            <strong>진행도</strong>
            <span style={{ fontWeight: 'bold', color: theme.successBtn }}>{successRate}%</span>
          </div>
          {/* 그래프 배경 */}
          <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            {/* 실제 채워지는 막대 */}
            <div style={{ 
              width: `${successRate}%`, 
              height: '100%', 
              backgroundColor: theme.successBtn, 
              borderRadius: '10px',
              transition: 'width 0.5s ease-out' 
            }} />
          </div>
        </div>

        <div style={{ marginTop: '15px', marginBottom: '5px', fontSize: '12px' }}>
          총 {totalCount}개 중 {doneCount}개 완료
        </div>
        
      </div>
    </div>
  );
}

const heatmapGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '8px'
};

const infoStyle = {
  marginTop: 'auto',
  fontSize: '13px',
  lineHeight: '1.6'
};

export default Sidebar;