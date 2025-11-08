
# 📈 PortfolioStatus - EquatePlus Stock Sale Simulation and Portfolio Status Tracker

## 🎯 Purpose and Functionality

This Google Sheet application serves as a dynamic, real-time tool for tracking the status of an EquatePlus stock portfolio and simulating potential stock sales.

The application achieves three main objectives:

1.  **Real-Time Portfolio Valuation:** Provides a current valuation of the entire stock package based on live exchange rates (EUR/ILS) and up-to-date stock indices.
2.  **Sale Simulation and Tax Calculation:** Allows the user to simulate a complete or partial stock sale at a desired price, automatically calculating the transaction costs, capital gains tax (based on Israeli regulations), and the resulting net profit.
3.  **Performance Analysis:** Calculates the **Annual Percentage Rate (APR)** for the entire stock package over the holding period, offering insight into the average weighted annual return.

---

## 🛠️ Key Sheets and Roles

| Sheet | Role | Key Function |
| :--- | :--- | :--- |
| **Portfolio Details** | Input | Stores the user's raw transaction data downloaded from EquatePlus. **User interaction required.** |
| **Shares** | Calculation | Performs detailed, per-lot calculations for the entire portfolio (cost basis, current value, nominal profit, APR). |
| **Sell** | Calculation | Executes the complex calculations for the sale simulation based on the FIFO (First-In, First-Out) method, determining the cost basis and tax liability for the specific shares being sold. |
| **Status** | Dashboard/Output | Displays the summarized results, visual charts, and serves as the primary input area for the sale simulation. |
| **Activity/ActivitySplit** | Data Processing | (Script-driven) Used to clean and structure transaction data for accurate FIFO calculations. |

---

## 🚀 How to Use the Application

### Phase 1: Setup and Data Import

1.  **Make a Copy:** The original document is published in "View only" mode. **The user must copy the document to their own Google Drive** to gain editing rights.
2.  **Download Portfolio Data:** The user must log into their personal EquatePlus account and download their portfolio transaction data, typically as an Excel file.
3.  **Replace Demo Data:** Navigate to the **Portfolio Details** sheet and **replace the abstract demonstration data** with the real transaction data downloaded from the user's EquatePlus portfolio.

### Phase 2: Automatic Portfolio Tracking

1.  **Automatic Calculation:** Once the data in **Portfolio Details** is updated, the **Shares** sheet automatically processes the cost basis and current valuation for all transactions.
2.  **Status Display:** The summarized results for the current portfolio status are immediately published on the **Status** sheet under the **"Current Portfolio Status"** table.
3.  **Visualization:** Charts comparing the cumulative investment value vs. the cumulative current stock value are rendered on the **Status** sheet.
4.  **Real-Time Update:** These tracking data automatically update every 20 minutes to reflect changes in stock prices (via `GOOGLEFINANCE`) and the EUR/ILS exchange rate.

### Phase 3: Stock Sale Simulation

1.  **Input Simulation Data:** Navigate to the **Status** sheet and locate the **"Stock sale simulation data"** table.
2.  **Define Parameters:** The user can specify the following parameters for the simulated sale:
    * **Quantity:** The number of shares to sell.
    * **Target Price:** The desired price per share (€) for the sale. (If the price is left empty, the simulation will use the current real-time stock price.)
3.  **View Results:** The simulation data is automatically processed by the **Sell** sheet (using FIFO logic), and the final results are displayed on the **Status** sheet in the **"Stock sale calculation"** table.

**The main goal of the simulation is to accurately calculate the transactional expenses and the exact capital gains tax liability, providing the user with the true net profit remaining after all deductions.**

---

### 💻 Embedded Google Apps Script Functionality

The application includes an integrated Google Apps Script to manage transaction data:

* **Purpose:** To generate the `ActivitySplit` table from the raw `Activity` data, applying the **FIFO (First-In, First-Out)** cost basis tracking logic to correctly link sold shares to their original purchase lots.
* **Trigger:**
    * **Automatic:** Triggered when the `Activity List SAP` sheet is edited.
    * **Manual:** Can be run manually (e.g., via a custom button on the `Status` sheet or from the Apps Script console) to force an update.