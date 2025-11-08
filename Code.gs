// This Google Apps Script is designed to automate the process of creating and updating the ActivitySplit sheet
// based on the raw data in the Activity sheet. The primary function of createActivitySplit() is to implement
// the First-In, First-Out (FIFO) accounting method for stock sales.

// When a "Sell" transaction occurs in the Activity data, the script identifies the oldest open "Buy" lots
// and splits them as necessary to match the sold quantity. It then assigns the "DateOfSale" to the specific lot
// segments that were sold, allowing for accurate profit and tax calculation per sold lot (cost basis tracking).

// The script is triggered either automatically when the Activity List SAP sheet is edited (onEdit function)
// or manually (e.g., via a custom menu or button) by calling createActivitySplit().



// call the createActivitySplit() function when the "Activity List SAP" changes

function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var sheetName = sheet.getName();

  // Check that the changes occurred in the required sheets
  if (sheetName === "Activity List SAP") {
    // Call the function to recreate the table
    createActivitySplit();
  }
}

// create an ActivitySplit table with split rows according to sales transactions

function createActivitySplit() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName('Activity');
  var targetSheet = ss.getSheetByName('ActivitySplit');

  // If the ActivitySplit sheet does not exist, create it
  if (!targetSheet) {
    targetSheet = ss.insertSheet('ActivitySplit');
  } else {
    targetSheet.clear();
  }

  // Get data from the source sheet
  var sourceData = sourceSheet.getDataRange().getValues();
  var headers = sourceData[0];

  // Add a new header: DateOfSale
  headers.push('DateOfSale');

  // Array to store stock packages [date, activity, price, quantity, dateOfSale]
  var packages = [];

  // Process each row
  for (var i = 1; i < sourceData.length; i++) {
    var row = sourceData[i];
    var date = row[0];
    var activity = row[1];
    var price = row[2];
    var quantity = row[3];

    if (!date) continue;

    // If NOT a sale (i.e., a purchase or other non-sale) - add to packages
    if (activity !== "Sell") {
      packages.push([date, activity, price, quantity, '']); // dateOfSale is empty for now
    }
    // If it is a sale - distribute using the FIFO method
    else if (activity === "Sell") {
      var soldAmount = Math.abs(quantity);
      var saleDate = date; // Date of sale

      // Iterate through packages and deduct the sold shares (FIFO logic)
      var j = 0;
      while (j < packages.length && soldAmount > 0) {
        var pkg = packages[j];
        var pkgActivity = pkg[1];
        var available = pkg[3]; // Quantity of shares in the package
        var pkgDateOfSale = pkg[4]; // Current sale date (empty if unsold)

        // Skip sale rows and packages that have already been fully sold
        if (pkgActivity === "Sell" || pkgDateOfSale !== '') {
          j++;
          continue;
        }

        if (available > 0) {
          if (available > soldAmount) {
            // Package is split: part sold, part remains
            var soldFromPackage = soldAmount;
            var remainingInPackage = available - soldAmount;

            // Update the current package (the sold portion) with the sale date
            packages[j] = [pkg[0], pkg[1], pkg[2], soldFromPackage, saleDate];

            // Insert a new package with the remainder (without a sale date)
            packages.splice(j + 1, 0, [pkg[0], pkg[1], pkg[2], remainingInPackage, '']);

            soldAmount = 0;
          } else {
            // The entire package is sold (or exactly matched)
            packages[j][4] = saleDate; // Set the sale date
            soldAmount -= available;
          }
        }

        j++;
      }

      // Add the sale row itself (without a DateOfSale)
      packages.push([date, activity, price, quantity, '']);
    }
  }

  // Form the final result
  var resultData = [headers];
  resultData = resultData.concat(packages);

  // Write to the target sheet
  if (resultData.length > 0) {
    targetSheet.getRange(1, 1, resultData.length, resultData[0].length).setValues(resultData);
  }

  SpreadsheetApp.getUi().alert('The ActivitySplit table has been successfully created!\nTotal rows: ' + (resultData.length - 1));
}
