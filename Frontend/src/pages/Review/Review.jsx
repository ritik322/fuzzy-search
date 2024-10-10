import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import CriminalDetailsDialog from '../../components/CriminalDetailsDialog';
import LogsPage from '../Logs';

const ReviewPage = () => {
  const [criminals, setCriminals] = useState([]); // To store criminals under review
  const [matchedRecords, setMatchedRecords] = useState({}); // To store matched records for each criminal
  const [loading, setLoading] = useState(false);

  // Function to retrieve all criminals under review
  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/criminal/get-review-criminals', {
        withCredentials: true,
      });
      const criminalsData = response.data;
      setCriminals(criminalsData); // Store criminals in state

      // Now fetch all matched records for each criminal
      criminalsData.forEach((criminal) => {
        if (criminal.matchedRecord) {
          getCriminal(criminal.matchedRecord, criminal._id); // Fetch the matched record for each criminal
        }
      });

      console.log(matchedRecords);

      setLoading(false);
    } catch (err) {
      console.log('Error: ', err);
      setLoading(false);
    }
  };

  // Function to retrieve matched document for a specific criminal
  const getCriminal = async (id, criminalId) => {
    try {
    console.log("id: ", id, ", criminalId: ", criminalId)
      const response = await axios.get(`http://localhost:3000/api/v1/criminal/get-criminal/${id}`, {
        withCredentials: true,
      });
      console.log(response.data.data);
      setMatchedRecords((prevState) => ({
        ...prevState,
        [criminalId]: response.data.data, // Store the matched record using the criminalId as the key
      }));
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  const handleDeleteConfirm = async (id) => {
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:3000/api/v1/criminal/delete-criminal/${id}`,
        {
          withCredentials: true,
        }
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
        {
          withCredentials: true,
        }
      );
      getData();
    } catch (error) {
      console.error("Error deleting row:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Review Conflicting Documents</h1>

      {/* Main container */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Conflicting Documents Section */}
        <div className="flex-grow lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4">Incoming Document and Existing Document</h2>

          {/* Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {criminals.map((criminal) => (
                <>
              <div key={criminal._id} className="flex flex-col">
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
              </div>
        <div className="lg:w-1/3">
        <h2 className="text-xl font-semibold mb-4">Options</h2>

        {/* Options Card */}
        <OptionsCard onDelete = {handleDeleteConfirm} onAccept = {updateReview} id={criminal._id}/>
      </div>
      </>
            ))}
          </div>
        </div>
      </div>
      <LogsPage/>
    </div>
  );
};

const DocumentCard = ({ title, content, criminal }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{content}</p>
        View <CriminalDetailsDialog criminal={criminal}/>
    </div>
  );
};

const OptionsCard = ({onDelete, id, onAccept}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Resolve Conflict</h3>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        <button onClick={()=>onDelete(id)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Accept New Document
        </button>
        <button onClick={()=>onDelete(id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Reject New Document
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;
