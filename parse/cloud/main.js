Parse.Cloud.beforeSave("TipReport", function(request,response){

  if(request.object.get("showInTipLog")!==false && request.object.get("showInTipLog")!==true){
    // Query the latest sequence number,
    // adds one to it and insert it on the current object
    var Sequence = Parse.Object.extend("Sequence");
    var sequenceNumber = new Parse.Query(Sequence);
    //Query the Sequence singleton and add 1 to the indexNumber property
    sequenceNumber.get("BJzYc7l9Ef", {
      success: function(result) {

        //Get the resulting number and add one to it then insert it on the current record
        request.object.set("rowIndex", result.get("indexNumber")+1);

        //Increment 1 in the sequence table
        result.increment("indexNumber");
        result.save();
        response.success();
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and description.
        response.error();
      }
    });
  }

  else{
    response.success();
  }
});


Parse.Cloud.define("receiveSMS", function(request, response) {
  console.log("Received a new text: " + request.params.From);
  response.success();
});

Parse.Cloud.afterSave("TipReport", function(request, response) {
  if(request.object.get("showInTipLog")!==false && request.object.get("showInTipLog")!==true){
    //Get User object from after save
    var user =request.object.get("user");
    var image;
    var video;
    var audio;
    var userId= "";
    var userFirst="Anonymous";
    var userLast="";
    var userPhone="";
    var listPosition="";
    var channel="disabled-link";
    var isAnon=true;
    var monthArray= new Array ("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");


    //Set Media variables
    if(request.object.get("attachmentPhoto")!==undefined){
      image=request.object.get("attachmentPhoto").url();
    }
    if(request.object.get("attachmentVideo")!==undefined){
      video=request.object.get("attachmentVideo").url();
    }
    if(request.object.get("attachmentAudio")!==undefined){
      audio=request.object.get("attachmentAudio").url();
    }

    if(request.object.get("crimeListPosition")!==undefined){
      listPosition=request.object.get("crimeListPosition");
    }

    // Client class object and its query
    var Client = Parse.Object.extend("Client");
    var clientQuery = new Parse.Query(Client);

    // Get the client from the received tip.
    var clientObj = request.object.get("clientId");
    var clientId = JSON.parse(JSON.stringify(clientObj)).objectId;

    // Get client id of the received tip and increment
    // the total tip count for the corresponding client.
    clientQuery.get(clientId, {
      success: function(client) {

        //Increment 1 in the table
        client.increment("totalTipCount");
        client.save();
      },
      error: function(object, error) {

        // The object was not retrieved successfully.
        // error is a Parse error with an error code and description.
        console.log("Error incrementing the count for the client. Code " + error.code + ":  " + error.message);
      }
    });

    //If the user is anonymous
    if(user!==undefined){
      var lat=request.object.get("latitude");
      var lon=request.object.get("longitude");
      userId=user.id;
      var date = new Date(request.object.createdAt);
      var dateString = monthArray[date.getMonth()] +" "+ date.getDate()+", "+ date.getFullYear() +" - "+date.getHours() +":"+date.getMinutes()+":"+date.getSeconds();
      channel="user_"+userId.toString();
      isAnon=false;
      //Build query statement to get data from Users table
      var userClass = Parse.Object.extend("User");
      var query = new Parse.Query(userClass);

      //Query the user table to get non-anonymous user information
      query.get(user.id, {
        success: function(result) {
          //Get data from user id
          userFirst=result.get("firstName");
          userLast=result.get("lastName");
          userPhone=result.get("phoneNumber");


          //Send HTTP Request
          Parse.Cloud.httpRequest({
            method: 'POST',
            url: 'http://sentihelm.elasticbeanstalk.com/tips',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            dataType:"json",
            body: {
              "controlNumber":request.object.id,
              "objectId":userId,
              "firstName":userFirst,
              "lastName":userLast,
              "phone":userPhone,
              "channel":channel,
              "anonymous":isAnon,
              "date":dateString,
              "crimeListPosition":request.object.get("crimeListPosition"),
              "center":{
                "latitude":lat,
                "longitude":lon
              },
              "crimeType":request.object.get("crimeType"),
              "crimeDescription":request.object.get("crimeDescription"),
              "imageUrl":image,
              "videoUrl":video,
              "audioUrl":audio,
              "rowIndex":request.object.get("rowIndex"),
              "pass":"bahamut"

            },

            success: function(httpResponse) {
              console.log(httpResponse);
              console.log(userFirst+", "+userLast+", "+ userPhone);
            },
            error: function(httpResponse) {
              console.error('Request failed with response code ' + httpResponse.status);
            }


          });


          sendEmail(request);


        },
        error: function(object, error) {

        }
      });
    }
    else {
      var date = new Date(request.object.createdAt);
      var dateString = monthArray[date.getMonth()] +" "+ date.getDate()+", "+ date.getFullYear() +" - "+date.getHours() +":"+date.getMinutes()+":"+date.getSeconds();

      //Send HTTP Request
      Parse.Cloud.httpRequest({
        method: 'POST',
        url: 'http://sentihelm.elasticbeanstalk.com/tips',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        dataType:"json",
        body: {
          "controlNumber":request.object.id,
          "anonymous":isAnon,
          "firstName":"ANONYMOUS",
          "lastName":"",
          "date":dateString,
          "crimeType":request.object.get("crimeType"),
          "crimeDescription":request.object.get("crimeDescription"),
          "crimeListPosition":request.object.get("crimeListPosition"),
          "imageUrl":image,
          "videoUrl":video,
          "audioUrl":audio,
          "rowIndex":request.object.get("rowIndex"),
          "pass":"bahamut"

        },

        success: function(httpResponse) {
          console.log(httpResponse);
          console.log(userFirst+", "+userLast+", "+ userPhone);
        },
        error: function(httpResponse) {
          console.error('Request failed with response code ' + httpResponse.status);
        }


      });
      sendEmail(request);


    }

    function sendEmail( request){
      //Initialize Mailgun
      var Mailgun = require('mailgun');
      Mailgun.initialize('bastaya.mailgun.org', 'key-6hn8wfe4o5-k--6kzt4nclk1df2zyik0');
      //Create html string to send in E-email
      var htmlMsg = "";
      htmlMsg += '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8" /><title></title></head><body>';
      if(user!==undefined){
        htmlMsg+='<table style="border: 1px solid #219EF9;" width="100%" height="200px">';
      }else{
        htmlMsg+='<table style="border: 1px solid #FF6600;" width="100%" height="200px">';
      }
      htmlMsg+='<tr style="border: 1px solid #219EF9;"><td colspan="3" height="40px" style="background-color:#4D4D4D">';
      if(user!==undefined){
        htmlMsg+='<div style="float:left; width:85%; font-weight:300; font-size:16px; color:white;"><center>'+userFirst + " "+ userLast+'</center></div>';
        htmlMsg+='<div style="right:0; float:right;padding:2px; color:white; font-size:14px; margin-right:4px; background-color:#219EF9;"><center> '+request.object.id+'</center></div></td></tr>';

      }else{
        htmlMsg+='<div style="float:left; width:85%; font-weight:300; font-size:16px; color:#FF6600;"><center>'+userFirst + " "+ userLast+'</center></div>';
        htmlMsg+='<div style="right:0; float:right;padding:2px; color:white; font-size:14px; margin-right:4px; background-color:#FF6600;"><center> '+request.object.id+'</center></div></td></tr>';

      }

      htmlMsg+='<tr style="border: 1px solid #219EF9;"><td width="25% valign="top" style="background-color:#CCCCCC">';
      htmlMsg+='<center>';
      htmlMsg+='<img src="http://199.85.204.123/fb_images/'+listPosition+'.png" height="150px" width="150px" style="margin-top:0px; " />';
      htmlMsg+='<br /><b>'+request.object.get("crimeType")+' </b> <br /><br /><b>CONTACT USER</b><br />';
      htmlMsg+=userPhone+'</center></td>';

      htmlMsg+='<td width="50%" valign="top"><center>';
      htmlMsg+='<div style="background-color:#CCCCCC">';
      //Show video
      if(request.object.get("attachmentVideo") !== undefined)
        {
          htmlMsg+='<a href='+video+'><img src="http://files.parsetfss.com/d5d1b985-6387-4477-9d38-4a443bcd7532/tfss-a5a2af4c-672f-4a28-89ff-8247ed82a74e-rec_rover-01.png" height="60px" width="60px" /></a>';

        }else{
          htmlMsg+='<img src="http://files.parsetfss.com/d5d1b985-6387-4477-9d38-4a443bcd7532/tfss-a5a2af4c-672f-4a28-89ff-8247ed82a74e-rec_rover-01.png" height="60px" width="60px" style="opacity:0.5;" />';

        }

        //Show picture
        if(request.object.get("attachmentPhoto") !== undefined)
          {
            htmlMsg+='<a href='+image+'><img src="http://files.parsetfss.com/d5d1b985-6387-4477-9d38-4a443bcd7532/tfss-71f55386-8282-4c2c-a04f-57ae33c471eb-cam_rover-01.png" height="60px" width="60px" style="margin-left:20px; margin-right:20px;"/></a>';
          }else{
            htmlMsg+='<img src="http://files.parsetfss.com/d5d1b985-6387-4477-9d38-4a443bcd7532/tfss-71f55386-8282-4c2c-a04f-57ae33c471eb-cam_rover-01.png" height="60px" width="60px" style="margin-left:20px; margin-right:20px;opacity:0.5;"  />';

          }

          //Show audio
          if(request.object.get("attachmentAudio") !== undefined)
            {
              htmlMsg+='<a href='+audio+'><img src="http://files.parsetfss.com/d5d1b985-6387-4477-9d38-4a443bcd7532/tfss-661e7b02-0263-4c45-bce2-32c91ecf9f27-mic_rover-01.png" height="60px" width="60px" /></a>';
            }else{
              htmlMsg+='<img src="http://files.parsetfss.com/d5d1b985-6387-4477-9d38-4a443bcd7532/tfss-661e7b02-0263-4c45-bce2-32c91ecf9f27-mic_rover-01.png" height="60px" width="60px" style="opacity:0.5;" />';

            }
            htmlMsg+='</div></center>';
            htmlMsg+='<p>'+request.object.get("crimeDescription")+'</p></td>';

            htmlMsg+='<td width="25%">';
            if(lat!==undefined){
              htmlMsg+='<img src="http://maps.googleapis.com/maps/api/staticmap?center='+lat+','+lon+'&zoom=13&size=300x290&maptype=roadmap&markers=color:red%7Clabel:A%7C'+lat+','+lon+'&key=AIzaSyB4YgcnyMY18Xhqs5BYYQlGHhGRd-CFb5w" height="100%" width="100%"/>';
            }else{
              htmlMsg+='<div style="background-color:#CCCCCC; color:#FF6600; margin-top:auto; margin-bottom:auto; height:300px; width:290px; " > <center>NO LOCATION AVAILABLE</center></div>'
            }
            htmlMsg+='</td></tr>';
            htmlMsg+='</table>';


            htmlMsg += '</body></html>'
            //Set the email subject to the crime type of the tip
            var subject = request.object.get("crimeType").toString();

            //Send Email
            Mailgun.sendEmail({
              to: "wnieves@optivon.net",
              from: "BastaYa App <developer@optivon.net>",
              subject: subject,
              html: htmlMsg
            }, {
              success: function(httpResponse) {
                console.log(httpResponse);
              },
              error: function(httpResponse) {
                console.error(httpResponse);
              }
            });

          }
          /*
          *  MD5 (Message-Digest Algorithm)
          *  http://www.webtoolkit.info/
          *
          */
          var MD5 = function (string) {
            function RotateLeft(lValue, iShiftBits) {
              return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
            }
            function AddUnsigned(lX,lY) {
              var lX4,lY4,lX8,lY8,lResult;
              lX8 = (lX & 0x80000000);
              lY8 = (lY & 0x80000000);
              lX4 = (lX & 0x40000000);
              lY4 = (lY & 0x40000000);
              lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
              if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
              }
              if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                  return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                  return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
              } else {
                return (lResult ^ lX8 ^ lY8);
              }
            }
            function F(x,y,z) { return (x & y) | ((~x) & z); }
            function G(x,y,z) { return (x & z) | (y & (~z)); }
            function H(x,y,z) { return (x ^ y ^ z); }
            function I(x,y,z) { return (y ^ (x | (~z))); }
            function FF(a,b,c,d,x,s,ac) {
              a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
              return AddUnsigned(RotateLeft(a, s), b);
            };
            function GG(a,b,c,d,x,s,ac) {
              a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
              return AddUnsigned(RotateLeft(a, s), b);
            };
            function HH(a,b,c,d,x,s,ac) {
              a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
              return AddUnsigned(RotateLeft(a, s), b);
            };
            function II(a,b,c,d,x,s,ac) {
              a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
              return AddUnsigned(RotateLeft(a, s), b);
            };
            function ConvertToWordArray(string) {
              var lWordCount;
              var lMessageLength = string.length;
              var lNumberOfWords_temp1=lMessageLength + 8;
              var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
              var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
              var lWordArray=Array(lNumberOfWords-1);
              var lBytePosition = 0;
              var lByteCount = 0;
              while ( lByteCount < lMessageLength ) {
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                lByteCount++;
              }
              lWordCount = (lByteCount-(lByteCount % 4))/4;
              lBytePosition = (lByteCount % 4)*8;
              lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
              lWordArray[lNumberOfWords-2] = lMessageLength<<3;
              lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
              return lWordArray;
            };
            function WordToHex(lValue) {
              var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
              for (lCount = 0;lCount<=3;lCount++) {
                lByte = (lValue>>>(lCount*8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
              }
              return WordToHexValue;
            };
            function Utf8Encode(string) {
              string = string.replace(/\r\n/g,"\n");
              var utftext = "";
              for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                  utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                  utftext += String.fromCharCode((c >> 6) | 192);
                  utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                  utftext += String.fromCharCode((c >> 12) | 224);
                  utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                  utftext += String.fromCharCode((c & 63) | 128);
                }
              }
              return utftext;
            };
            var x=Array();
            var k,AA,BB,CC,DD,a,b,c,d;
            var S11=7, S12=12, S13=17, S14=22;
            var S21=5, S22=9 , S23=14, S24=20;
            var S31=4, S32=11, S33=16, S34=23;
            var S41=6, S42=10, S43=15, S44=21;
            string = Utf8Encode(string);
            x = ConvertToWordArray(string);
            a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
            for (k=0;k<x.length;k+=16) {
              AA=a; BB=b; CC=c; DD=d;
              a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
              d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
              c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
              b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
              a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
              d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
              c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
              b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
              a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
              d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
              c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
              b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
              a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
              d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
              c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
              b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
              a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
              d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
              c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
              b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
              a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
              d=GG(d,a,b,c,x[k+10],S22,0x2441453);
              c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
              b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
              a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
              d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
              c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
              b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
              a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
              d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
              c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
              b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
              a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
              d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
              c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
              b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
              a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
              d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
              c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
              b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
              a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
              d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
              c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
              b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
              a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
              d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
              c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
              b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
              a=II(a,b,c,d,x[k+0], S41,0xF4292244);
              d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
              c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
              b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
              a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
              d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
              c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
              b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
              a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
              d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
              c=II(c,d,a,b,x[k+6], S43,0xA3014314);
              b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
              a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
              d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
              c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
              b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
              a=AddUnsigned(a,AA);
              b=AddUnsigned(b,BB);
              c=AddUnsigned(c,CC);
              d=AddUnsigned(d,DD);
            }
            var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
            return temp.toLowerCase();
          }


          //  var hash = MD5(JSON.stringify(content));


        } else{
          response.success();
        }

      });
