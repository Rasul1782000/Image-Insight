import { useState, useEffect } from "react";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [xrayImage, setXrayImage] = useState(null);
  const [backgroundVideo, setBackgroundVideo] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundVideoChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      setBackgroundVideo(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const convertToXray = () => {
    if (image) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pixels = ctx.getImageData(0, 0, img.width, img.height);
        for (let i = 0; i < pixels.data.length; i += 4) {
          const gray = Math.floor(
            pixels.data[i] * 0.2126 +
              pixels.data[i + 1] * 0.7152 +
              pixels.data[i + 2] * 0.0722
          );
          pixels.data[i] = gray;
          pixels.data[i + 1] = gray;
          pixels.data[i + 2] = gray;
        }
        ctx.putImageData(pixels, 0, 0);
        setXrayImage(canvas.toDataURL());
      };
      img.src = image;
    }
  };

  return (
    <div className="h-screen w-screen relative">
      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="progress" />
        </div>
      )}
      {!loading && (
        <div>
          {backgroundVideo ? (
            <video
              autoPlay
              loop
              muted
              className="absolute top-0 left-0 w-full h-full object-cover"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
          ) : (
            <input
              type="file"
              accept="video/*"
              onChange={handleBackgroundVideoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          )}
          <div className="relative flex justify-center items-center h-screen">
            <div className="bg-white p-4 rounded-lg shadow-lg w-1/2">
              <h1 className="text-3xl font-bold text-center mb-4">
                {" "}
                Image Insights{" "}
              </h1>
              <p className="text-lg text-center mb-4">Your Medical Assistant</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {image && (
                <div className="mt-4">
                  <img
                    src={image}
                    alt="Original Image"
                    className="w-full h-auto"
                  />
                </div>
              )}
              {xrayImage && (
                <div className="mt-4">
                  <img
                    src={xrayImage}
                    alt="Xray Image"
                    className="w-full h-auto"
                  />
                </div>
              )}
              <button
                onClick={convertToXray}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Convert to Xray
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
