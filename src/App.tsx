import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Poll from './pages/Poll'
import CreatePollForm from './pages/CreatePollForm'

import './global.css'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <CreatePollForm />
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
