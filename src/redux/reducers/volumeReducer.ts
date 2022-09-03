import { Reducer } from 'react';
import { SET_VOLUME, VolumeAction } from '../actions/VolumeActions';
import { VolumeState, defaultVolume } from '../state/VolumeState';

const initialState: VolumeState = {
    volume: defaultVolume,
};

export const volumeReducer: Reducer<VolumeState | undefined, VolumeAction> = (
    state = initialState,
    action = { type: SET_VOLUME },
) => {
    switch (action.type) {
        case SET_VOLUME:
            return {
                ...state,
                volume: action.volume ?? 0,
            };
        default:
            return state;
    }
};
