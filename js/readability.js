(function () {
  // ------------ helper function ---------------------

  function is_text_node (node) {
    if(node.nodeName === '#text') {
      if(node.parentNode.nodeName === 'A' &&
         node.parentNode.parentNode.nodeName !== 'P') {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }
  
  function is_p_node (node) {
    if(node.nodeName === 'P' || node.parentNode.nodeName === 'P'
      || node.parentNode.parentNode.nodeName === 'p') {
      return true;
    }
    return false;
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
                  'ratio', parseFloat(node.ratio.toFixed(2)),
                  node.node);

    }
  }

  function traverse_2node (node, shoud_ignore, cb) {
    var root = node;
    var depth = 0;
    while(node) {
      var ignore = shoud_ignore(node);
      if(!ignore) {
        cb(node, depth);
      }

      if(!ignore && node.childNodes.length) {
        node = node.childNodes[0];
        depth ++;
      } else {

        while(node.nextSibling === null && depth > 0) {
          node = node.parentNode;
          depth --;
        }

        if(node === root) {
          break;
        }

        node = node.nextSibling;
      }
    }
  }
  // --------------------------------


  function node_link_count (node) {

    var text_count = 0;
    traverse_node(node, should_ignore, function (node, depth) {
      if(node.nodeName === 'A' && node.parentNode.nodeName !== 'P') {
        text_count =+ 1;
      }
    });

    var all_a = node.querySelectorAll('a'),
        count = all_a.length;
    for(var i = 0; i < all_a.length; i++) {
      var a = all_a[i];
      if(a.parentNode.nodeName === 'P') {
        count -= 1;
      }
    }
    return count || 1;
  }

  var IGNORED = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', "FORM"];
  function should_ignore (node) {
    var name = node.nodeName;
    for(var i = 0; i < IGNORED.length; i++) {
      if(IGNORED[i] === name) {
        return true;
      }
    }

    var id = node.id,
        cls = node.className,
        re = /comment/;

    if(re.exec(id) || re.exec(cls)) {
      return true;
    }

    return false;
  }

  function node_text_char_count (node) {
    var text_count = 0;
    traverse_node(node, should_ignore, function (node, depth) {
      if(is_text_node(node)) {
        var t = node.wholeText.trim();
        // texts.push(t);
        text_count += t.length;
        if(is_p_node(node)) {
          text_count += t.length; // double
        }
      }
    });

    return text_count;
  }


  // BAD case
  // http://www.javaworld.com/javaworld/jw-04-2012/120419-fatal-exception.html?source=nww_rss
  // http://kotaku.com/5929067/gabe-newell-wants-to-support-linux-because-windows-8-is-a-catastrophe
  // $('#stack-title').text('');
  function without_space_length (node) {
    var text = node.innerText || node.textContent; // firefox
    // remove space
    return text.replace(/\s+/g, '').length;
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

  function time_fn (fn) {
    var start = new Date();
    var args = Array.prototype.slice.call(arguments, 1);
    fn.apply(null, args);
    var end = new Date();
    console.log(fn.name + '   ' + ((new Date) - start) + 'ms');
  }

  function mark_node () {
    var forms = document.querySelectorAll('form');
    for(var i = 0; i < forms.length; i++) {
      var f = forms[i];
      f.parentNode.removeChild(f);
    }
    var body_length = node_text_char_count(document.body);
    console.log('body-length', body_length);

    var allnodes= document.querySelectorAll('div, article, body, section');
    var nodes = [];

    for(var i = 0; i < allnodes.length; i++) {
      var node = allnodes[i];

      if(should_ignore(node)) {
        continue;
      }

      var char_count = node_text_char_count(node),
          link_count = node_link_count(node);

      if(char_count >  body_length / 4) {
        nodes.push({
          node: node,
          link_count: link_count,
          text: char_count,
          ratio: char_count / link_count
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


  function print_a_stats (node) {
    node = node || document;
    var all_a = node.querySelectorAll('a');
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
  time_fn(mark_node);
  // time_fn(print_a_stats);

  window.RD = {
    print_a_stats: print_a_stats,
    node_text_char_count: node_text_char_count,
    node_link_count: node_link_count
  };

  // window.traverse_node = traverse_node;
  // window.node_text_char_count = node_text_char_count;

})();
