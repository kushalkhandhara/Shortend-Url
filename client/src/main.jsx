import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import store from '../store/store.js'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
          <ToastContainer/>
          <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
