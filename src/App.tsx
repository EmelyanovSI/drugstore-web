import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import appTheme from './appTheme';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
    );
};

export default appTheme(App);
