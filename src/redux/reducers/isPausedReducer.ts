import { Reducer } from 'react';
import { SET_IS_PAUSED, IsPausedAction } from '../actions/IsPausedActions';
import { IsPausedState } from '../state/IsPausedState';

const initialState: IsPausedState = {
    isPaused: false,
};

export const isPausedReducer: Reducer<IsPausedState | undefined, IsPausedAction> = (
    state = initialState,
    action = { type: SET_IS_PAUSED },
) => {
    switch (action.type) {
        case SET_IS_PAUSED:
            return {
                ...state,
                isPaused: action.isPaused ?? false,
            };
        default:
            return state;
    }
};
