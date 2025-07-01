const express = require('express');
const app = express();
const screeningRouter = require('./api/screening');

app.use(express.json());
app.use('/api', screeningRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));