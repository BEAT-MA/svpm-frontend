import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function renderNav(settings = []) {
  return render(
    <MemoryRouter>
      <Navbar settings={settings} />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  it("renders the school name and primary links", () => {
    renderNav([{ key: "school_name", value: "SVPM Test" }]);
    expect(screen.getByText("SVPM Test")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About Us" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Apply Now" })).toBeInTheDocument();
  });

  it("falls back to SVPM when no setting is provided", () => {
    renderNav();
    expect(screen.getByText("SVPM")).toBeInTheDocument();
  });

  it("toggles the menu and updates aria-expanded", async () => {
    const user = userEvent.setup();
    renderNav();
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });
});
