import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppSettings } from '../models/AppSettings';
import { SET_APP_SETTINGS } from './actions/AppSettingsActions';
import { defaultAppSettings } from './state/AppSettingsState';
import { AppDispatch, RootState } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppSettingsSelector = () => {
    return useAppSelector((state) => state.appSettings?.appSettings ?? defaultAppSettings);
};

export const useAppSettingsDispatch = () => {
    const dispatch = useAppDispatch();
    return (value: AppSettings) => dispatch({ type: SET_APP_SETTINGS, appSettings: value });
};
