
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
//Parse.Cloud.define("hello", function(request, response) {
//  response.success("Hello world!");
//});

Parse.Cloud.afterSave("TipReport", function(request, response) {
 
  //Query the Client and increment 1 to the totalTipCount
  var Client = Parse.Object.extend("Client");
  var client = new Parse.Query(Client);
  //Query the table
  client.get(request.object.get("clientId").id, {
    success: function(result) {
      //increment 1 to totalTipCount
      result.increment("totalTipCount");
      //save result
      result.save();
    },
    error: function(object, error) {
      console.log("It was not possible to increment 1 to the totalTipCount of the Client.")
    }
  });
});
 