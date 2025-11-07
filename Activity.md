# Sheet 'Activity' 📈

[A](#column-a) | [B](#column-b) | [C](#column-c) | [D](#column-d)

---

This document provides the full breakdown of the formulas and logic used in the Google Sheet tab **'Activity'**. This sheet imports and displays the history of positive (purchase) transactions from the `PortfolioActivity` raw data sheet.

---

### Data Import Query

The following `QUERY` formula is executed once, starting at cell A2, to import the transaction history from the `PortfolioActivity` sheet. It filters for entries where the Quantity (`E`) is greater than or equal to zero (representing purchases or certain grants/transfers) and sorts the results by the transaction date (A). The query populates columns A, B, C, and D.

~~~
=QUERY(PortfolioActivity,"select A,B,E,F where (E >= 0) order by A")
~~~

<a id="column-a"></a>
### Column A

This column contains the **Date** (`A`) imported from the `PortfolioActivity` sheet, representing the date of the transaction.

<a id="column-b"></a>
### Column B: Activity

This column contains the **Activity Type** (`B`) imported from the `PortfolioActivity` sheet (e.g., Grant, Purchase).

<a id="column-c"></a>
### Column C: Purchase/Sell price

This column contains the **Purchase/Sell Price** (`E`) imported from the `PortfolioActivity` sheet. For the filtered data, this usually represents the per-unit cost/strike price.

<a id="column-d"></a>
### Column D: Quantity

This column contains the **Quantity** (`F`) imported from the `PortfolioActivity` sheet. Since the query filters for `E >= 0`, this column contains the quantity acquired in the transaction.

<a id="column-e"></a>
### Column E

This column is currently **empty** in the provided sheet structure.
