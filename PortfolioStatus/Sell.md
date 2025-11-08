# Sheet 'Sell' 📈

[A](#column-a) | [B](#column-b) | [C](#column-c) | [D](#column-d) | [E](#column-e) | [F](#column-f) | [G](#column-g) | [H](#column-h) | [I](#column-i) | [J](#column-j) | [K](#column-k) | [L](#column-l) | [M](#column-m) | [N](#column-n) | [O](#column-o) | [P](#column-p) | [Q](#column-q) | [R](#column-r) | [S](#column-s) | [T](#column-t) | [U](#column-u) | [V](#column-v)

---

This document provides the full breakdown of the formulas and logic used in the Google Sheet tab **'Sell'**. This sheet calculates the realized gain/loss, fees, and final net proceeds for a hypothetical sale of shares, applying the **First-In, First-Out (FIFO)** method.

---

### Data Import Query

The following `QUERY` formula is executed once, starting at cell A2, to import the necessary data from the `Portfolio` sheet for all assets classified as `'shares'`. The results are sorted by the purchase date (A). The query populates columns A, B, and C.

~~~
=QUERY(Portfolio,"select A,G,M where (C = 'shares') order by A")
~~~

<a id="column-a"></a>
### Column A

This column contains the **Purchase Date** (`A`) imported from the `Portfolio` sheet. This date is critical for the FIFO logic and historical exchange rate calculation (H).

<a id="column-b"></a>
### Column B: Strike price / Cost basis

This column contains the **Strike Price / Cost Basis** (`G`) imported from the `Portfolio` sheet. This represents the original cost of the shares in Euro (or holding currency).

<a id="column-c"></a>
### Column C: Available quantity

This column contains the **Available Quantity** (`M`) of shares in the lot imported from the `Portfolio` sheet.

<a id="column-d"></a>
### Column D: SUM of shares

Calculates the **running total (cumulative sum)** of available shares in column C. This sum is used as an input for the FIFO logic in Column F.

~~~
={"SUM of shares"; ARRAYFORMULA(IF(ISBLANK($C2:$C), "",
SUMIF(ROW($C$2:$C), "<="&ROW($C2:$C), $C$2:$C)
))}
~~~

<a id="column-e"></a>
### Column E

This column is currently **empty** in the provided sheet structure.

<a id="column-f"></a>
### Column F: Sell shares

Calculates how many shares from the current lot (C) are to be sold based on the total desired sale amount defined in `Status!$E$37`, applying the **FIFO (First-In, First-Out)** method.

~~~
={"Sell shares"; ARRAYFORMULA(IF(ISBLANK($C2:$C), "",
IF(SUMIF(ROW($C$2:$C), "<="&ROW($C2:$C), $C$2:$C) <= Status!$E$37,
$C2:$C,
IF(SUMIF(ROW($C$2:$C), "<"&ROW($C2:$C), $C$2:$C) >= Status!$E$37,
"",
Status!$E$37 - SUMIF(ROW($C$2:$C), "<"&ROW($C2:$C), $C$2:$C)
)
)
))}
~~~

<a id="column-g"></a>
### Column G

This column is currently **empty** in the provided sheet structure.

<a id="column-h"></a>
### Column H: Exchange rate (purchase day)

Fetches the **NIS/EUR exchange rate** on the Purchase Date (A) for each lot using `GOOGLEFINANCE`.

~~~
={"Exchange rate (purchase day)"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "",
MAP($A2:$A, LAMBDA(date, INDEX(GOOGLEFINANCE("CURRENCY:EURILS" ,"price",date),2,2) ))
))}
~~~

<a id="column-i"></a>
### Column I: Exchange rate (target rate)

Retrieves the user-defined **expected NIS/EUR exchange rate** from a reference cell on the 'Status' sheet (`Status!$E$31`). This is used for sales calculation.

