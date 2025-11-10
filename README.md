
# EquatePlus Tools Repository

Welcome to the **EquatePlus Tools** repository. This project provides detailed documentation, business logic explanations, and formulas used in two sophisticated Google Sheet applications designed for analyzing stocks held and traded via the EquatePlus brokerage platform.

## 🛠️ The Applications

This repository supports two distinct financial tools:

| Application | Primary Purpose | Live Link (Copy to Drive) | Documentation |
| :--- | :--- | :--- | :--- |
| **EquatePlus Portfolio Status** | Real-time valuation, APR calculation, and **sale simulation**. | [Link to Portfolio Status](https://docs.google.com/spreadsheets/d/1ZyRGgCTqMsaAuFo0XkZoU-_OG36x8Gwi4TuUNtRA1n8/edit?usp=sharing) | [PortfolioStatus.md](PortfolioStatus.md) |
| **EquatePlus Portfolio Taxes** | Calculating taxes for **past sales** and creating a formal annual tax report. | [Link to Portfolio Taxes](https://docs.google.com/spreadsheets/d/1Zez_1Qj6c__C5Fbj-gYL7yfAS0aQszpBqvGqTepPdck/edit?usp=sharing) | [PortfolioTaxes.md](PortfolioTaxes.md) |

---

## 🎯 Portfolio Status (Simulation Tool)

### Core Functionality:
* **Estimate the current state of your portfolio in real time.**
* **Calculate the taxes** in the event of a full or partial sale of securities at the current or target share price.
* **Calculate the final amount of shekels** you will receive after taxes.
* Find out the **average annual rate (APR)** of your investments for a general assessment of your SAP stock performance.

## 💰 Portfolio Taxes (Historical Tax Report Tool)

### Core Functionality:
* **Calculate taxes for past sale transactions** (applying the correct FIFO cost basis).
* **Create an annual tax report** summarizing total tax liability by calendar year.

---

## 🚀 Getting Started (General Usage)

The core workflow for both tools involves:

1.  **Preparation:** The source documents are published in **View only** mode and contain dummy data. **You must copy the document to your own Google Account** to gain editing rights.
2.  **Data Acquisition:** Download your portfolio data from your EquatePlus personal cabinet (typically Excel files).
3.  **Data Import:** **Overwrite the demonstration data** in the relevant input sheet with your actual portfolio data.

### Specific Data Requirements:

| Tool | Input Sheet | Required EquatePlus File |
| :--- | :--- | :--- |
| **Portfolio Status** | `Portfolio Details` | Current portfolio data (e.g., `PortfolioDetails_1234567.xlsx`) |
| **Portfolio Taxes** | `Activity List SAP` | Transaction history (e.g., `Activity_List_SAP.xlsx`) |

### Key Usage Steps:

#### Portfolio Status:
* Copy your current portfolio data into the `Portfolio Details` sheet. All calculations will update automatically.

#### Portfolio Taxes:
* Copy your `Activity List` data into the `Activity List SAP` sheet.
* **Crucial Step:** Click the **green "Refresh" button** on the `Status` page to manually execute the script and recreate the `ActivitySplit` table. **(Note: This step can be slow and may require patience!)**
* Verify that the `ActivitySplit` sheet is not empty.

### Data Accuracy Recommendations:

To ensure the highest tax calculation accuracy in the **Portfolio Taxes** tool, it is highly recommended to:
* Download individual **Confirmation of sale** reports (PDFs) from EquatePlus for each past sale transaction.
* Manually enter the exact **commissions paid** and the **Exchange Rates used** into the corresponding yellow input fields on the `Taxes` sheet.

---

## ⚠️ Important Remarks and Troubleshooting

* **Customizable Fields:** You can change the values in the **yellow fields** on the Status and Taxes sheets to customize calculations (e.g., setting a target sale price or overriding the exchange fee).
* **Loading Errors:** If you see **"Loading..."** or **"#VALUE!"** in some fields, wait until all indexes have been retrieved from the Google Finance API. Indexes are automatically updated every 20 minutes.
* **Date Formatting:** Due to variations in regional settings (e.g., between European English and other formats), date formats may cause errors when copying data.
    * If your Excel `PortfolioDetails` file uses a format like Hebrew or Arabic, you may need to convert the **"Allocation Date"** entries to the English GB format (`dd-mmm-yyyy`) *before* copying them to the Google Sheet.
    * To fix this in Excel: Select column A, right-click, choose "Format Cells," select `Number > Custom`, and set type to: `[$-en-GB]d mmm yyyy;@`.
* **Tax Calculation Basis:**
    * Profit and tax calculations are based on the rules applicable to **foreign securities** in Israel [מיסוי ניירות ערך זרים](https://moneyplan.co.il/%D7%9E%D7%99%D7%A1%D7%95%D7%99-%D7%A0%D7%99%D7%99%D7%A8%D7%95%D7%AA-%D7%A2%D7%A8%D7%9A-%D7%96%D7%A8%D7%99%D7%9D/).
    * Taxes are calculated after deducting EquatePlus transaction costs, including the cost of converting euros to shekels. If you plan to transfer funds to an Israeli bank in euros without conversion, set the EquatePlus exchange fee calculation field (yellow cell on the Status page) to **0%**.
* **Tax Optimization Window:** When selling shares, you must declare the income received no later than the first quarter of the following calendar year, providing an opportunity for tax optimization (e.g., deducting losses from other sales).

