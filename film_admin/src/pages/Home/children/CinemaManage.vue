<template>
    <div id="cinema-manage">
      <!--搜索-->
      <div class="top">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="input" class="input-with-select" style="width: 100%">
            <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="primary" size="small" @click="addCinema">添加影院</el-button>
        </el-col>
      </div>
      <!--表格-->
      <div class="cinema-table">
        <el-table
          border
          :data="tableData"
          >
          <el-table-column
            label="影院 ID"
            align="center"
            width="100"
            prop="cinema_id">
          </el-table-column>
          <el-table-column
            label="影院名"
            show-overflow-tooltip
            prop="cinema_name">
          </el-table-column>
          <el-table-column
            label="联系电话"
            align="center"
            width="120"
            prop="cinema_phone">
          </el-table-column>
          <el-table-column
            label="详细地址"
            show-overflow-tooltip
            prop="specified_address">
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
      <!--弹框-->
      <div>
        <el-dialog
          :title="dialogTitle"
          :visible.sync="dialogFormVisible"
          :modal-append-to-body="false"
          v-if="dialogFormVisible"
          :showClose="false"
        >
          <el-form :label-position="labelPosition" label-width="80px" :model="cinemaInfo" :rules="rules">
            <el-form-item label="影院名" prop="cinema_name">
              <el-col :span="18">
                <el-input v-model="cinemaInfo.cinema_name"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="联系电话" prop="cinema_phone">
              <el-col :span="18">
                <el-input v-model="cinemaInfo.cinema_phone"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="地址" prop="specified_address">
              <el-col :span="18">
                <el-input v-model="cinemaInfo.specified_address" type="textarea"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="manageCinemaInfo()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
    import {MessageBox,Message} from 'element-ui'
    import {getCurrentPageCinema,updateCinemaInfo,deleteCinemaInfo,addCinemaInfo} from '../../../api'
    export default {
        name: "CinemaManage",
        data() {
          let checkPhone = (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入手机号码'));
            } else {
              if (/^1[3|4|5|6|7|8][0-9]{9}$/.test(value)){
                callback();
              } else{
                callback(new Error('请输入正确格式的手机号码'));
              }
            }
          };
          return {
            //服务器地址
            server:'http://localhost:3000',
            tableData:[],
            total:0,
            currentPage:1,
            cinemaInfo:{},
            dialogFormVisible:false,
            dialogTitle:'',
            labelPosition:'right',
            input:'',
            searchInput:'',
            rules: {
              cinema_name: [
                { required: true, message: '影院名不能为空', trigger: 'blur' },
              ],
              cinema_phone: [
                { required: true, message: '影院电话不能为空', trigger: 'blur' },
                { validator: checkPhone, trigger: 'blur' }
              ],
              specified_address: [
                { required: true, message: '影院地址不能为空', trigger: 'blur' },
              ]
            },
          }
        },
        created(){
          this.loadCurrentPageCinema(this.currentPage,8,'');
        },
        methods: {
          async loadCurrentPageCinema(currentPage,pageSize,input){
            let json = await getCurrentPageCinema(currentPage,pageSize,input);
            if (json.success_code===200){
              this.tableData = json.data;
              this.total = json.total;
            }
          },
          handleEdit(index, row) {
            this.dialogTitle = '编辑影院信息';
            this.cinemaInfo = row;
            this.dialogFormVisible = true;
            console.log(index, row);
          },
          handleDelete(index, row) {
            console.log(index, row);
            MessageBox.confirm('此操作将永久删除该影院所有信息, 是否继续？','提示').then(async (value)=>{
              if (value==='confirm'){
                let json = await deleteCinemaInfo(row.cinema_id);
                if (json.success_code===200){
                  Message.success('删除该影院成功！');
                  this.loadCurrentPageCinema(this.currentPage,8,this.searchInput);
                }
              }
            });
            console.log(index, row);
          },
          //修改影院信息
          async manageCinemaInfo(){
            if (!this.cinemaInfo.cinema_name||!this.cinemaInfo.cinema_phone||!(/^1[3|4|5|6|7|8][0-9]{9}$/.test(this.cinemaInfo.cinema_phone))||!this.cinemaInfo.specified_address) {
              Message.error('请完成必填内容！');
            } else{
                if (this.dialogTitle==='编辑影院信息') {
                  let json = await updateCinemaInfo(this.cinemaInfo.cinema_id,this.cinemaInfo.cinema_name,this.cinemaInfo.cinema_phone,this.cinemaInfo.specified_address);
                  if (json.success_code===200){
                    this.dialogFormVisible = false;
                    Message.success('修改影院信息成功！');
                  } else if (json.error_code===1){
                    Message.error(json.message);
                  }
                } else{
                  let json = await addCinemaInfo(this.cinemaInfo.cinema_name,this.cinemaInfo.cinema_phone,this.cinemaInfo.specified_address);
                  if (json.success_code===200){
                    this.loadCurrentPageCinema(this.currentPage,8,this.searchInput);
                    this.dialogFormVisible = false;
                    Message.success('添加影院成功！');
                  } else if (json.error_code===1){
                    Message.error(json.message);
                  }
                }
            }
          },
          async currentChange(currentPage){
            this.currentPage = currentPage;
            this.loadCurrentPageCinema(this.currentPage,8,this.searchInput);
          },
          //搜索影院
          search(){
            this.searchInput = this.input;
            this.loadCurrentPageCinema(1,8,this.searchInput);
          },
          //添加影院
          addCinema(){
            this.dialogTitle = '添加影院';
            this.cinemaInfo = {};
            this.dialogFormVisible = true;
          },
          cancel(){
            this.loadCurrentPageCinema(this.currentPage,8,this.searchInput);
            this.dialogFormVisible = false;
          }
        },
    }
</script>

<style>
  .cinema-table{
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
