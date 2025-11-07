# Sheet 'Status' 

## General data

### Row: 5 cells: B-E
Current SAP share price
~~~
= GOOGLEFINANCE("FRA:SAP")
~~~

### Row: 6 cells: B-E
Current exchange rate
~~~
= GOOGLEFINANCE("CURRENCY:EURILS")
~~~

### Row: 7 cells: B-E
EquatePlus Payment fee (tax deductible): `Currency (€)`

### Row: 8 cells: B-E
EquatePlus Commissions (tax deductible): `Percentage`

### Row: 9 cells: B-E
EquatePlus exchange fee (tax deductible): `Percentage`

---

## Current portfolio status

### Row: 13 cells: B-E
Available quantity
~~~
=SUM(Shares!$F$2:$F)
~~~

### Row: 14 cells: B-E
Allocated Euro
~~~
=SUM(Shares!$K$2:$K)
~~~

### Row: 15 cells: B-E
Current Value Euro
~~~
=SUM(Shares!$N$2:$N)
~~~

### Row: 16 cells: B-E
Allocated Shekels
~~~
=SUM(Shares!$L$2:$L)
~~~

### Row: 17 cells: B-E
Current Value in Shekels
~~~
=SUM(Shares!$O$2:$O)
~~~

### Row: 18 cells: B-E
Profit for tax
~~~
=SUM(Shares!$R$2:$R)
~~~

### Row: 19 cells: B-E
EquatePlus Sales Fees (Transaction and Exchange)
~~~
=SUM(Shares!$S$2:$S)+$E6*$E7
~~~

### Row: 20 cells: B-E
Transfer to a bank in Israel
~~~
=$E17-$E19
~~~

### Row: 21 cells: B-E
Tax payable
~~~
=($E18-(SUM(Shares!$S$2:$S)+$E6*$E7))*25%
~~~

### Row: 22 cells: B-E
Amount in bank after taxes
~~~
=$E20-$E21
~~~

### Row: 24 cells: B-E
Weighted average annual return on shares in €
~~~
=SUMPRODUCT(Shares!$X$2:$X, Shares!$F$2:$F, (TODAY()-Shares!$A$2:$A)) /
SUMPRODUCT(Shares!$F$2:$F, (TODAY()-Shares!$A$2:$A))
~~~

### Row: 25 cells: B-E
Weighted average annual return on shares in ₪
~~~
=SUMPRODUCT(Shares!$Y$2:$Y, Shares!$F$2:$F, (TODAY()-Shares!$A$2:$A)) /
SUMPRODUCT(Shares!$F$2:$F, (TODAY()-Shares!$A$2:$A))
~~~

---

## Stock sale simulation data

### Row: 29 cells: B-E
Number of shares for sale: `Numeric`

### Row: 30 cells: B-E
Target SAP share price: `Currency (€)`

### Row: 31 cells: B-E
Exchange rate on the day of sale: `Numeric`

### Row: 32 cells: B-E
EquatePlus Payment fee (tax deductible): `Currency (€)`

### Row: 33 cells: B-E
EquatePlus Commissions (tax deductible): `Percentage`

### Row: 34 cells: B-E
Exchange fee in % (tax deductible): `Percentage`

---

## Stock sale calculation

### Row: 37 cells: B-E
Number of shares for sale:
~~~
=if($E$29<=SUM(Sell!$C2:C), $E$29 , SUM(Sell!$C2:C))
~~~

### Row: 38 cells: B-E
Selling value EUR
~~~
=SUM(Sell!$N$2:$N)
~~~

### Row: 39 cells: B-E
Selling value ILS
~~~
=SUM(Sell!$O$2:$O)
~~~

### Row: 40 cells: B-E
Nominal profit (price on purchase day)
~~~
=SUM(Sell!$P$2:$P)
~~~

### Row: 41 cells: B-E
Nominal profit (price on sale day)
~~~
=SUM(Sell!$Q$2:$Q)
~~~

### Row: 42 cells: B-E
Profit for tax
~~~
=IF(SIGN($E$40)=SIGN($E$41),
IF($E$40>=0,
IF($E$40<$E$41, $E$40, $E$41),
IF($E$40>$E$41, $E$40, $E$41)
),
0
)
~~~

### Row: 43 cells: B-E
EquatePlus Sales Fees (Transaction and Exchange)
~~~
=SUM(Sell!$S$2:$S)+$E31*$E32
~~~

### Row: 44 cells: B-E
Transfer to a bank in Israel
~~~
=$E$39-$E43
~~~

### Row: 45 cells: B-E
Tax payable
~~~
=($E42-(SUM(Sell!$S$2:$S)+$E6*$E7))*25%
~~~

### Row: 46 cells: B-E
Amount in bank after taxes
~~~
=$E$44-$E$45
~~~
