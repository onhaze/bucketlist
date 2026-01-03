import { Routes, Route } from 'react-router-dom';
import Mains from './pages/Mains';


function App() {
  return (
    <Routes>
      {/* 기본 경로("/")에서 Mains 컴포넌트 하나만 실행합니다. */}
      <Route path="/" element={<Mains />} />
    </Routes>
  );
}

export default App;