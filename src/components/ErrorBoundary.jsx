import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Something went wrong." };
  }

  componentDidCatch(error, info) {
    if (typeof console?.error === "function") {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page" role="alert">
          <div className="container error-page__inner">
            <h1>Something went wrong</h1>
            <p>An unexpected error occurred while rendering this page. Please try again.</p>
            {this.state.message && <code className="error-page__code">{this.state.message}</code>}
            <div className="error-page__actions">
              <button type="button" className="btn btn--primary" onClick={this.handleReset}>
                Try again
              </button>
              <a href="/" className="btn btn--outline">
                Back to home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
