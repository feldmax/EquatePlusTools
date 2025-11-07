# Sheet 'Shares' 📈

[A](#column-a) | [B](#column-b) | [C](#column-c) | [D](#column-d) | [E](#column-e) | [F](#column-f) | [G](#column-g) | [H](#column-h) | [I](#column-i) | [J](#column-j) | [K](#column-k) | [L](#column-l) | [M](#column-m) | [N](#column-n) | [O](#column-o) | [P](#column-p) | [Q](#column-q) | [R](#column-r) | [S](#column-s) | [T](#column-t) | [U](#column-u) | [V](#column-v) | [W](#column-w) | [X](#column-x) | [Y](#column-y) | [Z](#column-z) | [AA](#column-aa) | [AB](#column-ab) | [AC](#column-ac)

---

This document provides the full breakdown of the formulas and data imported into the Google Sheet tab **'Shares'**. This sheet is dedicated to tracking the **current valuation**, **profitability**, and **tax base** for all currently held share positions derived from the `Portfolio` sheet.

---

<a id="column-a"></a>
### Column A: Purchase Date

This column imports the **Purchase Date** (`A`) from the `Portfolio` sheet for all assets classified as 'shares'. This date is crucial for calculating the historical exchange rate (Column H) and the holding period (Column AB).

<a id="column-b"></a>
### Column B: Instrument Type

This column imports the **Instrument Type** (`C`) from the `Portfolio` sheet. Since this query specifically filters for `'shares'`, this column will always display 'shares' for non-header rows.

<a id="column-c"></a>
### Column C: Contribution Type

This column imports the **Contribution Type** (`D`) from the `Portfolio` sheet, which typically indicates the source of the shares (e.g., grant, purchase).

<a id="column-d"></a>
### Column D: Available Quantity (F)

This column imports the **Available Quantity** (`F`) of shares from the `Portfolio` sheet. This is the core data used for calculating all current values.

<a id="column-e"></a>
### Column E: Strike price / Cost basis (G)

This column imports the original **Strike Price / Cost Basis** (`G`) in Euros from the `Portfolio` sheet. This value is used to determine the initial capital allocation in Euro (K).

<a id="column-f"></a>
### Column F: Instrument (M)

This column imports the **Instrument Name or Ticker** (`M`) from the `Portfolio` sheet. This text field identifies the specific stock being held.

<a id="column-g"></a>
### Columns A:F Data Query

This is the initial formula used to populate the first six columns (A-F) with data filtered and ordered from the `Portfolio` sheet.

~~~
=QUERY(Portfolio,"select A,C,D,F,G,M where (C = 'shares') order by A")
~~~

<a id="column-h"></a>
### Column H: Exchange rate (purchase day)

This column calculates the **NIS/EUR exchange rate** that was effective on the corresponding Purchase Date (Column A) for each lot using the `GOOGLEFINANCE` function.

~~~
={"Exchange rate (purchase day)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", MAP($A2:$A, LAMBDA(date, INDEX(GOOGLEFINANCE("CURRENCY:EURILS" ,"price",date),2,2) )) ))}
~~~

<a id="column-i"></a>
### Column I: Exchange rate (current rate)

This column retrieves the **most recent NIS/EUR exchange rate** using `GOOGLEFINANCE`. This value is static and uniform across all rows for the current date.

~~~
={"Exchange rate (current rate)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", GOOGLEFINANCE("CURRENCY:EURILS")))}
~~~

<a id="column-j"></a>
### Column J: Share price current

This column retrieves the **current share price** (in Euro, based on the example ticker `FRA:SAP`) using `GOOGLEFINANCE`. This price is used to calculate the current value of the holding in Euro (N).

~~~
={"Share price current"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", GOOGLEFINANCE("FRA:SAP")))}
~~~

<a id="column-k"></a>
### Column K: Allocated Euro

Calculates the **original cost of the holding in Euro**: `Available Quantity (D) * Strike price / Cost basis (E)`. This represents the initial capital invested in the holding currency.

~~~
={"Allocated Euro"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $F2:$F*$E2:$E))}
~~~

<a id="column-l"></a>
### Column L: Allocated NIS (purchase day)

Calculates the **original cost in Shekels (NIS)** using the historical exchange rate: `Allocated Euro (K) * Exchange rate (purchase day) (H)`. This is the fundamental basis for capital gains tax calculations in Israel.

~~~
={"Allocated NIS (purchase day)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $K2:$K*$H2:$H))}
~~~

<a id="column-m"></a>
### Column M: Allocated NIS (current rate)

Calculates the **original cost in Shekels (NIS)** using the *current* exchange rate: `Allocated Euro (K) * Exchange rate (current rate) (I)`. This value is used purely for tracking profit independent of currency fluctuation.

~~~
={"Allocated NIS (current rate)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $K2:$K*$I2:$I))}
~~~

<a id="column-n"></a>
### Column N: Current Value EUR

Calculates the **current market value in Euro**: `Available Quantity (D) * Share price current (J)`.

~~~
={"Current Value EUR"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $F2:$F*$J2:$J ))}
~~~

<a id="column-o"></a>
### Column O: Current Value NIS

