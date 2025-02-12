import { useState, useEffect } from "react";

const TicketGenerator = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("ticketForm"));
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ticketForm", JSON.stringify(formData));
  }, [formData]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.avatar) {
      newErrors.avatar = "Upload an image";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "dev_jaytee");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dalaunt4j/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );
      const data = await response.json();
      setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setTicket({ ...formData });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#010e01] text-white font-serif">
      
      {/* Form & Ticket Container */}
      <div className={`flex flex-col ${ticket ? "md:flex-row md:space-x-6" : ""} items-center w-full max-w-4xl`}>
        
        {/* Form Card */}
        <div className="bg-[#021802] p-6 md:p-10 rounded-2xl shadow-2xl w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-6 text-center">Obtain Your Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2 border rounded bg-gray-600 text-white"
              />
              {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded bg-gray-600 text-white"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            {/* Avatar Upload */}
            <div>
              <label className="block">Upload Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded bg-gray-700 cursor-pointer"
              />
              {loading && <p className="text-gray-50">Uploading...</p>}
              {errors.avatar && <p className="text-red-500">{errors.avatar}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-700 px-4 py-2 rounded-lg text-white hover:bg-green-800 w-full transition duration-300"
            >
              Generate Ticket
            </button>
          </form>
        </div>

        {/* Ticket Card (Shows only if ticket is generated) */}
        {ticket && (
          <div className="bg-[#021802] p-6 md:p-10 rounded-2xl shadow-2xl w-full md:w-1/2 mt-6 md:mt-0">
            <h3 className="text-lg font-bold mb-6 text-center">Ticket Successfully Booked!</h3>
            <div className="flex flex-col items-center space-y-4">
              
              {/* Avatar */}
              <img src={ticket.avatar} alt="Avatar" className="w-20 h-20 rounded-full shadow-lg" />
              
              {/* Ticket Info */}
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold">{ticket.fullName}</p>
                <p className="text-gray-300">{ticket.email}</p>
                <p className="text-sm text-gray-400">Event Date: March 15, 2025 | 7:00 PM</p>
                <p className="text-sm text-gray-400">Ticket No. 454</p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default TicketGenerator;
