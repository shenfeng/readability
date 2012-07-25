(function () {

  function without_space_length (node) {
    // remove space
    return node.innerText.replace(/\s+/g, '').length;
  }

  function sub_a_text_length (node) {
    var all_a = node.querySelectorAll('a'),
        link_length = 0;
    for(var i = 0; i < all_a.length; i++) {
      link_length += without_space_length(all_a[i]);
    }
    return link_length;
  }

  function node_text_length (node) {
    return without_space_length(node) - sub_a_text_length(node);
  }

  function time (fn) {
    var start = new Date();
    var args = Array.prototype.slice.call(arguments, 1);
    fn.apply(null, args);
    var end = new Date();
    console.log(fn.name + '   ' + ((new Date) - start) + 'ms');
  }

  function mark_node () {
    var body_length = node_text_length(document.body);
    var allnodes= document.body.querySelectorAll('div, article');
    var nodes = [];

    console.log(body_length);

    for(var i = 0; i < allnodes.length; i++) {
      var node = allnodes[i];

      var text_length = node_text_length(node),
          link_count = (node.querySelectorAll('a').length
                        - node.querySelectorAll('p>a').length) || 1;

      if(text_length >  200) {
        nodes.push({
          node: node,
          link_count: link_count,
          text: text_length,
          ratio: text_length / link_count,
          text_full: node.innerText.length
        });
      }
    }
    var selected = nodes.sort(by_text).slice(0, 25);

    log_nodes(selected);
    selected.sort(by_ratio);

    console.log('---------------------------------');
    log_nodes(selected);
    if(selected.length) {
      selected[0].node.style.border = "3px solid red";
    }

  }


  function by_text (a, b) {
    if(a.text > b.text) { return -1; }
    else if(a.text === b.text) { return 0; }
    return 1;
  }

  function by_ratio (a, b) {
    if(a.ratio > b.ratio) { return -1; }
    else if(a.ratio === b.ratio) { return 0; }
    return 1;
  }

  function log_nodes (nodes) {
    for(var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      console.log("link", node.link_count,
                  'text', node.text,
                  'full', node.text_full,
                  'ratio', parseFloat(node.ratio.toFixed(2)),
                  node.node
                 );

    }
  }

  function print_a () {
    var all_a = document.querySelectorAll('a');
    var counter = {};
    for(var i = 0; i < all_a.length; i++) {
      var a = all_a[i],
          p_node =a.parentNode.nodeName;
      counter[p_node] = (counter[p_node] || 0) + 1;
    }
    var arr = [];
    for(var c in counter) {
      arr.push(c);
      arr.push(counter[c]);
    }
    console.log(arr);
  }

  // run it
  time(mark_node);
  time(print_a);

})();
