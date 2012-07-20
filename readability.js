(function () {
  var allnodes= document.body.querySelectorAll('*');
  var nodes = [];

  var all_a = document.querySelectorAll('a'),
      a_length = 0;
  for(var i = 0; i < all_a.length; i++) {
    a_length += all_a[i].innerText.length;
  }

  var NODES = ['DIV', 'ARTICLE'];

  var all_text = document.body.innerText.length - a_length;
  
  console.log(all_text);

  for(var i = 0; i < allnodes.length; i++) {
    var node = allnodes[i],
        name = node.nodeName;
    if(NODES.indexOf(node.nodeName) !== -1) {
      var as = node.querySelectorAll('a'),
          sub_a_length = 0;
      
      for(var j = 0; j < as.length; j++) {
        sub_a_length += as[i].innerText.length;
      }
      
      var text = node.innerText.length - sub_a_length,
          link_count = (node.querySelectorAll('a').length
                        - node.querySelectorAll('p>a').length) || 1;

      if(text > all_text / 3) {
        nodes.push({
          node: node,
          link_count: link_count,
          text: text,
          ratio: text / link_count
        });
      }
    }
  }

  function by_text (a, b) {
    if(a.text > b.text) {
      return -1;
    } else if(a.text === b.text) {
      return 0;
    }
    return 1;
  }

  function by_ratio (a, b) {
    if(a.ratio > b.ratio) {
      return -1;
    } else if(a.ratio === b.ratio) {
      return 0;
    }
    return 1;
  }

  function log_nodes (nodes) {
    for(var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      console.log("link_count", node.link_count,
                  'text', node.text,
                  'node', node.node,
                  'ratio', node.ratio
                 );

    }
  }

  var selected = nodes.sort(by_text).slice(0, 20);

  log_nodes(selected);
  selected.sort(by_ratio);

  console.log('-----------');
  log_nodes(selected);

  selected[0].node.style.border = "3px solid red";


  // console.log(selected);


})();
