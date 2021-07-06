<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片区域 -->
         <el-card>
             <el-row>
                 <el-col>
                     <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                 </el-col>
             </el-row>
             <tree-table class="treeTable"
                         :data="cateList" 
                         :columns="columns" 
                         :selection-type="false" 
                         :expand-type="false" 
                         :show-index="true" 
                         index-text="#" 
                         :border="true"
                         >
                         <!-- 定义名叫'isok'的模版 -->
                         <template slot="isok" slot-scope="scope">
                             <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:lightgreen;"></i>
                             <i class="el-icon-error" v-else style="color:red;"></i>
                         </template>
                         <!-- 定义名叫'order'的模版 -->
                         <template slot="order" slot-scope="scope">
                             <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                             <el-tag type="success" v-if="scope.row.cat_level == 1">二级</el-tag>
                             <el-tag type="warning" v-if="scope.row.cat_level == 2">三级</el-tag>
                         </template>
                         <!-- 定义名叫'opt'的模版 -->
                         <template slot="opt" slot-scope="scope">
                              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                              <el-button type="danger" icon="el-icon-delete" size="mini" ></el-button>
                         </template>
             </tree-table>
             <!-- 添加商品分类对话框 -->
            <el-dialog title="添加商品分类对话框"
                        :visible.sync="addCateVisible"
                        width="30%"
                        @close="addCateClose">
                <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类" >
                        <el-cascader
                            v-model="selectedValue"
                            :options="cascaderList"
                            :props="cascaderProps"
                            @change="cascaderChanged"
                            size="mini"
                            clearable
                            >
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="addCateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
            </el-dialog>

             <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
         </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //商品分类数据列表
            cateList: [],
            //商品分类数据总条目数
            total: 0,
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            //添加商品分类数据结构
            addCateForm: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
            },
            addCateFormRules: {
                cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur' }]
            },
            //控制添加分类对话框是否显示
            addCateVisible: false,
            //父级分类级联菜单选项数据
            cascaderList: [],
            //父级分类级联菜单被选中的选项
            selectedValue: [],
            cascaderProps: {
                expandTrigger:'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true
            },
            //为TreeTable设定列
            columns: [
                {label: '分类名称', prop: 'cat_name'},
                {
                    label: '是否有效', 
                    //表示这一列是模版列
                    type: 'template',
                    //表示这一列的显示采用一个名叫'isok'的模版
                    template: 'isok'
                },
                {
                    label: '排序', 
                    //表示这一列是模版列
                    type: 'template',
                    //表示这一列的显示采用一个名叫'isok'的模版
                    template: 'order'
                },
                {
                    label: '操作', 
                    //表示这一列是模版列
                    type: 'template',
                    //表示这一列的显示采用一个名叫'isok'的模版
                    template: 'opt'
                }
            ]
        }
    },
    methods: {
        //获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
            // console.log(res)
            if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
            this.cateList = res.data.result
            // console.log(this.cateList)
            this.total = res.data.total
            // console.log(this.total)
        },
        //监听pagesize发生变化
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        //监听pagenum发生变化
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        //添加商品分类
        async addCate() {
            const { data: res } = await this.$http.post('categories', this.addCateForm)
            // console.log(res)
            if(res.meta.status !== 201) return this.$message.error('增加商品分类出错')
            this.addCateVisible = false
            this.getCateList()
        },
        //展示添加商品分配对话框
        async showAddCateDialog() {
            //获取前2级商品分类数据
            const { data: res } = await this.$http.get('categories', { params: {type:2}})
            if(res.meta.status !== 200) return this.$message.error('获取父级分类级联数据失败')
            // console.log(res)
            this.cascaderList = res.data
            this.addCateVisible = true
        },
        //父级分类级联菜单发生变化
        cascaderChanged() {
            // console.log('in function cascaderChanged')
            // console.log(this.selectedValue)
            if(this.selectedValue.length > 0) {
                this.addCateForm.cat_pid = this.selectedValue[this.selectedValue.length - 1]
                this.addCateForm.cat_level = this.selectedValue.length
            }
        },
        //添加商品分类对话框的关闭事件
        addCateClose(){
            //对表单进行重置
            this.$refs.addCateFormRef.resetFields()
            this.selectedValue = []
        }
    },
    created(){
        this.getCateList()
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
</style>