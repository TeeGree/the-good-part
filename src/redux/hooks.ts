import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppSettings } from '../models/AppSettings';
import { SET_APP_SETTINGS } from './actions/AppSettingsActions';
import { SET_IS_PAUSED } from './actions/IsPausedActions';
import { defaultAppSettings } from './state/AppSettingsState';
import { AppDispatch, RootState } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppSettingsSelector = () => {
    return useAppSelector((state) => state.appSettings?.appSettings ?? defaultAppSettings);
};

export const useAppSettingsDispatch = (dispatch: AppDispatch) => {
    return (value: AppSettings) => dispatch({ type: SET_APP_SETTINGS, appSettings: value });
};

export const useIsPausedSelector = () => {
    return useAppSelector((state) => state.isPaused?.isPaused ?? false);
};

export const useIsPausedDispatch = (dispatch: AppDispatch) => {
    return (value: boolean) => dispatch({ type: SET_IS_PAUSED, isPaused: value });
};
