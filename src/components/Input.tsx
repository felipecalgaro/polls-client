import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface InputProps {
  name: string
  placeholder: string
  id: string
  className?: string
}

export function Input(props: InputProps) {
  const { register } = useFormContext()

  return (
    <input
      {...register(props.name)}
      placeholder={props.placeholder}
      className={twMerge('rounded-sm bg-zinc-800 text-white px-3 py-1 placeholder:text-zinc-600', props.className)}
      id={props.id}
    />
  )
}