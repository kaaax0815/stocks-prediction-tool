import { Autocomplete, TextField } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState } from 'react';

import styles from '../styles/Home.module.css';
import { getSymbols, Symbol } from '../util/api';

export interface Autocomplete {
  label: string;
  id: number;
}

function Home() {
  const [data, setData] = useState({
    loading: true,
    data: undefined as Autocomplete[] | undefined
  });

  // is being executed when state of stocks is changed
  useEffect(() => {
    getSymbols().then((x) => {
      const labels = x.map((x, i) => ({ label: x.symbol + ' - ' + x.description, id: i }));
      setData({ loading: false, data: labels });
    });
  }, []); // empty array would mean reloading only at first rendering of page

  const router = useRouter();
  // default value is empty string; stores current input value of desired stock
  const [stock, setStock] = useState('');
  if (data.loading) {
    return <p>Loading</p>;
  }

  function handleChosenValue(value: string | undefined) {
    if (!value) {
      return;
    }
    router.push(`/${value.split('-')[0].trim()}`);
  }

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
          options={data.data!}
          sx={{ width: 300 }}
          onChange={(_, value) => handleChosenValue(value?.label)}
          renderInput={(params) => <TextField {...params} label="Desired Stock" />}
        />
      </main>
    </div>
  );
}

export default Home;
