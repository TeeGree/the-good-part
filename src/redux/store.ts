import { configureStore } from '@reduxjs/toolkit';
import { appSettingsReducer } from './reducers/AppSettingsReducer';
import { volumeReducer } from './reducers/volumeReducer';
import { isPausedReducer } from './reducers/isPausedReducer';

export const store = configureStore({
    reducer: {
        volume: volumeReducer,
        appSettings: appSettingsReducer,
        isPaused: isPausedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
