import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import appRouter from "./router/appRouter";
import { ToastContainer } from "react-toastify";
import ThemeWrapper from "./utils/ThemeWrapper";
import { queryClient } from "./lib/queryClient";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import { persistAppStore, store, type RootState } from "./store/store";
import { setupAxiosInterceptors } from "./components/lib/axiosInterceptor";

setupAxiosInterceptors();

const App = () => {

  const { theme } = useSelector((state: RootState) => state.app);
  return (
    <ThemeWrapper>
      <ToastContainer theme={theme} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistAppStore}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={appRouter} />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ThemeWrapper>
  );
};

export default App;