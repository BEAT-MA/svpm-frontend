import { describe, expect, it } from "vitest";
import { formatDate, truncate, currency } from "../lib/hooks.js";

describe("formatDate", () => {
  it("formats an ISO date", () => {
    expect(formatDate("2024-05-10T00:00:00Z")).toBe("May 10, 2024");
  });

  it("returns empty string for falsy input", () => {
    expect(formatDate()).toBe("");
    expect(formatDate(null)).toBe("");
  });

  it("returns the raw string slice for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("truncate", () => {
  it("returns the string unchanged when short", () => {
    expect(truncate("short text")).toBe("short text");
  });

  it("truncates long strings with an ellipsis", () => {
    expect(truncate("a".repeat(200), 10)).toBe("aaaaaaaaaa…");
  });

  it("handles empty input", () => {
    expect(truncate("")).toBe("");
    expect(truncate(null)).toBe("");
  });
});

describe("currency", () => {
  it("formats numbers as USD", () => {
    expect(currency(1500)).toBe("$1,500");
  });

  it("defaults to zero for invalid input", () => {
    expect(currency("abc")).toBe("$0");
    expect(currency(undefined)).toBe("$0");
  });
});
