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
             <el-select v-model="upload_list.gardenDistrictValue" placeholder="请选择">
                <el-option
                v-for="item in gardenDistrict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-card>
        <el-card>
            <div class="title">
                报修楼栋
            </div>
            <el-select v-model="upload_list.buildingValue" placeholder="请选择" v-if="upload_list.gardenDistrictValue=='1'">
                <el-option
                v-for="item in building_north_or_south"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="upload_list.buildingValue" placeholder="请选择" v-else-if="upload_list.gardenDistrictValue=='2'">
                <el-option
                v-for="item in building_north_or_south"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="upload_list.buildingValue" placeholder="请选择" v-else-if="upload_list.gardenDistrictValue=='3'">
                <el-option
                v-for="item in building_west"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-else disabled></el-select>
        </el-card>
        <el-card>
            <div class="title">
                报修寝室
            </div>
            <el-input v-model="upload_list.room" placeholder="请填写寝室号" class="room"></el-input>
        </el-card>
        <el-divider content-position="left">报修人信息</el-divider>
        <el-card>
            <div class="title">
                报修人
            </div>
            <el-input v-model="upload_list.name" placeholder="请填写真实姓名" class="room"></el-input>
        </el-card>
        <el-card>
            <div class="title">
                手机号
            </div>
            <el-input v-model="upload_list.phone" placeholder="请填写真实手机号" class="room"></el-input>
        </el-card>
        <el-divider content-position="left">报修详情</el-divider>
        <el-card>
            <div class="title">
                报修类型
            </div>
            <el-select v-model="upload_list.kindValue" placeholder="请选择">
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
                v-model="upload_list.textarea">
            </el-input>
        </el-card>
        <el-divider content-position="left">图片上传（非必填）</el-divider>
        <el-card>
            <el-upload
                action=""
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="upload_list.dialogImageUrl" alt="">
            </el-dialog>
        </el-card>
        <button class="submit" @click="submit">提&nbsp;交</button>
    </div>    
</template>

<script>
export default {
    data() {
      return {
        gardenDistrict: [{
          value: '1',
          label: '北苑'
        }, {
          value: '2',
          label: '南苑'
        }, {
          value: '3',
          label: '西苑'
        }],
        building_north_or_south: [{
          value: '1',
          label: '1栋'
        }, {
          value: '2',
          label: '2栋'
        }, {
          value: '3',
          label: '3栋'
        }, {
          value: '4',
          label: '4栋'
        }, {
          value: '5',
          label: '5栋'
        }, {
          value: '6',
          label: '6栋'
        }],
        building_west: [{
          value: '1',
          label: '1栋'
        }, {
          value: '2',
          label: '2栋'
        }, {
          value: '3',
          label: '3栋'
        }, {
          value: '4',
          label: '4栋'
        }, {
          value: '5',
          label: '5栋'
        }, {
          value: '6',
          label: '6栋'
        },{
          value: '7',
          label: '7栋'
        }, {
          value: '8',
          label: '8栋'
        }, {
          value: '9',
          label: '9栋'
        }, {
          value: '10',
          label: '10栋'
        }, {
          value: '11',
          label: '11栋'
        }, {
          value: '12',
          label: '12栋'
        }, {
          value: '13',
          label: '13栋'
        }, {
          value: '14',
          label: '14栋'
        }, {
          value: '15',
          label: '15栋'
        }],
        kind: [{
          value: '1',
          label: "空调维修"
        }, {
          value: '2',
          label: "热水维修"
        }, {
          value: '3',
          label: "网络维修"
        }, {
          value: '4',
          label: "风扇维修"
        }, {
          value: '5',
          label: "灯维修"
        }, {
          value: '6',
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
          dialogImageUrl: '',
          UUID:''
        },
        dialogVisible: false
      }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        back() {
          this.$router.push({
            path: '/stu/index'
          })
        },
        submit() {
          this.upload_list.UUID = localStorage.getItem('dormitory_repair_userId');
          this.$axios.post(`/student/submit`,this.upload_list)
          .then((res) => {
            console.log(res.data);
            
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