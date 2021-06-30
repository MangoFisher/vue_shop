<template>
    <div>
    <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table :data="rightsList" :border="true" :stripe="true">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.level == '1'">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.level == '2'">三级</el-tag>
                    </template>
                </el-table-column>
                
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rightsList: []
        }
    },
    methods: {
        //type为权限类型，list 列表显示权限, tree 树状显示权限
        async getRightsList() {
            const { data: res } = await this.$http.get('rights/' + 'list')
            if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
            // console.log(res)
            this.rightsList = res.data
            this.$message.success('获取权限列表成功')
        }
    },
    created() {
        this.getRightsList()

    }
}
</script>


<style lang="less" scoped>

</style>