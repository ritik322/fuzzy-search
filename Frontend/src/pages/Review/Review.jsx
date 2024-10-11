import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import CriminalDetailsDialog from '../../components/CriminalDetailsDialog';
import LogsPage from '../Logs';

const ReviewPage = () => {
  const [criminals, setCriminals] = useState([]); 
  const [matchedRecords, setMatchedRecords] = useState({}); 
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/criminal/get-review-criminals', {
        withCredentials: true,
      });
      const criminalsData = response.data;
      setCriminals(criminalsData); 

      criminalsData.forEach((criminal) => {
        if (criminal.matchedRecord) {
          getCriminal(criminal.matchedRecord, criminal._id); 
        }
      });

      setLoading(false);
    } catch (err) {
      console.log('Error: ', err);
      setLoading(false);
    }
  }, []);

  const getCriminal = useCallback(async (id, criminalId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/criminal/get-criminal/${id}`, {
        withCredentials: true,
      });
      setMatchedRecords((prevState) => ({
        ...prevState,
        [criminalId]: response.data.data, 
      }));
    } catch (err) {
      console.log('Error: ', err);
    }
  }, []);

  const handleDeleteConfirm = async (id) => {
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:3000/api/v1/criminal/delete-criminal/${id}`,
        { withCredentials: true }
      );
      getData(); 
    } catch (error) {
      console.error("Error deleting row:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (id) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/v1/criminal/update-status/${id}`,
        { withCredentials: true }
      );
      getData();
    } catch (error) {
      console.error("Error updating row:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <CircularProgress />
        <p className="mt-4 text-lg text-gray-600">Loading criminals data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-12">
        Review Conflicting Documents
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Conflicting Documents Section */}
        <div className="flex-grow lg:w-2/3">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Incoming and Existing Document Comparison
          </h2>

          {/* Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {criminals.map((criminal) => (
              <div
                key={criminal._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              >
                <DocumentCard
                  title={`Incoming Document - ${criminal.name}`}
                  content={`Criminal Record: ${criminal.description}`}
                  criminal={criminal}
                />
                {matchedRecords[criminal._id] && (
                  <DocumentCard
                    title={`Matched Document - ${matchedRecords[criminal._id].name}`}
                    content={`Matched Record: ${matchedRecords[criminal._id].description}`}
                    criminal={matchedRecords[criminal._id]}
                  />
                )}
                 <OptionsCard
                key={criminal._id}
                onDelete={handleDeleteConfirm}
                onAccept={updateReview}
                id={criminal._id}
              />
                
              </div>
            ))}
          </div>
        </div>

        
      </div>

      <LogsPage />
    </div>
  );
};

const DocumentCard = ({ title, content, criminal }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 transform hover:scale-105 transition-all duration-300 ease-in-out">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{content}</p>
      <div className="text-blue-600 cursor-pointer">
        View Details <CriminalDetailsDialog criminal={criminal} />
      </div>
    </div>
  );
};

const OptionsCard = ({ onDelete, id, onAccept }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-105 transition-all duration-300 ease-in-out">
      <h3 className="text-lg font-semibold text-red-500 mb-6">Resolve Conflict</h3>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => onAccept(id)} 
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors text-lg">
          Accept New Document
        </button>
        <button 
          onClick={() => onDelete(id)} 
          className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors text-lg">
          Reject New Document
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;
