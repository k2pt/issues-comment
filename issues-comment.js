(function() {
    issuesComment = {
        USERNAME: "",
        PASSWORD: "",
        ID:"",
        AVATARURL: "",
        total:0,
        xhr: 1,
        flag: 0, //0:nothing, 1:GET avatar, 2:get Comments list
        showLogin: function() {
            loginForm.style.display = 'block';
        },
        getComment: function() {
            issuesComment.flag = 2;
            issuesComment.xhr.open('GET', 'https://api.github.com/repos/HTML50/HTML50.github.io/issues/1/comments', true);
            issuesComment.xhr.send();
        },
        login: function() {
            issuesComment.USERNAME = usernameVal.value;
            issuesComment.PASSWORD = passwordVal.value;
            issuesComment.flag = 1;
            issuesComment.checkUser();
        },
        logout() {
            localStorage.removeItem('USERNAME');
            localStorage.removeItem('PASSWORD')
            localStorage.removeItem('AVATARURL');
            issuesComment.tip.classList.remove('hidden');
            issuesComment.btn.classList.add('hidden');
            issuesComment.textarea.classList.add('hidden');
            issuesComment.btn.classList.add('hidden');
            userInfo.innerHTML = '<a href="javascript:void(0)" onclick="issuesComment.login()"><img class="avatar" src="octocat.png" title="Click to login"></a>';
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
            issuesComment.xhr.open('POST', 'https://api.github.com/repos/HTML50/HTML50.github.io/issues/1/comments', true);
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
            userInfo.innerHTML = '<a href="javascript:void(0)" onclick="issuesComment.logout()"><img class="avatar" src="' + issuesComment.AVATARURL + '" title="' + issuesComment.USERNAME + '已登录"></a>';
        },
        renderComment: function(obj) {
            let i = obj.length - 1,
                output = '';
                issuesComment.total = i;

            for (i; i > 0; i--) {
                output += issuesComment.generateItem(obj[i].user.avatar_url,obj[i].user.login,obj[i].created_at.replace(/[TZ]/g, " "),obj[i].body,i)
            }
            list.innerHTML = output;
        },
        addComment:function(){
            var ele = document.createElement('new'),
            now = new Date(),
            timeStr = now.getFullYear()+'-'+addZero(now.getMonth)+'-'+addZero(now.getDate)+'-'+addZero(now.getHour)+'-'+addZero(now.getMinutes)+'-'+addZero(now.getSeconds);

            ele.innerHTML = issuesComment.generateItem(issuesComment.AVATARURL,issuesComment.ID,timeStr,issuesComment.textarea.value,issuesComment.total)
            ele.style.opacity =0;
            ele.style.display = 'block';
            ele.style.transition = 'opacity 0.5s';
            setTimeout(function(){
                ele.style.opacity =1;
            },500)
            list.insertBefore(ele,list.firstChild)
            issuesComment.total++;

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
                } else if (day >= 1) {
                    result = parseInt(day) + " days ago";
                } else {
                    result = "today";
                }
                return result;
            }



            return '<li class="comment-item">\
                <img class="avatar" src="' + avatar + '" title="' + ID + '">\
                <span class="comment-body">\
                <div class="comment-header">\
                <span>\
                    <span class="comment-user">' + ID + '</span>\
                    <span class="comment-time" title="' + timeStr + '"> commented ' + getDateDiff(timeStr) + '</span>\
                </span>\
                <span>#' + floor + '</span>\
                </div>\
                <div class="comment-content">' + marked(content) + '</div>\
                </span>\
                </li>'
        },
        handleStateChange: function() {
            if (issuesComment.xhr.readyState == 4) {
                if (issuesComment.xhr.status == 200) {
                    if (issuesComment.flag == 1) {
                        issuesComment.AVATARURL = JSON.parse(issuesComment.xhr.responseText).avatar_url;
                        issuesComment.ID = JSON.parse(issuesComment.xhr.responseText).login;
                        localStorage.setItem('AVATARURL', issuesComment.AVATARURL);
                        localStorage.setItem('ID',issuesComment.ID);
                        issuesComment.success();
                        issuesComment.flag = 0;
                    } else {
                        issuesComment.renderComment(JSON.parse(issuesComment.xhr.responseText));
                        issuesComment.flag = 0;
                    }
                }

                if (issuesComment.xhr.status == 201) {
                    issuesComment.spinner.style.opacity = 0;
                    issuesComment.done.style.display = 'inline';
                    issuesComment.done.style.opacity = '1';
                    issuesComment.btn.classList.add('comment-btn-done');

                    issuesComment.addComment();
                    setTimeout(function() {
                        issuesComment.btn.classList.remove('comment-btn-done');
                        issuesComment.btn.classList.remove('loading');
                        issuesComment.btn.disabled = false;
                        issuesComment.spinner.style.display = 'none';
                        issuesComment.spinner.style.opacity = 1;
                        issuesComment.done.style.display = 'none';
                        issuesComment.done.style.opacity = 0;
                    }, 1000)

                }
                if (issuesComment.xhr.status == 401) {
                    if (issuesComment.flag == 1) {
                        alert('password wrong :(')
                    } else {
                        console.log('something went wrong :(')
                    }
                    issuesComment.flag = 0;
                }
            }
        },
        init: function() {
            issuesComment.xhr = new XMLHttpRequest();
            issuesComment.xhr.onreadystatechange = issuesComment.handleStateChange;
            issuesComment.getComment();
            //issuesComment.createCompnent()
            issuesComment.btn = document.querySelector(".issuesComment-box .comment-submit-btn");
            issuesComment.spinner = document.querySelector(".issuesComment-box .submit-spinner");
            issuesComment.tip = document.querySelector(".issuesComment-box .comment-login-tip");
            issuesComment.textarea = document.querySelector(".issuesComment-box .comment-textarea");
            issuesComment.done = document.querySelector(".issuesComment-box .comment-btn-ok");

            issuesComment.USERNAME = localStorage.getItem('USERNAME');
            if (issuesComment.USERNAME) {
                issuesComment.PASSWORD = localStorage.getItem('PASSWORD')
                issuesComment.AVATARURL = localStorage.getItem('AVATARURL')
                issuesComment.tip.classList.add('hidden');
                issuesComment.btn.classList.remove('hidden');
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

})();