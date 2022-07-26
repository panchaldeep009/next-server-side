import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

axios.defaults.baseURL = 'http://localhost:3000';

function Main() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
