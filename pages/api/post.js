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

    let { caption } = fields;
    let { location } = fields;
    const file = files.file ? files.file[0] : null;

    if (Array.isArray(caption)) {
      caption = caption[0];
    }

    if (Array.isArray(location)) {
      location = location[0];
    }

    const client = new TwitterApi({
      appKey: "P0nuueSg7C7ZllZVmIsbYUSq2",
      appSecret: "K3DUkLLX6FHNPJ8GU8TtFUODCjnwcHRQgOXQHkupMaCF8RIPQ8",
      accessToken: "1849452028508114944-yEJQ0noyR1g6NUNKr5ICE4YvBgxaiH",
      accessSecret: "pUPWHCSXnVYSdjXq7JrMdt2tMfJWKfN1YtwTSBBTEwm5W",
    });

    let mediaId = null;

    if (file) {
      mediaId = await client.v1.uploadMedia(file.filepath);
    }

    // Combine location into caption text if provided
    let tweetText = `${caption} \n`;
    if (location) {
      tweetText += `\n📍Lokasi: ${location}`;
      tweetText += `\n📷Kirim Foto Ke: itbparkir.vercel.app`;
    }

    // Prepare tweet data
    const tweetData = { text: tweetText };
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
