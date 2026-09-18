const INDEXNOW_KEY = '880071a12b914116d33f108114587758';
const BASE_URL = 'https://licitai.com.br';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const URLS_TO_SUBMIT = [
  BASE_URL,
  `${BASE_URL}/login`,
];

async function submitToIndexNow() {
  const payload = {
    host: 'licitai.com.br',
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: URLS_TO_SUBMIT,
  };

  console.log('Submitting to IndexNow:', URLS_TO_SUBMIT);

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    if (!response.ok) {
      console.error('IndexNow submission failed:', response.status, result);
      process.exit(1);
    }

    console.log('IndexNow submission successful:', result);
    console.log(`Submitted ${URLS_TO_SUBMIT.length} URLs`);
  } catch (error) {
    console.error('IndexNow error:', error);
    process.exit(1);
  }
}

submitToIndexNow();