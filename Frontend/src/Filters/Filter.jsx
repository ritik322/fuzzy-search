import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './FilterComponent.css'; // Custom styles if needed

function FilterComponent() {
  // State for job type checkboxes
  const [jobTypes, setJobTypes] = useState({
    fullTime: true,
    partTime: true,
    internship: false,
    projectWork: true,
    volunteering: false,
  });

  // State for salary range
  const [salaryRange, setSalaryRange] = useState([50, 120]);

  // State for experience level checkboxes
  const [experienceLevels, setExperienceLevels] = useState({
    entryLevel: false,
    intermediate: true,
    expert: true,
  });

  // Handle salary range change
  const handleSalaryChange = (e) => {
    const value = e.target.value.split(',');
    setSalaryRange(value.map(Number));
  };

  // Handle clear all button click
  const handleClearAll = () => {
    setJobTypes({
      fullTime: false,
      partTime: false,
      internship: false,
      projectWork: false,
      volunteering: false,
    });
    setSalaryRange([50, 120]); // Reset to default range
    setExperienceLevels({
      entryLevel: false,
      intermediate: false,
      expert: false,
    });
  };

  return (
    <div className="filter-section">
      {/* Job Type Section */}
      <div className="filter-category">
        <h5>Job Type <Button variant="link" className="clear-button" onClick={handleClearAll}>Clear all</Button></h5>
        <Form>
          <Form.Check 
            type="checkbox" 
            label="Full time" 
            checked={jobTypes.fullTime}
            onChange={() => setJobTypes({ ...jobTypes, fullTime: !jobTypes.fullTime })}
          />
          <Form.Check 
            type="checkbox" 
            label="Part time" 
            checked={jobTypes.partTime}
            onChange={() => setJobTypes({ ...jobTypes, partTime: !jobTypes.partTime })}
          />
          <Form.Check 
            type="checkbox" 
            label="Internship" 
            checked={jobTypes.internship}
            onChange={() => setJobTypes({ ...jobTypes, internship: !jobTypes.internship })}
          />
          <Form.Check 
            type="checkbox" 
            label="Project work" 
            checked={jobTypes.projectWork}
            onChange={() => setJobTypes({ ...jobTypes, projectWork: !jobTypes.projectWork })}
          />
          <Form.Check 
            type="checkbox" 
            label="Volunteering" 
            checked={jobTypes.volunteering}
            onChange={() => setJobTypes({ ...jobTypes, volunteering: !jobTypes.volunteering })}
          />
        </Form>
      </div>

      {/* Salary Range Section */}
      <div className="filter-category">
        <h5>Salary Range</h5>
        <div className="salary-range">
          <Form.Label>${salaryRange[0]}k - ${salaryRange[1]}k</Form.Label>
          <input 
            type="range" 
            min="50" 
            max="120" 
            step="5" 
            value={salaryRange} 
            onChange={handleSalaryChange} 
            multiple
          />
        </div>
      </div>

      {/* Experience Level Section */}
      <div className="filter-category">
        <h5>Experience Level</h5>
        <Form>
          <Form.Check 
            type="checkbox" 
            label="Entry level" 
            checked={experienceLevels.entryLevel}
            onChange={() => setExperienceLevels({ ...experienceLevels, entryLevel: !experienceLevels.entryLevel })}
          />
          <Form.Check 
            type="checkbox" 
            label="Intermediate" 
            checked={experienceLevels.intermediate}
            onChange={() => setExperienceLevels({ ...experienceLevels, intermediate: !experienceLevels.intermediate })}
          />
          <Form.Check 
            type="checkbox" 
            label="Expert" 
            checked={experienceLevels.expert}
            onChange={() => setExperienceLevels({ ...experienceLevels, expert: !experienceLevels.expert })}
          />
        </Form>
      </div>
    </div>
  );
}

export default FilterComponent;
