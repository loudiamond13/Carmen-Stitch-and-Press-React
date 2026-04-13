import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { AuthProvider } from './contexts/AuthContext.tsx'

const queryProvider = new QueryClient({
    defaultOptions: {
        queries: {
            retry:0
        }
    }
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={ queryProvider}>
                <AuthProvider>
                    <NuqsAdapter>
                        <App />
                    </NuqsAdapter>
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
)
