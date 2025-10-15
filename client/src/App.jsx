import { Loader } from './Components/index.js';
import { useSelector } from 'react-redux';
import AppRouter from './Router/AppRouter.jsx';

function App() {
  const loading = useSelector((state) => state.loader.loading);

  const authUser = useSelector((state) => state.auth.user);
  const authToken = useSelector((state) => state.auth.token);
  console.log(authUser, authToken);
  
  if (loading) {
    return <Loader />
  }

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
