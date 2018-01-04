import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import configureStore from './configureStore';
import Home from './components/Home';

export default createServerRenderer(params => {
    return new Promise<RenderResult>((resolve, reject) => {
        const store = configureStore();

        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin
        const app = (
            <Provider store={ store }>
                <Home />
            </Provider>
        );
        renderToString(app);
        
        // Once any async tasks are done, we can perform the final render
        // We also send the redux store state, so the client can continue execution where the server left off
        params.domainTasks.then(() => {
            resolve({
                html: renderToString(app),
                globals: { initialReduxState: store.getState() }
            });
        }, reject); // Also propagate any errors back into the host application
    });
});
