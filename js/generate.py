import re
js = open('bookmarklet.js').read()
js = re.sub(r'\s+', ' ', js)

js = 'javascript:'+ js
print js

html = open('index.html').read()
html = html.replace('{{js}}', js)

f = open('index2.html', 'w')
f.write(html);
f.close();

