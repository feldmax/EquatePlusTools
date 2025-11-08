# Sheet 'Shares' 📈

[A](#column-a) | [B](#column-b) | [C](#column-c) | [D](#column-d) | [E](#column-e) | [F](#column-f) | [G](#column-g) | [H](#column-h) | [I](#column-i) | [J](#column-j) | [K](#column-k) | [L](#column-l) | [M](#column-m) | [N](#column-n) | [O](#column-o) | [P](#column-p) | [Q](#column-q) | [R](#column-r) | [S](#column-s) | [T](#column-t) | [U](#column-u) | [V](#column-v) | [W](#column-w) | [X](#column-x) | [Y](#column-y) | [Z](#column-z) | [AA](#column-aa) | [AB](#column-ab) | [AC](#column-ac) | [AD](#column-ad)

---

This document provides the full breakdown of the formulas and data imported into the Google Sheet tab **'Shares'**. This sheet is dedicated to tracking the **current valuation**, **profitability**, and **tax base** for all currently held share positions derived from the `Portfolio` sheet.

---

### Data Import Query

The following `QUERY` formula is executed once, starting at cell A2, to import all necessary data from the `Portfolio` sheet where the instrument type is `'shares'`, and sorts the results by the purchase date (Column A). The results of this query populate the first six columns (A-F).

~~~
=QUERY(Portfolio,"select A,C,D,F,G,M where (C = 'shares') order by A")
~~~

<a id="column-a"></a>
### Column A

This column contains the **Purchase Date** (`A`) imported from the `Portfolio` sheet. This date is critical for calculating the historical exchange rate (H) and the holding period (AB).

<a id="column-b"></a>
### Column B: Instrument type

This column contains the **Instrument Type** (`C`) imported from the `Portfolio` sheet.

<a id="column-c"></a>
### Column C: Contribution type

This column contains the **Contribution Type** (`D`) imported from the `Portfolio` sheet.

<a id="column-d"></a>
### Column D: Strike price / Cost basis

This column contains the original **Strike Price / Cost Basis** (`G`) in the asset's currency (usually EUR) imported from the `Portfolio` sheet.

<a id="column-e"></a>
### Column E: Available quantity

This column contains the **Available Quantity** (`F`) of shares imported from the `Portfolio` sheet.

<a id="column-f"></a>
### Column F: Instrument

This column contains the **Instrument Name or Ticker** (`M`) imported from the `Portfolio` sheet.

<a id="column-g"></a>
### Column G

This column is currently **empty** in the provided sheet structure.

<a id="column-h"></a>
### Column H: Exchange rate (purchase day)

This column calculates the **NIS/EUR exchange rate** that was effective on the corresponding Purchase Date (Column A) for each lot using the `GOOGLEFINANCE` function.

~~~
={"Exchange rate (purchase day)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", MAP($A2:$A, LAMBDA(date, INDEX(GOOGLEFINANCE("CURRENCY:EURILS" ,"price",date),2,2) )) ))}
~~~

<a id="column-i"></a>
### Column I: Exchange rate (current rate)

This column retrieves the **most recent NIS/EUR exchange rate** using `GOOGLEFINANCE`. This current rate is static and uniform across all rows.

~~~
={"Exchange rate (current rate)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", GOOGLEFINANCE("CURRENCY:EURILS")))}
~~~

<a id="column-j"></a>
### Column J: Share price current

This column retrieves the **current share price** (in Euro, based on the example ticker `FRA:SAP`) using `GOOGLEFINANCE`.

~~~
={"Share price current"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", GOOGLEFINANCE("FRA:SAP")))}
~~~

<a id="column-k"></a>
### Column K: Allocated Euro

Calculates the **original cost of the holding in Euro**: `Available Quantity (E) * Strike price / Cost basis (D)`.

~~~
={"Allocated Euro"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $F2:$F*$E2:$E))}
~~~

<a id="column-l"></a>
### Column L: Allocated NIS (purchase day)

Calculates the **original cost in Shekels (NIS)** using the historical exchange rate: `Allocated Euro (K) * Exchange rate (purchase day) (H)`. This is the base cost for tax purposes.

~~~
={"Allocated NIS (purchase day)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $K2:$K*$H2:$H))}
~~~

<a id="column-m"></a>
### Column M: Allocated NIS (current rate)

Calculates the **original cost in Shekels (NIS)** using the *current* exchange rate: `Allocated Euro (K) * Exchange rate (current rate) (I)`.

~~~
={"Allocated NIS (current rate)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $K2:$K*$I2:$I))}
~~~

<a id="column-n"></a>
### Column N: Current Value EUR

Calculates the **current market value in Euro**: `Available Quantity (E) * Share price current (J)`.

~~~
={"Current Value EUR"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $F2:$F*$J2:$J ))}
~~~

