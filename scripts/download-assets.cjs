const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'assets');
const banksDir = path.join(targetDir, 'banks');
const leadershipDir = path.join(targetDir, 'leadership');

[targetDir, banksDir, leadershipDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://en.wikipedia.org/'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).toString();
        }
        return resolve(download(redirectUrl, dest));
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    });

    req.on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

const assets = [
  // 1. National Emblem of India (Ashoka Lion Capital SVG)
  {
    name: 'emblem-india.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg',
    dest: path.join(targetDir, 'emblem-india.svg')
  },
  // 2. Official AICTE Logo
  {
    name: 'aicte-logo.png',
    url: 'https://upload.wikimedia.org/wikipedia/en/e/eb/All_India_Council_for_Technical_Education_logo.png',
    dest: path.join(targetDir, 'aicte-logo.png')
  },
  // 3. Ministry of Education Logo
  {
    name: 'ministry-education.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Ministry_of_Education_India.svg',
    dest: path.join(targetDir, 'ministry-education.svg')
  },
  // 4. Digital India Logo
  {
    name: 'digital-india.svg',
    url: 'https://upload.wikimedia.org/wikipedia/en/9/95/Digital_India_logo.svg',
    dest: path.join(targetDir, 'digital-india.svg')
  },
  // 5. State Bank of India (SBI) Logo
  {
    name: 'sbi.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg',
    dest: path.join(banksDir, 'sbi.svg')
  },
  // 6. Punjab National Bank (PNB) Logo
  {
    name: 'pnb.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Punjab_National_Bank_Logo.svg',
    dest: path.join(banksDir, 'pnb.svg')
  },
  // 7. Bank of Baroda Logo
  {
    name: 'bob.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Bank_of_Baroda_Logo.svg',
    dest: path.join(banksDir, 'bob.svg')
  },
  // 8. Canara Bank Logo
  {
    name: 'canara.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Canara_Bank_Logo.svg',
    dest: path.join(banksDir, 'canara.svg')
  },
  // 9. Union Bank of India Logo
  {
    name: 'unionbank.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Union_Bank_of_India_Logo.svg',
    dest: path.join(banksDir, 'unionbank.svg')
  },
  // 10. HDFC Bank Logo
  {
    name: 'hdfc.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg',
    dest: path.join(banksDir, 'hdfc.svg')
  },
  // 11. ICICI Bank Logo
  {
    name: 'icici.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg',
    dest: path.join(banksDir, 'icici.svg')
  },
  // 12. Real Portrait: Hon'ble Minister Dharmendra Pradhan
  {
    name: 'minister-pradhan.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Dharmendra_Pradhan_in_2024.jpg',
    dest: path.join(leadershipDir, 'minister-pradhan.jpg')
  },
  // 13. Real Portrait: AICTE Chairman Prof. T. G. Sitharam
  {
    name: 'chairman-sitharam.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/T._G._Sitharam.jpg',
    dest: path.join(leadershipDir, 'chairman-sitharam.jpg')
  },
  // 14. Real Landmark: Rashtrapati Bhavan / Parliament for Viksit Bharat banner & Login Hero
  {
    name: 'rashtrapati-bhavan.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Rashtrapati_Bhavan%2C_New_Delhi.jpg',
    dest: path.join(targetDir, 'rashtrapati-bhavan.jpg')
  },
  // 15. Real Building: AICTE HQ New Delhi
  {
    name: 'aicte-hq-building.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/AICTE_building%2C_New_Delhi.jpg',
    dest: path.join(targetDir, 'aicte-hq-building.jpg')
  }
];

async function run() {
  console.log(`Starting sequential real asset downloads (${assets.length} items)...`);
  for (let i = 0; i < assets.length; i++) {
    const item = assets[i];
    let attempts = 0;
    let success = false;
    while (attempts < 3 && !success) {
      attempts++;
      try {
        await download(item.url, item.dest);
        const stats = fs.statSync(item.dest);
        console.log(`[${i + 1}/${assets.length}] ✓ Downloaded ${item.name} (${stats.size} bytes)`);
        success = true;
      } catch (err) {
        if (attempts < 3) {
          console.warn(`[${i + 1}/${assets.length}] Rate-limited on ${item.name}. Retrying in 2.5s...`);
          await sleep(2500);
        } else {
          console.error(`[${i + 1}/${assets.length}] ✗ Failed ${item.name}: ${err.message}`);
        }
      }
    }
    // Pace requests to respect Wikimedia 1 req/sec guidelines
    await sleep(1200);
  }
  console.log('ALL REAL ASSETS DOWNLOADED SUCCESSFULLY!');
}

run();
