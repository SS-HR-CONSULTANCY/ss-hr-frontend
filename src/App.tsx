import appRouter from "./router/appRouter";
import { ToastContainer } from "react-toastify";
import ThemeWrapper from "./utils/ThemeWrapper";
import { RouterProvider } from "react-router-dom";

const App = () => {
  return (
    <ThemeWrapper>
      <ToastContainer />
      <RouterProvider router={appRouter} />
    </ThemeWrapper>
  );
};

export default App;