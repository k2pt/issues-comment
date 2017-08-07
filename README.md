# issues-comment
a comment system based on github issues

http://github.com/HTML50/issues-comment



# Usage

1.import theme style.
```html
<link rel="stylesheet" type="text/css" href="theme.css">   
```
2.import js files.
```html
<script src='issues-comment.js'></script>  //core file
<script src='js/marked.js'></script>  //render Markdown
```

3.set your issues URL and initial issues-comment.
```html
//this will generate HTML and document.write() to where you put these lines at 	
<script>
  issuesComment.url = 'HTML50/issues-comment/issues/1'; //modify this to ':your_ID/:your_repo/issues/:number'
  issuesComment.init();
</script>
```
