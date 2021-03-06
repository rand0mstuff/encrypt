decrypt();
function encrypt(){
  var texts = document.getElementById("text").value;
  var key = document.getElementById("key").value;
  var formula = []; 
  var ref = firebase.database().ref();
  var keyExists = false;
  var existingKeys = [];
  
  ref.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
		existingKeys.push(childData.key);
        if(childData.key == key){
            keyExists = true;
            formula = childData.formula;
        }
      });
  });
  if(!keyExists){
      let randStr = "";
      for(let i = 0; i < 6; i++){
          let rand = randomInteger(0, 9);
          randStr += rand.toString();
      }
      let k = parseInt(randStr);
	  while(existingKeys.includes(k)){
		  let randStr = "";
		  for(let i = 0; i < 6; i++){
			  let rand = randomInteger(0, 9);
			  randStr += rand.toString();
		  }
		  k = parseInt(randStr);
	  }
	  document.getElementById("key").value = k;
      let ar = ['a', 'b', 'c', 'd', 'e', 'f'
      ,'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
      let fTest = [];
      for(let i = 0; i < 26; i++){
          var index = randomInteger(0, ar.length - 1);
          fTest.push(ar[index]);
          ar.splice(index, 1);
      }
	  formula = fTest;
      ref.push ({

          key: k,
          formula: fTest
      });
  }
  var encrypted = "";
  let a = "a";
  let ascii = a.charCodeAt(0);
  for(let i = 0; i < texts.length; i++){
	  let upperCase = false;
	  let f = texts.substring(i, i+1);
	  if(f == f.toUpperCase()){
		  upperCase = true;
	  }
	  let a2 = f.toLowerCase().charCodeAt(0);
	  if(upperCase){
		  encrypted += formula[a2 - ascii].toUpperCase();
	  }else{
		  encrypted += formula[a2 - ascii];
	  }
  }
  
  document.getElementById("result").value = encrypted;
  
  
}
function randomInteger(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

function decrypt(){
  var texts = document.getElementById("text").value;
  var key = document.getElementById("key").value;
  var formula = [];
  var ref = firebase.database().ref();
  var keyExists = false;
  
  ref.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        if(childData.key == key){
            keyExists = true;
            formula = childData.formula;
        }
      });
  });
  
  if(keyExists){
      var decrypted = "";
      let ascii = "a".charCodeAt(0);

      for(let i = 0; i < texts.length; i++){
          let upperCase = false;
          let f = texts.substring(i, i+1);
          let index = formula.indexOf(f.toLowerCase());
          let x = ascii + index;
          if(f == f.toUpperCase){
            decrypted += String.fromCharCode(x).toUpperCase();
          }else{
            decrypted += String.fromCharCode(x);
          }
          
      }
      document.getElementById("result").value = decrypted;
  }
}