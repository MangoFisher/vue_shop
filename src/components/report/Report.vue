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
import _ from 'lodash'
export default {
    data() {
        return {
            option: {
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
        }
    },
    methods: {},
    created() {},
    async mounted() {
        // var echarts = require('echarts')
        var myChart = echarts.init(document.getElementById('main'));

        const { data: res } = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200) return this.$message.error('获取数据报表数据出错');
        // console.log(res)

        const result = _.merge(res.data, this.option)
        // console.log(result)
        myChart.setOption(result)
    }
}
</script>

<style lang="scss" scoped>

</style>