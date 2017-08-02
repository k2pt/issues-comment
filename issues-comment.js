(function() {
    issuesComment = {
        USERNAME: "",
        PASSWORD: "",
        AVATARURL: "",
        xhr:1,
        flag: 0,
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
            issuesComment.checkUser();
        },
        success: function() {
            localStorage.setItem('USERNAME', issuesComment.USERNAME);
            localStorage.setItem('PASSWORD', issuesComment.PASSWORD);
            issuesComment.getUserInfo();
        },
        submit: function(method) {
            var payload;
            if (method == 1) {
                issuesComment.xhr.open('POST', 'https://api.github.com/repos/HTML50/HTML50.github.io/issues/3/comments', true);
                payload = JSON.stringify({ "body": "login" });
            } else {
                issuesComment.xhr.open('POST', 'https://api.github.com/repos/HTML50/HTML50.github.io/issues/1/comments', true);
                payload = JSON.stringify({ "body": text.value });
            }
            issuesComment.xhr.setRequestHeader("Authorization", "Basic " + btoa(issuesComment.USERNAME + ":" + issuesComment.PASSWORD))
            issuesComment.xhr.send(payload);
        },
        checkUser: function() {
            issuesComment.flag = 1;
            issuesComment.submit(1);
        },
        updateUser: function() {
            userInfo.innerHTML = '<img class="avatar" src="' + issuesComment.AVATARURL + '" title="' + issuesComment.USERNAME + '已登录">';
        },
        getUserInfo: function() {
            issuesComment.xhr.open('GET', 'https://api.github.com/users/' + issuesComment.USERNAME, true);
            issuesComment.xhr.send();
        },
        renderComment:function(obj){
            let i=0,length=obj.length,output='';
            for(i;i<length;i++){
                output += '<li><div class="comment-avatar"><img class="avatar" src="'+obj[i].user.avatar_url+'" title="'+obj[i].user.login+'"><span class="comment-body">'+obj[i].body+'</span></div></li>'
            }
            list.innerHTML = output;
        },
        handleStateChange: function() {
            if (issuesComment.xhr.readyState == 4) {
                if (issuesComment.xhr.status == 200) {
                    if(issuesComment.flag==1){
                    issuesComment.AVATARURL = JSON.parse(issuesComment.xhr.responseText).avatar_url
                    localStorage.setItem('AVATARURL', issuesComment.AVATARURL)
                    issuesComment.updateUser();
                    }else{
                    issuesComment.renderComment(JSON.parse(issuesComment.xhr.responseText));
                }
                }

                if (issuesComment.xhr.status == 201) {
                    if (issuesComment.flag == 1) {
                        issuesComment.success();
                    } else {
                        console.log('success!')
                    }
                }
                if (issuesComment.xhr.status == 401) {
                    if (issuesComment.flag == 1) {
                        alert('password wrong :(')
                    } else {
                        console.log('something went wrong :(')
                    }

                }
            }
        },
        init: function() {
            issuesComment.xhr = new XMLHttpRequest();
            issuesComment.xhr.onreadystatechange = issuesComment.handleStateChange;


            issuesComment.USERNAME = localStorage.getItem('USERNAME');
            if (issuesComment.USERNAME) {
                issuesComment.PASSWORD = localStorage.getItem('PASSWORD')
                issuesComment.AVATARURL = localStorage.getItem('AVATARURL')
                issuesComment.updateUser();
                issuesComment.getComment();
            }

            btn.addEventListener("click", function() {
                issuesComment.flag = 0;
                issuesComment.submit();
            })

            
        }
    }

})();