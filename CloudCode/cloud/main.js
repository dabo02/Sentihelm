Parse.Cloud.afterSave("TipReport", function(request, response) {

  //Query the Client and increment 1 to the totalTipCount
  var Client = Parse.Object.extend("Client");
  var client = new Parse.Query(Client);
  //Query the table
  client.get(request.object.get("clientId").id, {
    success: function(result) {
    //increment 1 to totalTipCount
    result.increment("totalTipCount");

    sendRequest(result);
    //save result
    result.save();
  },
  error: function(object, error) {
    console.log("It was not possible to increment 1 to the totalTipCount of the Client.")
  }
  });
  function  sendRequest (clientObject) {
    createRequest('http://208.80.239.58:1080/new-tip', clientObject);
    createRequest('http://sentihelm.elasticbeanstalk.com/new-tip', clientObject);
    sendEmail(request, clientObject);

  }

  function createRequest(url, clientObject){
  //Send HTTP Request
  Parse.Cloud.httpRequest({
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    dataType:"json",
    body: {
      "pass":'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@',
        "clientId": clientObject.id
      },

      success: function(httpResponse) {

      },
      error: function(httpResponse) {
        console.error('Request failed with response code ' + httpResponse.status);
      }


    });
  }

  function sendEmail(request, clientObject){
  //Initialize Mailgun
  var Mailgun = require('mailgun');
  Mailgun.initialize('bastaya.mailgun.org', 'key-6hn8wfe4o5-k--6kzt4nclk1df2zyik0');
  //Create html string to send in E-email
  var htmlMsg = "<html><body>You have a new tip report, to see more information visit: <a href='http://sentihelm.elasticbeanstalk.com'>SentiHelm</a> </body> </html>";

  var array = clientObject.get("tipEmail");
  var string = "";
  for (var i = 0; i<array.length; i++){
    if(i==array.length){
      string+=array[i];
    }else{
      string+=array[i]+",";
    }
  }
  //Send Email
  Mailgun.sendEmail ({

    from: "SentiGuard App <contact@sentiguard.com>",
    subject: "subject",
    html: htmlMsg,
    to: string

  },
  {
    success: function(httpResponse) {
      console.log(httpResponse);
    },
    error: function(httpResponse) {
      console.error(httpResponse);
    }
  });
}

});