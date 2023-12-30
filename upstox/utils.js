function checkDevicePlatform(){    
    var isMobile = /iPhone|iPad|Android|Playbook|Windows Phone/i.test(navigator.userAgent);
    if(isMobile || getCookie("source")){
        return "Mobile";
    }else{
        return "Web"
    }
}