# 💰 Portfolio Taxes

# EquatePlus Stock Sale Tax Calculator (Historical Transactions)

## 🎯 Purpose and Functionality

This Google Sheet application is designed to perform a comprehensive financial analysis of all historical stock sale transactions, accurately calculating the tax liability (Capital Gains Tax) for each sale and summarizing the total annual tax owed.

The application achieves two main objectives:

1.  **Per-Transaction Tax Calculation:** Analyzes all past purchase and sale transactions to calculate the precise capital gains tax due for every individual stock sale event.
2.  **Annual Tax Summary:** Aggregates the results to determine the total annual tax liability for every year in which stock sales occurred.

---

## 🛠️ Data Flow and Key Sheets

The application is built around a sequence of data processing sheets:

| Sheet | Role | Key Function |
| :--- | :--- | :--- |
| **Activity List SAP** | Raw Input | Stores the user's raw transaction data downloaded directly from EquatePlus. **User interaction required.** |
| **Activity** | Data Extraction | Automatically filters and prepares essential transaction data from `Activity List SAP`. |
| **ActivitySplit** | Core Logic | (Script-driven) Splits purchase lots and assigns sales to specific lots using the **FIFO (First-In, First-Out)** method to establish the correct cost basis for tax purposes. |
| **SharesSold** | Calculation | Performs detailed per-lot calculations for all segments of stock that have been sold. |
| **Taxes** | Tax Calculation | Calculates the final tax owed for each unique sale transaction, allowing user input for greater accuracy. |
| **TaxesAnnual** | Summary | Aggregates the results from the `Taxes` sheet to provide the total tax liability for each calendar year. |
| **Status** | Dashboard/Output | Displays the summarized tax results from `Taxes` and `TaxesAnnual` in corresponding summary tables. |

---

## 🚀 How to Use the Application

### Phase 1: Setup and Data Import

1.  **Make a Copy:** The original document is in "View only" mode. **Copy the document to your personal Google Drive** to enable editing rights.
2.  **Download Portfolio Data:** Download your transaction history (purchase and sale activity) from the EquatePlus platform, typically as an Excel file.
3.  **Replace Demo Data:** Navigate to the **Activity List SAP** sheet and **replace the abstract demonstration data** with your real transaction data.

### Phase 2: Core Processing (Critical Step)

1.  **Script Execution:** After updating the data in `Activity List SAP`, the built-in Google Apps Script must be run. This script calls the `createActivitySplit()` function, which is critical for updating (deleting and recreating) the records on the **ActivitySplit** sheet.
2.  **Manual Trigger (Required):** Due to current development limitations and instability, the automatic script launch is disabled. **The user must manually run the script.**
    * Click the **green "Refresh" button** on the **Status** page.
    * *Alternatively,* go to `Extensions > Apps Script` and manually call the `createActivitySplit` function from the console.

### ⚠️ Important Note on Script Performance

> This application is currently in development and has known performance issues. The script that updates the **ActivitySplit** sheet is slow and unstable; it may occasionally hang or only execute after 2-3 minutes. **The rebuilding of the ActivitySplit table is critically important for the entire application.** Until this table is successfully updated, the tax calculation tables will display old or incorrect data. You may need to repeat the manual refresh operation several times, but it will eventually succeed.

### Phase 3: Tax Adjustment and Final Results

1.  **Automatic Calculations:** Once `ActivitySplit` is updated, calculations automatically propagate to the **SharesSold** and **Taxes** sheets.
2.  **Optional Data Correction (Taxes Sheet):** On the **Taxes** sheet, the user can manually correct specific data points:
    * **Commissions:** Input the exact commission paid.
    * **Exchange Rate:** Input the precise exchange rate used on the sale day.
    * *Note:* These specific data points can often be found in separate transaction reports from EquatePlus. If the user enters values into the **yellow input fields**, these precise values will be used for the tax calculation. If the fields are left blank, the application will use the default commission values and the official exchange rate for the day of sale.
3.  **Viewing Results:**
    * **TaxesAnnual** sheet calculates the summary of the tax due for each year.
    * Final results from both the `Taxes` and `TaxesAnnual` tables are published in the corresponding summary tables at the bottom of the **Status** sheet.