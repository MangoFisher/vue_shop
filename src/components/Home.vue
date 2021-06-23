<template>
    <!-- <el-button type="info" @click="logout">退出</el-button> -->
    <el-container class="home-container">
        <el-header >
            <div>
                <img src="../assets/logo.png" alt="">
                <span>电商后台管理系统</span>   
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                        <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>    
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            //左侧菜单数据
            menuList: []
        }
    },
    created() {
        this.getMenuList()
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            if(res.meta.status !== 200) return this.$message.error('res.meta.msg')
            this.menuList = res.data
            console.log(res)
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
//elementUI中的组件名,即为类名
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;
}

.el-main {
    background-color: #EAEDF1;
}
</style>