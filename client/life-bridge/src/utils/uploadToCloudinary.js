const uploadToCloudinary = async (file) => {
    const cloudName = "dovyslbf0";
    const preset = "life-bridge";
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
  
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Cloudinary upload failed:", errorText);
        throw new Error("Failed to upload to Cloudinary");
      }
  
    const data = await res.json();
  
    if (!data.secure_url) {
      throw new Error("Failed to upload to Cloudinary");
    }
  
    return data.secure_url;
  };
  
  export default uploadToCloudinary;
  