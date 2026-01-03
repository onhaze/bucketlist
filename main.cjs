// main.cjs
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 외부 모듈 대신 Electron 자체 상태(isPackaged)를 사용해 개발/배포 모드를 구분합니다.
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 900,
    minHeight: 400,
    // 아이콘 설정을 제거하셨으므로 기본 아이콘으로 뜹니다.
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 상단 메뉴바 숨기기
  win.setMenuBarVisibility(false);

  if (isDev) {
    // 개발 모드: Vite 서버 주소 로드
    win.loadURL('http://localhost:5173');
  } else {
    // 배포 모드: 빌드된 index.html 파일 로드
    // file:// 프로토콜과 절대 경로를 결합하여 안전하게 로드합니다.
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);

// 모든 창이 닫히면 앱 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});