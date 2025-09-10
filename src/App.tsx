import { Suspense } from "react";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import appRouter from "./router/appRouter";
import Loading from "./pages/common/Loading";
import { ToastContainer } from "react-toastify";
import ThemeWrapper from "./utils/ThemeWrapper";
import { queryClient } from "./lib/queryClient";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import { setupAxiosInterceptors } from "./lib/axiosInterceptor";
import { persistAppStore, store, type RootState } from "./store/store";

setupAxiosInterceptors();

const AppContent = () => {
  const { theme } = useSelector((state: RootState) => state.app);

  return (
    <ThemeWrapper>
      <ToastContainer theme={theme} autoClose={2500} />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={appRouter} />
      </Suspense>
    </ThemeWrapper>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistAppStore}>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;