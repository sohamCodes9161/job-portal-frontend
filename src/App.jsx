import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily:
              "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
            fontSize: "14px",
            borderRadius: "10px",
            padding: "12px 16px",
            boxShadow: "0 12px 32px rgba(17, 24, 39, 0.12)",
          },
          success: { iconTheme: { primary: "#059669", secondary: "#fff" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
        }}
      />
      <AppRoutes />
    </>
  );
}

export default App;