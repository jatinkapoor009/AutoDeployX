const express = require('express');
const app = express();

app.use(express.json());

app.post('/api', (req, res) => {
const name = req.body.name;

res.json({
message: `Hello ${name}, AutoDeployX backend working `
});
});

app.listen(3000, () => {
console.log("Backend running on port 3000");
});
