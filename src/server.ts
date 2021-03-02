import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser'
import './database'

import routes from './routes/bins.routes'

dotenv.config()

const app = express();

app.set('view engine', 'ejs');
app.set("views", "./src/views");

app.use(bodyParser.urlencoded({ extended: true }))

app.use(routes)

app.listen(3333, () => console.log('Web app running on port 3333'))