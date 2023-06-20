const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const crypto = require('crypto');
const fileUpload = require('express-fileupload');

const app = express();

const API_KEY = '&qohPGDF1q6uYu@$f40HZ1&otcwFckvH';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static(__dirname));

function hashImage(imageData) {
  const hash = crypto.createHash('sha256');
  hash.update(imageData);
  return hash.digest('hex');
}

app.post('/send-data', async (req, res) => {
  const file = req.files.file;

  try {
    const url = 'https://eh-1.vercel.app/api/consensus/message/';
    const topic_id = '0.0.1728149';

    // Hash the image data
    const hashedImage = hashImage(file.data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic_id,
        message: hashedImage
      }),
    });

    const data = await response.json();

    // Include the hashedImage and topic_id in the response
    data.hashedImage = hashedImage;
    data.topic_id = topic_id;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while sending data to the API.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
