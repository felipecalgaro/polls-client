import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreatePollForm } from './components/CreatePollForm'
import { PollsSection } from './components/PollsSection'
import { useState } from 'react'

import './global.css'

const queryClient = new QueryClient()

export type Poll = {
  id: string
  title: string
}

function App() {
  const [polls, setPolls] = useState<Poll[]>([])

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex justify-center items-center bg-zinc-950 min-h-screen">
        <CreatePollForm setPolls={setPolls} />
        <PollsSection polls={polls} />
      </main>
    </QueryClientProvider>
  )
}

export default App
