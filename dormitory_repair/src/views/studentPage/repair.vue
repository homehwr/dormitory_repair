<template>
    <div>
        <div style="background-color: #409EFF; padding: 10px 0;margin: 0%;position: relative;">
            <div class="return" @click="back">
              <img src="../../assets/student/返回.png" width="100%">
            </div>
            <h2 style="text-align: center; color: white;margin: 0;">我要报修</h2>
        </div>

        <el-divider content-position="left">请选择报修区域</el-divider>
        <el-card>
            <div class="title">
                报修苑区
            </div>
             <el-select v-model="upload_list.gardenDistrictValue" placeholder="请选择" id="gardenDistrict" 
             @click.native="isClick($event)" @change="getBuildings">
                <el-option
                v-for="item in gardenDistrict"
                :key="item.key"
                :label="item.area"
                :value="item.key">
                </el-option>
            </el-select>
        </el-card>
        <el-card>
            <div class="title">
                报修楼栋
            </div>
            <el-select v-model="upload_list.buildingValue" placeholder="请选择" :disabled="!upload_list.gardenDistrictValue" id="building" @click.native="isClick($event)">
                <el-option
                v-for="item in buildings"
                :key="item.key"
                :label="item.area"
                :value="item.key">
                </el-option>
            </el-select>

        </el-card>
        <el-card>
            <div class="title">
                报修寝室
            </div>
            <el-input v-model="upload_list.room" placeholder="请填写寝室号" class="room" id="room" @click.native="isClick($event)"></el-input>
        </el-card>
        <el-divider content-position="left">报修人信息</el-divider>
        <el-card>
            <div class="title">
                报修人
            </div>
            <el-input v-model="upload_list.name" placeholder="请填写真实姓名" class="room" id="name" @click.native="isClick($event)"></el-input>
        </el-card>
        <el-card>
            <div class="title">
                手机号
            </div>
            <el-input v-model="upload_list.phone" placeholder="请填写真实手机号" class="room" id="phone" @click.native="isClick($event)"></el-input>
        </el-card>
        <el-divider content-position="left">报修详情</el-divider>
        <el-card>
            <div class="title">
                报修类型
            </div>
            <el-select v-model="upload_list.kindValue" placeholder="请选择" id="kindValue" @click.native="isClick($event)">
                <el-option
                v-for="item in kind"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-card>
        <el-card>
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请填写真实准确报修详情，如填写错误，可在报修记录中撤销本次报修！"
                v-model="upload_list.textarea"
                id="textarea"
                @click.native="isClick($event)">
            </el-input>
        </el-card>
        <el-divider content-position="left">图片上传（非必填）</el-divider>
        <el-card>
            <el-upload
                :http-request="upload"
                action="http://localhost:8088/student/uploadImg"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" width="100%">
                <img width="100%" :src="nowImageUrl" alt="">
            </el-dialog>
        </el-card>
        <button class="submit" @click="submit">提&nbsp;交</button>
    </div>    
</template>

<script>
export default {
    data() {
      return {
        gardenDistrict: [],
        buildings: [],
        kind: [{
          value: '1',
          label: "空调维修"
        }, {
          value: '2',
          label: "热水维修"
        }, {
          value: '3',
          label: "网络维修"
        },{
          value: '4',
          label: "其它"
        }],
        upload_list: {
          gardenDistrictValue: '',
          buildingValue: '',
          room:'',
          name:'',
          phone:'',
          kindValue: '',
          textarea: '',
          dialogImageUrl: [],
          uuid:[]
        },
        dialogVisible: false,
        nowImageUrl:''
      }
    },
    mounted() {
      this.$axios.get("/area/getGeneral").then((res) => {
        this.gardenDistrict = res.data;
      })
    },
    methods: {
       upload(params) {
          // 创建 FormData 对象
          const formData = new FormData();

          // 将文件添加到 FormData 中
          formData.append('file', params.file);

          // 将 uid 添加到 FormData 中
          formData.append('uid', params.file.uid);

          // 使用 axios 发送 POST 请求
          this.$axios.post('/student/uploadImg', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          })
          .then(response => {
              // console.log('上传成功:', response.data);
              this.upload_list.dialogImageUrl.push(response.data.data);
          })
          .catch(error => {
              // console.error('上传失败:', error);
          });
        },
        handleSuccess(response) {
          this.upload_list.dialogImageUrl.push(response.data);
        },
        handleRemove(file) {
          this.$axios.delete(`/student/deleteImg?fileName=${file.response.data}`)
        },
        handlePictureCardPreview(file) {
            this.nowImageUrl = file.url;
            this.dialogVisible = true;
        },
        back() {
          this.$router.push({
            path: '/stu/index'
          })
        },
        submit() {
          let isEmpty = false;
          if (this.upload_list.gardenDistrictValue === '') {
            const ele = document.getElementById("gardenDistrict");
            ele.style.border = '1px solid red';
            isEmpty = true;
          }
          if (this.upload_list.buildingValue === '') {
            const ele = document.getElementById("building");
            ele.style.border = '1px solid red';
            isEmpty = true;
          }
          if (this.upload_list.room === '') {
            const ele = document.getElementById("room");
            ele.style.border = '1px solid red';
            isEmpty = true;
          }
          if (this.upload_list.name === '') {
            const ele = document.getElementById("name");
            ele.style.border = '1px solid red';
            isEmpty = true;
          }
          if (this.upload_list.phone === '') {
            const ele = document.getElementById("phone");
            ele.style.border = '1px solid red';
            isEmpty = true;
          }
          if (this.upload_list.kindValue === '') {
            const ele = document.getElementById("kindValue");
            ele.style.border = '1px solid red';
            isEmpty = true;
          }
          if (this.upload_list.textarea === '') {
            const ele = document.getElementById("textarea");
            ele.style.border = '1px solid red';
            isEmpty = true;
          }
          if (isEmpty) {
            this.open();
            return;
          }
          this.upload_list.uuid = localStorage.getItem('dormitory_repair_userId');
          console.log(this.upload_list);
          
          this.$axios.post(`/student/submit`,this.upload_list)
          .then(() => {
            this.upload_list.buildingValue = '';
            this.upload_list.dialogImageUrl = [];
            this.upload_list.gardenDistrictValue = '';
            this.upload_list.kindValue = '';
            this.upload_list.name = '';
            this.upload_list.phone = '';
            this.upload_list.room = '';
            this.upload_list.textarea = '';
            this.upload_list.uuid = '';
            const elements = document.getElementsByClassName('el-upload-list');
            console.log(elements[0]);
            elements[0].remove();
            this.$message.success('提交成功');
          })
        },
        isClick(event) {
          if (event.target.style.border === '1px solid red') {
            event.target.style.border = '1px solid #DCDFE6';
          }
        },
        open() {
          this.$message('请填写完整信息');
        },
        getBuildings(){
          this.$axios.get(`/area/getBuildings?key=${this.upload_list.gardenDistrictValue}`).then((res) => {
            this.buildings = res.data;
          })
        }
    }
}
</script>

<style scoped>
.title {
    display: inline-block;
    margin-right: 14%;
    width: 64px;
}

.el-input {
    width: 66%;
}

.room ::v-deep .el-input__inner {
    width: 221px;
}

.submit {
    border-radius: 0.5rem;
    background-color: #409eff;
    width: 90%;
    height: 40px;
    margin: 2% 5%;
    color: white;
    font-size: 20px;
    border: 1px solid white;
}

.return {
  height: 30px;
  width: 30px;
  position: absolute;
  top: calc(50% - 15px);
  left: 2%;
}
</style>