import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LostItem {
  id: number;
  itemName: string;
  description: string;
  location: string;
  dateLost: string;
  status: string;
}

const Dashboard = () => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await axios.patch(`http://localhost:5000/items/${id}`, {
        status: 'found',
      });
      fetchItems(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Lost Items List</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-600">No lost items found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{item.itemName}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-500">📍 {item.location}</p>
              <p className="text-sm text-gray-500">🕒 Lost on: {item.dateLost}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${item.status === 'found' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                Status: {item.status}
              </span>

              {item.status === 'lost' && (
                <button
                  onClick={() => handleMarkAsFound(item.id)}
                  className="mt-4 block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Mark as Found
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
