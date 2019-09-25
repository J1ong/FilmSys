<template>
  <div id="hall-manage">
    <!--搜索-->
    <div class="top">
      <el-col :span="12">
        <el-input placeholder="请输入内容" v-model="input" class="input-with-select" style="width: 100%">
          <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" size="small" @click="addHall">添加影厅</el-button>
      </el-col>
    </div>
    <!--表格-->
    <div class="hall-table">
      <el-table
        border
        :data="tableData"
      >
        <el-table-column
          label="影厅 ID"
          align="center"
          width="100"
          prop="hall_id">
        </el-table-column>
        <el-table-column
          label="影院名"
          show-overflow-tooltip
          prop="cinema_name">
        </el-table-column>
        <el-table-column
          label="影院电话"
          align="center"
          width="120"
          prop="cinema_phone">
        </el-table-column>
        <el-table-column
          label="影厅名"
          width="200"
          show-overflow-tooltip
          prop="name">
        </el-table-column>
        <el-table-column 
        width="200"
        align="center"
        label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="block" v-if="tableData.length">
      <el-pagination
        @current-change="currentChange"
        background
        layout="prev, pager, next"
        :page-size="8"
        :total="total">
      </el-pagination>
    </div>
    <!--修改影厅信息-->
    <div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFormVisible"
        :modal-append-to-body="false"
        v-if="dialogFormVisible"
        :showClose="false"
      >
        <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="hallInfo">
          <el-form-item label="影院名" prop="cinema_name">
            <el-col :span="18">
              <el-input v-model="hallInfo.cinema_name" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="影厅名" prop="name">
            <el-col :span="18">
              <el-input v-model="hallInfo.name"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="manageHallInfo()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--添加影厅-->
    <div>
      <el-dialog
        title="添加影厅"
        :visible.sync="addDialogFormVisible"
        :modal-append-to-body="false"
        v-if="addDialogFormVisible"
        :show-close="false"
      >
        <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="hallInfo">
          <el-form-item label="影院名" prop="value">
            <el-col :span="12">
              <el-select v-model="hallInfo.value" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="影厅名" prop="hallName">
            <el-col :span="12">
              <el-input v-model="hallInfo.hallName"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="commitAddHall()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import {MessageBox,Message} from 'element-ui'
    import {getCurrentPageHall,deleteHall,updateHallInfo,getAllCinema,addHallInfo} from "../../../api";
    export default {
        name: "HallManage",
        data(){
          return{
            //服务器地址
            server:'http://localhost:3000',
            tableData:[],
            total:0,
            currentPage:1,
            hallInfo:{},
            dialogFormVisible:false,
            dialogTitle:'',
            labelPosition:'right',
            input:'',
            searchInput:'',
            hallOldName:'',
            addDialogFormVisible:false,

            options: [],
            value: '',
            hallName:'',
            rules: {
              value: [
                { required: true, message: '影院名不能为空', trigger: 'change' },
              ],
              hallName: [
                { required: true, message: '影厅名不能为空', trigger: 'blur' },
              ],
              name: [
                { required: true, message: '影厅名不能为空', trigger: 'blur' },
              ]
            },
          }
        },
        created(){
          this.loadCurrentPageHall(this.currentPage,8,'');
        },
        methods:{
          async loadCurrentPageHall(currentPage,pageSize,input){
            let json = await getCurrentPageHall(currentPage,pageSize,input);
            if (json.success_code===200){
              this.tableData = json.data;
              this.total = json.total;
            }
          },
          async currentChange(currentPage){
            this.currentPage = currentPage;
            this.loadCurrentPageHall(this.currentPage,8,this.searchInput);
          },
          //修改影厅信息
          async manageHallInfo(){
              if (this.dialogTitle === '编辑影厅信息') {
                if (this.hallInfo.name){
                  let json = await updateHallInfo(this.hallInfo.hall_id,this.hallInfo.cinema_id,this.hallOldName,this.hallInfo.name);
                  if (json.success_code===200){
                    this.dialogFormVisible = false;
                    Message.success('修改影厅信息成功！');
                  } else if (json.error_code===1){
                    Message.error(json.message);
                  }
                } else{
                  Message.error('请完成必填内容！');
                }
              }
          },
          handleEdit(index, row) {
            this.dialogTitle = '编辑影厅信息';
            this.hallInfo = row;
            this.hallOldName = row.name;
            this.dialogFormVisible = true;
            console.log(index, row);
          },
          handleDelete(index, row) {
            console.log(index, row);
            MessageBox.confirm('此操作将永久删除该影厅所有信息, 是否继续？','提示').then(async (value)=>{
              if (value==='confirm'){
                let json = await deleteHall(row.cinema_id,row.name);
                if (json.success_code===200){
                  Message.success('删除该影厅成功！');
                  this.loadCurrentPageHall(this.currentPage,8,this.searchInput);
                }
              }
            });
            console.log(index, row);
          },
          //搜索影院
          search(){
            this.searchInput = this.input;
            this.loadCurrentPageHall(1,8,this.searchInput);
          },
          cancel(){
            this.loadCurrentPageHall(this.currentPage,8,this.searchInput);
            this.dialogFormVisible = false;
          },
          async addHall(){
            this.value = '';
            this.hallName = '';
            this.hallInfo = {};
            let json = await getAllCinema();
            if (json.success_code===200){
              this.options = json.data;
              console.log(this.options);
              this.options= JSON.parse(JSON.stringify(this.options).replace(/cinema_id/g,"value"));
              this.options= JSON.parse(JSON.stringify(this.options).replace(/cinema_name/g,"label"));
            }
            this.addDialogFormVisible = true;
          },
          async commitAddHall(){
            this.value = this.hallInfo.value;
            this.hallName = this.hallInfo.hallName;
            if (this.value&&this.hallName){
              let json = await addHallInfo(this.value,this.hallName);
              if (json.success_code===200) {
                this.addDialogFormVisible = false;
                Message.success('添加影厅成功！');
                this.loadCurrentPageHall(this.currentPage,8,this.searchInput);
              } else if (json.error_code===1){
                Message.error(json.message);
              }
            } else{
              Message.error('请完成必填内容！');
            }
          }
        }
    }
</script>

<style>
  .hall-table{
    width:90%;
    min-width:900px;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .top{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    margin-bottom: 30px;
  }
  .block{
    text-align: center;
  }
  .el-dialog__header{
    text-align: center;
  }
  .el-dialog__body .el-form-item{
    width: 80%;
    padding-left: 20%;
  }
</style>
