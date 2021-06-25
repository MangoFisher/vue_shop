<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->       
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="usersList" :border="true" :stripe="true">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 1
            },
            usersList: [],
            total: 0
        }
       
    },
    methods: {
        async getUsersList() {
        const { data: res } = await this.$http.get('users', { params: this.queryInfo } )
        // console.log(res)
        if(res.meta.status !== 200 ) return this.$message.erro("获取用户权限列表失败")
        this.usersList = res.data.users
        this.total = res.data.total
        this.$message.success("获取用户权限列表成功")
        },
        //监听pagesize发生变化
        handleSizeChange(newSize) {
            
            console.log("newSize=" + newSize)
            this.queryInfo.pagesize = newSize
            this.getUsersList()
        },

        //监听pagenum发生变化
        handleCurrentChange(newPage) {
            console.log("newPage=" + newPage)
            this.queryInfo.pagenum = newPage
            this.getUsersList()
        }
    },
    created() {
        this.getUsersList()
    }
}
</script>

<style lang="less" scoped>

</style>