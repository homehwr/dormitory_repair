<template>
  <div class="repair-apply-container">
    <!-- 顶部导航栏 -->
    <div class="app-header">
      <div class="header-content">
        <div class="return-button" @click="back">
          <i class="el-icon-arrow-left"></i>
        </div>
        <h1 class="page-title">我要报修</h1>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="form-container">
      <!-- 报修区域 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-location-outline section-icon"></i>
          <h2>报修区域</h2>
        </div>
        
        <el-card class="form-card" shadow="hover">
          <div class="form-item">
            <label class="form-label">
              <i class="el-icon-office-building label-icon"></i>
              报修苑区
            </label>
            <el-select 
              v-model="upload_list.gardenDistrictValue" 
              placeholder="请选择苑区"
              class="form-select"
              @change="getBuildings"
              :class="{ 'error-border': showError.gardenDistrict }"
            >
              <el-option
                v-for="item in gardenDistrict"
                :key="item.key"
                :label="item.area"
                :value="item.key">
              </el-option>
            </el-select>
          </div>
          
          <div class="form-item">
            <label class="form-label">
              <i class="el-icon-school label-icon"></i>
              报修楼栋
            </label>
            <el-select 
              v-model="upload_list.buildingValue" 
              placeholder="请先选择苑区"
              class="form-select"
              :disabled="!upload_list.gardenDistrictValue"
              :class="{ 'error-border': showError.building }"
            >
              <el-option
                v-for="item in buildings"
                :key="item.key"
                :label="item.area"
                :value="item.key">
              </el-option>
            </el-select>
          </div>
          
          <div class="form-item">
            <label class="form-label">
              <i class="el-icon-house label-icon"></i>
              报修寝室
            </label>
            <el-input 
              v-model="upload_list.room" 
              placeholder="请输入寝室号（如101）"
              class="form-input"
              :class="{ 'error-border': showError.room }"
              @blur="validateRoom"
              @input="sanitizeRoomInput"
            ></el-input>
            <div v-if="showError.room" class="error-message">
              寝室号格式不正确
            </div>
          </div>
        </el-card>
      </div>

      <!-- 报修人信息 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-user section-icon"></i>
          <h2>报修人信息</h2>
        </div>
        
        <el-card class="form-card" shadow="hover">
          <div class="form-item">
            <label class="form-label">
              <i class="el-icon-user-solid label-icon"></i>
              报修人
            </label>
            <el-input 
              v-model="upload_list.name" 
              placeholder="请输入真实姓名"
              class="form-input"
              :class="{ 'error-border': showError.name }"
              @focus="clearError('name')"
            ></el-input>
          </div>
          
          <div class="form-item">
            <label class="form-label">
              <i class="el-icon-mobile-phone label-icon"></i>
              手机号
            </label>
            <el-input 
              v-model="upload_list.phone" 
              placeholder="请输入真实手机号"
              class="form-input"
              :class="{ 'error-border': showError.phone }"
              @blur="validatePhone"
              @input="sanitizePhoneInput"
              maxlength="11"
            ></el-input>
            <div v-if="showError.phone" class="error-message">
              手机号格式不正确，应为11位数字且以1开头
            </div>
          </div>
        </el-card>
      </div>

      <!-- 报修详情 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-tickets section-icon"></i>
          <h2>报修详情</h2>
        </div>
        
        <el-card class="form-card" shadow="hover">
          <div class="form-item">
            <label class="form-label">
              <i class="el-icon-collection-tag label-icon"></i>
              报修类型
            </label>
            <el-select 
              v-model="upload_list.kindValue" 
              placeholder="请选择报修类型"
              class="form-select"
              :class="{ 'error-border': showError.kindValue }"
            >
              <el-option
                v-for="item in kind"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          
          <div class="form-item">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请详细描述报修问题（如：空调不制冷、水管漏水等）"
            v-model="upload_list.textarea"
            class="form-textarea"
            :class="{ 'error-border': showError.textarea }"
            @focus="clearError('textarea')"
            maxlength="250"
            show-word-limit
          ></el-input>
            <div class="form-tips">
              <i class="el-icon-warning-outline"></i> 请填写真实准确的报修详情
            </div>
          </div>
        </el-card>
      </div>

      <!-- 图片上传 -->
      <div class="form-section">
        <div class="section-header">
          <i class="el-icon-picture-outline section-icon"></i>
          <h2>问题图片（选填）</h2>
        </div>
        
        <el-card class="form-card" shadow="hover">
          <el-upload
            :http-request="upload"
            action="#"
            accppet=".jpg,.png,.jpeg,.gif,.bmp,webp,svg"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :limit="4"
            :before-upload="beforeUploadImg"
            :on-exceed="handleExceed"
            class="image-uploader"
          >
            <i class="el-icon-plus"></i>
            <div class="upload-tips">上传图片</div>
          </el-upload>
          
          <el-dialog :visible.sync="dialogVisible" width="90%" top="5vh">
            <img width="100%" :src="nowImageUrl" alt="报修问题图片">
          </el-dialog>
        </el-card>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <el-button 
          type="primary" 
          class="submit-button"
          @click="submit"
          :loading="submitting"
        >
          <i class="el-icon-upload2"></i> 提交报修申请
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { on } from 'process';

