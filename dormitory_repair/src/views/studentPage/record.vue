<template>
    <div  v-loading="loading">
        <div style="background-color: #409EFF; padding: 10px 0;margin: 0%;position: relative;">
            <div class="return" @click="back">
              <img src="../../assets/student/返回.png" width="100%">
            </div>
            <h2 style="text-align: center; color: white;margin: 0;">报修记录</h2>
        </div>
        <div v-for="(item,index) in data_list" :key="index" class="record_card" @click="toDetail(item.id)">
            <div class="info">{{ item.info }}</div>
            <div class="content">
                <div class="content_title">当前状态：</div>
                <div class="content_content" id="status">{{ item.status }}</div>
            </div>
            <div class="content">
                <div class="content_title">报修时间：</div>
                <div class="content_content">{{ item.start_time }}</div>
            </div>
            <div class="worker">
                <div class="worker_content">维修师傅：{{ item.workerName }}&nbsp;&nbsp;&nbsp;&nbsp;联系方式：12345678910</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data_list: [],
            loading: true
        }
    },
    async mounted() {
        await this.$axios.get(`/student/getRecord?UUID=${localStorage.getItem('dormitory_repair_userId')}`)
        .then((res) => {
            this.data_list = res.data.data;
            for (let i = 0;i < this.data_list.length;i++) {
                if (this.data_list[i].status === 0) {
                    this.data_list[i].status = '待维修';
                } else if (this.data_list[i].status === 1) {
                    this.data_list[i].status = '已维修'
                } else if (this.data_list[i].status === 2) {
                    this.data_list[i].status = '已取消'
                } else if (this.data_list[i].status === 3) {
                    this.data_list[i].status = '已转对应服务商'
                }
                this.data_list[i].start_time = this.data_list[i].start_time.substring(0,10) + ' ' + this.data_list[i].start_time.substring(11,19)
            }
        })
        let status = document.querySelectorAll("#status");
        for (let i = 0;i < status.length;i++) {
            if (status[i].innerHTML === '待维修') {
                status[i].style.color = 'red';
            } else if (status[i].innerHTML === '已维修') {
                status[i].style.color = 'green';
            } else if (status[i].innerHTML === '已取消') {
                status[i].style.color = '#42414184';
            } else if (status[i].innerHTML === '已转对应服务商') {
                status[i].style.color = '#ff8800c1';
            }
         }
         this.loading = false;
        
    },
    methods: {
        back() {
            this.$router.push({
                path: '/stu/index'
            })
        },
        toDetail(id) {
            this.$router.push({
                name: 'stuDetail',
                params: {
                    id: id
                }
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

.record_card {
    border: 2px solid #DCDFE6;
    border-radius: 0.5rem;
    width: 90%;
    margin: 3vh auto;
    box-shadow: 5px 5px 10px #42414184;
}

.info {
    width: 90%;
    margin: auto;
    font-size: 16px;
    border-bottom: 1px solid #DCDFE6;
    line-height: 16px;
    padding: 7px;
    word-wrap: break-word;
}

.content {
    width: 90%;
    margin: auto;
    padding-top: 3px;
    padding-block: 3px;
}

.content_title {
    font-size: 18px;
    color: #42414184;
    display: inline-block;
}

.content_content {
    font-size: 18px;
    color: #42414184;
    display: inline-block;
}

.worker {
    width: 100%;
    background-color: #e1e8f0;
    padding-top: 5px;
    padding-block: 5px;
}

.worker_content {
    font-size: 14px;
    width: 90%;
    margin: auto;
}
</style>