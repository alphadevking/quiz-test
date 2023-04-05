import Header from '@/site/sections/header'
import Quiz from '@/site/sections/quiz'
import Head from 'next/head'
import Script from 'next/script'

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
      <Script>
        <script src="http://localhost:8097"></script>
      </Script>
    </>
  )
}
