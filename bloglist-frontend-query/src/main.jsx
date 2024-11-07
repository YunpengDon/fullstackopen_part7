import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { BrowserRouter as Router } from "react-router-dom"

import { GeneralContextProvider } from './components/GeneralContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <GeneralContextProvider>
      <Router>
        <App />
      </Router>
    </GeneralContextProvider>
  </QueryClientProvider>
)
