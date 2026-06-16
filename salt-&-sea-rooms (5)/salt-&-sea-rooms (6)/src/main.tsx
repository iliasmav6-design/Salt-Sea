import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CustomizerProvider } from './context/CustomizerContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomizerProvider>
      <App />
    </CustomizerProvider>
  </StrictMode>,
);
