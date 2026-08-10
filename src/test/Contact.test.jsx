import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Contact from "../pages/Contact.jsx";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

function renderContact() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );
}

describe("Contact", () => {
  it("renders the form and contact details", () => {
    renderContact();
    expect(screen.getByRole("heading", { name: "Leave Us a Message" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Message" })).toBeInTheDocument();
    expect(screen.getByText("Our Details")).toBeInTheDocument();
    expect(screen.getByText(/Masaka Sector, Kicukiro District, Kigali/)).toBeInTheDocument();
  });

  it("shows validation errors for an invalid submission", async () => {
    const user = userEvent.setup();
    renderContact();
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Message is required.")).toBeInTheDocument();
  });

  it("submits valid data to the API", async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ ok: true }),
    });

    renderContact();
    await user.type(screen.getByLabelText("Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Message"), "I would like to book a tour please.");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(await screen.findByText(/Message sent/)).toBeInTheDocument();
    const [, opts] = global.fetch.mock.calls[0];
    expect(opts.method).toBe("POST");
    expect(JSON.parse(opts.body)).toEqual({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I would like to book a tour please.",
    });
  });
});
