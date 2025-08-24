import { Provider } from "react-redux";
import appRouter from "./router/appRouter";
import { ToastContainer } from "react-toastify";
import ThemeWrapper from "./utils/ThemeWrapper";
import { queryClient } from "./lib/queryClient";
import { RouterProvider } from "react-router-dom";
import { persistAppStore, store } from "./store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <ThemeWrapper>
      <ToastContainer />
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