<template>
  <div class="login-container">
    <!-- 背景层 -->
    <div class="background-layer">
      <div class="background-overlay"></div>
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="card-header">
        <div class="logo-container">
          <div class="logo-circle">
            <i class="el-icon-s-custom logo-icon"></i>
          </div>
        </div>
        <h1 class="title">学生公寓报修系统</h1>
        <p class="subtitle">管理员登录入口</p>
      </div>

      <div class="card-body">
        <el-form @submit.native.prevent="login">
          <el-form-item>
            <el-input 
              v-model="account" 
              placeholder="请输入手机号"
              prefix-icon="el-icon-user"
              size="large"
            >
            </el-input>
          </el-form-item>
          
          <el-form-item>
            <el-input 
              v-model="password" 
              placeholder="请输入密码" 
              show-password
              prefix-icon="el-icon-lock"
              size="large"
            >
            </el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              class="login-button"
              native-type="submit"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="footer-links">
          <div class="link-group">
            <el-link 
              type="info" 
              class="forget-link"
              @click="showForgetPassword"
            >
              忘记密码?
            </el-link>
            <el-link 
              type="primary" 
              class="student-link"
              @click="goToStudentPage"
            >
              <i class="el-icon-user"></i> 我是学生，无需登录
            </el-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer-info">
      <p>赣南师范大学鸿源数字思政创新研究中心</p>
      <p>© 2025 学生公寓报修系统</p>
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
   beforeRouteEnter(to, from, next) {
    // 注意：在此守卫内无法访问 `this`，因为组件实例还没被创建
    next((vm) => {
      // 通过回调函数的 `vm` 参数访问组件实例，执行跳转逻辑
      vm.checkAuthAndRedirect();
    });
  },
  mounted() {
    // 可以保留，但主要逻辑已由路由守卫处理
    console.log('登录组件挂载');
  },
  methods: {

    saveTokenToCookie(token, expiresDays = 10) {
      const encodedToken = encodeURIComponent(token);
      const date = new Date();
      date.setTime(date.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
      const expires = `; expires=${date.toUTCString()}`;
      const secure = window.location.protocol === 'https:' ? '; secure' : '';
      
      document.cookie = `dormitory_token=${encodedToken}${expires}; path=/;`;
    },
    checkAuthAndRedirect() {
     console.log(localStorage);
      if (localStorage.getItem("dormitory_token") && localStorage.getItem("dormitory_name") && localStorage.getItem("dormitory_duty") === '0') {
        this.$router.push({
          path: '/manage',
        })
      } else if (localStorage.getItem("dormitory_token") && localStorage.getItem("dormitory_work_area") && localStorage.getItem("dormitory_name") && localStorage.getItem("dormitory_duty") === '1') {
        this.$router.push({
          path: '/worker',
        })
      }

    },
    
    login() {
      this.$axios.post(`/login`,{
        phone: this.account,
        password: this.password
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("登录成功！");
          // console.log(res.data)
          localStorage.setItem("dormitory_token",res.data.data[0]);
          localStorage.setItem("dormitory_work_area",res.data.data[1]);
          localStorage.setItem("dormitory_name",res.data.data[2]);
          localStorage.setItem("dormitory_duty",res.data.data[3]);
          localStorage.setItem("dormitory_account",res.data.data[4]);
          localStorage.setItem("dormitory_workerId",res.data.data[5]);
          this.saveTokenToCookie(res.data.data[0]);
          const duty = localStorage.getItem('dormitory_duty');
          // console.log(duty);
          
          if (duty === '0') {
            console.log(1);
            
            this.$router.push({
              path: '/manage',
            })
          } else if (duty === '1' || duty === '2' || duty === '3') {
            console.log(2);
            
            this.$router.push({
              path: '/worker',
            })
          }
          
        } else {
          this.$message.error("用户名或密码错误");
        }
      }).catch(() => {
        this.$message.error("账号或密码错误！")
      }) 
    },
    
    showForgetPassword() {
      this.$alert('请联系管理员重置密码', '忘记密码', {
        confirmButtonText: '确定',
        customClass: 'forget-password-alert'
      });
    },
    
    goToStudentPage() {
      this.$router.push("/stu");
    }
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 20px;
  overflow: hidden;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../../assets/admin/login.png') no-repeat center center;
  background-size: cover;
  z-index: 0;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(37, 117, 252, 0.85);
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  z-index: 2;
}

.circle-1 {
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.1);
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.08);
  bottom: -50px;
  right: 20%;
}

.circle-3 {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.06);
  top: 30%;
  right: -30px;
}

.login-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-header {
  text-align: center;
  padding: 35px 20px 20px;
  background: linear-gradient(to right, #2575fc, #6a11cb);
  color: white;
}

.logo-container {
  margin-bottom: 15px;
}

.logo-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.logo-icon {
  font-size: 40px;
  color: white;
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 10px 0 5px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 5px;
}

.card-body {
  padding: 30px 25px 25px;
}

.el-form-item {
  margin-bottom: 25px;
}

.login-button {
  width: 100%;
  height: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 2px;
  background: linear-gradient(to right, #2575fc, #6a11cb);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(37, 117, 252, 0.4);
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(37, 117, 252, 0.6);
}

.footer-links {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.link-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forget-link {
  font-size: 0.9rem;
  color: #6c757d !important;
}

.forget-link:hover {
  color: #2575fc !important;
}

.student-link {
  font-size: 0.95rem;
  font-weight: 500;
}

.footer-info {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  line-height: 1.6;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .login-card {
    max-width: 90%;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .card-body {
    padding: 25px 20px 20px;
  }
  
  .link-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .student-link {
    margin-top: 5px;
  }
}

@media (max-width: 360px) {
  .title {
    font-size: 1.3rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .login-button {
    height: 46px;
    font-size: 1rem;
  }
}
</style>

<style>
/* 全局样式调整 */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* 忘记密码弹窗样式 */
.forget-password-alert {
  border-radius: 16px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
}

.forget-password-alert .el-message-box__header {
  background: linear-gradient(to right, #2575fc, #6a11cb);
  border-radius: 16px 16px 0 0 !important;
  padding: 15px 20px;
}

.forget-password-alert .el-message-box__title {
  color: white;
  font-weight: 600;
}

.forget-password-alert .el-message-box__content {
  padding: 25px 20px;
  font-size: 1.05rem;
  color: #555;
  text-align: center;
}

.forget-password-alert .el-message-box__btns {
  padding: 0 20px 20px;
  justify-content: center;
}

.forget-password-alert .el-button {
  border-radius: 10px;
  padding: 10px 30px;
  background: linear-gradient(to right, #2575fc, #6a11cb);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s;
}

.forget-password-alert .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(37, 117, 252, 0.4);
}

/* 输入框样式优化 */
.el-input__inner {
  border-radius: 12px !important;
  padding-left: 45px !important;
  height: 50px !important;
  font-size: 1rem;
  border: 1px solid #e0e0e0 !important;
  transition: all 0.3s;
}

.el-input__inner:focus {
  border-color: #2575fc !important;
  box-shadow: 0 0 0 2px rgba(37, 117, 252, 0.2) !important;
}

.el-input__prefix {
  left: 15px !important;
  font-size: 1.2rem;
  color: #6a11cb !important;
}
</style>