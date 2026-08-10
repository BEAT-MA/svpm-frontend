import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NewsArticle from "../pages/NewsArticle.jsx";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

function renderArticle(id = "1") {
  return render(
    <MemoryRouter initialEntries={[`/news-events/${id}`]}>
      <Routes>
        <Route path="/news-events/:id" element={<NewsArticle />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("NewsArticle", () => {
  it("renders the local fallback article when the API is unavailable", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("offline"));
    renderArticle("1");
    expect(await screen.findByRole("heading", { name: "Sports Day" })).toBeInTheDocument();
    expect(screen.getByText(/Our annual Sports Day/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Back to News & Events" })).toBeInTheDocument();
  });

  it("shows an Article Not Found state for an unknown id", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("offline"));
    renderArticle("999");
    expect(await screen.findByRole("heading", { name: "Article Not Found" })).toBeInTheDocument();
  });
});
