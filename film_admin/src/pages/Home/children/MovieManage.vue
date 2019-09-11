<template>
    <div id="movie-manage">
      <!--搜索-->
      <div class="top">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="input" class="input-with-select" style="width: 100%">
            <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="primary" size="small" @click="addMovie">添加电影</el-button>
        </el-col>
      </div>
      <!--表格-->
      <div class="movie-table">
        <el-table
          border
          :data="tableData">
          <el-table-column
            label="电影 ID"
            align="center"
            width="100"
            prop="movie_id">
          </el-table-column>
          <el-table-column
            label="电影名"
            show-overflow-tooltip
            prop="name">
          </el-table-column>
          <el-table-column
            label="导演"
            align="center"
            show-overflow-tooltip
            prop="director">
          </el-table-column>
          <!-- <el-table-column
            label="主演"
            prop="actor">
          </el-table-column> -->
          <el-table-column
            label="类型"
            align="center"
            width="100"
            prop="type">
          </el-table-column>
          <el-table-column
            label="上映时间"
            prop="public_date">
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
          <el-form :label-position="labelPosition" :rules="rules" label-width="80px" :model="movieInfo">
            <el-form-item label="电影名" prop="name">
              <el-col :span="16">
                <el-input v-model="movieInfo.name"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="海报" prop="poster">
              <el-col :span="16">
                <img :src="movieInfo.poster" ref="previewImg" alt="" width="150px" height="200px">
                <div style="position: relative;height: 64px">
                  <el-button size="small" type="primary" style="position: absolute;left: 0;top: 0;cursor: pointer">点击上传</el-button>
                  <input type="file" id="file" name="file" ref="uploadImg" accept="image/png, image/jpeg, image/gif, image/jpg" style="position: absolute;left: 0;top: 0;opacity: 0;height: 32px;width: 80px;cursor: pointer" @change="changeImg">
                  <div slot="tip" class="el-upload__tip" style="position: absolute;left: 0;top: 32px;height: 32px">只能上传jpg/png文件，且不超过500kb</div>
                </div>
              </el-col>
            </el-form-item>
            <el-form-item label="导演" prop="director">
              <el-col :span="16">
                <el-input v-model="movieInfo.director"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="演员" prop="actor">
              <el-col :span="16">
                <el-input v-model="movieInfo.actor"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="片长" prop="movie_long">
              <el-col :span="16">
                <el-input v-model="movieInfo.movie_long"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="语言" prop="language">
              <el-col :span="16">
                <el-select v-model="movieInfo.language" placeholder="请选择语言" style="width: 100%">
                  <el-option
                    v-for="item in languageOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-col :span="16">
                <el-select v-model="movieInfo.type" placeholder="请选择类型" style="width: 100%">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="上映时间" prop="public_date">
              <el-col :span="16">
                <el-date-picker type="date" placeholder="选择日期" v-model="movieInfo.public_date" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="简介" prop="intro">
              <el-col :span="16">
                <el-input type="textarea" v-model="movieInfo.intro" :autosize="{ minRows: 8, maxRows: 10}"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="manageMovieInfo()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
    import {upLoadMovieImg,getCurrentPageMovie,addMovieInfo,updateMovieInfo,deleteMovieInfo} from '../../../api/index'
    import {MessageBox,Message} from 'element-ui'
    export default {
        name: "MovieManage",
        data() {
          let checkMovieLong = (rule, value, callback) => {
            if (!value) {
              callback(new Error('片长信息不能为空'));
            } else {
              if (/^[1-9]{1}[0-9]+分钟$/.test(value)){
                callback();
              } else{
                callback(new Error('格式应为xx分钟'));
              }
            }
          };
          return {
            //服务器地址
            server:'http://localhost:3000',
            tableData:[],
            total:0,
            currentPage:1,
            movieInfo:{},
            dialogFormVisible:false,
            dialogTitle:'',
            labelPosition:'right',
            input:'',
            searchInput:'',
            checkMovieLongFlag:false,
            rules:{
              name: [
                { required: true, message: '电影名不能为空', trigger: 'blur' },
              ],
              poster: [
                { required: true, message: '请上传电影海报', trigger: 'blur' },
              ],
              director: [
                { required: true, message: '导演信息不能为空', trigger: 'blur' },
              ],
              actor: [
                { required: true, message: '主演信息不能为空', trigger: 'blur' },
              ],
              movie_long: [
                { required: true, message: '片长信息不能为空', trigger: 'blur' },
                { validator: checkMovieLong, trigger: 'blur' }
              ],
              language: [
                { required: true, message: '请选择语言', trigger: 'change' },
              ],
              type: [
                { required: true, message: '请选择电影类型', trigger: 'change' },
              ],
              public_date: [
                { required: true, message: '请选择上映日期', trigger: 'blur' },
              ],
              intro: [
                { required: true, message: '电影简介信息不能为空', trigger: 'blur' },
              ]
            },
            languageOptions: [{
              value: '粤语',
              label: '粤语'
            }, {
              value: '国语',
              label: '国语'
            }, {
              value: '英语',
              label: '英语'
            }, {
              value: '日语',
              label: '日语'
            }, {
              value: '其它',
              label: '其它'
            }],
            typeOptions: [{
              value: '动漫',
              label: '动漫'
            }, {
              value: '言情',
              label: '言情'
            }, {
              value: '科幻',
              label: '科幻'
            }, {
              value: '喜剧',
              label: '喜剧'
            }, {
              value: '爱情',
              label: '爱情'
            }, {
              value: '剧情',
              label: '剧情'
            }, {
              value: '动作',
              label: '动作'
            }, {
              value: '冒险',
              label: '冒险'
            }, {
              value: '青春',
              label: '青春'
            }, {
              value: '悬疑',
              label: '悬疑'
            }, {
              value: '恐怖',
              label: '恐怖'
            }, {
              value: '其它',
              label: '其它'
            }
            ],
            pickerPublicDate: {
              disabledDate(time) {
                return time.getTime() < Date.now();
              },
            }
          }
        },
        created(){
          this.loadCurrentPageMovie(this.currentPage,8,'');
        },
        methods: {
          async loadCurrentPageMovie(currentPage,pageSize,input){
            let json = await getCurrentPageMovie(currentPage,pageSize,input);
            if (json.success_code===200){
              this.tableData = json.data;
              console.log(this.tableData);
              this.total = json.total;
            }
          },
          async currentChange(currentPage){
            this.currentPage = currentPage;
            this.loadCurrentPageMovie(this.currentPage,8,this.searchInput);
          },
          handleEdit(index, row) {
            this.dialogTitle = '编辑电影信息';
            this.movieInfo = row;
            this.dialogFormVisible = true;
            console.log(index, row);
          },
          async handleDelete(index, row) {
            console.log(index, row);
            MessageBox.confirm('此操作将永久删除该电影所有信息, 是否继续？','提示').then(async (value)=>{
              if (value==='confirm'){
                let json = await deleteMovieInfo(row.movie_id);
                if (json.success_code===200){
                  this.loadCurrentPageMovie(this.currentPage,8,this.searchInput);
                  Message.success('删除该电影成功！');
                }
              }
            });
          },
          changeImg(e){
            let reader = new FileReader();
            reader.readAsDataURL(this.$refs.uploadImg.files[0]);//发起异步请求
            let _this = this;
            reader.onload = function(){
              //读取完成后，将结果赋值给img的src
              _this.$refs.previewImg.src = this.result;
              _this.movieInfo.poster = this.result;
            }
          },
          //修改电影信息
          async manageMovieInfo(){
            console.log(this.movieInfo);
            if (this.movieInfo.name&&this.movieInfo.poster&&this.movieInfo.director&&this.movieInfo.actor&&this.movieInfo.movie_long&&/^[1-9]{1}[0-9]+分钟$/.test(this.movieInfo.movie_long)&&this.movieInfo.type&&this.movieInfo.language&&this.movieInfo.public_date&&this.movieInfo.intro) {
              let formData = new FormData();
              formData.append('file',this.$refs.uploadImg.files[0]);
              let json = await upLoadMovieImg(formData);
              if (json.success_code===200){
                if (this.movieInfo.public_date) {
                  let date = new Date(this.movieInfo.public_date);
                  this.movieInfo.public_date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                }
                if (json.data.length){
                  this.movieInfo.poster = '/images/movie/'+json.data[0].filename;
                }
                if (this.dialogTitle === '编辑电影信息') {
                  json = await updateMovieInfo(this.movieInfo.movie_id,this.movieInfo.name,this.movieInfo.poster,this.movieInfo.director,this.movieInfo.actor,this.movieInfo.movie_long,this.movieInfo.type,this.movieInfo.language,this.movieInfo.public_date,this.movieInfo.intro);
                  if (json.success_code===200){
                    this.dialogFormVisible = false;
                    Message.success('修改电影信息成功！');
                  } else if (json.error_code===1){
                    Message.error(json.message);
                  }
                } else{
                  json = await addMovieInfo(this.movieInfo.name,this.movieInfo.poster,this.movieInfo.director,this.movieInfo.actor,this.movieInfo.movie_long,this.movieInfo.type,this.movieInfo.language,this.movieInfo.public_date,this.movieInfo.intro);
                  if (json.success_code===200){
                    this.loadCurrentPageMovie(this.currentPage,8,this.searchInput);
                    this.dialogFormVisible = false;
                    Message.success('添加电影成功！');
                  } else if (json.error_code===1){
                    Message.error(json.message);
                  }
                }
              }
            } else{
              Message.error('请完成必填内容！');
            }
          },
          //搜索电影
          search(){
            this.searchInput = this.input;
            this.loadCurrentPageMovie(1,8,this.searchInput);
          },
          //添加电影
          addMovie(){
            this.dialogTitle = '添加电影';
            this.movieInfo = {};
            this.dialogFormVisible = true;
          },
          cancel(){
            this.dialogFormVisible = false;
            this.loadCurrentPageMovie(this.currentPage,8,this.searchInput);
          }
        },
    }
</script>

<style>
  .movie-table{
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
    padding-left: 20%;
  }
</style>
