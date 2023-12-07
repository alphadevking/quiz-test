import Header from '@/site/sections/header'
import Quiz from '@/site/sections/quiz'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Quiz Test</title>
        <meta name="description" content="quiz testing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="" />
      </Head>
      <main>
        <Header/>
        {/* <Quiz/> */}
        <div className='box-border align-middle justify-center m-auto text-center'>
          <h1 className='text-3xl font-bold'>Welcome to Quiz Test</h1>
          <div className='flex justify-center space-x-4 mt-8'>
            <Link href='/authentication/login' className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
              Login
            </Link>
            <Link href='/authentication/signup' className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
              Signup
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}