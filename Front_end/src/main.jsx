import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './Components/index.css'
import Rootas from './routes/routes'

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <BrowserRouter>

      <Rootas />
      
    </BrowserRouter>
  </React.StrictMode>



)
