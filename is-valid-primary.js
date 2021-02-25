/******************
 * YOUR CODE HERE *
 ******************/
function isValidPrimary(color1){
  if (color1 === 'red' || color1 === 'blue' || color1 === 'yellow'){
    return true;
  }
  else{
    return false;
  }
  }
   

 let color = isValidPrimary('red');
 color


// Our setup code here. Don't touch!
if(typeof isValidPrimary === 'undefined') {
  isValidPrimary = undefined;
}

module.exports = isValidPrimary;
