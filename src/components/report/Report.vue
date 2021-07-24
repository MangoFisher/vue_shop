<template>
    <div>
         <!-- 面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 为Echarts准备一个具备大小宽高的dom容器 -->
           <div id="main" style="width: 600px;height:400px">
           </div> 
        </el-card>
    </div>
</template>

<script>
//创建echarts实例
var echarts = require('echarts')
export default {
    data() {
        return {}
    },
    methods: {},
    created() {},
    mounted() {
        // var echarts = require('echarts')
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
        myChart.setOption(option)
    }
}
</script>

<style lang="scss" scoped>

</style>