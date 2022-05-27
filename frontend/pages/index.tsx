import { Autocomplete, Container, TextField } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import AutocompleteListBox from '../components/AutocompleteListBox';
import styles from '../styles/Start.module.css';
import { getSymbols } from '../util/api';

export interface AutoComplete {
  label: string;
  id: number;
}

export function Start() {
  const [data, setData] = useState({
    loading: true,
    data: undefined as AutoComplete[] | undefined
  });

  const router = useRouter();

  // is being executed when state of stocks is changed
  useEffect(() => {
    getSymbols().then((x) => {
      const labels = x.map((x, i) => ({ label: x.symbol + ' - ' + x.description, id: i }));
      setData({ loading: false, data: labels });
    });
  }, []); // empty array would mean reloading only at first rendering of page

  function handleChosenValue(value: string | undefined) {
    if (!value) {
      return;
    }
    router.push(`/${value.split('-')[0].trim()}`);
  }

  if (data.loading) {
    return <p>Loading</p>;
  }

  return (
    <Container>
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
          Get started by choosing a stock you would like to get predicted
        </p>

        <Autocomplete
          disablePortal
          options={data.data!}
          ListboxComponent={AutocompleteListBox}
          sx={{ width: 300 }}
          onChange={(_, value) => handleChosenValue(value?.label)}
          renderInput={(params) => <TextField {...params} label="Desired Stock" />}
        />
      </main>

      <footer className={styles.footer}>
        <div>
          by{' '}
          <a href="https://github.com/kaaax0815" target="_blank" rel="noreferrer">
            Bernd Storath
          </a>{' '}
          and{' '}
          <a href="https://github.com/jshProgrammer" target="_blank" rel="noreferrer">
            Joshua Pfennig
          </a>
        </div>
        <a
          href="https://github.com/kaaax0815/stocks-prediction-tool"
          target="_blank"
          rel="noreferrer"
        >
          Source Code
        </a>
      </footer>
    </Container>
  );
}
