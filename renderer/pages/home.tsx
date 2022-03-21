import * as el from 'electron'
import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ipcRenderer = el.ipcRenderer || false;

function Home() {

  const [version, setVersion] = useState('loading...');

  useEffect(() => {

    if (ipcRenderer) {
      const v = ipcRenderer.sendSync('version', 'arg1');
      setVersion(v);
    }
    else {
      setVersion('unable-to-get');
    }

    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('version');
      }
    }
  }, []);


  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div className='grid grid-col-1 text-2xl w-full text-center'>
        <img className='ml-auto mr-auto' src='/images/logo.png' />
        <span>⚡ Electron ⚡ Version: {version} </span>
        <span>+</span>
        <span>Next.js</span>
        <span>+</span>
        <span>tailwindcss</span>
        <span>=</span>
        <span>💕 </span>
      </div>
      <div className='mt-1 w-full flex-wrap flex justify-center'>
        <Link href='/next'>
          <a className='btn-blue'>Go to next page</a>
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Home;
