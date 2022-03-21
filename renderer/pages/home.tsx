import * as el from 'electron'
import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ipcRenderer = el.ipcRenderer || false;

function Home() {

  const [version, setVersion] = useState('loading...');
  const [message, setMessage] = useState('loading...');
  const [progress, setProgress] = useState('0');

  const handleVersion = useCallback((event, data) => setVersion(`${data}`), []);
  const handleMessage = useCallback((event, data) => setMessage(`${data}`), []);
  const handleDownloadProgress = useCallback((event, data) => setProgress(`${data}`), []);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on('version', handleVersion);
      ipcRenderer.on('message', handleMessage);
      ipcRenderer.on('download-progress', handleDownloadProgress);
      ipcRenderer.send('version');
    }
    else console.log('no renderer')

    setVersion('init...');
    setMessage('init...');
    setProgress('20');

    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('version');
        ipcRenderer.removeAllListeners('message');
        ipcRenderer.removeAllListeners('download-progress');
      }
    }
  }, [handleVersion, handleMessage, handleDownloadProgress]);


  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div>
        <div>{version}</div>
        <div>{message}</div>
        <div>{progress}</div>
        <progress value={progress} max={100}></progress>
      </div>
    </React.Fragment>
  );
}

export default Home;
