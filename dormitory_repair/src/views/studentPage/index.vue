<template>
    <div class="block">
        <div style="background-color: #409EFF; padding: 10px 0;">
            <h2 style="text-align: center; color: white;">赣南师范大学学生公寓报修系统</h2>
        </div>
        <div style="height: 300px;">
            <el-carousel :interval="3000">
                <el-carousel-item v-for="item in imgList" :key="item">
                        <el-image
                        style="width: 100%"
                        :src="item"
                        fit="cover"></el-image>
                </el-carousel-item>
            </el-carousel>
        </div>

        <el-row>
            <el-col :span="12">
                <el-card class="box-card" style="text-align: center;">
                    <i class="el-icon-edit" style="font-size: 50px;"></i>
                    <div style="font-size: 20px; margin-top: 10px">我要报修</div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card" style="text-align: center;">
                    <i class="el-icon-document" style="font-size: 50px;"></i>
                    <div style="font-size: 20px; margin-top: 10px">报修记录</div>
                </el-card>
            </el-col>
        </el-row>


  </div> 
</template>


<script>
import _ from 'lodash';

export default {
    data() {
        return {
            imgList: [require('@/assets/student/lunbo1.jpg'), require('@/assets/student/lunbo2.jpg')],
            valueList: {
                value1: 1000,
                value2: 632,
                value3: 0
            },
            plotImage: '',
            dialogVisible: false,
            picSizeOptions: ['50 x 50', '100 x 100', '200 x 200', '300 x 300', '400 x 400', '500 x 500', '600 x 600', '700 x 700', '800 x 800',
            '900 x 900', '1000 x 1000', '1200 x 1200'],
            picSize: '400 x 400',
            tableData: [
                { index: 1, left: -2.349, right: 2.349, editing: false },
                { index: 2, left: -2.241, right: 2.241, editing: false },
                { index: 3, left: -2.127, right: 2.127, editing: false },
                { index: 4, left: -2.007, right: 2.007, editing: false },
                { index: 5, left: -1.875, right: 1.875, editing: false },
                { index: 6, left: -1.737, right: 1.737, editing: false },
                { index: 7, left: -1.587, right: 1.587, editing: false },
                { index: 8, left: -1.419, right: 1.419, editing: false },
                { index: 9, left: -1.233, right: 1.233, editing: false },
                { index: 10, left: -1.005, right: 1.005, editing: false },
                { index: 11, left: -0.711, right: 0.711, editing: false },
                { index: 12, left: -0.705, right: 0.705, editing: false }
            ],
        }
    },
    created() {

    },
    mounted(){
        this.generatePlot();
    },
    destroyed() {

    },
    watch:{
        valueList: {
            handler: _.throttle(function(newVal, oldVal) {
                this.generatePlot();
            }, 250), // 100毫秒 = 0.1秒
            deep: true
        }
    },
    methods: {
        async generatePlot() {
            try {
                const response = await this.$axios.post('/physics/get_matlab_pic/', this.valueList, {
                        responseType: 'json'
                    });
                console.log(response);
                if (response.data.image) {
                    this.plotImage = 'data:image/png;base64,' + response.data.image;
                } else {
                    alert('Error: ' + response.data.error);
                }
            } catch (error) {
                console.error('Request failed:', error);
            }
        },
        permitSize(){
            this.$axios.post('/physics/change_size/', this.picSize, {
                        responseType: 'json'
                    }).then(res => {
                        if (res.data.status === 'success'){
                            this.$message.success("修改成功！");
                            this.generatePlot();
                        } else {
                            this.$message.error("修改失败！")
                        }
                    });
            this.dialogVisible = false;
        },
        edit(index, row) {
            console.log(index, row);
            this.tableData[index].editing = true;
        },
        save(index, row) {
            this.tableData[index].editing = false;
            // 可以在这里添加保存到后端的逻辑
        },
        calculateCurvatureRadius() {
            const data = [];
            for (let i = 0; i < this.tableData.length; i++) {
                const a = parseFloat(this.tableData[i].left);
                const b = parseFloat(this.tableData[i].right);
            if (!isNaN(a) && !isNaN(b)) {
                const d = Math.abs(a - b) * 1e-3;
                data.push(d);
            } else {
                this.$message.error('请确保所有单元格都填写了有效的数字');
                return;
            }
            }

            if (data.length >= 12) { // 确保有足够的数据点
                const r = [0, 0, 0, 0, 0, 0];
                const lambdaValue = this.valueList.value2 * 1e-9; // 波长，单位m

            for (let i = 0; i < 6; i++) {
                const diff1 = data[i + 6] || 0; // 防止数组越界
                const diff2 = data[i] || 0; // 防止数组越界
                const numerator = -(Math.pow(diff1, 2) - Math.pow(diff2, 2));
                const denominator = 4 * lambdaValue * 6;

                if (denominator === 0) {
                    this.$message.error('分母不能为零，请检查波长设置');
                    return;
                }

                r[i] = numerator / denominator;
            }
            // console.log(acc, val)
            const R = r.reduce((acc, val) => acc + val, 0) / 6;

            if (isNaN(R)) {
                this.$message.error('计算结果无效，请检查数据是否正确');
            } else {
                this.$notify.info({
                    title: '计算结果',
                    message: `曲率半径: ${R} m`,
                    duration: 0
                });
            }
            } else {
                this.$message.error('需要至少12个数据点来计算曲率半径');
            }
        }
    },
}

</script>


<style>
*{
    margin: 0;
    box-sizing: border-box;
    list-style: none;
}
.block{
    
}
.box-card{
    width: 90%;
    margin: 30px auto;
}
</style>