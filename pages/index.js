import { useState } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import Head from 'next/head';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  // State untuk menyimpan input form
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Cek apakah caption dan file kosong
    if (!caption && !file) {
      alert("Please provide either a caption or an image.");
      return;
    }

    // Buat FormData untuk mengirim data termasuk file
    const formData = new FormData();
    formData.append("location", location);
    formData.append("caption", caption);

    if (file) {
      formData.append("file", file);
    }

    try {
      // Kirim data ke API (ubah URL dengan API tujuan Anda)
      const response = await fetch("/api/post", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Post successful!");
      } else {
        const errorData = await response.json();
        alert(`Failed to post. Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Error posting data.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Head>
        <title>ITB Parkir</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </Head>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black">ITB Parkir</h1>
        <p className="text-lg text-black">100% Anonymous</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center space-y-2">
            <label className="text-lg font-semibold text-black">Lokasi Kampus:</label>
            <select
              className="border border-gray-400 p-2 rounded w-64 text-black"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Pilih Lokasi</option>
              <option value="ITB Kampus Ganesha">ITB Kampus Ganesha</option>
              <option value="ITB Kampus Jatinangor">ITB Kampus Jatinangor</option>
              <option value="ITB Kampus Cirebon">ITB Kampus Cirebon</option>
            </select>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <label className="text-lg font-semibold text-black">Caption(kata kata):</label>
            <textarea
              className="border border-gray-400 p-2 rounded w-64 h-24 text-black"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <label className="text-lg font-semibold text-black">Foto Kendaraan:</label>
            <input
              type="file"
              className="border border-gray-400 p-2 rounded w-64 text-black"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-24 rounded">
            Posting!
          </button>
        </form>
      </div>
    </div>
  );
}
