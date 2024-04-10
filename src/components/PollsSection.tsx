import { Link } from 'react-router-dom'
import { Poll } from '../pages/Polls'

interface PollsSectionProps {
  polls: Poll[]
}

export function PollsSection({ polls }: PollsSectionProps) {
  return (
    <section className='flex flex-col gap-8 justify-start items-center'>
      {polls.map((poll) => (
        <Link to={`/polls/${poll.id}`} className='text-black bg-slate-400 py-3'>
          <h1>{poll.title}</h1>
        </Link>
      ))}
    </section>
  )
}