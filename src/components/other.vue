<template>
    <div class="content-right" v-cloak>
        <div class="content-wrap" id="orderContent">
            <div class="my_content" v-cloak>
                <div class="my_content_body">
                    <div class="my_order_head">
						<span>
							<span>预定日期</span>
							<input type="text" placeholder="请选择开始日期" @click = "dateLeft()" v-model="param.beginBookingDay" data-type="time" readonly>
							<i> -- </i>
							<input type="text" placeholder="请选择结束日期" @click = "dateRight()" v-model="param.endBookingDay" data-type="time" readonly>
							<div class="my_date_big_box" v-show="isTimeShow" v-bind:class = "{my_date_right:right}">
								<div class="my_date_month">
									<div class="my_month_move prevMonth" @click = "clickMonth(-1)">
										<span class="glyphicon glyphicon-menu-left"></span>
									</div>
									<div class="my_month_select my_month_selected" data-change="1">{{currentDate.substring(0,4) + "年" + currentDate.substring(4,6) + "月"}}</div>
									<div class="my_month_move nextMonth" @click = "clickMonth(1)">
										<span class="glyphicon glyphicon-menu-right"></span>
									</div>
								</div>
								<div class="my_date_week">
									<div class="left" style="color: #f75461;">日</div>
									<div class="left">一</div>
									<div class="left">二</div>
									<div class="left">三</div>
									<div class="left">四</div>
									<div class="left">五</div>
									<div class="left" style="color: #f75461;">六</div>
								</div>
								<div class="my_date_day clear">
									<div v-for = "item in date" :data-time="item">
										<!--年月日相等的当前日期-->
										<span v-if="item.substring(0,4) == fixDate.getFullYear()
													&& item.substring(4,6) == fixDate.getMonth()+1
													&& item.substring(6,8) == fixDate.getDate()" v-on:click="selectedDate($event)" class="active_month">
													{{item.substring(6,8)}}
										</span>
                                        <!--年份小，年份等月份小，年份月份等日期小的前面的日期-->
										<span v-else-if="item.substring(0,4) < param.beginBookingDay.substring(0,4) ||
														 (item.substring(0,4) === param.beginBookingDay.substring(0,4) && item.substring(4,6) < param.beginBookingDay.substring(5,7)) ||
														 (item.substring(0,4) === param.beginBookingDay.substring(0,4)
														 && item.substring(4,6) === param.beginBookingDay.substring(5,7)
														 && item.substring(6,8) < param.beginBookingDay.substring(8,10))" v-on:click="selectedDate($event)" class="pre_date">
														 {{item.substring(6,8)}}
										</span>
                                        <!--月份不等的其他月份-->
										<span v-else-if="item.substring(4,6) != currentDate.substring(4,6)" class="other_month" v-on:click="selectedDate($event)">{{item.substring(6,8)}}</span>
                                        <!--本月分的日期-->
										<span v-else  v-on:click="selectedDate($event)">{{item.substring(6,8)}}</span>
									</div>
								</div>
							</div>
						</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            param : {
                beginBookingDay : "2018-02-05",
                endBookingDay : "2018-02-02"
            },
            fixDate:"",				/*当前utc时间。不随事件触发改变，随点击事件改变并给相应日期加上点击样式*/
            nowDate:"",				/*当前utc时间。随事件触发改变*/
            currentDate:"",			/*当前字符串时间*/
            date:[],				/*该数组储存整月日历数值*/
            isTimeShow:false,		/*是否显示日历布尔值*/
            right:false				/*是否右移布尔值*/
        }
    },
    mounted : function() {
            this.init();
    },
    methods : {
        init : function() {
            this.fixDate = new Date();
            this.nowDate = new Date();
            this.initDate();
        },


        /*日历*/
        /*日历的显示隐藏*/
        dateToggle:function(){
            if(!this.isTimeShow){
                this.isTimeShow = true;
            }else{
                this.isTimeShow = false;
            }
        },
        /*选择结束日期还原到左侧*/
        dateLeft:function(){
            var that = this;
            that.right = false;
            that.dateToggle();
        },
        /*选择开始日期时右移到右侧*/
        dateRight:function(){
            var that = this;
            if(!!that.param.beginBookingDay){
                that.right = true;
                that.dateToggle();
            }
        },
        /*将utc时间转换为年月日字符串*/
        dateString:function(date){
            var year = date.getFullYear(),
                month = date.getMonth()+1,
                day = date.getDate();
            if(day < 10){
                day = "0" + day;
            }
            if(month < 10){
                month = "0" + month;
            }else{
                month = "" + month;  //需加上这一步，将数字转换为字符串？
            }
            return year+month+day;
        },
        /*日历数据渲染*/
        dayRender:function(date){
            var that = this,
                stringDate = that.dateString(date),
                year = stringDate.substring(0,4),
                month = stringDate.substring(4,6);
            that.date.length = 0;
            for(var i=0 ; i<42 ; i++){
                var nowDate = new Date(year,month-1,1),
                    week = nowDate.getDay(),stringNowDate;
                /*以每年每月的1号的星期数值为基点，依次渲染怎么日历表的日期数据*/
                nowDate.setDate(i+1-week);
                stringNowDate = that.dateString(nowDate);
                that.date.push(stringNowDate);
            }
        },
        /*初始化日历*/
        initDate:function(date){
            var that = this;
            if(!date){
                var nodate = new Date();
                that.dayRender(nodate);
                this.currentDate = that.dateString(nodate);
            }else{
                that.dayRender(date);
                this.currentDate = that.dateString(date);
            }
        },
        /*依据传入参数的正负重新渲染日历*/
        clickMonth:function(num){
            var that = this,
                nowyear = that.nowDate.getFullYear(),
                nowmonth = that.nowDate.getMonth()+num;
            that.nowDate = new Date(nowyear,nowmonth,1);
            that.currentDate = that.dateString(that.nowDate);
            that.initDate(that.nowDate);
        },
        /*点击日期数据导入input，并被加上特定样式*/
        selectedDate :function(e){
            var that = this,
                nowDate = e.target.parentNode.getAttribute("data-time"),
                year = nowDate.substring(0,4),
                month = nowDate.substring(4,6),
                day = nowDate.substring(6,9),
                nowDateString = year+"年"+month+"月"+day+"日";
            /*开始日期表单内的年月日*/
            var starYear = that.param.beginBookingDay.substring(0,4),
                starMonth = that.param.beginBookingDay.substring(5,7),
                starDay = that.param.beginBookingDay.substring(8,10);
            if(!that.right){
                /*开始日期表单导入值时，结束日期表单值重置*/
                that.param.beginBookingDay = nowDateString;
                that.param.endBookingDay = "";
                /*设置为当前固定时间，即为选中的日期加上选中样式*/
                that.fixDate = new Date(year,month-1,day);
                /*日历控件的显示与隐藏*/
                that.dateToggle();
            }else if(that.right && year>starYear ||(year===starYear && month>starMonth) || (year===starYear && month===starMonth && day>=starDay)){
                /*当日历控件在右侧且所选日期大于或等于开始日期(年份大，年份等但月份大，年份等月份等日期大)时才会将值导入结束日期表单*/
                that.param.endBookingDay = nowDateString;
                that.fixDate = new Date(year,month-1,day);
                that.dateToggle();
            }
        }
    }
}
    </script>

    <style>
    .left{
        float: left;
    }
    .clear:before,.clear:after {
        content: '';
        clear: both;
        display: table;
    }
    .my_center_right_nav_list>span.right{
        position: relative
    }
    .my_center_right_nav_list>div.right{
        position: relative;top: -5px;margin-left: 20px;color:#fc3d6a
    }
    .my_order_search{
        width: 240px;height: 32px;background:#f5f5f5;border: 1px solid #b2b2b2;position: relative;top: 0;padding: 0 40px 0 10px;outline: none;
    }
    .my_order_search+.iconfont{
        color:#faa3b7;position: absolute;right: 6px;top: -3px;font-size: 24px;cursor: pointer;
    }
    .my_order_head{
        height: 80px;
        line-height: 80px;
    }
    .my_order_head [data-type='time']{
        width:160px;
        height: 32px;
        background-color: #fff;
        border: 1px solid #b3b3b3;
        padding: 0 40px 0 10px;
        border-radius: 5px;
    }
    .my_order_head [data-type="down2"]{
        width: 150px;
        height: 32px;
        border: 1px solid #b3b3b3;
        padding:0 40px 0 10px;
        border-radius:5px;
    }
    .my_order_head>span{
        position:relative;
        margin-left: 12px;
    }
    .my_order_head>span>span{
        margin-right: 8px;
    }
    .my_order_head>span>input{
        cursor:pointer;
    }
    .my_order_head>button{
        width: 62px;height: 32px;border: none;background: #fc3d6a;color:#fff;border-radius: 5px;line-height: 32px;
        margin-left: 10px;
    }
    .my_head_table{
        width: 100%;border:1px solid #e5e5e5;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-bottom: 20px;
    }
    .my_head_table select{
        width: 94px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        background-size:20px 15px;
        padding: 0 25px 0 7px;
    }
    .my_order_table>tbody>tr>td:nth-child(1){
        width: 390px;
    }
    .my_order_table>tbody>tr>td:nth-child(2){
        width: 94px;
    }
    .my_order_table>tbody>tr>td:nth-child(3){
        width: 83px;
    }
    .my_order_table>tbody>tr>td:nth-child(4){
        width: 91px;
    }
    .my_order_table>tbody>tr>td:nth-child(5){
        width: 91px;
    }
    .my_order_table>tbody>tr>td:nth-child(6){
        width: 107px;
    }
    .my_order_table>tbody>tr>td:nth-child(7){
        width: 97px;
    }
    .my_order_item{
        margin-bottom: 30px;
    }
    .my_order_item_table>tbody>tr>td{
        border-right:1px solid #e5e5e5;
        text-align: center;
    }
    .my_order_body{
        padding: 0 20px
    }
    .my_order_item_table>tbody>tr>td:last-child{
        border: none;
    }
    
    .my_order_item_table>tbody>tr>td:first-child{
        text-align: left;
        padding: 15px 27px
    }
    .my_order_item_table>tbody>tr>td:first-child img{
        width: 96px;height: 86px;border: 1px solid #ccc;border-radius: 3px;vertical-align: middle;
    }
    .my_order_item_table>tbody>tr>td:first-child>div{
        display:inline-block;width: 220px;vertical-align: middle;margin-left: 10px;
    }
    .my_order_item{
        border: 1px solid #e5e5e5
    }
    .my_order_item_title{
        border-bottom: 1px solid #e5e5e5;line-height: 32px;padding: 0  25px;
    }
    .my_go_pay_btn{
        background: #fff;
        border: 1px solid #fc3d6a;
        color:#fc3d6a;
        border-radius: 5px;
        padding: 6px 8px;
    }
    .my_go_detail_btn{
        background: #fff;
        border: 1px solid #4598c8;
        color:#4598c8;
        border-radius: 5px;
        padding: 6px 8px;
    }
    
    /*日历*/
    .my_date_big_box{position:absolute;left:68px;top:27px;width:200px;height:350px;}
    .my_order_head .my_date_right{left:247px;}
    .my_date_month{height:28px;cursor: pointer}
    .my_month_select{font-size:14px;float:left;background:#fc3f6c;line-height: 28px;width:140px;color:#fff;text-align: center}
    .my_month_move{float:left;line-height: 28px;width:30px;height:28px;text-align: center;background:#fc3f6c;color: #fff;}
    .my_date_week{height:28px;background:#e6e6e6;color:#333;}
    .my_date_week>div{width:calc(100% / 7);color:#333;line-height: 28px;text-align: center;}
    .my_date_day{border:1px solid #e0e0e0;border-top:none;}
    .my_date_day>div{float:left;height:30px;line-height:30px;width:calc(100% / 7);border-right: 1px solid #c6c6c6;border-bottom:1px solid #c6c6c6;background:#fff;text-align:center;cursor:pointer;box-sizing: border-box;}
    .my_date_day>div>span{display:block;}
    .my_date_day>div:nth-of-type(7n){border-right:none;}
    .my_date_day>div:nth-of-type(n+36){border-bottom:none;}
    .pre_date{color:#DDD}
    .other_month{color:#C0C0C0}
    .active_month{color:#fc3f6c}
    .my_date_day_row:last-child{border: none}
    .my_date_day_col:last-child{border: none}
    .my_date_prevmonth{color:#fff;}
    .my_date_prevmonth>span{color:#fff!important;}
    .my_date_day_col_now{color:#fc3f6c;}
    [prop="date_stock"]{color:#ee873f;position:relative;top: 4px;}
    [prop="date_stock"] span{color:#ee873f;font-size: 12px;}
    [data].selected:not(.my_date_prevmonth){background:#fc3f6c44;border:1px solid #fc3f6c;}

</style>