
function addLoadEvent(func) {
    var oldonload = window.onload;
    if(typeof(window.onload) != 'function') {
        window.onload = func;
    }else {
        window.onload = function() {
            oldonload();
            func();
        };
    }
}

addLoadEvent(getUrlParameterConfig);

function getUrlParameterConfig() {
    var Request = new Object();
    Request = getUrlParameter();
    var id;
    id = Request['id'];
    return id;
}

function getCourseById() {
    
}