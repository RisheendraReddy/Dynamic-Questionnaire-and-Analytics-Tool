function convert() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s1 = ss.getSheetByName("S1");
  var s2 = ss.getSheetByName("S2");
  
  // range to use is A1:C4, should be a trigger as the project progresses
  var sourceRange = s1.getRange("A1:C4");
  var values = sourceRange.getValues();
  
  function toNum(cell) {
    if (cell === "A") {
      return 1;
    } else if (cell === "B") {
      return 2;
    } else if (cell === "C") {
      return 3;
    } else {
      return cell;
    }
  }
  
  var newVals = values.map(function(row) {
    return row.map(toNum);
  });
  
  // Write
  s2.getRange("A1:C4").setValues(newVals);
}
