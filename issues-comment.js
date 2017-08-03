(function() {
    issuesComment = {
        USERNAME: "",
        PASSWORD: "",
        AVATARURL: "",
        xhr:1,
        flag: 0,//0:nothing, 1:GET avatar, 2:get Comments list
        showLogin: function() {
            loginForm.style.display = 'block';
        },
        getComment:function(){
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
        logout(){
            localStorage.removeItem('USERNAME');
            localStorage.removeItem('PASSWORD')
            localStorage.removeItem('AVATARURL');
            tip.classList.remove('hidden');
            btn.classList.add('hidden');
            text.classList.add('hidden');
            btn.classList.add('hidden');
            userInfo.innerHTML = '<a href="javascript:void(0)" onclick="issuesComment.login()"><img class="avatar" src="octocat.png" title="Click to login"></a>';
        },
        success: function() {
            localStorage.setItem('USERNAME', issuesComment.USERNAME);
            localStorage.setItem('PASSWORD', issuesComment.PASSWORD);
            tip.classList.add('hidden');
            btn.classList.remove('hidden');
            text.classList.remove('hidden');
            btn.classList.remove('hidden');
            issuesComment.updateUser();
        },
        submit: function(method) {
            var payload;
            issuesComment.xhr.open('POST', 'https://api.github.com/repos/HTML50/HTML50.github.io/issues/1/comments', true);
            payload = JSON.stringify({ "body": text.value });
            issuesComment.xhr.setRequestHeader("Authorization", "Basic " + btoa(issuesComment.USERNAME + ":" + issuesComment.PASSWORD))
            issuesComment.xhr.send(payload);
        },
        checkUser: function() {
            issuesComment.xhr.open('GET', 'https://api.github.com/user', true);
            issuesComment.xhr.setRequestHeader("Authorization", "Basic " + btoa(issuesComment.USERNAME + ":" + issuesComment.PASSWORD))
            issuesComment.xhr.send();
        },
        updateUser: function() {
            userInfo.innerHTML = '<a href="javascript:void(0)" onclick="issuesComment.logout()"><img class="avatar" src="' + issuesComment.AVATARURL + '" title="' + issuesComment.USERNAME + '已登录"></a>';
        },
        renderComment:function(obj){
            let i=obj.length-1,output='';

        function getDateDiff(dateStr){
            var now = new Date().getTime(),
            diffValue = now - Date.parse(dateStr.slice(0,10)),
            day =diffValue/86400000,
            result;
            if(day>=365){
             result=parseInt(day/365) + " years ago";
             }
             else if(day>=1){
             result=parseInt(day) + " days ago";
             }else{
             result="today";
            }
            return result;
            }

            for(i;i>0;i--){
                output += '<li class="comment-item">\
                <img class="avatar" src="'+obj[i].user.avatar_url+'" title="'+obj[i].user.login+'">\
                <span class="comment-body">\
                <div class="comment-header">\
                <span>\
                    <span class="comment-user">'+obj[i].user.login+'</span>\
                    <span class="comment-time" title="'+obj[i].created_at.replace(/[TZ]/g," ")+'"> commented '+getDateDiff(obj[i].created_at)+'</span>\
                </span>\
                <span>#'+i+'</span>\
                </div>\
                <div class="comment-content">'+marked(obj[i].body)+'</div>\
                </span>\
                </li>'
            }
            list.innerHTML = output;
        },
        handleStateChange: function() {
            if (issuesComment.xhr.readyState == 4) {
                if (issuesComment.xhr.status == 200) {
                    if(issuesComment.flag==1){
                    issuesComment.AVATARURL = JSON.parse(issuesComment.xhr.responseText).avatar_url
                    localStorage.setItem('AVATARURL', issuesComment.AVATARURL);
                    issuesComment.success();
                    issuesComment.flag = 0;
                    }else{
                    issuesComment.renderComment(JSON.parse(issuesComment.xhr.responseText));
                    issuesComment.flag = 0;
                    }
                }

                if (issuesComment.xhr.status == 201) {
                        console.log('success!')
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

            issuesComment.USERNAME = localStorage.getItem('USERNAME');
            if (issuesComment.USERNAME) {
                issuesComment.PASSWORD = localStorage.getItem('PASSWORD')
                issuesComment.AVATARURL = localStorage.getItem('AVATARURL')
                            tip.classList.add('hidden');
            btn.classList.remove('hidden');
            text.classList.remove('hidden');
            btn.classList.remove('hidden');
                issuesComment.updateUser();
            }

            btn.addEventListener("click", function() {
                issuesComment.flag = 0;
                issuesComment.submit();
            })

            
        }
    }

})();