import { combineReducers, Reducer } from 'redux';

import { RouterReducer, RouterReducerState } from './router';
import { ModuleReducer, ModuleReducerState } from './module';
import { authReducer } from './auth';
import { CohortReducer, CohortReducerState } from './cohort';
import { reducer as formReducer } from 'redux-form'

export type RootReducerState = 
    RouterReducerState 
    & ModuleReducerState 
    & CohortReducerState
    & { auth: {loggedInUser: any} };

export const rootReducer: Reducer<RootReducerState> = combineReducers({
    ...RouterReducer,
    ...ModuleReducer,
    ...CohortReducer,
    auth: authReducer,
    form: formReducer
});
