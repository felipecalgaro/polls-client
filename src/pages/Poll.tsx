import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

type Option = {
  id: string,
  title: string,
  score: number,
}

type Message = {
  pollOptionId: string
  votes: number
}

type GetPollResponse = {
  data: {
    poll: {
      id: string,
      title: string,
      options: Option[]
    },
  }
}

type VoteOnPollRequest = {
  pollOptionId: string
}

export default function Poll() {
  const [optionsScore, setOptionsScore] = useState<Record<string, number>>({})
  const pollParams = z.object({
    pollId: z.string().uuid()
  })

  const params = useParams()

  const { pollId } = pollParams.parse(params)

  const ws = new WebSocket(`ws://localhost:3333/polls/${pollId}/results`)
  ws.onmessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data) as Message
    setOptionsScore(prev => {
      return { ...prev, [message.pollOptionId]: message.votes }
    })
  }

  const { data: response, isLoading, } = useQuery<undefined, Error, GetPollResponse>({
    queryKey: ['polls'],
    queryFn: () => {
      return axios.get(`http://localhost:3333/polls/${pollId}`)
    },
  })

  const { mutate } = useMutation<undefined, Error, VoteOnPollRequest>({
    mutationFn: ({ pollOptionId }) => {
      return axios.post(`http://localhost:3333/polls/${pollId}/votes`, {
        pollOptionId
      }, {
        withCredentials: true,
      })
    },
  })

  console.log(document.cookie);

  function handleVote(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, optionId: string) {
    event.preventDefault()

    mutate({ pollOptionId: optionId })
  }

  return (
    <main className="flex justify-center items-center bg-zinc-950 min-h-screen">

      {!isLoading && (
        <>
          <p className='text-white text-xl'>{response?.data.poll.title}</p>
          <div>
            {response?.data.poll.options.map(option => (
              <div>
                <p className='text-orange-400 text-xl'>{option.title}</p>
                <p className='text-orange-400 text-xl'>Votes: {optionsScore[option.id] ?? option.score}</p>
                <button className='bg-white' onClick={(e) => handleVote(e, option.id)}>Vote</button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}