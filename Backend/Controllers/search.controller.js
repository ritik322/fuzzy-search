import { spawn } from 'child_process';
import { Criminal } from '../Models/criminal.model.js';

const search = async (req, res) => {
  const { name } = req.body;
  const criminals = await Criminal.find();
  
  // For each criminal in the database, call the Python script and process the result
  const pythonProcess = spawn('python', ['./scripts/script2.py', name, JSON.stringify(criminals)]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            
            try {
                // Parse the result from the Python script
                const parsedResult = JSON.parse(result);
        
                // Sort the results in descending order by the 'score' field
                const sortedResult = parsedResult.sort((a, b) => b.criminal_data.score - a.criminal_data.score);
        
                // Send the sorted results back to the frontend
                res.json(sortedResult);
              } catch (err) {
                console.error('Error parsing or sorting the result:', err);
                res.status(500).send('Error processing the name');
              }
        } else {
            res.status(500).send('Error processing the name');
        }
    });
};

export {search}
