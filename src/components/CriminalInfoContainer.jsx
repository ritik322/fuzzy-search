import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import CriminalTable from './CriminalTable/CriminalTable';

const CriminalInfoContainer = ({tableData = []}) => {
  const [crimeTypes, setCrimeTypes] = useState({
    Homicide: false,
    Assault: false,
    Burglary: false,
    Fraud: false,
    DrugOffenses: false,
  });

  const [thresholdRange, setThresholdRange] = useState([0, 100]);
  const [filteredData, setFilteredData] = useState(tableData)

  const handleThresholdChange = (e) => {
    const value = e.target.value.split(",");
    setThresholdRange(value.map(Number));
  };

  // Handle clear all button click
  const handleClearAll = () => {
    setCrimeTypes({
      Homicide: false,
      Assault: false,
      Burglary: false,
      Fraud: false,
      DrugOffenses: false,
    });
    setThresholdRange([0, 100]);
  };

  useEffect(() => {
    const filterCriminalData = () => {
      const data = tableData || []; // Use an empty array if tableData is null

      // Convert crimeTypes object to an array of selected crime types
      const selectedCrimeTypes = Object.keys(crimeTypes).filter(
        (crime) => crimeTypes[crime]
      );

      // Filter tableData based on selected crime types and threshold range
      const filtered = data.filter((record) => {
        // Ensure the record has a 'crime' array and 'score' property before filtering
        const matchesCrimeType = selectedCrimeTypes.length
          ? selectedCrimeTypes.some((crime) => record.crime && record.crime.includes(crime))
          : true;

        // Ensure that the record has a 'score' property for threshold filtering
        const matchesThreshold =
          record.score >= thresholdRange[0] && record.score <= thresholdRange[1];

        return matchesCrimeType && matchesThreshold;
      });

      setFilteredData(filtered);
    };

    filterCriminalData();
  }, [crimeTypes, thresholdRange, tableData]); // Ensure dependencies are correct
  return (
    <div className="ml-4 space-y-4 section-container">
      <div>
        <h1 className="font-bold text-2xl text-center">Criminal Records</h1>
      </div>
      <div className="flex p-4 gap-8 justify-center ">
        <div className="filter-section bg-inherit flex flex-col gap-6 p-6">
          <div className="filter-category  flex flex-col gap-3">
            <h5>
              Crime Type{" "}
              <Button
                variant="link"
                className="clear-button  ml-6 text-red-500"
                onClick={handleClearAll}
              >
                Clear all
              </Button>
            </h5>
            <Form>
              <div className="flex items-center">
                <Form.Check
                  className="text-xl"
                  type="checkbox"
                  checked={crimeTypes.Homicide}
                  onChange={() =>
                    setCrimeTypes({
                      ...crimeTypes,
                      Homicide: !crimeTypes.Homicide,
                    })
                  }
                />
                <label htmlFor="" className="ml-2 font-bold">
                  Homicide
                </label>
              </div>

              <div className="flex items-center">
                <Form.Check
                  type="checkbox"
                  checked={crimeTypes.Assault}
                  onChange={() =>
                    setCrimeTypes({
                      ...crimeTypes,
                      Assault: !crimeTypes.Assault,
                    })
                  }
                />
                <label htmlFor="" className="ml-2 font-bold">
                  Assault
                </label>
              </div>
              <div className="flex items-center">
                <Form.Check
                  type="checkbox"
                  checked={crimeTypes.Burglary}
                  onChange={() =>
                    setCrimeTypes({
                      ...crimeTypes,
                      Burglary: !crimeTypes.Burglary,
                    })
                  }
                />
                <label htmlFor="" className="ml-2 font-bold">
                  Burglary
                </label>
              </div>
              <div className="flex items-center">
                <Form.Check
                  type="checkbox"
                  checked={crimeTypes.Fraud}
                  onChange={() =>
                    setCrimeTypes({ ...crimeTypes, Fraud: !crimeTypes.Fraud })
                  }
                />
                <label htmlFor="" className="ml-2 font-bold">
                  Fraud
                </label>
              </div>
              <div className="flex items-center">
                <Form.Check
                  type="checkbox"
                  checked={crimeTypes.DrugOffenses}
                  onChange={() =>
                    setCrimeTypes({
                      ...crimeTypes,
                      DrugOffenses: !crimeTypes.DrugOffenses,
                    })
                  }
                />
                <label htmlFor="" className="ml-2 font-bold">
                  Drug Offenses
                </label>
              </div>
            </Form>
          </div>

          {/* Salary Range Section */}
          <div className="filter-category">
            <h5>Threshold Range</h5>
            <div className="threshold-range flex flex-col">
              <Form.Label>
                {thresholdRange[0]} - {thresholdRange[1]}
              </Form.Label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={thresholdRange[0]} // Use only the first element for range
                onChange={(e) => setThresholdRange([Number(e.target.value), thresholdRange[1]])}
              />
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={thresholdRange[1]} // Use only the second element for range
                onChange={(e) => setThresholdRange([thresholdRange[0], Number(e.target.value)])}
              />
            </div>
          </div>
        </div>
        <div className="grow"><CriminalTable tableData={filteredData}/></div>  
      </div>
    </div>
  );
};

export default CriminalInfoContainer;