~~~
={"Exchange rate (target rate)"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", Status!$E$31))}
~~~

<a id="column-j"></a>
### Column J: Share price (target price)

Retrieves the user-defined **expected share price (€)** for the sale from a reference cell on the 'Status' sheet (`Status!$E$30`).

~~~
={"Share price (target price)"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", Status!$E$30))}
~~~

<a id="column-k"></a>
### Column K: Allocated Euro (purchase day)

Calculates the **original cost in Euros** for the shares sold from this lot: `Strike Price (€) (B) * Sell Shares (F)`.

~~~
={"Allocated Euro (purchase day)"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", $B2:$B*$F2:$F))}
~~~

<a id="column-l"></a>
### Column L: Allocated NIS (purchase day)

Calculates the **original cost in Shekels (NIS)** for the shares sold, using the exchange rate on the purchase day: `Allocated Euro (K) * Exchange rate (purchase day) (H)`. This is the tax cost basis.

~~~
={"Allocated NIS (purchase day)"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", $B2:$B*$F2:$F*$H2:$H))}
~~~

<a id="column-m"></a>
### Column M: Allocated NIS (target rate)

Calculates the original cost in Shekels (NIS) for the shares sold, using the target exchange rate: `Allocated Euro (K) * Exchange rate (target rate) (I)`. Used for tracking purposes.

~~~
={"Allocated NIS (target rate)"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", $B2:$B*$F2:$F*$I2:$I))}
~~~

<a id="column-n"></a>
### Column N: Target Sale Value Euro

Calculates the **gross sales proceeds in Euros**: `Shares to Sell (F) * Target Share Price (€) (J)`.

~~~
={"Target Sale Value Euro"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", $F2:$F*$J2:$J ))}
~~~

<a id="column-o"></a>
### Column O: Target Sale Value NIS

Calculates the **gross sales proceeds in Shekels (NIS)** using the target exchange rate: `Target Sale Value Euro (N) * Target Exchange Rate (I)`.

~~~
={"Target Sale Value NIS"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", $F2:$F*$I2:$I*$J2:$J ))}
~~~

<a id="column-p"></a>
### Column P: Profit nominal (purchase day)

Calculates the **nominal profit** based on the purchase day exchange rate: `Target Sale Value NIS (O) - Allocated NIS (Purchase Day) (L)`. This is the primary profit calculation for tax.

~~~
={"Profit nominal (purchase day)"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", ($O2:$O - $L2:$L) ))}
~~~

<a id="column-q"></a>
### Column Q: Profit nominal (target rate)

Calculates the nominal profit based on the target exchange rate: `Target Sale Value NIS (O) - Allocated NIS (Target Rate) (M)`.

~~~
={"Profit nominal (target rate)"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", ($O2:$O - $M2:$M) ))}
~~~

<a id="column-r"></a>
### Column R: Profit nominal for tax

Determines the **final nominal profit for tax purposes (R)**, comparing the two nominal profits (P and Q) based on their signs, following tax rules.

~~~
={"Profit nominal for tax"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "",
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
### Column S: Target Sales fees (0.3+2.5%)

Calculates the **total estimated EquatePlus fees** (transaction + exchange) based on the total target sale value in NIS: `Target Sale Value NIS (O) * (Transaction Fee + Exchange Fee)` (from `Status!$E33` and `Status!$E34`).

~~~
={"Target Sales fees (0.3+2.5%)"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", ($O2:$O * (Status!$E33+Status!$E34)) ))}
~~~

<a id="column-t"></a>
### Column T: Transfer to bank in Israel

Calculates the **hypothetical gross amount** that would be transferred to an Israeli bank account *before* tax deduction: `Target Sale Value NIS (O) - Target Sales Fees (S)`.

~~~
={"Transfer to bank in Israel"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", ($O2:$O-$S2:$S) ))}
~~~

<a id="column-u"></a>
### Column U: Tax 25%

Calculates the **25% capital gains tax** on the real taxable profit: `(Profit nominal for tax (R) - Target Sales Fees (S)) * 25%`.

~~~
={"Tax 25%"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", (($R2:$R-$S2:$S))*25% ))}
~~~

<a id="column-v"></a>
### Column V: Net amount after tax

Calculates the **final net cash amount received per lot**: `Target Sale Value NIS (O) - Target Sales Fees (S) - Tax 25% (U)`.

~~~
={"Net amount after tax"; ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""), "", ($O2:$O-$S2:$S-$U2:$U) ))}
~~~