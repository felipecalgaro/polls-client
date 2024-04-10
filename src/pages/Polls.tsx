import { useState } from 'react';
import { CreatePollForm } from '../components/CreatePollForm';
import { PollsSection } from '../components/PollsSection';

export type Poll = {
  id: string
  title: string
}

export default function Polls() {
  const [polls, setPolls] = useState<Poll[]>([])

  return (
    <main className="flex justify-center items-center bg-zinc-950 min-h-screen">
      <CreatePollForm setPolls={setPolls} />
      <PollsSection polls={polls} />
    </main>
  )
}