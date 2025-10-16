import './index.css';
import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from './store/store.js';
import AppWrapper from './Components/common/AppWrapper.jsx';
import { ToastProvider } from './Hooks/useToast.jsx';


if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}



createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <ToastProvider>
        <ToastContainer position='bottom-right' autoClose={2000} />
        <AppWrapper />
      </ToastProvider>
    </Provider>
  </>,
)
