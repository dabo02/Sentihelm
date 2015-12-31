Parse.Cloud.define("receiveSMS", function(request, response) {
  var EncryptionManager = require('cloud/EncryptionManager.js').EncryptionManager;
  var PasswordGenerator = require('cloud/PasswordGenerator.js').PasswordGenerator;

  //Query the client to whom the To number pertains
  var Client = Parse.Object.extend("Client");
  var client = new Parse.Query(Client);
  client.equalTo("smsNumber", request.params.To);
  client.find({
    success:function(results){
      if(results.length==0){
        response.success();
        return;
      }
      var clientObject = results[0];
      //Create a new Tip Report to returned client
      var TipReport = Parse.Object.extend("TipReport");
      var tipReport = new TipReport();

      tipReport.set("clientId", clientObject);
      var passwordGenerator = new PasswordGenerator();
      var password = passwordGenerator.generatePassword(request.params.MessageSid);
      tipReport.set("smsId", request.params.MessageSid);
      var encryptionManager = new EncryptionManager();

      tipReport.set("crimeDescription", {
        __type: "Bytes",
        base64: encryptionManager.encrypt(password, request.params.Body)
      });

      tipReport.set("crimeType", {
        __type: "Bytes",
        base64: encryptionManager.encrypt(password, "SMS Message")
      });

      tipReport.set("smsNumber",{
        __type: "Bytes",
        base64: encryptionManager.encrypt(password, request.params.From)
      });

      tipReport.set("crimeListPosition", 17);

      tipReport.set("crimePositionLatitude", {
        __type: "Bytes",
        base64: encryptionManager.encrypt(password, "0.0")
      });

      tipReport.set("crimePositionLongitude", {
        __type: "Bytes",
        base64: encryptionManager.encrypt(password, "0.0")
      });

      tipReport.save(null, {
        success: function(tipReport) {
          console.log('New object created with objectId: ' + tipReport.id);
          response.success();

        },
        error: function(tipReport, error) {
          console.log('Failed to create new object, with error code: ' + error.message);
          response.error();
        }
      });
    },
    error:function(object,error){
      console.log("Esto Crapio");
      response.error();

    }
  });

});

Parse.Cloud.define("sendSMS",function(request, response){
  // Require and initialize the Twilio module with your credentials
  var client = require('twilio')('AC292ee7535b1b111e650043c1901850f8', 'f63607b6602e568d8930af82955f18f7');

  // Send an SMS message
  client.sendSms({
      to:request.params.To,
      from: request.params.From,
      body: request.params.Body
    }, function(err, responseData) {
      if (err) {
        console.log(err);
      } else {
        console.log(responseData.from);
        console.log(responseData.body);
        response.success();
      }
    }
  );

})

Parse.Cloud.beforeSave("TipReport", function(request,response){
  var Client = Parse.Object.extend("Client");
  var client = new Parse.Query(Client);
  //Query the table
  console.log(request.object.get("clientId").id);

  client.get(request.object.get("clientId").id, {
    success: function(result) {
      if(request.object.get("controlNumber")==undefined){
        result.increment("totalTipCount");
        //save result
        result.save();
        var date = new Date();

        request.object.set("controlNumber", date.getFullYear()+"-"+result.get("totalTipCount"));
      }

      response.success();
    },
    error: function(object, error) {
      console.log("It was not possible to increment 1 to the totalTipCount of the Client.");
    }
  });
});

