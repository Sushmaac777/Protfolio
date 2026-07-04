import { Component, type ErrorInfo, type ReactNode } from "react";

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Portfolio UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <div className="empty-state">
            <h2>Something broke.</h2>
            <p>Refresh the page to try again.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

