import * as moment from 'moment';
import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { Challenge } from './Models';

export interface CurrentChallenge {
    isView: boolean;
    isLoading: boolean;
    location: string | null;
    errorMessage: string | null;
    challenge: Challenge | null;
}

export interface ApplicationState {
    isLoading: boolean;
    challenges: Challenge[];
    currentChallenge: CurrentChallenge | null;
}

export interface ActionCreators {
    requestLastChallenges: () => Promise<void>;
    sendChallenge: (data: FormData) => Promise<void>;
    requestChallenge: (location: string, isView: boolean) => Promise<void>;
}

interface RequestChallengeAction {
    type: 'REQUEST_CHALLENGE';
}

interface ReceiveChallengeAction {
    type: 'RECEIVE_CHALLENGE';
    challenge: Challenge;
    location: string;
}

interface ReceiveChallengeErrorAction {
    type: 'RECEIVE_CHALLENGE_ERROR';
    message: string;
}

interface ReceiveChallengeUpdateAction {
    type: 'RECEIVE_CHALLENGE_UPDATE';
    isView: boolean;
    challenge: Challenge;
}

interface RequestLastChallengesAction {
    type: 'REQUEST_LAST_CHALLENGES';
}

interface ReceiveLastChallengesAction {
    type: 'RECEIVE_LAST_CHALLENGES';
    challenges: Challenge[];
}

type KnownAction =
    | RequestChallengeAction
    | ReceiveChallengeAction
    | ReceiveChallengeErrorAction
    | ReceiveChallengeUpdateAction
    | RequestLastChallengesAction
    | ReceiveLastChallengesAction;

interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): Promise<any>;
}

function updateChallenge(c: Challenge) {
    const start = moment(c.startTime);

    c.startTime = start.format('DD/MM/YYYY HH:mm:ss');
    c.duration = null;
    if (c.endTime) {
        const end = moment(c.endTime);
        c.endTime = end.format('DD/MM/YYYY HH:mm:ss');
        c.duration = end.diff(start, 'milliseconds');
    }

    return c;
}

export const actionCreators = {
    requestLastChallenges: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch("api/Challenges")
            .then(response => response.json() as Promise<Challenge[]>)
            .then(data => {
                dispatch({
                    type: 'RECEIVE_LAST_CHALLENGES',
                    challenges: data.map(updateChallenge)
                });
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_LAST_CHALLENGES' });

        return fetchTask;
    },
    sendChallenge: (data: FormData): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: 'REQUEST_CHALLENGE' });

        const response = (await fetch(`api/Challenges`, { method: 'POST', body: data })) as Response;
        if (response.ok) {
            const location = response.headers.get('Location') || '';
            const challenge = (await response.json()) as Challenge;

            dispatch({ type: 'RECEIVE_CHALLENGE', challenge: updateChallenge(challenge), location });
        } else if (response.status == 400) {
            const error = (await response.json()) as any;

            dispatch({ type: 'RECEIVE_CHALLENGE_ERROR', message: error.message });
        } else {
            dispatch({ type: 'RECEIVE_CHALLENGE_ERROR', message: "Erro inesperado" });
        }

    },
    requestChallenge: (location: string, isView: boolean): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        if (isView)
            dispatch({ type: 'REQUEST_CHALLENGE' });

        const response = await fetch(location);
        const challenge = (await response.json()) as Challenge;

        dispatch({ type: 'RECEIVE_CHALLENGE_UPDATE', challenge: updateChallenge(challenge), isView });
    }
};

const unloadedState: ApplicationState = { challenges: [], isLoading: false, currentChallenge: null };
const loadingChallenge: CurrentChallenge = {
    isView: false,
    location: null,
    challenge: null,
    isLoading: true,
    errorMessage: null
};

export const reducer: Reducer<ApplicationState> = (state: ApplicationState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CHALLENGE':
            return Object.assign({}, state, {
                currentChallenge: loadingChallenge
            });
        case 'RECEIVE_CHALLENGE':
            return Object.assign({}, state, {
                challenges: [action.challenge].concat(state.challenges),
                currentChallenge: {
                    isView: false,
                    isLoading: false,
                    errorMessage: null,
                    location: action.location,
                    challenge: action.challenge,
                }
            });
        case 'RECEIVE_CHALLENGE_ERROR':
            return Object.assign({}, state, {
                currentChallenge: {
                    isView: false,
                    isLoading: false,
                    location: null,
                    challenge: null,
                    errorMessage: action.message,
                }
            });
        case 'RECEIVE_CHALLENGE_UPDATE':
            return Object.assign({}, state, {
                challenges: state.challenges.map(c => c.id == action.challenge.id ? action.challenge : c),
                currentChallenge: {
                    isLoading: false,
                    errorMessage: null,
                    isView: action.isView,
                    challenge: action.challenge,
                    location: state.currentChallenge && state.currentChallenge.location,
                }
            });
        case 'REQUEST_LAST_CHALLENGES':
            return {
                isLoading: true,
                currentChallenge: null,
                challenges: state.challenges
            };
        case 'RECEIVE_LAST_CHALLENGES':
            return {
                isLoading: false,
                currentChallenge: null,
                challenges: action.challenges,
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
