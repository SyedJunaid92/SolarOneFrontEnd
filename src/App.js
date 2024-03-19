import './App.css';
import ApplicationRoutes from './components/Routes/index';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
  return (
    
      <BrowserRouter>
      <ApplicationRoutes />
      </BrowserRouter>
    
  );
}

export default App;




