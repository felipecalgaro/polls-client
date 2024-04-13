import { useMutation, useQuery } from '@tanstack/react-query';
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

type VoteOnPollRequest = {
  pollOptionId: string
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

  const { mutate } = useMutation<undefined, Error, VoteOnPollRequest>({
    mutationFn: ({ pollOptionId }) => {
      return axios.post(`http://localhost:3333/polls/${pollId}/votes`, {
        pollOptionId
      })
    }
  })

  function handleVote(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, optionId: string) {
    event.preventDefault()

    mutate({ pollOptionId: optionId })
  }

  return (
    <main className="flex justify-center items-center bg-zinc-950 min-h-screen">

      {response?.data && (
        <>
          <p className='text-white text-xl'>{response.data.poll.title}</p>
          <div>
            {response.data.poll.options.map(option => (
              <div>
                <p className='text-orange-400 text-xl'>{option.title}</p>
                <button className='bg-white' onClick={(e) => handleVote(e, option.id)}>Vote</button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}