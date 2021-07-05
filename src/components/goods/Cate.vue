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
             <tree-table :data="cateList" 
                         :columns="columns" 
                         :selection-type="false" 
                         :expand-type="false" 
                         :show-index="true" 
                         index-text="#" 
                         :border="true">
                         <!-- 定义名叫'isok'的模版 -->
                         <template slot="isok" slot-scope="scope">
                             <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:lightgreen;"></i>
                             <i class="el-icon-error" v-else style="color:red;"></i>
                         </template>
             </tree-table>


             <!-- 分页区域 -->
            <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination> -->
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
            queryInfor: {
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
            this.cateList = res.data
            this.total = res.data.total
            console.log(this.total)
        }
    },
    created(){
        this.getCateList()
    }
}
</script>

<style lang="less" scoped>

</style>