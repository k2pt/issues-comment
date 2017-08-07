# issues-comment
a comment system based on github issues

http://es5.site/issues-comment



# Usage

1.import theme style.
```html
<link rel="stylesheet" type="text/css" href="//html50.github.io/issues-comment/theme.css">   
```
2.import js files.
```html
<script src='//html50.github.io/issues-comment/issues-comment.js'></script>  //core file
<script src='//html50.github.io/issues-comment/js/marked.js'></script>  //render Markdown
```

3.set your issues URL and initial issues-comment.
```html
//this will generate HTML and document.write() to where you put these lines at 	
<script>
  issuesComment.url = 'HTML50/issues-comment/issues/1'; //modify this to ':your_ID/:your_repo/issues/:number'
  issuesComment.init();
</script>
```
