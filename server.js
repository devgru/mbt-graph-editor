import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import store from './src/store';

const app  = express();
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true}));

app.post('/dispatch', (request, response) => {
  store.dispatch(request.body);
  response.send();
});

app.get('/getState', (request, response) => {
  response.send(store.getState());
});


app.listen(9182);
