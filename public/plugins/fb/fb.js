	function uploadSubmit(myForm){
        // FB.init({ appId: '377914855891849',
            // status: true,
            // cookie: true,
            // xfbml: true,
            // oauth: true
        // });
        
        // FB.login(function (response) {
            // if (response.status === 'connected') {  // 程式有連結到 Facebook 帳號
                // var uid = response.authResponse.userID; // 取得 UID
                // var accessToken = response.authResponse.accessToken; // 取得 accessToken
                // setCookie("u",uid);
                // setCookie("atnum",accessToken);
                // myForm.submit();
            // } else if (response.status === 'not_authorized') {  // 帳號沒有連結到 Facebook 程式
                // alert("請允許授權！");
            // } else {    // 帳號沒有登入
            // }
        // }, { scope: "email" });
        
        myForm.submit();
	}