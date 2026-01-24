const fs = require('fs');
const https = require('https');
const path = require('path');

const LOGOS = [
  { name: 'dole.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Department_of_Labor_and_Employment_%28DOLE%29.svg' },
  { name: 'tesda.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/TESDA_Logo.svg' },
  { name: 'csc.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Civil_Service_Commission_%28CSC%29.svg' },
  { name: 'dti.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Department_of_Trade_and_Industry_%28DTI%29_logo.svg' },
  { name: 'bi.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Bureau_of_Immigration_%28Philippines%29_Logo.svg' },
  { name: 'owwa.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Overseas_Workers_Welfare_Administration_%28OWWA%29.svg' },
  { name: 'denr.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Department_of_Environment_and_Natural_Resources_%28DENR%29.svg' },
  { name: 'gsis.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Government_Service_Insurance_System_%28GSIS%29.svg' },
  { name: 'doh.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Department_of_Health_%28Philippines%29_logo.svg' },
  { name: 'barangay.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Liga_ng_mga_Barangay_sa_Pilipinas.svg' }
];

const OUTPUT_DIR = path.join(__dirname, 'public', 'logos');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const downloadLogo = (logo) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(OUTPUT_DIR, logo.name);
    const file = fs.createWriteStream(filePath);

    console.log(`Downloading ${logo.name}...`);

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    https.get(logo.url, options, response => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filePath);
        reject(new Error(`Failed to download ${logo.name}: Status Code ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded ${logo.name}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlinkSync(filePath);
      reject(new Error(`Error downloading ${logo.name}: ${err.message}`));
    });
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const downloadAll = async () => {
  for (const logo of LOGOS) {
    try {
      await downloadLogo(logo);
      await delay(2000); // 2 second delay to be polite and avoid 429
    } catch (error) {
      console.error(error.message);
    }
  }
};

downloadAll();
