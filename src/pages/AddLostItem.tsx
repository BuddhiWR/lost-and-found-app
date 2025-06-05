import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddLostItem = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [imageBase64, setImageBase64] = useState<string>('');
  const [message, setMessage] = useState('');

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!itemName || !description || !location || !dateLost) {
    setError('All fields are required');
    return;
  }

  try {
    await axios.post('http://localhost:5000/items', {
      itemName,
      description,
      location,
      dateLost,
      status: 'lost',
      userId: 'current-user-id',
      image: imageBase64,
    });

    setMessage('Lost item submitted successfully!');
    setItemName('');
    setDescription('');
    setLocation('');
    setDateLost('');
    setImageBase64('');

    // ✅ navigate AFTER successful submission
    navigate('/');
  } catch (err) {
    console.error(err);
    setError('Failed to submit item');
  }
};

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Report Lost Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="text"
          placeholder="Location Lost"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={dateLost}
          onChange={(e) => setDateLost(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="w-full p-2 border rounded"
/>

  {imageBase64 && (
          <img src={imageBase64} alt="Preview" className="w-32 h-32 object-cover rounded" />
        )}


        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddLostItem;
