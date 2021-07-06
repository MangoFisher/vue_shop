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
                     <el-button type="primary">添加分类</el-button>
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
            console.log(res)
            if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
            this.cateList = res.data.result
            console.log(this.cateList)
            this.total = res.data.total
            console.log(this.total)
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