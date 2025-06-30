<template>
    <div>
        <div style="background-color: #409EFF; padding: 10px 0;margin: 0%;position: relative;">
            <div class="return" @click="back">
              <img src="../../assets/student/返回.png" width="100%">
            </div>
            <h2 style="text-align: center; color: white;margin: 0;">报修记录</h2>
        </div>
        <div class="bigBox">
            <div class="outsideTitle">
                当前状态：<span id="status">{{ status }}</span>
            </div>
            <div class="item">
                <div class="title">报修人</div>
                <div class="content">{{ repair_info.name }}</div>
            </div>
            <div class="item">
                <div class="title">手机号</div>
                <div class="content">{{ repair_info.phone }}</div>
            </div>
            <div class="item">
                <div class="title">报修地址</div>
                <div class="content">{{ address }}</div>
            </div>
            <div class="item">
                <div class="title">报修寝室</div>
                <div class="content">{{ repair_info.address3 }}</div>
            </div>
            <div class="item">
                <div class="title">报修时间</div>
                <div class="content">{{ time }}</div>
            </div>
            <div class="item">
                <div class="title">报修详情</div>
                <div class="content" style="word-wrap: break-word;">{{ repair_info.info }}</div>
            </div>
            <div class="outsideTitle">
                图片
            </div>
            <div v-if="img_list.length === 0" class="content item" style="width: 100%;">暂无图片</div>
            <div v-else class="content item" style="width: 100%;text-indent: 0.5em;">
                <div v-for="(item,index) in img_list" :key=index style="display: inline-block;">
                    <el-image
                    style="width: 100px; height: 100px"
                    :src="item"
                    :preview-src-list="['http://sqh.gnnu.edu.cn/api/image/22332.0%E6%9C%B1%E9%92%A6%E8%83%9C.jpg','http://sqh.gnnu.edu.cn/api/image/22332.0%E6%9C%B1%E9%92%A6%E8%83%9C.jpg']">
                    </el-image>
                </div>
            </div>
            <div style="height:20px"></div>
            <div class="item">
                <div class="title">维修师傅</div>
                <div class="content">邱清华</div>
            </div>
            <div class="item">
                <div class="title">联系方式</div>
                <div class="content">12345678910</div>
            </div>
            <div class="item">
                <div class="title">服务评分</div>
                <div style="display:inline-block;"><el-rate v-model="value1"></el-rate></div>
            </div>
            <div class="item" v-if="repair_info.status == 0 || repair_info.status == 3" id="cancel">
                <el-button type="danger" style="width:130px; margin-left:calc(50% - 65px)" @click="cancel">取消报修</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import repair_dataplatformVue from '../adminPage/repair_dataplatform.vue'
export default {
    data() {
        return {
            repair_info: {},
            address: '',
            time: '',
            img_list: [],
            value1: '',
            status: ''
        }
    },
    async mounted() {
        if (!this.$route.params.id){
            return;
        }
        await this.$axios.get(`/student/getRecordById?id=${this.$route.params.id}`)
        .then((res) => {
            this.repair_info = res.data.data
            console.log(this.repair_info);
            if (this.repair_info.address1 === '1') {
                this.address += '南苑';
            } else if (this.repair_info.address1 === '2') {
                this.address += '西苑';
            } else if (this.repair_info === '3') { 
                this.address += '北苑';
            }
            this.address += this.repair_info.address2 + "栋" + ' ' + this.repair_info.address3;
            this.time = this.repair_info.start_time.substring(0,10) + ' ' + this.repair_info.start_time.substring(11,19)
            if (this.repair_info.info_img != '' || this.repair_info.info_img != null) {
                this.img_list = this.repair_info.info_img.split(',');
            }
            if (this.repair_info.status === 0) {
                this.status = '待维修';
            } else if (this.repair_info.status === 1) {
                this.status = '已维修';
            } else if (this.repair_info.status === 2) { 
                this.status = '已取消';
            } else if (this.repair_info.status === 3) {
                this.status = '已转对应服务商';
            }
        })

        let element = document.getElementById('status');
        console.log(element);
        
        if (element.innerHTML === '待维修') {
            element.style.color = 'red';
        } else if (element.innerHTML === '已维修') {
            element.style.color = 'green';
        } else if (element.innerHTML === '已取消') {
            element.style.color = '#42414184';
        } else if (element.innerHTML === '已转对应服务商') {
            element.style.color = '#ff8800c1';
        }
    },
    methods: {
        back() {
            this.$router.push({
                path: '/stu/record',
            })
        },
        cancel() {
            this.$axios.post(`/student/updateStatus?id=${this.repair_info.id}&status=2`)
            .then(() => {
                this.$message('取消成功')
                document.getElementById('cancel').remove();
            })
        }
    }
}
</script>

<style scoped>
.return {
  height: 30px;
  width: 30px;
  position: absolute;
  top: calc(50% - 15px);
  left: 2%;
}

.bigBox {
    background-color: #DCDFE6;
    width: 100%;
    height: 100vh;
}

.item {
    display: flex;
    align-items: flex-start; /* 子元素在容器的起始位置对齐 */
    width: 100%;
    background-color: white;
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #DCDFE6;
}

.title {
    display: inline-block;
    color: #42414184;
    width: 40%;
    font-size: 1em;
    text-indent: 1em;
}

.content {
    display: inline-block;
    color: black;
    width: 60%;
    font-size:1em;
}

.outsideTitle {
    color: #42414184;
    text-indent: 1em;
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>