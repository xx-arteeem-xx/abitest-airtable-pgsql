// _____________________ ИМПОРТ БИБЛИОТЕК ______________________________________
const express = require('express');
require('dotenv').config();
const cors = require("cors");
const getRoutes = require('./routes/getRoutes.js');

// ______________ НАСТРОЙКА ПАРАМЕТРОВ ПРИЛОЖЕНИЯ ______________________________
const port = 3030;
const corsOptions ={
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/get/', getRoutes);

// _____________________ ЗАПУСК ПРИЛОЖЕНИЯ _____________________________________
app.listen(port, () => {
    console.log(`App started on port ${port}`);
});