export default {
  data() {
    return {
      gardenDistrict: [],
      buildings: [],
      kind: [
        { value: '1', label: "空调维修" },
        { value: '2', label: "热水维修" },
        { value: '3', label: "网络维修" },
        { value: '4', label: "其它维修" }
      ],
      upload_list: {
        gardenDistrictValue: '',
        buildingValue: '',
        room: '',
        name: '',
        phone: '',
        kindValue: '',
        textarea: '',
        dialogImageUrl: [],
        uuid: ''
      },
      fileUrlMap: {} ,// 新增：存储文件UID和URL的映射
      dialogVisible: false,
      nowImageUrl: '',
      fileList: [],
      submitting: false,
      showError: {
        gardenDistrict: false,
        building: false,
        room: false,
        name: false,
        phone: false,
        kindValue: false,
        textarea: false
      }
    }
  },
  mounted() {
    this.$axios.get("/area/getGeneral").then((res) => {
      this.gardenDistrict = res.data;
    })
  },
  methods: {
    // 优化手机号输入处理
    sanitizePhoneInput() {
      // 只允许输入数字
      this.upload_list.phone = this.upload_list.phone.replace(/\D/g, '');
      // 自动清除错误状态
      if (this.showError.phone) this.validatePhone();
    },
    
    // 优化寝室号输入处理
    sanitizeRoomInput() {
      // 只允许输入数字
      this.upload_list.room = this.upload_list.room.replace(/\D/g, '');
      // 自动清除错误状态
      if (this.showError.room) this.validateRoom();
    },
    
    // 验证手机号格式
    validatePhone() {
      const phone = this.upload_list.phone;
      if (!phone) {
        this.showError.phone = true;
        return false;
      }
      
      // 手机号正则：11位数字，以1开头
      const phoneRegex = /^1[3-9]\d{9}$/;
      this.showError.phone = !phoneRegex.test(phone);
      return !this.showError.phone;
    },
    
    // 验证寝室号格式
    validateRoom() {
      const room = this.upload_list.room;
      if (!room) {
        this.showError.room = true;
        return false;
      }
      
      // 寝室号正则：3-4位数字，不能以0开头
      const roomRegex = /^[1-9]\d{2,3}$/;
      this.showError.room = !roomRegex.test(room);
      return !this.showError.room;
    },
    
    upload(params) {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('uid', params.file.uid);

      this.$axios.post('http://parliy.com:83/api/student/uploadImg', formData, {
        // this.$axios.post('http://localhost:8088/student/uploadImg', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(response => {
        this.upload_list.dialogImageUrl.push(response.data.data);
        this.fileUrlMap[params.file.uid] = response.data.data;
        this.$message.success('图片上传成功');
      }).catch(error => {
        this.$message.error('图片上传失败');
      });
    },
    // handleSuccess(response,file) {
    //   this.upload_list.dialogImageUrl.push(response.data);
    //     // 建立UID和URL的映射关系
    //   console.log(this.fileUrlMap);
    // },
  handleRemove(file) {
    try {
        if (!this.upload_list || !this.upload_list.dialogImageUrl) {
            return;
        }
        
        const imageUrl = this.fileUrlMap[file.uid];
        if (!imageUrl) {
            console.warn('未找到对应文件的URL映射');
            return;
        }
        
        // 简单地从URL中提取文件名（假设URL格式为 http://xxx.com/images/文件名.jpg）
        const fileName = imageUrl.split('/').pop();
        
        if (!fileName) {
            this.$message.error('无法解析文件名');
            return;
        }
        
        // 调用后端删除
        this.$axios.delete(`http://parliy.com:83/api/student/deleteImg?fileName=${fileName}`)
            .then(response => {
                if (response.data.code === 200) {
                    const imageIndex = this.upload_list.dialogImageUrl.findIndex(url => 
                        url === imageUrl
                    );
                    
                    if (imageIndex !== -1) {
                        this.upload_list.dialogImageUrl.splice(imageIndex, 1);
                        delete this.fileUrlMap[file.uid];
                        this.$message.success('图片删除成功');
                    }
                } else {
                    this.$message.error('删除失败');
                }
            })
            .catch(error => {
                console.error('删除接口调用失败:', error);
                this.$message.error('删除失败');
            });
            
    } catch (error) {
        console.error('移除图片时发生错误:', error);
        this.$message.error('移除图片失败');
    }
},
    handlePictureCardPreview(file) {
      this.nowImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleExceed() {
      this.$message.warning('最多只能上传4张图片');
    },
    back() {
      this.$router.push({ path: '/stu/index' });
    },
    clearError(field) {
      this.showError[field] = false;
    },
       // 上传  文件，只能是图片
        beforeUploadImg(file) {
          const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
          const whiteList = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
          if (whiteList.indexOf(fileSuffix) === -1) {
            this.$message({
              message: '上传文件只能是图片',
              type: 'error',
              center: true
            });
            return false;
          }
        },
    validateForm() {
      let isValid = true;
      const requiredFields = [
        'gardenDistrictValue', 'buildingValue', 'room', 
        'name', 'phone', 'kindValue', 'textarea'
      ];
      
      // 验证必填项
      requiredFields.forEach(field => {
        if (!this.upload_list[field]) {
          this.showError[field] = true;
          isValid = false;
        } else {
          this.showError[field] = false;
        }
      });
      
      // 单独验证手机号和寝室号格式
      if (!this.validatePhone()) isValid = false;
      if (!this.validateRoom()) isValid = false;
      
      return isValid;
    },
    submit() {
      if (!this.validateForm()) {
        this.$message.error('请填写完整且格式正确的信息');
        return;
      }

      this.submitting = true;
      this.upload_list.uuid = localStorage.getItem('dormitory_repair_userId');
      
      this.$axios.post(`/student/submit`, this.upload_list)
        .then(() => {
          this.$message.success('报修申请提交成功');
          // 重置表单
          Object.keys(this.upload_list).forEach(key => {
            if (key !== 'dialogImageUrl') {
              this.upload_list[key] = '';
            }
          });
          this.upload_list.dialogImageUrl = [];
          this.fileList = [];
        })
        .catch(error => {
          console.error(error);
          this.$message.error('提交失败，请稍后重试');
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    getBuildings() {
      this.$axios.get(`/area/getBuildings?key=${this.upload_list.gardenDistrictValue}`)
        .then((res) => {
          this.buildings = res.data;
          this.upload_list.buildingValue = '';
        });
    }
  }
}
</script>

<style scoped>
.repair-apply-container {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  padding-bottom: 30px;
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
  padding-right: 40px;
}

/* 表单容器样式 */
.form-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 15px;
}

/* 表单区块样式 */
.form-section {
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-left: 10px;
}

.section-icon {
  font-size: 24px;
  color: #409EFF;
  margin-right: 12px;
}

.section-header h2 {
  font-size: 1.2rem;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

/* 表单卡片样式 */
.form-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
}

.form-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}

/* 表单项样式 */
.form-item {
  margin-bottom: 20px;
  position: relative;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.95rem;
  color: #606266;
  font-weight: 500;
}

.label-icon {
  font-size: 18px;
  margin-right: 8px;
  color: #409EFF;
}

.form-select, .form-input {
  width: 100%;
}

.form-textarea {
  width: 100%;
}

.form-tips {
  font-size: 0.85rem;
  color: #909399;
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.form-tips i {
  margin-right: 5px;
  color: #E6A23C;
}

/* 图片上传样式 */
.image-uploader {
  text-align: center;
}

.upload-tips {
  font-size: 0.9rem;
  color: #909399;
  margin-top: 5px;
}

/* 提交按钮区域 */
.submit-section {
  margin-top: 30px;
  text-align: center;
}

.submit-button {
  width: 100%;
  max-width: 400px;
  height: 50px;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 2px;
  border-radius: 12px;
  background: linear-gradient(to right, #409EFF, #6a11cb);
  border: none;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(64, 158, 255, 0.4);
}

.submit-button i {
  margin-right: 8px;
}

/* 错误边框样式 */
.error-border >>> .el-input__inner,
.error-border >>> .el-textarea__inner,
.error-border >>> .el-select .el-input__inner {
  border-color: #F56C6C !important;
}

/* 错误提示文字样式 */
.error-message {
  color: #F56C6C;
  font-size: 12px;
  margin-top: 5px;
  position: absolute;
  bottom: -20px;
  left: 0;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .page-title {
    font-size: 1.2rem;
  }
  
  .section-header h2 {
    font-size: 1.1rem;
  }
  
  .form-label {
    font-size: 0.9rem;
  }
  
  .submit-button {
    height: 46px;
    font-size: 1rem;
  }
  
  .error-message {
    font-size: 11px;
    bottom: -18px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 15px;
  }
  
  .return-button {
    width: 36px;
    height: 36px;
  }
  
  .section-header {
    padding-left: 5px;
  }
  
  .section-icon {
    font-size: 20px;
    margin-right: 8px;
  }
}
</style>

<style>
/* 全局样式调整 */
.image-uploader .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 110px;
  border: 1px dashed #409EFF;
  background-color: #f0f7ff;
}

.image-uploader .el-upload--picture-card:hover {
  border-color: #6a11cb;
}

.image-uploader .el-upload-list__item {
  transition: all 0.3s;
}

.image-uploader .el-upload-list__item:hover {
  transform: scale(1.03);
}

.el-dialog__header {
  background: linear-gradient(to right, #409EFF, #6a11cb);
  border-radius: 12px 12px 0 0 !important;
  padding: 15px 20px;
}

.el-dialog__title {
  color: white !important;
  font-weight: 600 !important;
}

.el-dialog__headerbtn .el-dialog__close {
  color: white !important;
}

.el-dialog__body {
  padding: 20px !important;
}
</style>