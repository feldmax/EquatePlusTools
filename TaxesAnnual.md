# Sheet 'TaxesAnnual' 📈

[A](#column-a) | [B](#column-b) | [C](#column-c) | [D](#column-d) | [E](#column-e) | [F](#column-f) | [G](#column-g)

---

This document provides the breakdown of the single aggregating `QUERY` formula used in the Google Sheet tab **'TaxesAnnual'**. This sheet summarizes the total realized sales, profit, fees, and taxes on an **annual basis** using data from the `Taxes` sheet.

---

### Data Aggregation Query

The following `QUERY` formula is executed once, starting at cell A2, to aggregate sales data from the `Taxes` sheet. It groups the sales records by the transaction year (`year(A)`), and calculates the sum of key financial metrics (Quantity, Sales Values, Profit, Fees, and Taxes) for each year.

~~~
=QUERY(Taxes,"select year(A), sum(C), sum(N), sum(O), sum(P), sum(Q), sum(S)
where A is not null
group by year(A)
order by year(A)
label year(A) 'Year', sum(C) 'Quantity', sum(N) 'Sales Total EUR', sum(O) 'Sales Total ILS', sum(P) 'Profit for tax', sum(Q) 'Sales fees', sum(S) 'Taxes'"
)
~~~

<a id="column-a"></a>
### Column A: Year

This column contains the aggregated **Year** (`year(A)`), which acts as the grouping key for the summary data.

<a id="column-b"></a>
### Column B: Quantity

This column displays the **Total Quantity** (`sum(C)`) of shares sold during that year.

<a id="column-c"></a>
### Column C: Sales Total EUR

This column displays the **Total Gross Sales Value in Euro** (`sum(N)`) realized during that year.

<a id="column-d"></a>
### Column D: Sales Total ILS

This column displays the **Total Gross Sales Value in ILS (NIS)** (`sum(O)`) realized during that year.

<a id="column-e"></a>
### Column E: Profit for tax

This column displays the **Total Nominal Profit for Tax** (`sum(P)`) calculated for the sales that occurred during that year.

<a id="column-f"></a>
### Column F: Sales fees

This column displays the **Total Sales Fees in ILS (NIS)** (`sum(Q)`) incurred during that year.

<a id="column-g"></a>
### Column G: Taxes

This column displays the **Total Capital Gains Tax (25%) in ILS (NIS)** (`sum(S)`) calculated for the profitable sales during that year.
