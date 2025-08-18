import appRouter from "./router/appRouter";
import ThemeWrapper from "./utils/ThemeWrapper";
import { RouterProvider } from "react-router-dom";

const App = () => {
  return (
    <ThemeWrapper>
      <RouterProvider router={appRouter} />
    </ThemeWrapper>
  );
};

export default App;