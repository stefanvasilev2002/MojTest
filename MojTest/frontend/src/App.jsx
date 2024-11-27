import React from 'react';
import AppRoutes from './routes/AppRoutes';  // Import your routes component

const App = () => {
    return (
        <div>
            <AppRoutes />  {/* Routes will be handled inside AppRoutes now */}
        </div>
    );
};

export default App;