Parse.Cloud.afterSave("TipReport", function(request, response) {

  //Query the Client and increment 1 to the totalTipCount
  var Client = Parse.Object.extend("Client");
  var client = new Parse.Query(Client);
  //Query the table
  client.get(request.object.get("clientId").id, {
    success: function(result) {
      if(result!=null){
        console.log(result.id);

        if(!request.object.get("emailSent")){
          sendRequest(result, response);
        }
      }
    },
    error: function(object, error) {
      console.log("It was not possible to increment 1 to the totalTipCount of the Client.")
    }


  });


  function  sendRequest (clientObject, response) {

    createRequest('http://sentihelmtesting.elasticbeanstalk.com/new-tip', clientObject);
    sendEmail(request, response, clientObject);

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
        console.log(httpResponse);
      },
      error: function(httpResponse) {
        console.error('Request failed with response code ' + httpResponse.status);
      }


    });
  }

  function sendEmail(request, response, clientObject){
    //Initialize Mailgun
    var Mailgun = require('mailgun');
    Mailgun.initialize('bastaya.mailgun.org', 'key-6hn8wfe4o5-k--6kzt4nclk1df2zyik0');
    var date = request.object.createdAt;
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    var daysArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    var formattedDate = daysArray[date.getDay()] + " " + monthArray[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " at " + date.getHours() +":" +  date.getMinutes()+":" + date.getSeconds();

    //Create html string to send in E-email
    var htmlMsg = "";
    htmlMsg += "<html>";
    htmlMsg += "<head><script src='http://code.jquery.com/jquery-1.11.0.min.js'></script> <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'>  <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js'></script></head>";
    htmlMsg += "<body><div style='margin-left:25%; margin-right:25%;'><center><a href='http://sentihelm.elasticbeanstalk.com'><img src='http://sentihelm.elasticbeanstalk.com/resources/images/sentihelm.png' height='70' width='300'/></a></center><br/><br/><br/>";
    htmlMsg += "<font size ='4'>Hello Officer, <br /><br/><p>A new crime report was submitted to your police department on "+formattedDate+", to see more information visit the SentiHelm Dashboard</p>";
    htmlMsg += "<p><br /><center><a href='http://sentihelm.elasticbeanstalk.com'><button type='button' id='button' class='btn btn-primary'>Visit SentiHelm</button></a></center> <br /></p>"
    htmlMsg += "Kind Regards, <br />The SentiGuard Team</font><br/><br/><br/>";
    htmlMsg += "<center><p><font size = '4'> If you have any question call Customer Support: 813-600-6060</font> <br/><br/>";
    htmlMsg += "<a href='https://www.facebook.com/pages/SentiGuard/391316054350720'><img src='http://sentiguard.com/assets/facebook.png' /></a>";
    htmlMsg +="<a href='https://www.linkedin.com/company/sentiguard?trk=company_logo'><img src ='http://sentiguard.com/assets/linkedin.png'/></a></p></center>"

    htmlMsg +="</div></body> </html>";

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
        subject: "SentiHelm Activity Report",
        html: htmlMsg,
        to: string

      },
      {
        success: function(httpResponse) {
          console.log(httpResponse);
          request.object.set("emailSent", true).save(null,{
            success: function(result){

            },
            error: function (error){
              response.error();
            }
          });
        },
        error: function(httpResponse) {
          console.error(httpResponse);
        }
      });
  }

});
Parse.Cloud.job("removeInactiveStreams", function(request, status) {

  var VideoSession = Parse.Object.extend("VideoSession");
  var sessions = new Parse.Query(VideoSession);
  sessions.notEqualTo("status", "dropped");
  sessions.descending("createdAt");
  sessions.limit(1000);
  console.log("Debug 1");
  sessions.find({
    success:function(results){
      console.log("Debug 2 " + results.length);


      results.forEach(function(result){
        var date = new Date();
        var delayHours = date.getHours() - result.updatedAt.getHours();
        var delayDays = date.getDate() - result.updatedAt.getDate();

        console.log("Days " + date.getDate() + " "+ result.updatedAt.getDate());
        if(delayHours >= 2 || delayDays >0 ){
          result.set("status", "dropped");
          console.log(result.id);
          result.save();
        }
      });
      status.success("Job completed");
    },
    error:function (object, error){
      console.log("Debug 3");
      status.error("Error");

    }
  });

});

