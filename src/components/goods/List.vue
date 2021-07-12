<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->       
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList" ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="goodsList" :border="true" :stripe="true">
                <el-table-column type="index" :index="indexMethod"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价值" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>          
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.goods_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="goodDeleteById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        <!-- 添加商品对话框 -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            addDialogVisible: false,
            goodsList: [],
            //分页相关
            total: 0

        }
    },
    methods: {
        async getGoodsList() {
            const { data: res} = await this.$http.get('goods', {params: this.queryInfo})
            console.log(res)
            this.goodsList = res.data.goods
            this.total = res.data.total
            if(res.meta.status !== 200) return this.$message.error('获取商品列表出错')
        },
        showEditDialog(id) {},
        async goodDeleteById(id) {
            const res = await this.$confirm('此操作将删除该角色信息, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                            }).catch((err) => {
                                                return err
                                            })
            if('confirm' !== res) return this.$message.info('用户取消删除！')
            const { data: result } = await this.$http.delete(`goods/${id}`)
            if(result.meta.status !== 200) return this.$message.error('商品删除失败')
            this.getGoodsList()
        },
        //分页相关的函数
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        //自定义索引
        indexMethod(index) {
            return (this.queryInfo.pagenum - 1) * 10 + (index + 1)
        }

    },
    created() {
        this.getGoodsList()
    }
}
</script>

<style lang="less" scoped>

</style>