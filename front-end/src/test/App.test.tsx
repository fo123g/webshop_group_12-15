import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test,} from "vitest";
import App from "../components/App.tsx";
import {calculateDiscounts, getTotalAmount,} from "../components/Total1.tsx";

describe(App.name, () => {
    test("should display a Delivery Address section", () => {
        render(<App/>);
        const element =
            screen.getByText("Delivery Address");
        expect(element).toBeInTheDocument();
    });
});

describe('10% rebate test', () => {
    test('applies a 10% rebate if the total exceeds $300', async () => {

        render(<App  />);
        const inputs = screen.getAllByRole('spinbutton');
        const bicycleInput = inputs[1];
        fireEvent.change(bicycleInput, { target: { value: '2' } });


        const discountElement = await screen.findByText(/-\$40/i);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
        const discount = parseFloat(discountElement.textContent.replace(/[^0-9.-]+/g, ""));
        const expectedDiscount = -40;
        expect(discount).toBeCloseTo(expectedDiscount);
    });
});




describe('Zip code to city test', () => {
    test('enters Ballerup for zip code 2750', async () => {
        render(<App />);
        const zipInput = screen.getByLabelText(/Zip Code/i);
        const cityInput = screen.getByLabelText(/City/i);
        fireEvent.change(zipInput, { target: { value: '2750' } });
        await waitFor(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            expect(cityInput.value).toBe('Ballerup');
        });
    });
});

describe('every product will get added to basket', () => {
    test('products gets added to basket', async () => {
        render(<App />);
        const inputs = screen.getAllByRole('spinbutton');
        const goatInput = inputs[0];
        fireEvent.change(goatInput, { target: { value: '1' } });
        const bicycleInput = inputs[1];
        fireEvent.change(bicycleInput, { target: { value: '1' } });
        const songbookInput = inputs[2];
        fireEvent.change(songbookInput, { target: { value: '1' } });
        const cowInput = inputs[3];
        fireEvent.change(cowInput, { target: { value: '1' } });
        const antilopineKangarooInput = inputs[4];
        fireEvent.change(antilopineKangarooInput, { target: { value: '1' } });
        const greyKangarooInput = inputs[5];
        fireEvent.change(greyKangarooInput, { target: { value: '1' } });
        const hoppopotamusInput = inputs[6];
        fireEvent.change(hoppopotamusInput, { target: { value: '1' } });
        const footballInput = inputs[7];
        fireEvent.change(footballInput, { target: { value: '1' } });
        const squirrelInput = inputs[8];
        fireEvent.change(squirrelInput, { target: { value: '1' } });
        const toothbrushInput = inputs[9];
        fireEvent.change(toothbrushInput, { target: { value: '1' } });
        const blobfishInput = inputs[10];
        fireEvent.change(blobfishInput, { target: { value: '1' } });
        const tetherballInput = inputs[11];
        fireEvent.change(tetherballInput, { target: { value: '1' } });
        const chargerInput = inputs[12];
        fireEvent.change(chargerInput, { target: { value: '1' } });
        const sodaInput = inputs[13];
        fireEvent.change(sodaInput, { target: { value: '1' } });
        const flightSuitInput = inputs[14];
        fireEvent.change(flightSuitInput, { target: { value: '1' } });
        const panInput = inputs[15];
        fireEvent.change(panInput, { target: { value: '1' } });

        const subtotalElement = await screen.findByText(/2227.85/i);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
        const subtotal = parseFloat(subtotalElement.textContent.replace(/[^0-9.-]+/g, ""));
        const expectedSubtotal = 2227.85;
        expect(subtotal).toBeCloseTo(expectedSubtotal);
    });
});


describe('calculateDiscounts function', () => {
    test('should return correct discount amount for items', () => {
        // Test case 1: items with quantities less than or equal to 3
        const items1 = [
            { price: 10, quantity: 2 },
            { price: 20, quantity: 1 },
        ];
        expect(calculateDiscounts(items1)).toBe(0); // No discount expected
        
        // Test case 2: items with quantities greater than 3 
        const items2 = [
            { price: 10, quantity: 4 }, // quantity > 3
            { price: 20, quantity: 2 },
        ];
        // Expected discount: (10 * 0.05 * 4) = 2
        expect(calculateDiscounts(items2)).toBe(2);

        // Test case 3: items with subtotal greater than 300
        const items3 = [
            { price: 50, quantity: 2 },
            { price: 100, quantity: 3 },
        ];
        // Expected discount: (50 * 2 + 100 * 3) * 0.10 = 40
        expect(calculateDiscounts(items3)).toBe(40);
    });
});

describe('getTotalAmount function', () => {
    test('should return correct subtotal for items', () => {
        // Mock items data for testing
        const items = [
            { price: 10, quantity: 3 },
            { price: 20, quantity: 1 },
        ];

        // Test getTotalAmount function with the mock items
        expect(getTotalAmount(items)).toBe(50); // Subtotal for the provided items
        
        
        // You can add more test cases as needed
    });
});

describe('amountNeedForDiscount test', () => {
    test('shows true price for discount', () => {
        render(<App />);
        const inputs = screen.getAllByRole('spinbutton');
        const goatInput = inputs[0];
        fireEvent.change(goatInput, { target: { value: '1' } });
        const element = screen.getByText(/add \$295.01 more to your basket for a 10% discount!/i);
        expect(element).toBeInTheDocument();
    });
});

describe('discountMessage test', () => {
    test('Displays the right message', () => {
        render(<App />);
        const inputs = screen.getAllByRole('spinbutton');
        const goatInput = inputs[0];
        fireEvent.change(goatInput, { target: { value: '3' } });
        const element = screen.getByText(/You only need one more to get a 5% discount!/i);
        expect(element).toBeInTheDocument();
    });
});

