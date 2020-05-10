var xhttp = new XMLHttpRequest()
xhttp.onreadystatechange = function () {
    if (xhttp.status == 200 && xhttp.readyState == 4) {
        var container = document.getElementById("main_container") 
        var doc = JSON.parse(xhttp.responseText)    
        for (let index = 0; index < doc.length; index++) {
            const element = doc[index];
            var i = document.createElement('img')
            i.src = "http://109.20.225.173:8080/static/"+element.name
            i.className = "img_users"
            container.appendChild(i)
        }
    }
}
xhttp.open('GET',"http://192.168.1.65:8080/allimg")
xhttp.send()