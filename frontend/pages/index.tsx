import { Autocomplete, TextField } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from 'react';

import styles from '../styles/Home.module.css';
import Stocks from './[stocks]';

function Home() {
  const stockOptions = [
    { label: 'TSLA - Tesla', id: 1 },
    { label: 'AAPL - Apple', id: 2 },
    { label: 'NVD - Nvidia', id: 3 },
    { label: 'MSF - Microsoft', id: 4 }
  ];

  const router = useRouter();

  function handleChosenValue(value: string | undefined) {
    if (!value) {
      return;
    }
    router.push(`/${value.split('-')[0].trim()}`);
  }

  // default value is empty string; stores current input value of desired stock
  const [stock, setStock] = useState('');

  return (
    <div className={styles.container}>
      <Head>
        <title>Stock Prediction Tool</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the
          <br />
          STOCK PREDICTION TOOL
        </h1>

        <p className={styles.description}>
          Get started by choosing a stock you would like to be predicted.
          <br /> ~by Bernd Storath and Joshua Pfennig
        </p>

        <Autocomplete
          disablePortal
          options={stockOptions}
          sx={{ width: 300 }}
          onChange={(_, value) => handleChosenValue(value?.label)}
          renderInput={(params) => <TextField {...params} label="Desired Stock" />}
        />
      </main>
    </div>
  );
}

export default Home;
