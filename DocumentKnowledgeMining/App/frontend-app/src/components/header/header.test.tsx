import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from "./header";

describe("Header", () => {
    test("renders Header component", () => {
        render(<Header>Test Header</Header>);
        expect(screen.getByText("Test Header")).toBeInTheDocument();
    });

    test.each([
        ["small", "h-[135px]"],
        ["medium", "h-[180px]"],
        ["large", "h-[268px]"],
    ])("renders Header component with size %s", (size, expectedClass) => {
        render(<Header size={size as "small" | "medium" | "large"}>Test Header</Header>);
        const headerElement = screen.getByRole("banner");
        expect(headerElement).toHaveClass(expectedClass);
    });
});
