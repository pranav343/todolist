exports.getDate=function(){    //this function tells us the whole date

    var today = new Date(); //find the today

    var options = {    //for using the date we specify like this
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var date = today.toLocaleDateString("en-US", options); //find the date 
  return date; //returns the whole date
}

exports.getDay=function(){    //this function tells us the day

    var today = new Date(); //find the today

    var options = {    //for using the date we specify like this
    weekday: "long",  
  };
  var day = today.toLocaleDateString("en-US", options); //find the day 
  return day; //returns the day
}