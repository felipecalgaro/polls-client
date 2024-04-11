import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

type GetPollResponse = {
  data: {
    poll: {
      id: string,
      title: string,
      options: {
        id: string,
        title: string,
        score: number,
      }[]
    },
  }
}

export default function Poll() {
  const pollParams = z.object({
    pollId: z.string().uuid()
  })

  const params = useParams()

  const { pollId } = pollParams.parse(params)

  const { data: response } = useQuery<undefined, Error, GetPollResponse>({
    queryKey: ['polls'],
    queryFn: () => {
      return axios.get(`http://localhost:3333/polls/${pollId}`)
    },
  })

  return (
    <main className="flex justify-center items-center bg-zinc-950 min-h-screen">

      {response?.data && (
        <>
          <p className='text-white text-xl'>{response.data.poll.title}</p>
          <p className='text-orange-400 text-xl'>{response.data.poll.options.map(option => <p>{option.title}</p>)}</p>
        </>
      )}
    </main>
  )

  // votar em cada uma e botar pontuacao (ws)
}