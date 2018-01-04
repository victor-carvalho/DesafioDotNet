import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, Store, StoreEnhancerStoreCreator, ReducersMapObject } from 'redux';
import thunk from 'redux-thunk';
import * as StoreModule from './store';
import { ApplicationState, reducer } from './store';

export default function configureStore(initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__ as () => GenericStoreEnhancer;
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk),
        devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
    )(createStore);

    return createStoreWithMiddleware(reducer, initialState) as Store<ApplicationState>;
}
