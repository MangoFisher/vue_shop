<template>
    <div>
        <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                :closable="false"
                :show-icon="true"
                type="warning">
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;

}
</style>