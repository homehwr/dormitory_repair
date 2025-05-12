<template>
    <div class="block">
        <div style="background-color: #409EFF; padding: 10px 0;">
            <h2 style="text-align: center; color: white;">我要报修</h2>
        </div>

        <el-divider content-position="left">请选择报修区域</el-divider>
        <el-card>
            <div class="title">
                报修苑区
            </div>
             <el-select v-model="gardenDistrictValue" placeholder="请选择">
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
            <el-select v-model="buildingValue" placeholder="请选择" v-if="gardenDistrictValue=='1'">
                <el-option
                v-for="item in building_north_or_south"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="buildingValue" placeholder="请选择" v-else-if="gardenDistrictValue=='2'">
                <el-option
                v-for="item in building_north_or_south"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="buildingValue" placeholder="请选择" v-else-if="gardenDistrictValue=='3'">
                <el-option
                v-for="item in building_west"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-else disabled></el-select>
        </el-card>
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
        gardenDistrictValue: '',
        buildingValue: ''
      }
    }
}
</script>

<style scoped>
*{
    box-sizing: border-box;
    list-style: none;
}
.item {
    width: 100%;
    position: relative;
    border: 1px solid black;
}

.title {
    display: inline-block;
    margin-right: 14%;
}
</style>