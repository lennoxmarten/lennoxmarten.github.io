


fetch('VISO_Daten.xlsx').then(function (res) {
  /* get the data as a Blob */
  if (!res.ok) throw new Error("fetch failed");
  return res.arrayBuffer();
})
.then(function (ab) {
  /* parse the data when it is received */
  var data = new Uint8Array(ab);
  var workbook = XLSX.read(data, {
      type: "array"
  });

  // Define the custom value parsers


  /* *****************************************************************
  * DO SOMETHING WITH workbook: Converting Excel value to Json       *
  ********************************************************************/
  var first_sheet_name = workbook.SheetNames[0];
  /* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];

  // Convert the worksheet to an array of JSON objects using the custom value parsers
  let _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

  /************************ End of conversion ************************/

  // Modify the resulting JSON objects
  _JsonData.forEach(obj => {
  obj.Shopsysteme = obj.Shopsysteme.split(',');
});

  console.log("This is the JSON data:", _JsonData);
  console.log(JSON.stringify(_JsonData));
});
