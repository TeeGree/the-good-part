import { AnyAction } from 'redux';
import { AppSettings } from '../../models/AppSettings';

export const SET_APP_SETTINGS = 'SET_APP_SETTINGS';

export interface AppSettingsAction extends AnyAction {
    appSettings?: AppSettings;
    type: typeof SET_APP_SETTINGS;
}
