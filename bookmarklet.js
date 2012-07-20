(function () {
  function add_js (src) {
    var id = src.split('/').pop();
    var e = document.getElementById(id);
    if(e) {
      e.parentNode.removeChild(e);
    }
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = src;
    js.id = id;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(js, s);
  }

  add_js('http://192.168.1.20:9999/readability.js');
  add_js('http://192.168.1.20:9999/jquery-1.7.2.js');
  

})();
