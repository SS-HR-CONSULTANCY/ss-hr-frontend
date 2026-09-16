import { Suspense } from "react";
import { Provider } from "react-redux";
import { HeadProvider } from "react-head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkUserStatus } from "./utils/apis/authApi";
import type { AppDispatch } from "./store/store";
import appRouter from "./router/appRouter";
import Loading from "./pages/common/LoadingPage";
import { ToastContainer } from "react-toastify";
import ThemeWrapper from "./utils/ThemeWrapper";
import { queryClient } from "./lib/queryClient";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import { initGA, trackPageView } from "./lib/analytics";
import { setupAxiosInterceptors } from "./lib/axiosInterceptor";
import { persistAppStore, store, type RootState } from "./store/store";

setupAxiosInterceptors();
initGA().catch(console.error);

// Track page views on every route change (outside Router context — no useLocation needed)
appRouter.subscribe((state) => {
  trackPageView(state.location.pathname + state.location.search);
});


const AppContent = () => {
  const { theme } = useSelector((state: RootState) => state.app);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkUserStatus());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <ThemeWrapper>
      <ToastContainer theme={theme} autoClose={1000} />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={appRouter} />
      </Suspense>
    </ThemeWrapper>
  );
};

const App = () => {
  return (
    <div className="h-screen w-full">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistAppStore}>
          <QueryClientProvider client={queryClient}>
            <HeadProvider>
              <AppContent />
            </HeadProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
