import "./styles/variables.css";
import "./styles/animations.css";
import "./styles/globals.css";

import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <ContentProvider>
              <AppRoutes />
            </ContentProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
