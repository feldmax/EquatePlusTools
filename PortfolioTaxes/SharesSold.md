# Sheet 'SharesSold' 📈

[A](#column-a) | [B](#column-b) | [C](#column-c) | [D](#column-d) | [E](#column-e) | [F](#column-f) | [G](#column-g) | [H](#column-h) | [I](#column-i) | [J](#column-j) | [K](#column-k) | [L](#column-l)

---

This document provides the full breakdown of the formulas and logic used in the Google Sheet tab **'SharesSold'**. This sheet calculates the realized sales values and cost bases for shares that have been sold, based on historical transaction data imported from the `ActivitySplit` sheet.

---

### Data Import Query

The following `QUERY` formula is executed once, starting at cell A2, to import historical sale data from the `ActivitySplit` sheet. It filters for records where the Date of Sale (`E`) is not null, indicating a completed sale transaction, and sorts the results by the purchase date (A). The query populates columns A, B, C, and D.

~~~
=QUERY(ActivitySplit,"select A,C,D,E where E is not null order by A")
~~~

<a id="column-a"></a>
### Column A

This column contains the **Purchase Date** (`A`) imported from the `ActivitySplit` sheet. This date is used for fetching the historical purchase day exchange rate (F).

<a id="column-b"></a>
### Column B: Purchase/Sell price

This column contains the **Purchase/Sell Price** (`C`) imported from the `ActivitySplit` sheet, representing the strike price or cost basis in the asset's currency (usually EUR).

<a id="column-c"></a>
### Column C: Quantity

This column contains the **Quantity** (`D`) imported from the `ActivitySplit` sheet, representing the number of shares sold in that transaction lot.

<a id="column-d"></a>
### Column D: DateOfSale

This column contains the **Date of Sale** (`E`) imported from the `ActivitySplit` sheet. This date is used for fetching the historical sale day exchange rate (G) and share price (J).

<a id="column-e"></a>
### Column E

This column is currently **empty** in the provided sheet structure.

<a id="column-f"></a>
### Column F: Exchange rate (purchase day)

Calculates the **NIS/EUR exchange rate** that was effective on the Purchase Date (A) for each lot using the `GOOGLEFINANCE` function.

~~~
={"Exchange rate (purchase day)"; ARRAYFORMULA(IF($A2:$A="", "",
MAP($A2:$A, LAMBDA(date, INDEX(GOOGLEFINANCE("CURRENCY:EURILS" ,"price",date),2,2) ))
))}
~~~

<a id="column-g"></a>
### Column G: Exchange rate (sell day)

Calculates the **NIS/EUR exchange rate** that was effective on the Date of Sale (D) for each lot using the `GOOGLEFINANCE` function.

~~~
={"Exchange rate (sell day)"; ARRAYFORMULA(IF($D2:$D="", "",
MAP($D2:$D, LAMBDA(date, INDEX(GOOGLEFINANCE("CURRENCY:EURILS" ,"price",date),2,2) ))
))}
~~~

<a id="column-h"></a>
### Column H: Allocated NIS (purchase day)

Calculates the **original cost (allocated value) in Shekels (NIS)** using the exchange rate on the purchase day: `Purchase/Sell price (B) * Quantity (C) * Exchange rate (purchase day) (F)`. This is the tax cost basis in NIS.

~~~
={"Allocated NIS (purchase day)"; ARRAYFORMULA(IF($A2:$A="", "", $B2:$B*$C2:$C*$F2:$F))}
~~~

<a id="column-i"></a>
### Column I: Allocated NIS (sell day)

Calculates the **original cost (allocated value) in Shekels (NIS)** using the exchange rate on the sell day: `Purchase/Sell price (B) * Quantity (C) * Exchange rate (sell day) (G)`.

~~~
={"Allocated NIS (sell day)"; ARRAYFORMULA(IF($A2:$A="", "", $B2:$B*$C2:$C*$G2:$G))}
~~~

<a id="column-j"></a>
### Column J: Share price (sell day)

Fetches the **share price (in Euro)** on the Date of Sale (D) using the `GOOGLEFINANCE` function (based on the example ticker `FRA:SAP`).

~~~
={"Share price (sell day)"; ARRAYFORMULA(IF($D2:$D="", "",
MAP($D2:$D, LAMBDA(date, INDEX(GOOGLEFINANCE("FRA:SAP" ,"price",date),2,2) ))
))}
~~~

<a id="column-k"></a>
### Column K: Sale Value Euro

Calculates the **gross sales proceeds in Euro** for the lot: `Quantity (C) * Share price (sell day) (J)`.

~~~
={"Sale Value Euro"; ARRAYFORMULA(IF($A2:$A="", "", $C2:$C*$J2:$J ))}
~~~

<a id="column-l"></a>
### Column L: Sale Value NIS

Calculates the **gross sales proceeds in Shekels (NIS)**: `Sale Value Euro (K) * Exchange rate (sell day) (G)`.

~~~
={"Sale Value NIS"; ARRAYFORMULA(IF($A2:$A="", "", $C2:$C*$J2:$J*$G2:$G ))}
~~~
