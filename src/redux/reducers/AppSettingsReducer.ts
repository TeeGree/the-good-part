import { Reducer } from 'react';
import { AppSettingsAction, SET_APP_SETTINGS } from '../actions/AppSettingsActions';
import { AppSettingsState, defaultAppSettings } from '../state/AppSettingsState';

const initialState: AppSettingsState = {
    appSettings: defaultAppSettings,
};

export const appSettingsReducer: Reducer<AppSettingsState | undefined, AppSettingsAction> = (
    state = initialState,
    action = { type: SET_APP_SETTINGS },
) => {
    switch (action.type) {
        case SET_APP_SETTINGS:
            return {
                ...state,
                appSettings: action.appSettings ?? defaultAppSettings,
            };
        default:
            return state;
    }
};
