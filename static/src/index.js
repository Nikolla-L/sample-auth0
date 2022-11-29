import React from 'react'
import ReactDOM from 'react-dom/client'
import * as serviceWorker from './serviceWorker'
import { Auth0Provider } from './react-auth0-spa'
import config from './auth_config.json'
import history from './history'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App'

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl ? appState.targetUrl : window.location.pathname
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      audience={config.audience}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)

serviceWorker.unregister()