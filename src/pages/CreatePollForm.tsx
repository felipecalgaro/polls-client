import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../components/Input';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type CreatePollRequest = {
  title: string
  options: string[]
}

type CreatePollResponse = {
  data: {
    pollId: string
  }
}

export default function CreatePollForm() {
  const navigate = useNavigate()

  const mutation = useMutation<CreatePollResponse, Error, CreatePollRequest>({
    mutationFn: ({ title, options }) => {
      return axios.post('http://localhost:3333/polls', {
        title,
        options
      })
    },
    onSuccess: ({ data }) => {
      navigate(`/polls/${data.pollId}`)
    }
  })

  const createPollFormSchema = z.object({
    title: z.string().min(1, 'You must provide a title to the poll.'),
    options: z.array(z.object({ title: z.string().min(1, 'You must provide a valid option.') }))
      .min(2, 'Insert a minimum of 2 options.')
      .max(5, 'Insert a maximum of 5 options.')
  })

  type CreatePollFormData = z.infer<typeof createPollFormSchema>

  const createPollForm = useForm<CreatePollFormData>({ resolver: zodResolver(createPollFormSchema) })

  const { append, fields, remove } = useFieldArray({
    control: createPollForm.control,
    name: 'options',
  })

  function addPollOption() {
    append({ title: '' })
  }

  function createPoll(data: CreatePollFormData) {
    const { options, title } = data

    mutation.mutate({
      title,
      options: options.map(option => option.title)
    })
  }

  const { errors } = createPollForm.formState

  return (
    <main className="flex justify-center items-center bg-zinc-950 min-h-screen">
      <FormProvider {...createPollForm}>
        <form onSubmit={createPollForm.handleSubmit(createPoll)} className='bg-zinc-900 flex flex-col justify-center items-start gap-7 p-8 rounded-md xl:w-1/3 md:w-1/2 w-4/5'>
          <h1 className='font-sans text-2xl text-slate-200'>Create a poll</h1>
          <div className='flex flex-col justify-center items-start gap-y-1.5 w-full'>
            <label htmlFor='title' className='text-slate-200'>Title</label>
            <Input
              id='title'
              name='title'
              placeholder='Type in a title'
              className='w-full'
            />
            <div className='flex flex-col justify-center items-start w-full'>
              {errors.title &&
                <span className='text-red-500 text-sm'>{errors.title.message}</span>
              }
              {errors.options &&
                <span className='text-red-500 text-sm'>{errors.options.message}</span>
              }
              {errors.options?.root &&
                <span className='text-red-500 text-sm'>{errors.options?.root.message}</span>
              }
            </div>
          </div>
          {fields.map((field, index) => (
            <>
              <div className='flex justify-start items-center gap-x-4 gap-y-1.5 w-full flex-wrap' key={index}>
                <label htmlFor={field.id} className='w-full text-slate-200'>{`Option ${index + 1}`}</label>
                <Input
                  id={field.id}
                  placeholder='Type in an option'
                  name={`options.${index}.title`}
                  className='flex-1'
                />
                <button type='button' onClick={() => remove(index)} className='bg-red-500 hover:bg-red-600 transition-colors duration-150 px-3 py-1 rounded-sm'>Remove</button>
                <span className='text-red-500 text-sm w-full'>
                  {createPollForm.formState.errors.options?.[index]?.title && createPollForm.formState.errors.options?.[index]?.title?.message}
                </span>
              </div>
            </>
          ))}
          {fields.length < 5 && (
            <button type='button' onClick={addPollOption} className='self-start text-cyan-700'>Add option</button>
          )}
          <button disabled={createPollForm.formState.isSubmitting} type='submit' className='w-4/5 bg-cyan-600 hover:bg-cyan-700 transition-colors duration-150 py-1 rounded-sm self-center mt-2'>Create</button>
        </form>
      </FormProvider >
    </main>
  )
}