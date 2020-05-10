var xhttp = new XMLHttpRequest()
xhttp.onreadystatechange = function () {
    if (xhttp.status == 4 && xhttp.readyState == 200) {
        console.log(xhttp.responseText);        
    }
}
xhttp.open('GET',"http://192.168.1.65:8080/allimg")
xhttp.send()