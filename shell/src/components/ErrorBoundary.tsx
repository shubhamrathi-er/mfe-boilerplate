import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  name: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <div className="text-sm font-medium text-gray-700">
              Failed to load {this.props.name}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Make sure the micro-app is running
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}