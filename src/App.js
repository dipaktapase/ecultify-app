import React, { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";

function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && !file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      setImage(null);
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5MB. Please upload a smaller image.");
      setImage(null);
      return;
    }

    setImage(file);
    setErrorMessage("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setErrorMessage("Please select an image.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("image", image);

    try {
      // Make the POST request to the backend
      const response = await axios.post("https://ecultify-backend.onrender.com/generate-gif", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      // Create a URL for the video file
      // set it for download
      const videoBlob = new Blob([response.data], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
    } catch (error) {
      console.error("Error generating file:", error);
      setErrorMessage("Error generating the video. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <h1 className="text-3xl text-center mb-4 pt-4">Upload an Image to Generate Video</h1>

      <form onSubmit={handleSubmit} className="text-center gap-4 p-2 justify-center">
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 border border-gray-300 p-2 rounded" />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>
          {loading ? "Generating..." : "Generate Video"}
        </button>
      </form>

      {errorMessage && (
        <div className="text-red-500 mt-4 text-center">
          <p>{errorMessage}</p>
        </div>
      )}

      {videoUrl && (
        <div className="mt-4 text-center flex flex-col items-center justify-center">
          <h2 className="text-xl mb-2">Generated Video</h2>
          <video controls width="400" src={videoUrl}></video>
          <br />
          <a href={videoUrl} download="generated-video.mp4" className="mt-2 inline-block px-4 py-2 bg-green-500 text-white rounded">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
