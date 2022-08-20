import { AnyAction } from "redux";

export const SET_VOLUME = 'SET_VOLUME';

export interface VolumeAction extends AnyAction {
    volume?: number
    type: typeof SET_VOLUME
}