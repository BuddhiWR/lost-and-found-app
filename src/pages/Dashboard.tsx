import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface LostItem {
  id: number;
  itemName: string;
  description: string;
  location: string;
  dateLost: string;
  status: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsFound = async (id: number) => {
    await axios.patch(`http://localhost:5000/items/${id}`, {
      status: 'found',
    });
    fetchItems();
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await axios.delete(`http://localhost:5000/items/${id}`);
      fetchItems();
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard - {user?.role}</h2>

     {user?.role?.toLowerCase() === 'admin' && (
        <div className="mb-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold">👤 Admin Panel</h3>
          <p>Admin can manage all lost items and users.</p>
        </div>
      )}

    {user?.role?.toLowerCase() === 'staff' && (
        <div className="mb-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold">🛠️ Staff Panel</h3>
          <p>Staff can update or review item requests.</p>
        </div>
      )}

      {/* Summary Box */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-yellow-100 p-4 rounded text-center shadow">
          <h3 className="text-xl font-semibold text-yellow-800">Lost Items</h3>
          <p className="text-3xl">{items.filter((i) => i.status === 'lost').length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded text-center shadow">
          <h3 className="text-xl font-semibold text-green-800">Found Items</h3>
          <p className="text-3xl">{items.filter((i) => i.status === 'found').length}</p>
        </div>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-center text-gray-600">No matching items found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow relative">
              <h3 className="text-lg font-semibold">{item.itemName}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-500">📍 {item.location}</p>
              <p className="text-sm text-gray-500">🕒 Lost on: {item.dateLost}</p>
              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                  item.status === 'found'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}
              >
                Status: {item.status}
              </span>

              {/* Found Button */}
              {item.status === 'lost' && (
                <button
                  onClick={() => handleMarkAsFound(item.id)}
                  className="mt-4 block bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Mark as Found
                </button>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="mt-2 block bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