Parse.Cloud.job("editUsers", function(request, status) {

  var EncryptionManager = require('cloud/EncryptionManager.js').EncryptionManager;
  var PasswordGenerator = require('cloud/PasswordGenerator.js').PasswordGenerator;

  //Generates the password for the encription manager.
  var passwordGenerator = new PasswordGenerator();

  //Encrypts and decrypts
  var encryptionManager = new EncryptionManager();

  var User = Parse.Object.extend("User");

  var users = ['jblack', 'tbaldwin', 'Parsealoglou', 'gmarksberry',
    'slinville', 'abiddle', 'jblack', 'ntimon', 'tbaldwin',
    'jsmith_admin', 'jsmith'
  ];

  users.forEach(function (username) {
    new Parse.Query(Parse.Object.extend('User'))
      .equalTo('username', username)
      .first()
      .then(function (user) {
        var password = passwordGenerator.generatePassword(username);

        console.log(user);

        user.set('zipCode', {
          __type: 'Bytes',
          base64: encryptionManager.encrypt(password, '41074')
        })
        user.set('phoneNumber', {
          __type: 'Bytes',
          base64: encryptionManager.encrypt(password, '859-261-1471')
        }) // 859-261-1471
        user.set('state', {
          __type: 'Bytes',
          base64: encryptionManager.encrypt(password, 'KY')
        });
        Parse.Cloud.useMasterKey();
        user.save();
      });


  });
});

Parse.Cloud.define("sendNewsletterEmail", function(request,response) {
  var SendGrid = require("sendgrid");
  SendGrid.initialize("snowman28924", "snowman19");
  var html = '<html>  <head>  <style>';
  html +='.text{color:#7E7E7E;font-size:20px;  font-family:Calibri;  }.title{color:black;font-size:30px;font-family:Calibri;}';
  html+= '</style>  </head>  <body style="width:700px; margin-right:auto; margin-left:auto;">';
  html+='<center><img width="350" height="60" src="http://files.parsetfss.com/1c53ade3-84aa-4eb7-a6f1-01297659b655/tfss-9f6b1a35-0ccf-492c-8fd3-25e2cea71142-Logo_Header.png"/>';
  html+='</center><p align="center" class="text">Hey There! This newsletter will give you an insight of what we are working on to meet your Community Policing efforts.  This time the SentiHelm Newsletter bring us news on features added to our platform.';
  html+='</p><p align="center" class="title"><b><font size="6">Data Analysis</font></b></p><p align="center" class="text">';
  html+='Now you can have a more detailed insight of what has been reported through the SentiGuard app in the Data Analysis panel. This chart allows you to see monthly report statistics, in another chart you will be able to see crime type percentages. Daily report charts are available by clicking the preferred month.  Data exportation is available as well, this will create a CSV file that will allow you to integrate this data with other reports.';
  html+='</p><p><center>  <img width="600" height="320" src="http://files.parsetfss.com/deda63a2-83d7-43ed-94b9-f577a507f004/tfss-799f2262-2107-4322-b24d-2fa984a94345-data_analysis.png"/></center></p>';
  html+='</br><center><hr width="100%" height="1px" style="border: 0; border-top: 1px solid #cccccc;"/></center>';
  html+='<p align="center" class="title"><b><font size="6">Chat in Video Stream Panel</font></b></p> <p align="center"  class="text">';
  html+='Video streaming capabilities just got better! When a live video streaming is received, you will see an input field below where you can write instructions to the user. At the same time all communication through microphone is disabled from the police officer, avoiding exposure of conceled users.</p>'
  html+='<p align="center"> <center>  <img width="130" height="230" src="http://files.parsetfss.com/deda63a2-83d7-43ed-94b9-f577a507f004/tfss-ffa25ca9-7465-4713-8cfd-6e5799865c17-Screenshot_2015-02-19-11-30-27.png" alt="Description: Macintosh HD:Users:wilfredonieves:Dropbox:Screenshots:SentiHelm:Screenshot_2015-02-19-11-30-27.png"/>';
  html+='<img width="450" height="250" src="http://files.parsetfss.com/deda63a2-83d7-43ed-94b9-f577a507f004/tfss-d813c72b-2001-4924-99c4-e6162dab5f7d-Screenshot%202015-02-19%2011.34.55.png" /></center></p>';
  html+='</br><center><hr width="100%" height="1px" style="border: 0; border-top: 1px solid #cccccc;"/></center>';
  html+='<p align="center" class="title"><b><font size="6">New Layout for Most Wanted</font></b></p> <p align="center" class="text">';
  html+='Most Wanted new layout comes with a more intuitive interface, displaying a more organized list of profiles in the form of cards, which allows the user to change the order by dragging each card to the desired position.  Instead of having each profile open and making a long list, now you just have to click which profile you want to edit, there you can save your changes or even delete the person from the Most Wanted List.</p>';
  html+='<p><center><img width="600" height="330" src="http://files.parsetfss.com/deda63a2-83d7-43ed-94b9-f577a507f004/tfss-c448aeaf-087d-427f-b3c0-a08226f1f60e-Screenshot%202015-02-19%2012.37.03.png"alt="Description: Macintosh HD:Users:wilfredonieves:Dropbox:Screenshots:SentiHelm:Screenshot 2015-02-19 12.37.03.png"/></center>';
  html+='</p> <p> <center> <table border="0" cellpadding="0"> <tr> <td> <a href="https://www.facebook.com/pages/SentiGuard/391316054350720">  <img src="http://files.parsetfss.com/deda63a2-83d7-43ed-94b9-f577a507f004/tfss-37b06274-c285-41a1-bbea-b5105be3d7da-facebook.png"  width="35px"  height="30px"  /></a>';
  html+='</td> <td width="30px"></td><td><img src="http://files.parsetfss.com/deda63a2-83d7-43ed-94b9-f577a507f004/tfss-a0fc843b-d9f4-44e9-ada0-f4da2ccfe581-phone.png" width="40" height="40"/> </td>';
  html+='<td>813-600-6060</td><td width="30px"></td><td><img src="http://files.parsetfss.com/deda63a2-83d7-43ed-94b9-f577a507f004/tfss-909b21c2-6ae2-4165-a794-bafa7b4f0f80-envelope.png" width="40" height="40"/></td><td>contact@sentiguard.com</td>';
  html+='</tr></table></center></div></p></body></html>';
  SendGrid.sendEmail({
    to: request.params.email,
    from: "SentiHelm-Newsletter<contact@sentiguard.com>",
    subject: "An occasional newsletter highlighing new features on SentiHelm",
    html: html
  }, {
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Uh oh, something went wrong");
    }
  });
});

