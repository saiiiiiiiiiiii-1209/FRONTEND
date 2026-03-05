// // import React from 'react';
// // import ReactDOM from 'react-dom/client';
// // import './index.css';
// // import App from './App';
// // import reportWebVitals from './reportWebVitals';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { BrowserRouter } from 'react-router-dom';


// // const root = ReactDOM.createRoot(document.getElementById('root'));
// // root.render(
// //   <BrowserRouter>
// //     <App />
// //   </BrowserRouter>
// // );

// // // If you want to start measuring performance in your app, pass a function
// // // to log results (for example: reportWebVitals(console.log))
// // // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// // reportWebVitals();


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter } from 'react-router-dom';

// // ==================== ERROR OVERLAY COMPLETELY DISABLE ====================
// (function disableReactErrorOverlay() {
//   // Development mode mein hi kaam karo
//   if (process.env.NODE_ENV !== 'development') return;

//   // 1. Console errors ko filter karo
//   const originalConsoleError = console.error;
//   console.error = function(...args) {
//     // Appointment wale error ko ignore karo
//     if (args[0]?.includes?.('time slot is already booked')) {
//       return;
//     }
//     // React error overlay related errors ignore karo
//     if (args[0]?.includes?.('React error overlay')) {
//       return;
//     }
//     originalConsoleError.apply(console, args);
//   };

//   // 2. Global error events ko handle karo
//   window.addEventListener('error', function(event) {
//     if (event.message?.includes('time slot is already booked')) {
//       event.preventDefault();
//       event.stopPropagation();
//       return false;
//     }
//   }, true);

//   // 3. Unhandled promise rejections ko handle karo
//   window.addEventListener('unhandledrejection', function(event) {
//     if (event.reason?.message?.includes('time slot is already booked')) {
//       event.preventDefault();
//       return false;
//     }
//   }, true);

//   // 4. React error overlay global hook ko disable karo
//   if (window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__) {
//     window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.errorHandler = () => {};
//   }

//   // 5. React error overlay element ko physically remove karo
//   function removeErrorOverlay() {
//     const selectors = [
//       'iframe[title="React error overlay"]',
//       '.__react-error-overlay',
//       '.react-error-overlay',
//       'div[data-reactroot] + iframe',
//       'body > iframe:last-child',
//       '#webpack-dev-server-client-overlay',
//       '.webpack-error-overlay'
//     ];
    
//     selectors.forEach(selector => {
//       const elements = document.querySelectorAll(selector);
//       elements.forEach(el => {
//         if (el && el.parentNode) {
//           el.style.display = 'none';
//           el.style.visibility = 'hidden';
//           el.style.opacity = '0';
//           el.style.pointerEvents = 'none';
//           el.style.zIndex = '-9999';
//           el.style.position = 'fixed';
//           el.style.top = '-9999px';
//           el.style.left = '-9999px';
//         }
//       });
//     });

//     // Webpack error overlay ko bhi hide karo
//     const webpackOverlay = document.getElementById('webpack-dev-server-client-overlay');
//     if (webpackOverlay) {
//       webpackOverlay.style.display = 'none';
//     }
//   }

//   // Har 100ms mein check karo aur remove karo
//   const interval = setInterval(removeErrorOverlay, 100);
  
//   // DOM change ho tab bhi check karo
//   const observer = new MutationObserver(() => {
//     removeErrorOverlay();
//   });
  
//   observer.observe(document.body, { 
//     childList: true, 
//     subtree: true,
//     attributes: true,
//     attributeFilter: ['style', 'class']
//   });
  
//   // Turant remove karo
//   setTimeout(removeErrorOverlay, 0);
//   setTimeout(removeErrorOverlay, 100);
//   setTimeout(removeErrorOverlay, 500);
//   setTimeout(removeErrorOverlay, 1000);
//   setTimeout(removeErrorOverlay, 2000);

//   // Cleanup on page unload
//   window.addEventListener('beforeunload', () => {
//     clearInterval(interval);
//     observer.disconnect();
//   });

//   console.log('✅ React error overlay disabled successfully');
// })();

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
