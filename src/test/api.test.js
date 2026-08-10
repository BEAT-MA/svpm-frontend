import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { api } from "../lib/api.js";

describe("api", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("GET returns parsed JSON", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [1, 2, 3] }),
    });
    const res = await api.list("news");
    expect(res).toEqual({ data: [1, 2, 3] });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/news"),
      expect.any(Object)
    );
  });

  it("POST sends a JSON body", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ ok: true }),
    });
    await api.submitTour({ parentName: "Jane" });
    const [, opts] = global.fetch.mock.calls[0];
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toEqual({ parentName: "Jane" });
  });

  it("throws a message parsed from the error body", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Bad request" }),
    });
    await expect(api.list("news")).rejects.toThrow("Bad request");
  });

  it("passes through an abort signal option", async () => {
    const controller = new AbortController();
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
    await api.list("news", "", { signal: controller.signal });
    const [, opts] = global.fetch.mock.calls[0];
    expect(opts.signal).toBe(controller.signal);
  });
});
