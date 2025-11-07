# Sheet 'Taxes' 📈

[A](#column-a) | [B](#column-b) | [C](#column-c) | [D](#column-d) | [E](#column-e) | [F](#column-f) | [G](#column-g) | [H](#column-h) | [I](#column-i) | [J](#column-j) | [K](#column-k) | [L](#column-l) | [M](#column-m) | [N](#column-n) | [O](#column-o) | [P](#column-p) | [Q](#column-q) | [R](#column-r) | [S](#column-s)

---

This document provides the full breakdown of the formulas and logic used in the Google Sheet tab **'Taxes'**. This sheet calculates the final tax liability and net proceeds for executed sales transactions, consolidating profit calculation, fees, and currency conversions.

---

### Data Import Query

The following `QUERY` formula is executed once, starting at cell A2, to import all necessary data related to sale transactions from the `PortfolioActivity` sheet. It filters for entries where the Activity Type (`B`) is `'Sell'` and calculates the `Quantity` as a positive value by using `-1*F`.

~~~
=QUERY(PortfolioActivity,"select A,E,-1*F where (B = 'Sell') order by A label E 'Sell Price', -1*F 'Quantity'")
~~~

<a id="column-a"></a>
### Column A

This column contains the **Date** (`A`) imported from the `PortfolioActivity` sheet, representing the date of the sale transaction. This date is critical for fetching the exchange rate (I) and looking up the allocated cost (L, M).

<a id="column-b"></a>
### Column B: Sell Price

This column contains the **Sell Price** (`E`) imported from the `PortfolioActivity` sheet, representing the per-unit selling price in the asset's currency (usually EUR).

<a id="column-c"></a>
### Column C: Quantity

This column contains the **Quantity** (`-1*F`) imported from the `PortfolioActivity` sheet, representing the number of units sold.

<a id="column-d"></a>
### Column D

This column is currently **empty** in the provided sheet structure.

<a id="column-e"></a>
### Column E: EquatePlus Payment fee

Calculates the **EquatePlus Payment Fee (in Euro)** based on a default value from the `Status` sheet (`Status!$E7`). This is the default value used if column F is empty.

~~~
={"EquatePlus Payment fee"; ARRAYFORMULA(IF($A2:$A="", "",
IF(ISBLANK($F2:$F), Status!$E7 , $F2:$F)
))}
~~~

<a id="column-f"></a>
### Column F: ℹ️ Adjust Payment fee

This column is reserved for a user to **manually override** the calculated value in Column E. If the user enters a value here, it will be used as the payment fee in Column E instead of the default.

<a id="column-g"></a>
### Column G: EquatePlus Commissions

Calculates the **EquatePlus Commissions (in Euro)** based on a default formula: `5 + (Sell Price (B) * Quantity (C) * 0.3%)`. This is the default value used if column H is empty.

~~~
={"EquatePlus Commissions"; ARRAYFORMULA(IF($A2:$A="", "",
IF(ISBLANK($H2:$H), 5+($B2:$B*$C2:$C*0.3%) , $H2:$H)
))}
~~~

<a id="column-h"></a>
### Column H: ℹ️ Adjust Commissions

This column is reserved for a user to **manually override** the calculated value in Column G. If the user enters a value here, it will be used as the commission in Column G instead of the default.

<a id="column-i"></a>
### Column I: Exchange Rate (day of sale)

Calculates the **NIS/EUR exchange rate** on the day of sale (A) using `GOOGLEFINANCE`. This is the default value used if column J is empty.

~~~
={"Exchange Rate (day of sale)"; ARRAYFORMULA(IF($A2:$A="", "",
IF(ISBLANK($J2:$J), MAP($A2:$A, LAMBDA(date, INDEX(GOOGLEFINANCE("CURRENCY:EURILS" ,"price",date),2,2) )) , $J2:$J)
))}
~~~

<a id="column-j"></a>
### Column J: ℹ️ Adjust Exchange Rate

This column is reserved for a user to **manually override** the calculated value in Column I. If the user enters a value here, it will be used as the exchange rate in Column I instead of the default.

<a id="column-k"></a>
### Column K

This column is currently **empty** in the provided sheet structure.

<a id="column-l"></a>
### Column L: Allocated ILS (purchase day)

Looks up the **original allocated cost in ILS (NIS)** for the shares sold by matching the sale date (A) with the purchase date/sale date in the `SharesSold` sheet, retrieving the `Allocated NIS (purchase day)` value from there.

~~~
={"Allocated ILS (purchase day)"; ARRAYFORMULA(IF($A2:$A="", "",
MAP($A2:$A, LAMBDA(date,
SUMPRODUCT((SharesSold!$D$2:$D=date)*(SharesSold!$B$2:$B)*(SharesSold!$C$2:$C)*(SharesSold!$F$2:$F))
))
))}
~~~

<a id="column-m"></a>
### Column M: Allocated NIS (sell day)

Calculates the **allocated cost in NIS** using the exchange rate on the day of sale (I). It matches the sale date (A) with the `SharesSold` sheet and multiplies the base cost by the exchange rate from Column I.

~~~
={"Allocated NIS (sell day)"; ARRAYFORMULA(IF($A2:$A="", "",
MAP($A2:$A, $I2:$I, LAMBDA(date, gValue,
SUMPRODUCT((SharesSold!$D$2:$D=date)*(SharesSold!$B$2:$B)*(SharesSold!$C$2:$C)*gValue)
))
))}
~~~

<a id="column-n"></a>
### Column N: Sale Value EUR

Calculates the **gross sales proceeds in Euro**: `Sell Price (B) * Quantity (C)`.

~~~
={"Sale Value EUR"; ARRAYFORMULA(IF($A2:$A="", "", $B2:$B*$C2:$C ))}
~~~

<a id="column-o"></a>
### Column O: Sale Value ILS

Calculates the **gross sales proceeds in ILS (NIS)**: `Sale Value EUR (N) * Exchange Rate (day of sale) (I)`.

~~~
={"Sale Value ILS"; ARRAYFORMULA(IF($A2:$A="", "", $B2:$B*$C2:$C*$I2:$I ))}
~~~

<a id="column-p"></a>
### Column P: Profit nominal for tax

Determines the **nominal profit subject to tax** by comparing the profit based on the purchase day exchange rate (`O - L`) with the profit based on the sale day exchange rate (`O - M`), following the Israeli tax rule (taking the smaller absolute value for gain or larger for loss).

~~~
={"Profit nominal for tax"; ARRAYFORMULA(IF($A2:$A="", "",
IF(SIGN($O2:$O - $L2:$L)=SIGN($O2:$O - $M2:$M),
IF(($O2:$O - $L2:$L)>=0,
IF(($O2:$O - $L2:$L)<($O2:$O - $M2:$M), ($O2:$O - $L2:$L), ($O2:$O - $M2:$M)),
IF(($O2:$O - $L2:$L)>($O2:$O - $M2:$M), ($O2:$O - $L2:$L), ($O2:$O - $M2:$M))
),
0
)
))}
~~~

<a id="column-q"></a>
### Column Q: Sales fees ILS

Calculates the **total sales fees in ILS (NIS)**: `(EquatePlus Payment fee (E) + EquatePlus Commissions (G)) * Exchange Rate (day of sale) (I)`.

~~~
={"Sales fees ILS"; ARRAYFORMULA(IF($A2:$A="", "", ($E2:$E+$G2:$G)*$I2:$I ))}
~~~

<a id="column-r"></a>
### Column R: Transferred to bank in Israel

Calculates the **gross amount transferred to the bank** (Sale Value minus all fees) *before* tax deduction: `Sale Value ILS (O) - Sales fees ILS (Q)`.

~~~
={"Transferred to bank in Israel"; ARRAYFORMULA(IF($A2:$A="", "", ($O2:$O - $Q2:$Q) ))}
~~~

<a id="column-s"></a>
### Column S: Tax 25%

Calculates the **25% capital gains tax** due on the real taxable profit: `(Profit nominal for tax (P) - Sales fees ILS (Q)) * 25%`.

~~~
={"Tax 25%"; ARRAYFORMULA(IF($A2:$A="", "", ($P2:$P - $Q2:$Q)*25% ))}
~~~

<a id="column-t"></a>
### Column T: Net amount after taxes

Calculates the **final net amount received** after all fees and taxes: `Sale Value ILS (O) - Sales fees ILS (Q) - Tax 25% (S)`.

~~~
={"Net amount after taxes"; ARRAYFORMULA(IF($A2:$A="", "", ($O2:$O - $Q2:$Q - $S2:$S) ))}
~~~