import { useSelector } from "react-redux";
import { Loader } from "..";
import AppRouter from "../../Router/AppRouter";

const AppWrapper = () => {
  const isLoading = useSelector((state) => state.loader.loading);

  return (
    <>
        
        {isLoading && <Loader />}
        <AppRouter />
    </>
  )
}

export default AppWrapper;