Parse.Cloud.define("updateUserRole", function(req, res){

  var User = Parse.Object.extend("_User");
  var userQuery = new Parse.Query(User);
  var users = req.params.users;
  var action = req.params.action;
  var role = req.params.role;

  users.forEach(function(user, index){
    userQuery.get(user.objectId).then(function(fetchedUser) {
      if (action === "add") {
        if(role === "employee"){
          fetchedUser.remove("roles", "admin");
        }
        else{
          fetchedUser.remove("roles", "employee");
        }
        Parse.Cloud.useMasterKey();
        fetchedUser.save();

        fetchedUser.addUnique("roles", role);
      }
      else if (action === "remove") {
        fetchedUser.remove("roles", role);
      }
      else {
        return;
      }

      Parse.Cloud.useMasterKey();

      return fetchedUser.save();

    }).then(function(savedUser){
      if(index + 1 === req.params.users.length){
        res.success();
      }
    }).then(null, function(error) {
      res.error(error);
    });
  });
});

Parse.Cloud.define("updatePassword", function(req, res){

  var PasswordGenerator = require('cloud/PasswordGenerator.js').PasswordGenerator;

  //Generates the password for the encription manager.
  var passwordGenerator = new PasswordGenerator();

  var User = Parse.Object.extend("_User");
  var userQuery = new Parse.Query(User);
  var user = req.params.user;
  var prevPass = req.params.prevPass;
  var newPass = req.params.newPass;
  var confirmPass = req.params.confirmPass;


  userQuery.get(user.objectId).then(function(fetchedUser) {

    //Change pass
    if (passwordGenerator.md5(prevPass) === fetchedUser.attributes.userPassword && newPass === confirmPass) {

      //Throw pass incorrect
      fetchedUser.set("password", newPass);
      fetchedUser.set("userPassword", passwordGenerator.md5(newPass));
      Parse.Cloud.useMasterKey();

      fetchedUser.save().then(function(savedUser){
        res.success(savedUser);
      }).then(null, function(error){
        res.error(error);
      });
    } else {
      res.error("Passwords don't match");
    }

  }).then(null, function(error){
    res.error(error);
  });

});

