import { StrictMode } from 'react';
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import './index.css';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

const queryProvider = new QueryClient({
    defaultOptions: 
    {
        queries: {
            retry :0
        }
    }
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryProvider}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
  </StrictMode>
)
