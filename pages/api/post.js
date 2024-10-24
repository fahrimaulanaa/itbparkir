import { TwitterApi } from "twitter-api-v2";
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export default async function postTweet(req, res) {
  try {
    const { fields, files } = await parseForm(req); // Parsing multipart form data

    let { caption } = fields; // Ambil caption dari fields
    const file = files.file ? files.file[0] : null;

    // Jika caption adalah array, ambil elemen pertama atau gabungkan sebagai string
    if (Array.isArray(caption)) {
      caption = caption[0]; // Atau bisa gunakan: caption.join(' ')
    }

    // Set up Twitter API client with hardcoded keys (not recommended for production)
    const client = new TwitterApi({
        appKey: "P0nuueSg7C7ZllZVmIsbYUSq2",
        appSecret: "K3DUkLLX6FHNPJ8GU8TtFUODCjnwcHRQgOXQHkupMaCF8RIPQ8",
        accessToken: "1849452028508114944-yEJQ0noyR1g6NUNKr5ICE4YvBgxaiH",
        accessSecret: "pUPWHCSXnVYSdjXq7JrMdt2tMfJWKfN1YtwTSBBTEwm5W",
    });

    let mediaId = null;

    // Upload media if provided
    if (file) {
      mediaId = await client.v1.uploadMedia(file.filepath);
    }

    // Prepare tweet data with caption and/or media
    const tweetData = {};
    if (caption) {
      tweetData.text = caption; // Pastikan caption berupa string
    }
    if (mediaId) {
      tweetData.media = { media_ids: [mediaId] };
    }

    // Create the tweet
    await client.v2.tweet(tweetData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Helper function to parse form-data
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};
