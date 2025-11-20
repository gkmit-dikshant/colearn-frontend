import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PublicRoute from "./PublicRoute";
import { MemoryRouter } from "react-router";
import { Navigate } from "react-router";

// Mock Navigate component to test redirect
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div>Redirected to {to}</div>),
  };
});

describe("PublicRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders children when no accessToken in localStorage", () => {
    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Public Page</div>
        </PublicRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Public Page")).toBeInTheDocument();
  });

  it("redirects when accessToken exists", () => {
    localStorage.setItem("accessToken", "dummy-token");

    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Public Page</div>
        </PublicRoute>
      </MemoryRouter>,
    );

    // Navigate mock should render this
    expect(screen.getByText("Redirected to /")).toBeInTheDocument();
  });
});
