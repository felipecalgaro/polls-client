import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
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

type GetVoteResponse = {
  data: {
    pollOptionId: string
  }
}

type VoteOnPollRequest = {
  pollOptionId: string
}

export default function Poll() {
  const [optionsScore, setOptionsScore] = useState<Record<string, number>>({})
  const [chosenOptionId, setChosenOptionId] = useState<string | undefined>(undefined)
  const params = useParams()

  const pollParams = z.object({
    pollId: z.string().uuid()
  })

  const { pollId } = pollParams.parse(params)

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3333/polls/${pollId}/results`)
    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as Message
      setOptionsScore(prev => {
        return { ...prev, [message.pollOptionId]: message.votes }
      })
    }
  }, [pollId])


  const { data: poll, isLoading, } = useQuery<undefined, Error, GetPollResponse>({
    queryKey: ['poll'],
    queryFn: () => {
      return axios.get(`http://localhost:3333/polls/${pollId}`)
    },
  })

  const { data: vote } = useQuery<undefined, Error, GetVoteResponse>({
    queryKey: ['vote'],
    queryFn: () => {
      return axios.get(`http://localhost:3333/polls/${pollId}/vote`, {
        withCredentials: true
      })
    },
    retry: false,
  })

  const { mutate } = useMutation<undefined, Error, VoteOnPollRequest>({
    mutationFn: ({ pollOptionId }) => {
      return axios.post(`http://localhost:3333/polls/${pollId}/votes`, {
        pollOptionId
      }, {
        withCredentials: true,
      })
    },
    onSuccess: (_, { pollOptionId }) => {
      setChosenOptionId(pollOptionId)
    }
  })

  async function handleVote(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, optionId: string) {
    event.preventDefault()

    mutate({ pollOptionId: optionId })
  }

  useEffect(() => {
    setChosenOptionId(vote?.data.pollOptionId)
  }, [vote])

  return (
    <main className="flex justify-center items-center bg-zinc-950 min-h-screen">
      <div className='bg-zinc-900 flex justify-center items-center flex-col w-1/3'>
        {!isLoading && (
          <>
            <p className='text-white text-xl my-6'>{poll?.data.poll.title}</p>
            <div className='flex justify-center items-center flex-col p-8 w-full gap-y-1'>
              {poll?.data.poll.options.map(option => (
                <button
                  key={option.id}
                  className={twMerge('ring-orange-400 border-0 rounded-sm group hover:bg-zinc-800 w-full h-12 text-left px-6 flex justify-between items-center gap-x-8', option.id === chosenOptionId ? 'ring-1' : 'hover:ring-1 focus:ring-1')}
                  onClick={(e) => handleVote(e, option.id)}
                >
                  <p className={twMerge('overflow-hidden text-ellipsis whitespace-nowrap text-zinc-200 text-xl', option.id === chosenOptionId ? 'text-orange-400' : 'group-focus:text-orange-400')}>{option.title}</p>
                  <p className='text-orange-400 text-xl w-max text-right'> {optionsScore[option.id] ?? option.score} </p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
