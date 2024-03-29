import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate as PersistProvider } from 'redux-persist/integration/react';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { persistor, store } from './redux/store';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const Loading = () => <div>Loading...</div>;

root.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <PersistProvider
                persistor={persistor}
                loading={<Loading />}
            >
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistProvider>
        </ReduxProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
