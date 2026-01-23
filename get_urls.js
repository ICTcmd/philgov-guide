const crypto = require('crypto');
const files = [
  'Philippine_National_Police_seal.svg',
  'Professional_Regulation_Commission_(PRC).svg',
  'Commission_on_Elections_(COMELEC).svg',
  'Phlpost_2012_logo.svg'
];

files.forEach(f => {
  const hash = crypto.createHash('md5').update(f).digest('hex');
  const path = hash.substring(0, 1) + '/' + hash.substring(0, 2);
  console.log(`https://upload.wikimedia.org/wikipedia/commons/${path}/${f}`);
});
