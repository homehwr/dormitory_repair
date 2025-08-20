<template>
    <div class="set-password">
        <div class="set-container1">
        <el-card style="height: 400px;">
            <div slot="header">修改密码</div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="left">
            <el-form-item label="旧密码" prop="old">
            <el-input type="password" v-model.number="ruleForm.old" ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
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
                console.log(res.data);
                if (res.data.code === 200) {
                    this.$message.success('修改密码成功！');
                    this.resetForm(formName);
                } else {
                    this.$message.error(res.data.data);
                }
                }).catch(err => {
                console.log(err);
            });
          } else {
            console.log('提交失败，请稍后再试');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped>  
.set-container1{
    margin: 5vw auto;
    width: 30%;
}
.set-container2{
    margin: 5vw auto;
    width: 30%;
}
.demo-ruleForm{
    margin: 20px auto;
}
</style>