Parse.Cloud.define("deleteUser", function(req, res){

  var User = Parse.Object.extend("_User");
  var userQuery = new Parse.Query(User);
  var users = req.params.users;

  users.forEach(function(user, index){
    userQuery.get(user.objectId).then(function(fetchedUser) {

      Parse.Cloud.useMasterKey();

      return fetchedUser.destroy();

    }).then(function(deletedUser){
      if(index + 1 === req.params.users.length){
        res.success();
      }
    }).then(null, function(error) {
      res.error(error);
    });
  });
});

//TODO replace updateUserRole cloud code with this function
Parse.Cloud.define("updateUser", function(req, res){

  var User = Parse.Object.extend("_User");
  var userQuery = new Parse.Query(User);
  var user = req.params.user;
  var attrs = req.params.attrs;
  var values = req.params.values;
  var action = req.params.action;

  userQuery.get(user.objectId).then(function(user){

    for(var i = 0; i < attrs.length; i++){

      if(action === "delete"){ // on delete only roles and permissions ar unset
        user.unset(attrs[i]);
        if(attrs[i] === "roles"){
          user.addUnique(attrs[i], "user");
        }
      }
      else if(attrs[i] === "roles"){
        if(values[i] === "employee"){
          user.remove(attrs[i], "admin");
        }
        else if(values[i] === "admin"){
          user.remove(attrs[i], "employee");
        }
        else{

        }

        Parse.Cloud.useMasterKey();
        user.save(); //save removed role then add new role

        if(action !== "delete"){
          user.addUnique(attrs[i], values[i]);
          user.addUnique(attrs[i], "user");
        }
      }
      else if(attrs[i] === "email" || attrs[i] === "permissions" || attrs[i] === "password" || attrs[i] === "userPassword"){
        user.set(attrs[i], values[i]);
      }
      else{
        user.set(attrs[i], {
          __type: "Bytes",
          base64: values[i]
        });
      }
    }

    Parse.Cloud.useMasterKey();
    user.save().then(function(savedUser){
      res.success(savedUser);
    }).then(null, function(error){
      res.error(error);
    });
  }).then(null, function(error){
    res.error(error);
  });
});


Parse.Cloud.define('exportTipFeedTrigger', function(response,request){

  console.log(request);
  Parse.Cloud.httpRequest({
    method: "POST",
    url: "https://api.parse.com/1/jobs/exportTipFeed",
    headers: {
      "X-Parse-Application-Id": "ppejTan0nxzC495cG2et1zIlHfkiHGc9ONUYCkNL",
      "X-Parse-Master-Key": "vM4jrDPgyosomU5pxwByYPrxZ39o8DZM8sQ1wpST",
      "Content-Type": "application/json"
    },
    body: {
      "request": request,
      "response": response
    },
    success: function(httpResponse) {
      response.success(httpResponse.text);
    },
    error: function(httpResponse) {
      response.error('Request failed with response code ' + httpResponse.status);
    }
  });
});

