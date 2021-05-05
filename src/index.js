import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MaketMaker from './components/MaketMaker'

ReactDOM.render(
  <React.StrictMode>
    <MaketMaker
      onExport={console.log}
      backgroundImage='/images/BB.png'
      layoutImage='/images/B2.png'
    />
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
