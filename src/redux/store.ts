import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { AsyncThunk, configureStore } from '@reduxjs/toolkit';
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

const persistConfig = {
    rootReducer: { key: 'rootReducer', storage, whitelist: [] },

    themeReducer: { key: 'themeReducer', storage, whitelist: ['mode'] },
    drugsReducer: { key: 'drugsReducer', storage, whitelist: [] },
    countriesReducer: { key: 'countriesReducer', storage, whitelist: [] }
};

const rootReducer = combineReducers({
    themeReducer: persistReducer(persistConfig.themeReducer, themeReducer),
    drugsReducer: persistReducer(persistConfig.drugsReducer, drugsReducer),
    countriesReducer: persistReducer(persistConfig.countriesReducer, countriesReducer)
});

const store = configureStore({
    preloadedState: {},
    reducer: persistReducer(persistConfig.rootReducer, rootReducer),
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    }),
    enhancers: []
});
const persistor = persistStore(store);

export type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

export type PendingAction = ReturnType<GenericAsyncThunk['pending']>
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, persistor };
