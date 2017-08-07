    issuesComment = {
        USERNAME: "",
        PASSWORD: "",
        ID:"",
        AVATARURL: "",
        url:"",
        total:0,
        xhr: 1,
        flag: 0, //0:nothing, 1:GET avatar, 2:get Comments list
        showLogin: function() {
            loginForm.style.display = 'flex';
            usernameVal.focus();
            issuesComment.loginBtn = document.querySelector(".issuesComment-box .login-box .comment-submit-btn");
            issuesComment.loginSpinner = document.querySelector(".issuesComment-box .login-box .submit-spinner");
            issuesComment.loginResult = document.querySelector(".issuesComment-box .login-box .comment-btn-result");
            issuesComment.loginForm.style.opacity = 1;

            issuesComment.loginForm.addEventListener('click',function(){
                issuesComment.loginForm.style.opacity = 0;
                setTimeout(function(){
                    issuesComment.loginForm.style.display = 'none';
                },1000)
                issuesComment.loginForm.removeEventListener('click',arguments.callee)
            })
            document.querySelector('.issuesComment-box .login-box').addEventListener('click',function(e){
                e.stopPropagation()
            })
        },
        getComment: function() {
            issuesComment.flag = 2;
            issuesComment.xhr.open('GET', 'https://api.github.com/repos/'+issuesComment.url+'/comments?per_page=100', true);
            issuesComment.xhr.send();
        },
        login: function() {
            issuesComment.USERNAME = usernameVal.value;
            issuesComment.PASSWORD = passwordVal.value;
            issuesComment.flag = 1;
            issuesComment.checkUser();
            issuesComment.loginBtn.classList.add('loading');
            issuesComment.loginBtn.disabled = true;
            issuesComment.loginSpinner.style.display = 'inline';
        },
        logout() {
            localStorage.removeItem('USERNAME');
            localStorage.removeItem('PASSWORD')
            localStorage.removeItem('AVATARURL');
            issuesComment.tip.classList.remove('hidden');
            issuesComment.btn.classList.add('hidden');
            issuesComment.textarea.classList.add('hidden');
            issuesComment.btn.classList.add('hidden');
            document.querySelector('.issuesComment-box .user-info').innerHTML = '<a href="javascript:void(0)" onclick="issuesComment.login()"><img class="avatar" src="//html50.github.io/issues-comment/octocat.png" title="Click to login"></a>';
        },
        success: function() {
            localStorage.setItem('USERNAME', issuesComment.USERNAME);
            localStorage.setItem('PASSWORD', issuesComment.PASSWORD);
            issuesComment.tip.classList.add('hidden');
            issuesComment.btn.classList.remove('hidden');
            issuesComment.textarea.classList.remove('hidden');
            issuesComment.btn.classList.remove('hidden');
            issuesComment.updateUser();
        },
        submit: function(method) {
            var payload;
            issuesComment.xhr.open('POST', 'https://api.github.com/repos/'+issuesComment.url+'/comments', true);
            payload = JSON.stringify({ "body": issuesComment.textarea.value });
            issuesComment.xhr.setRequestHeader("Authorization", "Basic " + btoa(issuesComment.USERNAME + ":" + issuesComment.PASSWORD))
            issuesComment.xhr.send(payload);
            issuesComment.btn.classList.add('loading');
            issuesComment.btn.disabled = true;
            issuesComment.spinner.style.display = 'inline';
        },
        checkUser: function() {
            issuesComment.xhr.open('GET', 'https://api.github.com/user', true);
            issuesComment.xhr.setRequestHeader("Authorization", "Basic " + btoa(issuesComment.USERNAME + ":" + issuesComment.PASSWORD))
            issuesComment.xhr.send();
        },
        updateUser: function() {
            document.querySelector('.issuesComment-box .user-info').innerHTML = '<img class="avatar" src="' + issuesComment.AVATARURL + '" title="' + issuesComment.USERNAME + '"><a href="javascript:void(0)" onclick="issuesComment.logout()">Logout</a>';
        },
        renderComment: function(obj) {
            let i = obj.length - 1,
                output = '';
                issuesComment.total = i;

            for (i; i >= 0; i--) {
                output += issuesComment.generateItem(obj[i].user.avatar_url,obj[i].user.login,obj[i].created_at.replace(/[TZ]/g, " "),obj[i].body,i)
            }
            document.querySelector('.issuesComment-box #list').innerHTML = output;
        },
        addComment:function(){
            var ele = document.createElement('new'),
            now = new Date(),
            timeStr = now.getFullYear()+'-'+addZero(now.getMonth)+'-'+addZero(now.getDate)+'-'+addZero(now.getHour)+'-'+addZero(now.getMinutes)+'-'+addZero(now.getSeconds);

            issuesComment.total++;
            ele.innerHTML = issuesComment.generateItem(issuesComment.AVATARURL,issuesComment.ID,timeStr,issuesComment.textarea.value,issuesComment.total)
            ele.style.opacity =0;
            ele.style.display = 'block';
            ele.style.transition = 'opacity 0.5s';
            setTimeout(function(){
                ele.style.opacity =1;
            },500)
            document.querySelector('.issuesComment-box #list').insertBefore(ele,document.querySelector('.issuesComment-box #list').firstChild);
            function addZero(str){
                str = str+"";
                if(str.length== 1){
                    return '0'+str;
                }
                return str;
            }
        },
        generateItem:function(avatar,ID,timeStr,content,floor){
            function getDateDiff(dateStr) {
                var now = new Date().getTime(),
                    diffValue = now - Date.parse(dateStr.slice(0, 10)),
                    day = diffValue / 86400000,
                    result;
                if (day >= 365) {
                    result = parseInt(day / 365) + " years ago";
                } else if (day > 1) {
                    result = parseInt(day) + " days ago";
                } else if (day == 1) {
                result = "1 day ago";
                } else {
                    result = "today";
                }
                return result;
            }

            return '<li class="comment-item">\
                <a href="//github.com/'+ID+'" target="_blank"><img class="avatar" src="' + avatar + '" title="' + ID + '"></a>\
                <span class="comment-body">\
                <div class="comment-header">\
                <span>\
                    <span class="comment-user"><a href="//github.com/'+ID+'" target="_blank">' + ID + '</a></span>\
                    <span class="comment-time" title="' + timeStr + '"> commented ' + getDateDiff(timeStr) + '</span>\
                </span>\
                <span>#' + (floor+1) + '</span>\
                </div>\
                <div class="comment-content">' + marked(content) + '</div>\
                </span>\
                </li>'
        },
        handleStateChange: function() {
            if (issuesComment.xhr.readyState == 4) {
                if (issuesComment.xhr.status == 200) {
                    if (issuesComment.flag == 1) {
                        issuesComment.submitBtnCallback(true,issuesComment.loginBtn,issuesComment.loginSpinner,issuesComment.loginResult,document.querySelector(".issuesComment-box .login-box .comment-submit-btn img"));
                        issuesComment.AVATARURL = JSON.parse(issuesComment.xhr.responseText).avatar_url;
                        issuesComment.ID = JSON.parse(issuesComment.xhr.responseText).login;
                        localStorage.setItem('AVATARURL', issuesComment.AVATARURL);
                        localStorage.setItem('ID',issuesComment.ID);
                        issuesComment.success();
                        setTimeout(function(){
                            issuesComment.loginForm.style.opacity = 0;
                        },1000)
                        setTimeout(function(){
                            issuesComment.loginForm.style.display = 'none';
                        },2000)
                        issuesComment.loginResult = '';
                        issuesComment.flag = 0;
                    } else {
                        if(issuesComment.xhr.getResponseHeader('Link')){
                            console.log('多于100条记录，可以进行分页啦！')
                        }
                        issuesComment.renderComment(JSON.parse(issuesComment.xhr.responseText));
                        issuesComment.flag = 0;
                    }
                }

                if (issuesComment.xhr.status == 201) {
                    issuesComment.addComment();
                    issuesComment.submitBtnCallback(true,issuesComment.btn,issuesComment.spinner,issuesComment.result,document.querySelector(".issuesComment-box .comment-submit-btn img"))

                }

                if (issuesComment.xhr.status == 422) {
                    issuesComment.submitBtnCallback(false,issuesComment.btn,issuesComment.spinner,issuesComment.result,document.querySelector(".issuesComment-box .comment-submit-btn img"))
                }

                if (issuesComment.xhr.status == 401) {
                    if (issuesComment.flag == 1) {
                        issuesComment.submitBtnCallback(false,issuesComment.loginBtn,issuesComment.loginSpinner,issuesComment.loginResult,document.querySelector(".issuesComment-box .login-box .comment-submit-btn img"))
                    } else {
                        issuesComment.submitBtnCallback(false,issuesComment.btn,issuesComment.spinner,issuesComment.result,document.querySelector(".issuesComment-box .comment-submit-btn img"))
                    }
                    issuesComment.flag = 0;
                }
            }
        },
        submitBtnCallback:function(isSuccess,btn,spinner,result,resultIMG){
            var resultClass = isSuccess ? 'comment-btn-done' : 'comment-btn-wrong',
                resultSvg = isSuccess ? '//html50.github.io/issues-comment/ok.svg':'//html50.github.io/issues-comment/wrong.svg'; 
                    resultIMG.src=resultSvg;
                    spinner.style.display = 'none';
                    result.style.display = 'inline-block';
                    result.style.opacity = '1';
                    btn.classList.add(resultClass);

                    setTimeout(function() {
                        btn.classList.remove(resultClass);
                        btn.classList.remove('loading');
                        btn.disabled = false;
                        
                        result.style.display = 'none';
                        result.style.opacity = 0;
                    }, 1000)

        },
        createCompnent:function(){
            var html = '<comment class="issuesComment-box">\
        <editor class="comment-editor">\
            <user class="user-info">\
                <a href="#" onclick="issuesComment.showLogin()"><img src="//html50.github.io/issues-comment/octocat.png" class="avatar" title="Click to login"></a>\
            </user>\
            <span>\
        <div class="comment-login-tip"><a href="#" onclick="issuesComment.showLogin()">Login with Github to comment</a></div>\
            <textarea class="comment-textarea hidden" placeholder="Styling with Markdown is supported"></textarea>\
            <button class="comment-submit-btn hidden">Comment<span class="submit-spinner"></span><span class="comment-btn-result"><img src="//html50.github.io/issues-comment/ok.svg"></span></button>\
            </span>\
        </editor>\
        <ul id="list">\
            <div class="index-comment-loading">Loading data<div class="submit-spinner data-loading"></div></div>\
        </ul>\
        <login id="loginForm">\
            <div class="login-box">\
            <div class="login-title">Sign in via GitHub</div>\
            <form>\
                <div>\
                    <input class="input" id="usernameVal" type="text" placeholder="Username or email address">\
                </div>\
                <div>\
                    <input class="input" id="passwordVal" type="password" placeholder="Password">\
                </div>\
                <div class="login-form-tip">We are not collecting your password, just use it for Github basic authentication</div>\
                <button class="comment-submit-btn" onclick="issuesComment.login()">Login<span class="submit-spinner"></span><span class="comment-btn-result"><img src="ok.svg"></span></button>\
                </form>\
            </div>\
        </login>\
    </comment>'
            document.write(html)
        },
        init: function() {
            issuesComment.xhr = new XMLHttpRequest();
            issuesComment.xhr.onreadystatechange = issuesComment.handleStateChange;
            issuesComment.createCompnent();
            issuesComment.getComment();
            issuesComment.btn = document.querySelector(".issuesComment-box .comment-submit-btn");
            issuesComment.spinner = document.querySelector(".issuesComment-box .submit-spinner");
            issuesComment.tip = document.querySelector(".issuesComment-box .comment-login-tip");
            issuesComment.textarea = document.querySelector(".issuesComment-box .comment-textarea");
            issuesComment.result = document.querySelector(".issuesComment-box .comment-btn-result");
            issuesComment.loginForm = document.querySelector(".issuesComment-box #loginForm");

            issuesComment.USERNAME = localStorage.getItem('USERNAME');
            if (issuesComment.USERNAME) {
                issuesComment.PASSWORD = localStorage.getItem('PASSWORD')
                issuesComment.AVATARURL = localStorage.getItem('AVATARURL')
                issuesComment.tip.classList.add('hidden');
                issuesComment.textarea.classList.remove('hidden');
                issuesComment.btn.classList.remove('hidden');
                issuesComment.updateUser();
            }

            issuesComment.btn.addEventListener("click", function() {
                issuesComment.flag = 0;
                issuesComment.submit();
            })


        }
    }