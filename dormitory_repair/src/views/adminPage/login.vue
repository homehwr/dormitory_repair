<template>
    <div class="bigBox">
        <img src="../../assets/admin/login.png" class="backImg">
        <div class="loginCardBox">
            <el-card class="loginCard">
                <p class="title">报修系统登录</p>
                <el-input v-model="account" placeholder="请输入手机号" class="account"></el-input>
                <el-input v-model="password" placeholder="请输入密码" class="password"></el-input>
                <el-button type="primary" class="button" @click="login">登录</el-button>
                <div class="forgetPassword">忘记密码</div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            account: '',
            password: '',
        }
    },
    mounted() {
        if (localStorage.getItem("dormitory_token") && localStorage.getItem("dormitory_work_area") && localStorage.getItem("dormitory_name") && localStorage.getItem("dormitory_duty")) {
            this.$router.push({
                path: '/manage',
            })
        }
    },
    methods: {
        saveTokenToCookie(token, expiresDays = 10) {
            // 处理特殊字符编码
            const encodedToken = encodeURIComponent(token);
            
            // 设置Cookie
            const date = new Date();
            date.setTime(date.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
            const expires = `; expires=${date.toUTCString()}`;
            const secure = window.location.protocol === 'https:' ? '; secure' : ''; // 仅HTTPS存储
            
            document.cookie = `dormitory_token=${encodedToken}${expires}; path=/;`;
            console.log('Token已存储到Cookie');
        },
        login() {
            this.$axios.post(`/login`,{
                phone: this.account,
                password: this.password
            }).then((res) => {
                if (res.data.code == 200) {
                    localStorage.setItem("dormitory_token",res.data.data[0]);
                    localStorage.setItem("dormitory_work_area",res.data.data[1]);
                    localStorage.setItem("dormitory_name",res.data.data[2]);
                    localStorage.setItem("dormitory_duty",res.data.data[3]);
                    localStorage.setItem("dormitory_account",res.data.data[4]);
                    localStorage.setItem("dormitory_workerId",res.data.data[5]);
                    console.log(res.data.data[5]);
                    this.saveTokenToCookie(res.data.data[0]);
                    this.$router.push({
                        path: '/manage',
                    })
                } else {
                    this.open();
                }
            }).catch((res) => {
                console.log(res.data);
                
            }) 
        },
        open() {
            this.$message('用户名或密码错误');
        },
    }
}
</script>

<style>
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
}
</style>

<style scoped>
.title {
    font-size: x-large;
    font-weight: 700;
    margin: 0 0 0 30%;
}
.forgetPassword:hover {
    color: skyblue;
    cursor: pointer;
}
.forgetPassword {
    font-size: small;
    position: absolute;
    bottom: 40%;
    right: 5%;
}
.button {
    width: 90%;
    position: absolute;
    bottom: 10%;
    left: 5%;
}
.account {
    margin: 10% auto 0;
}
.password {
    margin: 8% auto;
}
.loginCard {
    width: 100%;
    height: 100%;
    position: relative;
}
.loginCardBox {
    width: 20vw;
    height: 40vh;
    margin: auto;
    position: absolute;
    top: 24vh;
    left: 40%;
}
.bigBox {
    position: relative;
    width: 100%;
    height: 100%;
}

.backImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
}
</style>