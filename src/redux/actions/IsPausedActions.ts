import { AnyAction } from 'redux';

export const SET_IS_PAUSED = 'SET_IS_PAUSED';

export interface IsPausedAction extends AnyAction {
    isPaused?: boolean;
    type: typeof SET_IS_PAUSED;
}
