<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table>

            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: []
        }
    },
    methods: {
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            // console.log(res.data)
            if(res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
            this.rolesList = res.data
            this.$message.success('获取角色列表成功')
        }
    },
    created() {
        this.getRolesList()
    }
}
</script>

<style lang="less">

</style>