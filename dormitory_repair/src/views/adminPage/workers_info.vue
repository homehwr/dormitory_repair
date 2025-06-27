<template>
    <div class="card_container">
     
    <el-card>
     
        <el-tabs type="border-card" >
          <div class="workers__header">
             <div class="worker_info">维修工信息管理</div>
            <el-row style="margin: 0px auto;width: 60%;display: flex;">
            <el-col :span="8" >
                <span>姓名：</span>
              <el-select v-model="filterWorker" placeholder="请选择">
                  <el-option
                    v-for="item in worker_options"
                    :key="item.filterWorker"
                    :label="item.label"
                    :value="item.filterWorker">
                  </el-option>
                </el-select> 
               </el-col>
                <el-button @click="filterChange(filterWorker)" type="primary" round style="width: 10%;">查询</el-button>
          </el-row>
          </div>
    <el-table
      :data="tableData"
      :border=bian
      height:auto
      style="width: auto">
      <el-table-column
       fixed
        prop="num"
        label="序号"
        width="300">
        <template #default="scope">
                    {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="300">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话"
        width="250">
      </el-table-column>
      <el-table-column
        prop="work_area"
        label="活动区域"
        width="250">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)"  type="text" size="middle">修改</el-button>
          <el-button @click="remove(scope.row.id)"  type="text" size="middle">删除</el-button>
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
                :total="tableData.length"
              ></el-pagination>
              <el-dialog title="修改维修工信息" :visible.sync="editVisible" width="30%" :before-close="handleClose">
                <el-form  label-width="80px" :model="editbox">
                <el-form-item label="姓名">
                  <el-input v-model="editbox.name"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                  <el-input v-model="editbox.phone"></el-input>
                </el-form-item>
                <el-form-item label="活动区域">
                  <el-input v-model="editbox.work_area"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer"  >
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editpost(editbox)">确 定</el-button>
              </span>
            </el-dialog>

</el-tabs>
</el-card>
</div>
  </template>
  
  <script>
    export default {
      mounted(){
        this.gerWorkerInfo();
      },
      methods: {
        filterChange(id){
          console.log(id);
           if(id)(
              this.$axios.get(`/user/getWorkersById?id=${id}`).then((res) =>{
                this.tableData=res.data;
                console.log(res.data);
                  })
           )
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
        open(row) {
          this.DetailedId = row;
          this.DetailDialogVisible=true;
          //this.$axios   // 获取报修记录的id
           // .get(`/team/getApplicantNameById?userId=${row.informantId}`)
           // .then((res) => {
           //   this.applicantName = res.data.data.username;
           // })
      },
      edit(row) {
        this.editVisible=true;
        this.editbox=row;
       
      },
      editpost(box){
          this.$axios.post('/user/updateUser',box)
         .then(res => {
            if (res.data.code === 200) { // 根据实际响应结构调整
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.editVisible=false;
              this.tableData = this.tableData.map(item => {
                if (item.id === this.DetailedId.id) {
                  return Object.assign({}, item, box);
                }
                return item;
              });
            } else {
              this.$message({
                type: 'error',
                message: res.data.message || '修改失败'
              });
            }
          })

      },
      
       remove(id) {
    this.$confirm('确定要删除这位工人的信息吗？', '确认信息', {
      distinguishCancelAndClose: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      // 用户点击确定后执行删除操作
      this.$axios.post(`/user/removeUser?id=${id}`)
        .then(res => {
          if (res.data.code === 200) { // 根据实际响应结构调整
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.tableData = this.tableData.filter(item => item.id !== id);
          } else {
            this.$message({
              type: 'error',
              message: res.data.message || '删除失败'
            });
          }
        })
       
    }).catch(action => {
      // 用户取消操作
      if (action !== 'cancel') {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      }
    });
  },
       gerWorkerInfo(){
        this.$axios.get('/user/getAllWorkers').then((res) =>{
            this.tableData=res.data;
           this.worker_options.push(
            ...this.tableData.map(item => ({
              label: item.name,
              filterWorker: item.id
            }))
          );
          })

       }

      },
  
      data() {
        return {
        DetailedId:'',
        worker_options: [{label: '全部', filterWorker: '0'}],
        address_options:[],
        filterWorker: '',
        bian:true,
        TableData:[1,1,1],
        pageSize:20,
        currentPage:1,
        editVisible:false,
        editbox:[],
        tableData: []
        }
      },
    }
  </script>

  <style scoped>
.worker_info{
  font-size: large;
  margin-bottom: 10px;
  border-left: 7px solid rgb(228, 70, 49) ;
  padding-left: 10px;
}
.workers__header{
  display: flex;
  margin-bottom: 20px;
}
 </style>