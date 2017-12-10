## 街区地图

### 使用指南
  1. 下载该项目所有文件，双击 `index.html` ,即可打开基于谷歌地图的街区地图项目-搜索各城市的高校。
  2. 该项目主要使用 **Google Maps API** 载入谷歌地图以实现各项功能。利用Google Maps API内的 **places库** 和 **搜索自动完成** 完成对国内各个城市的主要高校机构的搜索及返回相关信息(可单击标记查看相关信息, 也可查看名单中的主要信息)。
  3. 单击地图上方的 **搜索框**，输入城市名(中英文), **地址和搜索自动完成** 功能会在搜索框下方显示和输入相关完整的地址，选择需要的地址，地图会定位在该城市，并对该区域搜索相关的高等学校机构。同时将所有搜索结果在地图中以标记显示，主要的信息显示在结果名单表中。
  4. 在搜索框右边利用 **knockout框架**(MVVM模式)生成的 **选择列表** 中，可对浙江省内各大城市进行初步筛选，选择需要查询的城市后，地图会定位在该城市，然后单击搜索框其下方会显示相关完整地址，选择完整的地址后即能在地图上返回该城市高校标记和结果高校名单表。同时切换或搜索不同城市时，搜索框和选择列表城市信息保持一致，标记和名单表同步刷新。
  5. 地图中 **高校名单表** 表格利用 **knockout框架**(MVVM模式)，将返回的信息(`autocomplete`的`place_changed`事件绑定KO内事件)，自动更新填入对应的信息的表格内。点击表格中一处地点的 [Remove it] 可以移除该处表格内容和地图上该处的标记。当返回完整的需要搜索的城市地址后，若搜索的结果数量为0，或没有搜索或搜索信息不全未正确搜索时，则不显示结果名单表。
  6. 响应式样式 使用 **Bootstrap 样式**, 在大屏情况下表格中显示地址列表，在大屏以下只显示地名。同时当屏幕小于`width<560px`时,隐藏名单表。
  7. 使用其他第三方API-百度地图WEB服务API，微信小程序应用类别下利用Ajax获取每处marker的天气情况，并在点击marker后显示。

----

### 项目使用资源
  * [knockout文档资源](http://knockoutjs.com/documentation/introduction.html)
  * [Google Maps JavaScript API 参考文档](https://developers.google.com/maps/documentation/javascript/reference)
  * [Google Maps JavaScript API 指南参考](https://developers.google.com/maps/documentation/javascript/tutorial)
