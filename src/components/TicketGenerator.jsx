import  { useState, useEffect } from 'react';

const TicketGenerator = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    avatar: '',
  });
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('ticketForm'));
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ticketForm', JSON.stringify(formData));
  }, [formData]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.avatar) {
      newErrors.avatar = 'Upload an image';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dev_jaytee'); // 

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dalaunt4j/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
    } catch (error) {
      console.error('Upload failed:', error);
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Conference Ticket Generator</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2 border rounded text-black"
            />
            {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
          </div>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded text-black"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block">Upload Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded bg-gray-700 cursor-pointer"
            />
            {loading && <p className="text-yellow-400">Uploading...</p>}
            {errors.avatar && <p className="text-red-500">{errors.avatar}</p>}
          </div>
          <button
            type="submit"
            className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700 w-full">
            Generate Ticket
          </button>
        </form>
      </div>
      {ticket && (
        <div className="mt-6 p-6 bg-green-700 rounded-lg shadow-lg w-full max-w-md text-center">
          <h3 className="text-lg font-bold">Your Ticket</h3>
          <img src={ticket.avatar} alt="Avatar" className="w-20 h-20 mx-auto rounded-full my-2" />
          <p className="text-xl font-semibold">{ticket.fullName}</p>
          <p>{ticket.email}</p>
          <p className="text-sm text-gray-200">Event Date: March 15, 2025 | 7:00 PM</p>
        </div>
      )}
    </div>
  );
};

export default TicketGenerator;
