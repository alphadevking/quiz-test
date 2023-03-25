import Header from '@/site/sections/header'
import Quiz from '@/site/sections/quiz'
import Head from 'next/head'

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
        <Quiz/>
      </main>
    </>
  )
}
