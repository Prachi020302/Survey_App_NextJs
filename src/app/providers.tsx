"use client";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import AuthProvider from "@/components/Auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import ClientOnly from "@/components/ClientOnly";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
        <ClientOnly>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ClientOnly>
      </AuthProvider>
    </Provider>
  );
};

export default Providers;
