import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { Empty, ErrorState, Skeleton, SkeletonGrid } from "../components/ui.jsx";

describe("ErrorBoundary", () => {
  function Bomb() {
    throw new Error("kaboom");
  }

  it("renders a fallback UI when a child throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    spy.mockRestore();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>all good</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("all good")).toBeInTheDocument();
  });
});

describe("UI helpers", () => {
  it("Empty renders a default message", () => {
    render(<Empty />);
    expect(screen.getByText("No content available yet.")).toBeInTheDocument();
  });

  it("ErrorState renders a message and retry button", () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Network failed" onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Network failed");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("Skeleton is marked aria-hidden", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector(".skeleton")).toHaveAttribute("aria-hidden", "true");
  });

  it("SkeletonGrid renders the requested number of cards", () => {
    render(<SkeletonGrid count={3} />);
    expect(document.querySelectorAll(".skeleton-card")).toHaveLength(3);
  });
});
