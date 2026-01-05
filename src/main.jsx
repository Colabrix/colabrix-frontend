import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import UltimateKanban from './components/common/Kanban_Board_Ultimate.jsx';
import NativeKanbanBoard from './components/common/Kanban_Board_Native.jsx';
import Kanban from './components/common/Kanban_Board.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Kanban /> */}
    {/* <NativeKanbanBoard /> */}
    <UltimateKanban />
  </StrictMode>
);
