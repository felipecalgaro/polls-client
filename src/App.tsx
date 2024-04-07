import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './global.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Polls from './pages/Polls'
import Poll from './pages/Poll'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Polls />
  },
  {
    path: 'polls/:pollId',
    element: <Poll />,
  }
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
