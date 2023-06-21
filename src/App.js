import React, { useState } from 'react';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import '/node_modules/primeflex/primeflex.css'
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { httpClient } from './HttpClient';

import Keycloak from 'keycloak-js';

let initOptions = {
  url: 'http://localhost:8080/',
  realm: 'master',
  clientId: 'react-client',
  onLoad: 'login-required', // check-sso | login-required
  KeycloakResponseType: 'code',

  // silentCheckSsoRedirectUri: (window.location.origin + "/silent-check-sso.html")
}

let kc = new Keycloak(initOptions);

kc.init({
  onLoad: initOptions.onLoad,
  KeycloakResponseType: 'code',
  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html", checkLoginIframe: false,
  pkceMethod: 'S256'
}).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.info("Authenticated");
    console.log('auth', auth)
    console.log('Keycloak', kc)
    console.log('Access Token', kc.token)

    httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

    kc.onTokenExpired = () => {
      console.log('token expired')
    }
  }
}, () => {
  console.error("Authenticated Failed");
});

function App() {

  const [infoMessage, setInfoMessage] = useState('');

  const callBackend = () => {
    // httpClient.get('https://mockbin.com/request')
    httpClient.get('http://localhost:4000/')
  };

  return (
    <div className="App">
      {/* <Auth /> */}
      <div className='grid'>
        <div className='col-12'>
          <h1>My Awesome React App</h1>
        </div>
        <div className='col-12'>
          <h1 id='app-header-2'>Secured with Keycloak</h1>
        </div>
      </div>
      <div className="grid">
        <div className="col">
        <Button onClick={() => { setInfoMessage(kc.authenticated ? 'Authenticated: TRUE' : 'Authenticated: FALSE') }} className="m-1" label='Is Authenticated' />
         
          <Button onClick={() => { kc.login() }} className='m-1' label='Login' severity="success" />
          <Button onClick={() => { setInfoMessage(kc.token) }} className="m-1" label='Show Access Token' severity="info" />
          <Button onClick={() => { setInfoMessage(JSON.stringify(kc.tokenParsed)) }} className="m-1" label='Show Parsed Access token' severity="info" />
          <Button onClick={() => { setInfoMessage(kc.isTokenExpired(5).toString()) }} className="m-1" label='Check Token expired' severity="warning" />
          <Button onClick={() => { kc.updateToken(10).then((refreshed)=>{ setInfoMessage('Token Refreshed: ' + refreshed.toString()) }, (e)=>{setInfoMessage('Refresh Error')}) }} className="m-1" label='Update Token (if about to expire)' />  {/** 10 seconds */}
          <Button onClick={() => { kc.logout({ redirectUri: 'http://localhost:3000/' }) }} className="m-1" label='Logout' severity="danger" />
          
        </div>
      </div>
      <div className='grid'>
      <div className="col">
       <Button onClick={callBackend} className='m-1' label='Send HTTP Request' severity="success" />
      </div>
      </div>

      {/* <div className='grid'>
      <div className='col'>
        <h2>Is authenticated: {kc.authenticated}</h2>
      </div>
        </div> */}


      <div className='grid'>
        <div className='col-2'></div>
        <div className='col-8'>
        <h3>Info Pane</h3>
          <Card>
            <p style={{ wordBreak: 'break-all' }} id='infoPanel'>
              {infoMessage}
            </p>
          </Card>
        </div>
        <div className='col-2'></div>
      </div>



    </div>
  );
}


export default App;