<a id="column-o"></a>
### Column O: Current Value NIS

Calculates the **current market value in Shekels (NIS)**: `Current Value EUR (N) * Exchange rate (current rate) (I)`.

~~~
={"Current Value NIS"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $F2:$F*$J2:$J*$I2:$I ))}
~~~

<a id="column-p"></a>
### Column P: Profit nominal (purchase day)

Calculates the **nominal profit** based on the cost in NIS at the time of purchase: `Current Value NIS (O) - Allocated NIS (purchase day) (L)`.

~~~
={"Profit nominal (purchase day)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", ($O2:$O - $L2:$L) ))}
~~~

<a id="column-q"></a>
### Column Q: Profit nominal (current rate)

Calculates the **nominal profit** based on the cost in NIS using the current exchange rate: `Current Value NIS (O) - Allocated NIS (current rate) (M)`.

~~~
={"Profit nominal (current rate)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", ($O2:$O - $M2:$M) ))}
~~~

<a id="column-r"></a>
### Column R: Profit nominal for tax

Determines the **nominal profit subject to tax** by comparing the two nominal profits (P and Q), following the Israeli tax logic.

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

Calculates an **estimated total sales fee** if sold today (0.3% transaction fee + 2.5% exchange fee), based on the current value in Euro (N) converted to NIS (I) and multiplied by the combined fee rates from the `Status` sheet (`Status!E8+Status!E9`).

~~~
={"Sales fees (0.3+2.5%)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", $I2:$I*$N2:$N*(Status!E8+Status!E9) ))}
~~~

<a id="column-t"></a>
### Column T

This column is currently **empty** in the provided sheet structure.

<a id="column-u"></a>
### Column U: Tax 25%

Calculates the **25% capital gains tax** due on the profit after deducting fees: `(Profit nominal for tax (R) - Sales fees (S)) * 25%`.

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

Calculates the **Annual Percentage Rate (APR)** of return in Euro, based on the current value (N) and allocated Euro (K).

~~~
={"Annual Rate (APR) Euro"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
((($N2:$N/$K2:$K)^(1/((TODAY()-$A2:$A)/365.25*12)))-1)*12
))}
~~~

<a id="column-x"></a>
### Column X: Annual Rate (APR) NIS

Calculates the **Annual Percentage Rate (APR)** of return in NIS, based on the current value (O) and allocated NIS (L).

~~~
={"Annual Rate (APR) NIS"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
((($O2:$O/$L2:$L)^(1/((TODAY()-$A2:$A)/365.25*12)))-1)*12
))}
~~~

<a id="column-y"></a>
### Column Y: SUM of capital allocated

Calculates the **cumulative sum** (running total) of the `Allocated NIS (current rate)` (M) up to the current row.

~~~
={"SUM of capital allocated"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
SUMIF(ROW($M$2:$M), "<="&ROW($M2:$M), $M$2:$M)
))}
~~~

<a id="column-z"></a>
### Column Z

This column is currently **empty** in the provided sheet structure.

<a id="column-aa"></a>
### Column AA: SUM of capital current value

Calculates the **cumulative sum** (running total) of the `Current Value NIS` (O) up to the current row.

~~~
={"SUM of capital current value"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
SUMIF(ROW($O$2:$O), "<="&ROW($O2:$O), $O$2:$O)
))}
~~~

<a id="column-ab"></a>
### Column AB: Number of periods (month)

Calculates the **number of full months** the asset has been held since the Purchase Date (A) until today.

~~~
={"Number of periods (month)"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", DATEDIF($A2:$A,TODAY(),"M") ))}
~~~

<a id="column-ac"></a>
### Column AC: SUM of shares

Calculates the **cumulative sum** (running total) of the `Available Quantity` (E) up to the current row.

~~~
={"SUM of shares"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "",
SUMIF(ROW($F$2:$F), "<="&ROW($F2:$F), $F$2:$F)
))}
~~~

<a id="column-ad"></a>
### Column AD: Transfer to bank in Israel

This column calculates the **hypothetical gross cash amount** that would be available for transfer *before* tax deduction: `Current Value NIS (O) - Sales fees (S)`. *Note: The formula provided for T in the prompt was reused here for the last column that contains a formula.*

~~~
={"Transfer to bank in Israel"; ARRAYFORMULA(IF(ISBLANK($A2:$A), "", ($O2:$O-$S2:$S) ))}
~~~