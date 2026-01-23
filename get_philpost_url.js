const https = require('https');

https.get('https://en.wikipedia.org/wiki/File:Phlpost_2012_logo.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/https:\/\/upload\.wikimedia\.org\/wikipedia\/[^"]*Phlpost_2012_logo\.svg/);
    if (match) {
      console.log(match[0]);
    } else {
      console.log('Not found');
    }
  });
});
