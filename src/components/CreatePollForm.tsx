import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../Input';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type CreatePollRequest = {
  title: string
  options: string[]
}

export function CreatePollForm() {
  const mutation = useMutation({
    mutationFn: ({ title, options }: CreatePollRequest) => {
      return axios.post('http://localhost:3333/polls', {
        title,
        options
      })
    }
  })

  const createPollFormSchema = z.object({
    title: z.string().min(1, 'You must provide a title for the poll.'),
    options: z.array(z.object({ title: z.string() }))
      .min(2, 'Insert a minimum of 2 options')
      .max(5, 'Insert a maximum of 5 options')
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

    mutation.mutate({ title, options: options.map(option => option.title) })
  }

  return (
    <FormProvider {...createPollForm}>
      <form onSubmit={createPollForm.handleSubmit(createPoll)} className='bg-zinc-900 flex flex-col justify-center items-start gap-7 p-8 rounded-md xl:w-1/3 md:w-1/2 w-4/5'>
        <h1 className='font-sans text-2xl text-slate-200'>Create a poll</h1>
        <div className='flex flex-col justify-center items-start gap-y-1.5 w-full'>
          <label htmlFor='title' className='text-slate-200'>Title</label>
          <Input id='title' name='title' placeholder='Type in a title' className='w-full' />
        </div>
        {fields.map((field, index) => (
          <div className='flex justify-start items-center gap-x-4 gap-y-1.5 w-full flex-wrap'>
            <label htmlFor={field.id} className='w-full text-slate-200'>{`Option ${index + 1}`}</label>
            <Input id={field.id} key={field.id} placeholder='Type in an option' name={`options.${index}.title`} className='flex-1' />
            <button type='button' onClick={() => remove(index)} className='bg-red-500 hover:bg-red-600 transition-colors duration-150 px-3 py-1 rounded-sm'>Remove</button>
          </div>
        ))}
        {fields.length < 5 && (
          <button type='button' onClick={addPollOption} className='self-start text-cyan-700'>Add option</button>
        )}
        <button disabled={createPollForm.formState.isSubmitting} type='submit' className='w-4/5 bg-cyan-600 hover:bg-cyan-800 transition-colors duration-150 py-1 rounded-sm self-center mt-2'>Create</button>
      </form>
    </FormProvider>
  )
}