Parse.Cloud.job("exportTipFeed", function(request, status){

  Parse.Cloud.useMasterKey();
  console.log("Entro al job" + request);
  //var allTips = [];
  console.log("Entered cc");
  var allTips = "Control Number,First Name,Last Name,Username,Phone,Crime Type,Submitted At,Latitude,Longitude,Crime Description\n";
  var options = request.params;

  var EncryptionManager = require("cloud/EncryptionManager.js").EncryptionManager;
  var PasswordGenerator = require("cloud/PasswordGenerator.js").PasswordGenerator;

  //Generates the password for the encription manager.
  var passwordGenerator = new PasswordGenerator();

  //Encrypts and decrypts
  var encryptionManager = new EncryptionManager();

  function getAllTips(loopCount){


    var TipReport = Parse.Object.extend("TipReport");
    var tipReportQuery = new Parse.Query(TipReport);
    var parseSkipLimit = 10000;

    // If there's a searchString get the username or email associated with that tip.
    if (options.searchString) {
      var usernameQuery = new Parse.Query("_User");
      usernameQuery.startsWith("username", options.searchString);

      var emailQuery = new Parse.Query("_User");
      emailQuery.startsWith("email", options.searchString);

      var innerQuery = Parse.Query.or(usernameQuery, emailQuery);
      tipReportQuery.matchesQuery("user", innerQuery);
    }

    // Starts to find tips on a date greater than or equal to what was specified.
    if (options.registeredOn) {
      tipReportQuery.greaterThanOrEqualTo("createdAt", new Date(options.registeredOn));
    }

    // Gets crimes of a type
    if (parseInt(options.type) && parseInt(options.type) > -1) {
      tipReportQuery.equalTo("crimeListPosition", parseInt(options.type));
    }

    tipReportQuery.equalTo("clientId", {
      __type: "Pointer",
      className: "Client",
      objectId: options.homeClient
    });

    // Sort by date
    tipReportQuery.descending("createdAt");

    tipReportQuery.include("user");


    // Switch between report types
    if (parseInt(options.reportType) > 0) {
      //var reportType = options.reportType.toLowerCase() || 'all';

      // Show only crime reports
      if (parseInt(options.reportType) == 1) {
        tipReportQuery.exists("user");
      }
      // Show only anonymous tips
      if (parseInt(options.reportType) == 2) {
        tipReportQuery.equalTo("user", undefined);
      }

    }

    var limit = 1000;
    var skip = limit * loopCount;

    if (skip > parseSkipLimit) {
      //todo track last tip creation date for parse hack
      //tipReportQuery.lessThanOrEqualTo("createdAt", lastUserCreatedAt); // talk over this
      //skip = 0;
    }

    tipReportQuery.skip(skip);
    tipReportQuery.limit(limit);

    tipReportQuery.find({
      success: function (tips) {
        if(tips.length > 0) {
          tips.forEach(function (singleTip) {

            var tip = singleTip.toJSON();

            if (tip.user) {
              tip.user = singleTip.get("user").toJSON();
              var tipUser = tip.user;
            }

            var passPhrase;
            if (!tip.smsId) {
              passPhrase = passwordGenerator.generatePassword((!!tipUser ? tipUser.username : tip.anonymousPassword), !tipUser);
            } else {
              passPhrase = passwordGenerator.generatePassword(tip.smsId);
            }

            //If not an anonymous tip, get user information
            if (!!tipUser) {
              tip.firstName = encryptionManager.decrypt(passPhrase, tipUser.firstName.base64);
              tip.lastName = encryptionManager.decrypt(passPhrase, tipUser.lastName.base64);
              tip.username = tipUser.username;
              tip.phone = encryptionManager.decrypt(passPhrase, tipUser.phoneNumber.base64);
            } else {
              //Set tip to anonymous if the user was not found
              tip.firstName = "ANONYMOUS";
              tip.lastName = "";
              tip.username = "";
              tip.phone = "";
            }

            //Prepare tip object with the values needed in
            //the front end; coordinates for map, tip control
            //number, and formatted date
            tip.latitude = encryptionManager.decrypt(passPhrase, tip.crimePositionLatitude.base64);
            tip.longitude = encryptionManager.decrypt(passPhrase, tip.crimePositionLongitude.base64)

            tip.controlNumber = tip.objectId + "-" + tip.controlNumber;
            var tempDate = (new Date(tip.createdAt));
            tempDate = tempDate.toDateString() + " - " + tempDate.toLocaleTimeString();
            tip.date = tempDate;
            tip.crimeDescription = tip.crimeDescription ? encryptionManager.decrypt(passPhrase, tip.crimeDescription.base64) : "";
            tip.crimeType = encryptionManager.decrypt(passPhrase, tip.crimeType.base64);
            tip.crimeListPosition = tip.crimeListPosition;

            if (tip.smsNumber) {
              tip.phone = encryptionManager.decrypt(passPhrase, tip.smsNumber.base64);
            }

            allTips += tip.controlNumber + "," + tip.firstName + "," + tip.lastName + "," + tip.username + "," + tip.phone + "," +
            tip.crimeType + "," + tip.date + "," + tip.latitude + "," + tip.longitude + "," + tip.crimeDescription + "\n";

            //var info = {
            //  controlNumber: tip.controlNumber,
            //  firstName: tip.firstName,
            //  lastName: tip.lastName,
            //  username: tip.username,
            //  phone: tip.phone,
            //  crimeType: tip.crimeType,
            //  date: tip.date,
            //  latitude: tip.latitude,
            //  longitude: tip.longitude,
            //  description: tip.crimeDescription
            //};
            //allTips.push(info);
          });

          loopCount++;
          getAllTips(loopCount);
        }
        else{
          //save file to parse
          var CSVExport = Parse.Object.extend("CSVExport");

          var csvExport = new CSVExport();

          var Buffer = require("buffer").Buffer;

          csvExport.set("csvFile", new Parse.File("file", {
            base64: new Buffer(allTips).toString("base64")
          }));

          csvExport.set("client", {
            __type: "Pointer",
            className: "Client",
            objectId: options.homeClient
        });

          csvExport.set("type", "tipFeed");

          csvExport.save().then(function(report){
            //send email using mailgun

            var Mailgun = require("mailgun");
            Mailgun.initialize("bastaya.mailgun.org", "key-6hn8wfe4o5-k--6kzt4nclk1df2zyik0");

            //Create html string to send in E-email
            var htmlMsg = "";
            htmlMsg += "<html>";
            htmlMsg += "<head><script src='http://code.jquery.com/jquery-1.11.0.min.js'></script> <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'>  <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js'></script></head>";
            htmlMsg += "<body><div style='margin-left:25%; margin-right:25%;'><center><a href='http://sentihelm.elasticbeanstalk.com'><img src='http://sentihelm.elasticbeanstalk.com/resources/images/sentihelm.png' height='70' width='300'/></a></center><br/><br/><br/>";
            htmlMsg += "<font size ='4'>Hello Officer, <br /><br/><p>A new TipFeed CSV Export is ready for download</p>";
            htmlMsg += "<p><br /><center><a href='http://sentihelm.elasticbeanstalk.com/csvexports/:'" + report.id + "><button type='button' id='button' class='btn btn-primary'>Download Report</button></a></center> <br /></p>";
            htmlMsg += "Kind Regards, <br />The SentiGuard Team</font><br/><br/><br/>";
            htmlMsg += "<center><p><font size = '4'> If you have any question call Customer Support: 813-600-6060</font> <br/><br/>";
            htmlMsg += "<a href='https://www.facebook.com/pages/SentiGuard/391316054350720'><img src='http://sentiguard.com/assets/facebook.png' /></a>";
            htmlMsg +="<a href='https://www.linkedin.com/company/sentiguard?trk=company_logo'><img src ='http://sentiguard.com/assets/linkedin.png'/></a></p></center>";

            htmlMsg +="</div></body> </html>";

            //Send Email
            Mailgun.sendEmail ({

                from: "SentiGuard App <contact@sentiguard.com>",
                subject: "SentiHelm TipFeed CSV Export Link",
                html: htmlMsg,
                to: options.email

              },
              {
                success: function(httpResponse) {

                },
                error: function(httpResponse) {
                  console.error(httpResponse);
                }
              });

            status.success();
          }).then(null, function(error){
            status.error(error);
          });
        }
      },
      error: function (object, error) {
        // The object was not retrieved successfully.
        console.error("Error fetching tip feed data for export");
        status.error(error);
      }
    });
  }

  getAllTips(0);

});