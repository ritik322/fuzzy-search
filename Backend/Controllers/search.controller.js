import { spawn } from 'child_process';

const criminals = [
    { name: 'muhammad ali' },
    { name: 'suresh' },
    { name: 'oleg ivanov' },
    { name: 'jose' },
    { name: 'chloe' },
    { name: 'taro yamada' },
    { name: 'giovanni rossi' },
    { name: 'francois dupont' },
  ];

const search = async (req, res) => {
  const { name } = req.body;
   
  // For each criminal in the database, call the Python script and process the result
  const pythonProcess = spawn('python', ['./scripts/script.py', name, JSON.stringify(criminals)]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json(JSON.parse(result)); // Send the results back to the frontend
        } else {
            res.status(500).send('Error processing the name');
        }
    });
};

export {search}
