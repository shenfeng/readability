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
    if(s) {
      s.parentNode.insertBefore(js, s);
    } else {
      document.body.appendChild(js);
    }
  }

  add_js('http://192.168.1.21:9999/readability.js');
})();
