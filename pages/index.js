import axios from 'axios'
import Head from 'next/head'
import '../console.image'
import { useState } from 'react'

const defaultUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'

export default function Home() {
    const [url, setUrl] = useState(defaultUrl)
    const [busy, setBusy] = useState(false)
    const [result, setResult] = useState(null)

    const search = async (e) => {
        setBusy(true)
        e.preventDefault()
        const { data } = await axios.get(`/api/hello?url=${url}`)

        setResult(data)

        console.clear()
        console.table(data.log.headers)

        if (data.log.image) {
            console.image(data.log.body)
        } else {
            console.log(data.log.body)
        }

        setBusy(false)
    }

  return (
    <div className={'text-white bg-purple-700 antialiased min-h-screen flex items-center'}>
      <Head>
        <title>Handy Headers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={'p-6 max-w-4xl mx-auto'} style={{ width: '100%'}}>

          <h1 title={'Just the ones we need to see.'} className={'font-bold text-center uppercase text-4xl text-purple-600'}>
              Handy Headers
          </h1>

          <form autoComplete={'off'} action="/api/hello" method={'get'} onSubmit={search} className={'mt-10 block w-full border-2 border-white rounded-full flex items-center overflow-hidden p-4'}>
              <div className={'flex-1 pr-5'}>
                  <input autoComplete={'off'} autoFocus={true} placeholder={`e.g. ${defaultUrl}`} className={'text-center bg-transparent h-full w-full focus:outline-none'} name={'url'} type="url" onChange={e => setUrl(e.target.value)} value={ url }/>
              </div>
              <div className={'w-10 h-10'}>
                  <button className={'w-full h-full p-1 focus:outline-none text-white hover:text-purple-200'} disabled={!url || busy} type='submit'>
                      { busy ?
                          <svg className="animate-spin w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          :
                          <svg className={'w-full h-full'} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.172 24l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/></svg>
                      }
                  </button>
              </div>
          </form>

          { result && <div className={'mt-10'}>
              <div className={'max-w-md mx-auto'}>
                  { Object.keys(result.display).filter(key => result.display[key]).map(key => {
                      return <div key={key} className={'flex'}>
                          <div className={'w-1/3'}>
                              <span className={'font-bold'}>
                                  { key }:
                              </span>
                          </div>
                          <div title={ result.display[key] } className={'flex-1 truncate'}>
                              { result.display[key] }
                          </div>
                      </div>
                  })}
              </div>

              <div className={'w-full text-xs text-center mt-20 px-4 text-purple-400'}>
                  (check dev console for more data)
              </div>
          </div>}
      </main>
    </div>
  )
}