Calculates the **current market value in Shekels (NIS)**: `Current Value EUR (N) * Exchange rate (current rate) (I)`. This is the gross current value in the reporting currency.

~~~
={"Current Value NIS"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $F2:$F*$J2:$J*$I2:$I ))}
~~~

<a id="column-p"></a>
### Column P: Profit nominal (purchase day)

Calculates the **nominal profit** based on the cost in NIS at the time of purchase: `Current Value NIS (O) - Allocated NIS (purchase day) (L)`. This is the profit considered by Israeli tax law before adjustment.

~~~
={"Profit nominal (purchase day)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", ($O2:$O - $L2:$L) ))}
~~~

<a id="column-q"></a>
### Column Q: Profit nominal (current rate)

Calculates the **nominal profit** based on the cost in NIS calculated using the current exchange rate: `Current Value NIS (O) - Allocated NIS (current rate) (M)`.

~~~
={"Profit nominal (current rate)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", ($O2:$O - $M2:$M) ))}
~~~

<a id="column-r"></a>
### Column R: Profit nominal for tax

Determines the **nominal profit subject to tax** by comparing the two nominal profits (P and Q). If they have the same sign (both profit or both loss), it takes the smaller absolute value for gain or the larger absolute value for loss. If signs differ, the profit for tax is zero.

~~~
={"Profit nominal for tax"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
IF(SIGN($P2:$P)=SIGN($Q2:$Q),
IF($P2:$P>=0,
IF($P2:$P<$Q2:$Q, $P2:$P, $Q2:$Q),
IF($P2:$P>$Q2:$Q, $P2:$P, $Q2:$Q)
),
0
)
))}
~~~

<a id="column-s"></a>
### Column S: Sales fees (0.3+2.5%)

Calculates an **estimated total sales fee** if the shares were sold today, based on the current value in Euro (N) converted to NIS (I) and multiplied by the combined fee rates from the `Status` sheet.

~~~
={"Sales fees (0.3+2.5%)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $I2:$I*$N2:$N*(Status!E8+Status!E9) ))}
~~~

<a id="column-t"></a>
### Column T: Transfer to bank in Israel

This column calculates the **hypothetical gross amount** that would be transferred to an Israeli bank account *before* tax deduction: `Current Value NIS (O) - Sales fees (S)`.

~~~
={"Transfer to bank in Israel"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", ($O2:$O-$S2:$S) ))}
~~~

<a id="column-u"></a>
### Column U: Tax 25%

Calculates the **25% capital gains tax** due on the profit, after deducting fees: `(Profit nominal for tax (R) - Sales fees (S)) * 25%`.

~~~
={"Tax 25%"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", ($R2:$R-$S2:$S)*25% ))}
~~~

<a id="column-v"></a>
### Column V: Net amount after tax

Calculates the **final net amount** that would be received if the shares were sold today: `Current Value NIS (O) - Sales fees (S) - Tax 25% (U)`.

~~~
={"Net amount after tax"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", ($O2:$O-$S2:$S-$U2:$U) ))}
~~~

<a id="column-w"></a>
### Column W: Annual Rate (APR) Euro

Calculates the **Annual Percentage Rate (APR)** of return in Euro based on the current value (N), allocated Euro (K), and the holding period. This measures performance in the asset's base currency.

~~~
={"Annual Rate (APR) Euro"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
((($N2:$N/$K2:$K)^(1/((TODAY()-$A2:$A)/365.25*12)))-1)*12
))}
~~~

<a id="column-x"></a>
### Column X: Annual Rate (APR) NIS

Calculates the **Annual Percentage Rate (APR)** of return in NIS based on the current value (O), allocated NIS (L), and the holding period. This measures performance in the reporting currency (NIS).

~~~
={"Annual Rate (APR) NIS"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
((($O2:$O/$L2:$L)^(1/((TODAY()-$A2:$A)/365.25*12)))-1)*12
))}
~~~

<a id="column-y"></a>
### Column Y: SUM of capital allocated

Calculates the **cumulative sum** (running total) of the `Allocated NIS (current rate)` (M) up to the current row. This provides a running total of the capital invested.

~~~
={"SUM of capital allocated"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
SUMIF(ROW($M$2:$M), "<="&ROW($M2:$M), $M$2:$M)
))}
~~~

<a id="column-z"></a>
### Column Z: SUM of capital current value

Calculates the **cumulative sum** (running total) of the `Current Value NIS` (O) up to the current row. This provides a running total of the current market value of all holdings.

~~~
={"SUM of capital current value"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
SUMIF(ROW($O$2:$O), "<="&ROW($O2:$O), $O$2:$O)
))}
~~~

<a id="column-aa"></a>
### Column AA: Number of periods (month)

Calculates the **number of full months** the asset has been held since the Purchase Date (A) until today.

~~~
={"Number of periods (month)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", DATEDIF($A2:$A,TODAY(),"M") ))}
~~~

<a id="column-ab"></a>
### Column AB: SUM of shares

Calculates the **cumulative sum** (running total) of the `Available Quantity` (F) up to the current row. This provides a running total of the number of shares currently held.

~~~
={"SUM of shares"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
SUMIF(ROW($F$2:$F), "<="&ROW($F2:$F), $F$2:$F)
))}
~~~