import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';

import themeReducer from './themeSlice';
import drugsReducer from './drugsSlice';
import countriesReducer from './countriesSlice';
import appReducer from './appSlice';
import {
    AppState,
    CountriesState,
    DrugsState,
    ThemeState
} from './state';

const [
    themePersistor,
    drugsPersistor,
    countriesPersistor,
    appPersistor
] = [
    { key: 'theme', storage, blacklist: [] },
    { key: 'drugs', storage, whitelist: [] },
    { key: 'countries', storage, whitelist: [] },
    { key: 'app', storage, blacklist: [] }
];

const store = configureStore({
    preloadedState: {},
    reducer: combineReducers({
        themeReducer: persistReducer<ThemeState>(themePersistor, themeReducer),
        drugsReducer: persistReducer<DrugsState>(drugsPersistor, drugsReducer),
        countriesReducer: persistReducer<CountriesState>(countriesPersistor, countriesReducer),
        appReducer: persistReducer<AppState>(appPersistor, appReducer)
    }),
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    }),
    enhancers: []
});
const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, persistor };
