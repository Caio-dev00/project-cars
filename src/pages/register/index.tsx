import { Link } from 'react-router-dom'
import logoImg from '../../assets/logo1.png'
import { Container } from '../../components/container'

import { Input } from '../../components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name: z.string().min(1,"O campo é obrigatório!"),
  email: z.string().email("Insira um email valido!").min(0, 'O campo email é obrigatório!'),
  password: z.string().min(6, "A senha deve ter no minimo 6 caracteres").min(0, "O campo é obrigatório")
})

type FormData = z.infer<typeof schema>

export function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  })

  function onSubmit(data: FormData){
    console.log(data)
  }


  return (
    <Container>
      <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
        <Link to="/" className='mb-6 max-w-sm'>
          <img 
            src={logoImg} 
            alt="logo" 
            className='w-auto'
            />
        </Link>

        <form 
        onSubmit={handleSubmit(onSubmit)} 
        className='bg-white max-w-xl w-full rounded-lg p-4'>

          <div className='mb-3'>

            <Input
              type="text"
              placeholder="Digite seu nome completo..."
              name="name"
              error={errors.name?.message}
              register={register}
            />

          </div>

          <div className='mb-3'>

            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />

          </div>

          <div className='mb-3'>

            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />

          </div>

          <button type='submit' className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'>
            Cadastrar
          </button>

        </form>

        <Link to="/login">
          Já poussui uma conta? Faça o login!
        </Link>

      </div>
    </Container>
  )
}
