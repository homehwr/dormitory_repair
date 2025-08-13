<template>
    <div class="repair-record-container" v-loading="loading">
        <!-- 顶部导航栏 -->
        <div class="app-header">
            <div class="header-content">
                <div class="return-button" @click="back">
                <i class="el-icon-arrow-left"></i>
                </div>
                <h1 class="page-title">修改密码</h1>
            </div>
        </div>

        <div>
            <el-card class="box-card">
                <el-form ref="ruleForm" :model="ruleForm" label-width="80px">
                    <el-form-item label="旧密码" prop="old">
                        <el-input v-model="ruleForm.old"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码"  prop="pass">
                        <el-input v-model="ruleForm.pass"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input v-model="ruleForm.checkPass"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        var checkOld = (old, value, callback) => {
        if (!value) {
          return callback(new Error('旧密码不能为空'));
        }
        callback();
      };
      var validatePass = (old, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          old: ''
        },
        workerId: localStorage.getItem("dormitory_workerId"),
        duty: localStorage.getItem("dormitory_duty"),
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          old: [
            { validator: checkOld, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$axios.post(`/user/resetPassword?id=${Number(this.workerId)}&old=${this.ruleForm.old}&newPW=${this.ruleForm.pass}`).then(res => {
                if (res.data.code === 200) {
                    this.$message.success('修改密码成功！');
                    this.resetForm(formName);
                } else {
                    this.$message.error(res.data.data);
                }
              }).catch(err => {
              });
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        back() {
            this.$router.push({
                path: '/worker'
            })
        }
    }
}
</script>
<style scoped>
.box-card {
    width: 90%;
    margin: 2vh auto;
    border-radius: 1rem;
}
.repair-record-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  padding-bottom: 20px;
}

/* 顶部导航栏样式 */
.app-header {
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
  padding: 15px 0;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
}

.return-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.return-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.return-button i {
  font-size: 22px;
  color: white;
  font-weight: bold;
}

.page-title {
  flex: 1;
  text-align: center;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  padding-right: 40px; /* 平衡返回按钮位置 */
}
</style>