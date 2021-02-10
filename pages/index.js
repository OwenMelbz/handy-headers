import axios from 'axios';
import Head from 'next/head'
import '../console.image'
import { useState } from 'react';

const defaultUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'

export default function Home() {
    const [url, setUrl] = useState(defaultUrl)
    const [result, setResult] = useState(null)

    const search = async (e) => {
        e.preventDefault();
        const { data } = await axios.get(`/api/hello?url=${url}`)

        setResult(data)

        console.clear();
        console.table(data.log.headers)

        if (data.log.image) {
            console.image(data.log.body)
        } else {
            console.log(data.log.body)
        }
    }

  return (
    <div className={'text-white bg-purple-700 antialiased min-h-screen flex items-center'}>
      <Head>
        <title>Handy Headers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={'p-6 max-w-4xl mx-auto'} style={{ width: '100%'}}>

          <h1 title={'Just the ones we need to see.'} className={'font-bold text-center uppercase text-xs'}>
              Handy Headers
          </h1>

          <form autoComplete={'off'} action="/api/hello" method={'get'} onSubmit={search} className={'mt-10 block w-full border-2 border-white rounded-full flex items-center overflow-hidden p-4'}>
              <div className={'flex-1 pr-5'}>
                  <input autoComplete={'off'} autoFocus={true} placeholder={`e.g. ${defaultUrl}`} className={'text-center bg-transparent h-full w-full focus:outline-none'} name={'url'} type="url" onChange={e => setUrl(e.target.value)} value={ url }/>
              </div>
              <div className={'w-10 h-10'}>
                  <button className={'w-full h-full p-1 focus:outline-none text-white hover:text-purple-200'} disabled={!url} type='submit'>
                      <svg className={'w-full h-full'} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.172 24l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"/></svg>
                  </button>
              </div>
          </form>

          { result && <div className={'mt-10 mx-auto max-w-lg'}>
              <table>
                  <tbody>
                  { Object.keys(result.display).filter(key => result.display[key]).map(key => {
                      return <tr key={key}>
                          <th className={'text-left'}>
                              <span className={'px-4'}>
                                  { key }:
                              </span>
                          </th>
                          <td>
                              <span className={'px-4'}>
                                  { result.display[key] }
                              </span>
                          </td>
                      </tr>
                  })}
                  </tbody>
              </table>

              <div className={'text-xs text-center mt-20 px-4'}>
                  (check dev console for more data)
              </div>
          </div>}
      </main>
    </div>
  )
}
