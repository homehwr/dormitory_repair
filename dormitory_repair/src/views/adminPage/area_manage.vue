<template>
    <div class="card_container">
    <el-card>
      <el-tabs type="border-card" >
          <div class="area_header">&nbsp;&nbsp;宿舍区域管理</div>
          <!-- <el-row style="margin: 20px 10px;width: 60%;display: flex;">
          <el-col :span="8" >
              <span>姓名：</span>
            <el-select v-model="filterAddress" placeholder="请选择" @change="filterChange">
                <el-option
                  v-for="item in address_options"
                  :key="item.filterAddress"
                  :label="item.label"
                  :value="item.filterAddress">
                </el-option>
              </el-select> 
              </el-col>
                <el-button type="primary" round style="width: 10%;">查询</el-button>
        </el-row> -->
        <el-table
      :data="buildings"
      style="width: 100%;margin-bottom: 20px; overflow-y: auto; height: 65dvh;"
      row-key="key"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="genArea"
        label="苑区"
        sortable
        width="220">
      </el-table-column>
      <el-table-column
        prop="area"
        label="宿舍楼号">
      </el-table-column>
      <el-table-column
          label="操作"
          width="350">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)"  type="primary" size="middle">修改名称</el-button>
            <el-button @click="add(scope.row)" v-if="scope.row['genArea']" type="success" size="middle">新增楼栋</el-button>
            <el-button @click="remove(scope.row)" v-else type="danger" size="middle">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 25, 50, 100, 200]"
          :page-size="pageSize"
          layout="total,   prev, pager, next, jumper"
          :total="buildings.length"
        ></el-pagination>

      </el-tabs>
    </el-card>
  </div>
</template>
  
  <script>
    export default {
      data() {
        return {
          address_options:[],
          filterAddress: '南苑',
          bian:true, 
          pageSize:20,
          currentPage:1,
          buildings: [],
        }
      },
      mounted() {
        this.getAllArea();
      },
      methods: {
        getAllArea(){
          this.$axios.get('/area/getAllArea').then((res) => {
            this.buildings = res.data;
          })
        },
        filterChange(){
          if(this.filterCollege==='全部'){
              this.tableData=this.AllTableData;
          }
          if(this.filterCollege==='已维修'){
              this.tableData=this.PassedTableData;
          }
          if(this.filterCollege==='待维修'){
              this.tableData=this.RepairTableData;
          }
        },
        handleClick(row) {
          console.log(row);
        },
        handleSizeChange (size) {
          console.log(size, 'size');
          this.pageSize = size;
          console.log(this.pageSize);
        },
        handleCurrentChange (currentPage) {
          this.currentPage = currentPage;
        },
        edit(row) {
          this.$prompt('请输入修改后的名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            if (value.length > 8){
              this.$message.error("输入字符不能超过8个！");
              return;
            }
            this.$axios.post(`/area/changeName?key=${row.key}&name=${value}`).then((res) => {
              if (res.data.code == 200){
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                });
                this.getAllArea();
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                });  
              }
              return;
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });       
          });
        },
        add(row){
          console.log(row);
          this.$prompt(`请输入在“${row.genArea}”增加的楼栋的名称（例如：1栋、2栋等）`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            if (value.length > 8){
              this.$message.error("输入字符不能超过8个！");
              return;
            }
            this.$axios.post(`/area/addArea?name=${value}&key=${row.key}`).then((res) => {
              if (res.data.code == 200){
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                });
                this.getAllArea();
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                });  
              }
              return;
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });       
          });
        },
        remove(row) {
          console.log(row);
          this.$confirm('确定要删除这一楼栋信息吗？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(() => {
            this.$axios.post(`/area/delArea?key=${row.key}`).then((res) => {
              if (res.data.code == 200){
                this.$message.success("删除成功！");
                this.getAllArea();
              } else {
                this.$message.error("删除失败！");
              }
              return;
            })
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          });
        },
      },
    }
  </script>
<style scoped>
.area_header{
    border-left: 7px solid rgb(228, 70, 49) ;
    font-size: large;
    font-weight: 500;
    margin-bottom: 20px;
}
</style>