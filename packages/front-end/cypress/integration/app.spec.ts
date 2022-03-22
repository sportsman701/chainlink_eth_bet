import {
    BETTER_1,
    BETTER_2
} from "smart-contract/scripts/params";
import {formatWithDecimals} from "../../utils/decimal";

describe('2. Front End', () => {
    it('- should navigate to the home page', () => {
        // Start from the index page
        cy.visit('/')

        cy.get('.project-name').contains('ETH Bet')

        // Find a "CONNECT WALLET" button and click
        cy.get('.connect-wallet-btn').click()

        cy.get('h1').contains('Welcome to ETH Bet')
    })

    it('- should load betting data from the deployed contract', () => {
        cy.wait(5000);
        // Display Current ETH price
        cy.get('.current-eth-price').contains('Current ETH Price: $');

        // Display Total Betting MATIC Amount
        cy.get('.total-eth-amount').contains(formatWithDecimals(BETTER_1.fundAmt.add(BETTER_2.fundAmt)));
    })

    it('- should load betters` data from the deployed contract', () => {
        // Display Better1 Address
        cy.get('.better_0 .better-address').contains(BETTER_1.addr);

        // Display Better1 Betting Amount
        cy.get('.better_0 .better-amount').contains("Betting: " + formatWithDecimals(BETTER_1.fundAmt) + " MATIC");

        // Display Better1 Betting Side
        cy.get('.better_0 .better-flag').contains("ETH Price will be " + (BETTER_1.flag ? "over" : "below"));

        // Display Better2 Address
        cy.get('.better_1 .better-address').contains(BETTER_2.addr);

        // Display Better2 Betting Amount
        cy.get('.better_1 .better-amount').contains("Betting: " + formatWithDecimals(BETTER_2.fundAmt) + " MATIC");

        // Display Better2 Betting Side
        cy.get('.better_1 .better-flag').contains("ETH Price will be " + (BETTER_2.flag ? "over" : "below"));
    })
})