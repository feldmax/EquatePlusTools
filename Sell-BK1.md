# Sheet 'Sell' 📈

[A](#column-a) | [B](#column-b) | [C](#column-c) | [D](#column-d) | [E](#column-e) | [H](#column-h) | [I](#column-i) | [J](#column-j) | [K](#column-k) | [L](#column-l) | [M](#column-m) | [N](#column-n) | [O](#column-o) | [P](#column-p) | [Q](#column-q) | [R](#column-r) | [S](#column-s) | [T](#column-t) | [U](#column-u) | [V](#column-v) | [W](#column-w) | [Y](#column-y)

---

This document contains the extracted formulas and queries from the Google Sheet tab **'Sell'**, detailing the per-lot calculation logic for share sales, profit, and tax.

---

<a id="column-a"></a>
## Column A

Data Query: Retrieves the **Purchase Date (A)**, **Strike Price (€) (G)**, and **Available Quantity (M)** for all portfolio entries that are classified as 'shares'. The results are sorted by date.

~~~
=QUERY(
  Portfolio,
  "select A,G,M 
   where (C = 'shares') 
   order by A"
)
~~~

<a id="column-b"></a>
## Column B

Header for the **'Strike price / Cost basis'** column (Value is the retrieved Strike Price from the QUERY in column A).

    Strike price / Cost basis


<a id="column-c"></a>
## Column C

Header for the **'Available quantity'** column (Value is the retrieved Available Quantity from the QUERY in column A).

    Available quantity


<a id="column-d"></a>
## Column D

Cumulative Available Shares: Calculates the **running total (cumulative sum)** of available shares in column C.

    ={"SUM of shares";ARRAYFORMULA(IF(ISBLANK($C2:$C),"",SUMIF(ROW($C$2:$C),"<="&ROW($C2:$C),$C$2:$C)))}


~~~
={"SUM of shares";
  ARRAYFORMULA(
    IF(
      ISBLANK($C2:$C), 
      "", 
      SUMIF(
        ROW($C$2:$C), 
        "<="&ROW($C2:$C), 
        $C$2:$C
      )
    )
  )
}
~~~

---

<a id="column-e"></a>
## Column E

Shares to Sell (FIFO Logic): Calculates how many shares from the current lot (C) will be sold based on the total desired sale amount (`Status!$E$35`), applying the **First-In, First-Out (FIFO)** method.

    ={"Sell shares";ARRAYFORMULA(IF(ISBLANK($C2:$C),"",IF(SUMIF(ROW($C$2:$C), "<="&ROW($C2:$C), $C$2:$C) <= Status!$E$35,$C2:$C,IF(SUMIF(ROW($C$2:$C), "<"&ROW($C2:$C), $C$2:$C) >= Status!$E$35,"",Status!$E$35 - SUMIF(ROW($C$2:$C), "<"&ROW($C2:$C), $C$2:$C)))))}
---

<a id="column-h"></a>
## Column H

Exchange Rate (Purchase Day): Fetches the **NIS/EUR exchange rate** on the purchase date (A) for each lot using `GOOGLEFINANCE`.

    ={"Exchange rate (purchase day)";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",MAP($A2:$A,LAMBDA(date,INDEX(GOOGLEFINANCE("CURRENCY:EURILS" ,"price",date),2,2)))))}
---

<a id="column-i"></a>
## Column I

Exchange Rate (Target): Retrieves the user-defined **expected exchange rate (NIS/EUR)** from a reference cell on the 'Status' sheet (`Status!$E$29`).

    ={"Exchange rate (target rate)";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",Status!$E$29))}
---

<a id="column-j"></a>
## Column J

Share Price (Target): Retrieves the user-defined **expected share price (€)** for the sale from a reference cell on the 'Status' sheet (`Status!$E$28`).

    ={"Share price (target price)";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",Status!$E$28))}
---

<a id="column-k"></a>
## Column K

Allocated Euro (Purchase Day): Calculates the **original cost in Euros** for the shares sold from this lot: Strike Price (€) (B) * Sell Shares (F).

    ={"Allocated Euro (purchase day)";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",$B2:$B*$F2:$F))}
---

<a id="column-l"></a>
## Column L

Allocated NIS (Purchase Day): Calculates the **original cost in Shekels (NIS)** for the shares sold using the exchange rate on the purchase day (K * H). This is the basis for tax calculation.

    ={"Allocated NIS (purchase day)";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",$B2:$B*$F2:$F*$H2:$H))}
---

<a id="column-m"></a>
## Column M

Allocated NIS (Target Rate): Calculates the original cost in Shekels (NIS) for the shares sold using the target exchange rate (K * I). Used for tracking purposes.

    ={"Allocated NIS (target rate)";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",$B2:$B*$F2:$F*$I2:$I))}
---

<a id="column-n"></a>
## Column N

Target Sale Value Euro: Calculates the **gross sales proceeds in Euros**: Shares to Sell (F) * Target Share Price (€) (J).

    ={"Target Sale Value Euro";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",$F2:$F*$J2:$J))}
---

<a id="column-o"></a>
## Column O

Target Sale Value NIS: Calculates the **gross sales proceeds in Shekels (NIS)** using the target exchange rate: Target Sale Value Euro (N) * Target Exchange Rate (I).

    ={"Target Sale Value NIS";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",$F2:$F*$I2:$I*$J2:$J))}
---

<a id="column-p"></a>
## Column P

Profit Nominal (Purchase Day Rate): Calculates the **nominal profit** based on the purchase day exchange rate: Target Sale Value NIS (O) - Allocated NIS (Purchase Day) (L). This is the **primary tax profit calculation**.

    ={"Profit nominal (purchase day)";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",($O2:$O - $L2:$L)))}
---

<a id="column-q"></a>
## Column Q

Profit Nominal (Target Rate): Calculates the nominal profit based on the target exchange rate: Target Sale Value NIS (O) - Allocated NIS (Target Rate) (M). Used for tracking purposes.

    ={"Profit nominal (target rate)";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",($O2:$O - $M2:$M)))}
---

<a id="column-r"></a>
## Column R

Profit Nominal for Tax (Min/Max based on Sign): Determines the final nominal profit for tax purposes (R), comparing the two nominal profits (P and Q) based on their signs. If both signs are the same, it takes the smaller absolute value for gain or the larger absolute value for loss. If signs differ, profit is considered 0.

    ={"Profit nominal for tax";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",IF(SIGN($P2:$P)=SIGN($Q2:$Q),IF($P2:$P>=0,IF($P2:$P<$Q2:$Q, $P2:$P, $Q2:$Q),IF($P2:$P>$Q2:$Q, $P2:$P, $Q2:$Q)),0)))}
---

<a id="column-s"></a>
## Column S

Target Sales Fees: Calculates the **total EquatePlus fees** (transaction + exchange) based on the total target sale value in NIS: Target Sale Value NIS (O) * (Transaction Fee + Exchange Fee).

    ={"Target Sales fees";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",($O2:$O * (Status!$E30+Status!$E31))))}
---

<a id="column-t"></a>
## Column T

Profit for Tax (Real): Calculates the **taxable profit** after deducting the fees from the Nominal Profit for Tax: Profit Nominal for Tax (R) - Target Sales Fees (S).

    ={"Profit for tax real";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",($R2:$R-$S2:$S)))}
---

<a id="column-u"></a>
## Column U

Tax 25%: Calculates the **25% capital gains tax** on the Profit for Tax (Real) (T).

    ={"Tax 25%";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",($T2:$T)*25%))}
---

<a id="column-v"></a>
## Column V

Profit Netto (After Tax): Calculates the **net profit** (75% of the real profit for tax): Profit for Tax (Real) (T) * 75%.

    ={"Profit netto";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",($T2:$T)*75%))}
---

<a id="column-w"></a>
## Column W

Net Amount to Bank in Israel: Calculates the **final cash amount received per lot**: Target Sale Value NIS (O) - Target Sales Fees (S) - Tax 25% (U).

    ={"Net amount to bank in Israel";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",($O2:$O-$S2:$S-$U2:$U)))}
---

<a id="column-y"></a>
## Column Y

Cumulative Net Amount to Bank: Calculates the **running total (cumulative sum)** of the 'Net amount to bank in Israel' (W).

    ={"SUM to bank in Israel";ARRAYFORMULA(IF(($A2:$A="")+($F2:$F=""),"",SUMIF(ROW($W$2:$W),"<="&ROW($W2:$W),$W$2:$W)))}