
var imgDownloaderPlugin = (function() {
  
  var zip = new JSZip();
  
  
  function createFile() {
    var fileName = 'ReadMe.txt';
    var content = 'Open nodejs command prompt with administrator access.'+
      'run \'npm install\''+
      'then run \'npm run dev\''+
      '****************************'+
      'currently I have created an array with 5 images link, you can add 1K, the code will remain the same.'+
      'I am loading the array JSON file via axios.';

    zip.file(fileName, content);

  }

  function createFolder() {
    var folderName = 'images';

    return zip.folder(folderName);

  }

  function getAndCreateImages(imgFolder, imgDataArray) {
       var imgPromiseStack = [];
    for (var i=0, l= imgDataArray.length; i<l; i++) {

      (function(j) {
          var item = imgDataArray[j];
          var ext = item.substring(item.lastIndexOf('.')+1, item.length);
          imgPromiseStack.push($.Deferred());


          axios.get(item, {
              responseType: 'arraybuffer'
            })
            .then(function(response) {
              
              imgFolder.file('image '+(j+1)+'.'+ext, response.data);
              imgPromiseStack[j].resolve();
              
            }).catch(function(error) {
              console.log(error);
              imgPromiseStack[j].resolve();
            });
          

      })(i);
        
        
      /*
        With jQuery Deferreds

                  var imgPromiseStack = [];
    for (var i=0, l= imgDataArray.length; i<l; i++) {

      (function(j) {
          var item = imgDataArray[j];
          var ext = item.substring(item.lastIndexOf('.')+1, item.length);
          imgPromiseStack.push($.Deferred());


          axios.get(item, {
              responseType: 'arraybuffer'
            })
            .then(function(response) {
              
              imgFolder.file('image '+(j+1)+'.'+ext, response.data);
              imgPromiseStack[j].resolve();
              
            }).catch(function(error) {
              console.log(error);
              imgPromiseStack[j].resolve();
            });
          

      })(i);

      with Bluebird promises

       var imgPromiseStack = [];
    for (var i=0, l= imgDataArray.length; i<l; i++) {
       (function(j) {
          imgPromiseStack.push(new Promise(function(resolve, reject) {
             var item = imgDataArray[j];
             var ext = item.substring(item.lastIndexOf('.')+1, item.length);
             
              
        
          axios.get(item, {
              responseType: 'arraybuffer'
            })
            .then(function(response) {
              
              imgFolder.file('image '+(j+1)+'.'+ext, response.data);
              resolve();
              
            }).catch(function(error) {
              console.log(error);
              resolve();
            });

          }));

          
      })(i);

      */
    
    }

    return imgPromiseStack;
 
  }

  function createZipFile(imgPromiseStack,  zipFileName, callBackSuccess, callBackError) {
    var zipFileName = zipFileName;

        $.when.apply($, imgPromiseStack).then(function() {
            
            zip.generateInternalStream({type:"blob"})
               .accumulate(function callback(err, content) {
                  if (err) {
                   console.log(err);
                    //callBackError();
                  }
              saveAs(content, zipFileName+'.zip');
                callBackSuccess();
            }, function updateCallback(metadata) {
              // print progression with metadata.percent and metadata.currentFile
            });
        

        }, function(e) {
          callBackError();
        });

     /*
        With jQuery Deferreds
 var zipFileName = zipFileName;

    $.when.apply($, imgPromiseStack).then(function() {
        
        zip.generateAsync({type:"blob"})
          .then(function(content) {
           
          saveAs(content, zipFileName+'.zip');
            callBackSuccess();
          }, function() {


           // callBackError();
          });


    }, function(e) {
       callBackError();
    });


    With Bluebird promise
        var zipFileName = zipFileName;

    Promise.all(imgPromiseStack).then(function() {
        zip.generateAsync({type:"blob"})
          .then(function(content) {
           
          saveAs(content, zipFileName+'.zip');
            callBackSuccess();
          }, function() {


           // callBackError();
          });
      }, function() {

         callBackError();

      });
    */

 }

  function render(imgDataArray, zipFileName, callBackSuccess, callBackError) {

    createFile();
    var imgFolder = createFolder();

    var imgPromiseStack = getAndCreateImages(imgFolder, imgDataArray);

    createZipFile(imgPromiseStack,  zipFileName, callBackSuccess, callBackError);
  }

  

  return publicAPI = {
    render: render
  };


})();