<template>
	<view>
		<!-- 顶部 fixed定位 -->
		<view class="top-warp">
			<view class="p-l-30 p-r-30 card flex  col-bottom">
				<u-search
					placeholder="请输入小区首字母或者名称"
					@clear="clear"
					@search="search"
					@custom="search"
					v-model="keyword"
				></u-search>
			</view>
		</view>

		<mescroll-body top="80rpx" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="m-l-10 m-r-10 m-t-30">
				<u-grid col="2" :border="false">
					<u-grid-item v-for="(item, index) in data" :key="index">
						<view class=" item-card m-b-30 border-r-16 flex flex-col row-between">
							<view @click.stop="previewImage(item.imgUrl)">
								<image :src="getURl(item.imgUrl[0].url)" class="item-image"></image>
							</view>

							<view @longpress.stop="showAction(item)" @touchend="touchEnd" @touchmove="touchMove">
								<view class="item-title u-line-1 p-l-20 p-r-20 m-t-10 m-b-20 font-28">{{ item.name }}</view>
								<view class=" flex  row-right">
									<view class="m-l-20 m-r-20 m-b-20">
										<u-button size="mini" type="primary" @click="bianji(item)">编辑</u-button>
									</view>
								</view>
							</view>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
import Pinyin from '@/common/py.js';
import { fileURL, BaseURL } from '@/common/index.js';
export default {
	data() {
		return {
			ifLongtap: true,
			data: [],
			keyword: '',
			height: ''
		};
	},
onShow() {
		this.canReset && this.mescroll.resetUpScroll(false) // 重置列表数据为第一页  
		// this.canReset && this.mescroll.scrollTo(0,0) // 重置列表数据为第一页时,建议把滚动条也重置到顶部,避免无法再次翻页的问题  
		this.canReset = true // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback, 无需配置auto:false
	},
	//右上角点击事件
	onNavigationBarButtonTap() {
		this.$toPath('pages/home/eidt');
	},
	methods: {
		//预览图片
		previewImage(images) {
			let data = [];
			for (var i = 0; i < images.length; i++) {
				data.push(this.getURl(images[i].url));
			}
			uni.previewImage({
				urls: data
			});
		},
		getURl(url) {
			if (url.indexOf('http://114.96.104.189:8088/') != -1) {
				url = url.substring(27, url.length);
			}
			return fileURL + url;
		},

		bianji(item) {
			this.$toPath('/pages/home/eidt?id=' + item._id);
		},
		timeagoDiv(date) {
			return timeago(date);
		},
		touchEnd() {
			this.ifLongtap = true;
		},
		touchMove(e) {
			// 手指触摸后的移动事件
			this.ifLongtap = false;
		},
		//删除
		showAction(item) {
			if (!this.ifLongtap) {
				return;
			}
			let that = this;
			uni.showModal({
				title: '提示',
				content: `确定要删除 ${item.name} 小区吗？`,
				success: function(res) {
					if (res.confirm) {
						uni.$u.http.post('/api/product/deleteProdcut', { id: item._id }).then(res => {
							uni.$u.toast('操作成功');
							that.mescroll.resetUpScroll(false);
							that.keyword = '';
						});
					}
				}
			});
		},

		//清空事件回调
		clear() {
			this.mescroll.resetUpScroll(false);
		},
		//搜索点击事件
		search() {
			this.mescroll.resetUpScroll(false);
		},

		/*下拉刷新的回调 */
		downCallback() {
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			this.mescroll.resetUpScroll();
		},
		upCallback(page) {
			uni.$u.http
				.post('/api/product/queryProduct', {
					spelling: this.keyword,
					limit: page.size,
					page: (page.num - 1) * page.size
				})
				.then(res => {
					this.mescroll.endByPage(res.data.length, res.count);
					if (page.num == 1) {
						this.data = [];
					}
					this.data = this.data.concat(res.data);
				})
				.catch(() => {
					this.mescroll.endErr();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.item-title {
	color: #444444;
}
.item-image {
	height: 300rpx;
	width: 100%;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
}
.item-card {
	width: 330rpx;
	height: 450rpx;
	background-color: #f8f8f8;
}
/* 顶部 fixed定位*/
.top-warp {
	z-index: 200;
	position: fixed;
	top: var(--window-top);
	left: 0;
	width: 100%;
	height: 80rpx;
}
.card {
	background-color: #f8f8f8;
	height: 80rpx;
}
</style>
