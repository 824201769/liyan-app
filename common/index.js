export let BaseURL = 'http://125.124.134.54:3000/'
export let fileURL = 'http://125.124.134.54:8088/'

// 路由跳转
export function toPath(url, isLogin = true) {
	let delay = 500
	let timer = null
	if (timer) {
		return
	}
	uni.$u.route(url)
	timer = setTimeout(() => {
		timer = null
	}, delay)
}
// 解析地址（省市区）
export function decodeAddress(address, separator) {
	address = address.match(/.+?(省|市|自治区|自治州|县|区)/g)
	if (address[0] === address[1]) {
		address.shift() // 删除第一个
	}
	separator = separator ? separator : ''
	let res = address[0] + separator + address[1]
	if (address[2]) {
		res = res + separator + address[2]
	}
	return res
}
//解析定位后的地址
export function reverseGeocode(longitude, latitude) {
	return new Promise((resolve, reject) => {
		var point = new plus.maps.Point(longitude, latitude);
		plus.maps.Map.reverseGeocode(point, {}, function(event) {
			var address = event.address; // 转换后的地理位置
			var point = event.coord; // 转换后的坐标信息
			var coordType = event.coordType; // 转换后的坐标系类型
			let area = decodeAddress(address);
			let addressStr = address.substring(area.length, address.length);
			resolve({
				success: true,
				longitude: point.longitude,
				latitude: point.latitude,
				area: area,
				address: addressStr
			})
		}, function(e) {
			resolve({
				success: false
			})
		});
	})
}
//datetime 格式为2019-11-22 12:23:59样式
//将时间转换成几天前，几个月前，几小时前等
export function timeago(datetime) { //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
	var dateTimeStamp = Date.parse(datetime.replace(/-/gi, "/"));
	var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
	var hour = minute * 60;
	var day = hour * 24;
	var week = day * 7;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime(); //获取当前时间毫秒
	var diffValue = now - dateTimeStamp; //时间差
	if (diffValue < 0) {
		return '刚刚';
	}
	var minC = diffValue / minute; //计算时间差的分，时，天，周，月
	var hourC = diffValue / hour;
	var dayC = diffValue / day;
	var weekC = diffValue / week;
	var monthC = diffValue / month;
	var result = "2";
	if (monthC >= 1 && monthC <= 3) {
		result = " " + parseInt(monthC) + "月前"
	} else if (weekC >= 1 && weekC <= 3) {
		result = " " + parseInt(weekC) + "周前"
	} else if (dayC >= 1 && dayC <= 6) {
		result = " " + parseInt(dayC) + "天前"
	} else if (hourC >= 1 && hourC <= 23) {
		result = " " + parseInt(hourC) + "小时前"
	} else if (minC >= 1 && minC <= 59) {
		result = " " + parseInt(minC) + "分钟前"
	} else if (diffValue >= 0 && diffValue <= minute) {
		result = "刚刚"
	} else {
		var datetime = new Date();
		datetime.setTime(dateTimeStamp);
		var Nyear = datetime.getFullYear(); {}
		var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
		var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
		var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
		var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
		var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
		result = Nyear + "-" + Nmonth + "-" + Ndate
	}
	return result;
}
