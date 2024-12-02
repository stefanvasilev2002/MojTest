import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes/AppRoutes';
import './index.css';
import './styles/tailwind.css';

import './i18n';
import './styles/select.css'
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppRoutes />
    </React.StrictMode>
);
