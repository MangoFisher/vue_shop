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
            <el-table :data="rolesList" :border="true" :stripe="true">
                //展开列
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', index1 == 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag>{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级、三级权限 -->
                            <el-col :span="19">
                                <el-row  :class="[index2 == 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                                    <el-col :span="9">
                                        <el-tag type="warning">
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="15" >
                                        <el-tag type="danger" v-for="(item3, index3) in item2.children" :key="item3.id">
                                            {{ item3.authName }}
                                            <i class="el-icon-caret-right"></i>
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="roleDeleteById(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRolesEditDialog">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限对话框"
            :visible.sync="roleEditDialogVisible"
            width="30%"
            >
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleEditDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleEditDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: [],
            roleEditDialogVisible: false
        }
    },
    methods: {
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            // console.log(res.data)
            if(res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
            this.rolesList = res.data
            this.$message.success('获取角色列表成功')
        },
        async roleDeleteById(id) {
            const res = await this.$confirm('此操作将删除该角色信息, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                            }).catch((err) => {
                                                return err
                                            })
            if('confirm' !== res) return this.$message.info('用户取消删除！')
            const { data: result } = await this.$http.delete('roles/' + id )
            if(result.meta.status !== 200) return this.$message.error('角色删除失败！')
            this.$message.success('角色删除成功！')
            this.getRolesList()
        },
        //分配权限对话框
        async showRolesEditDialog() {
            this.roleEditDialogVisible = true
            const { data: res } = await this.$http.get('rights/tree')
            console.log(res)
        }

    },
    created() {
        this.getRolesList()
    }
}
</script>

<style lang="less">
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

//垂直方向居中对齐，谁想要此效果，绑定该类即可
.vcenter {
    display: flex;
    align-items: center;
}
</style>