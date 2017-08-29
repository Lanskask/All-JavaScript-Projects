window.onload = function(){           
    var div = document.body.children[0];
    var span2 = div.children[1];

    span2.myProperty = 1000;

    var_dump(span2);
}

function var_dump(obj){
    var s = '<h1>' + obj + '</h1>';
    s += '<ol>';

    for (p in obj)
        s += '<li><b>' + p + '</b> : ' + obj[p] + '</li>';
    
    s += '</ol>';
    window.document.body.innerHTML = s;
}