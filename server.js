const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('Hello from CI/CD pipeline! Deployed automatically 🚀');
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));