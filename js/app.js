
  var map,
      markers=[],
      marker,
      labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      labelIndex = 0,
      infowindow,
      autocomplete,
      service,
      content,
      request;

  var areas ={
    '杭州市':{
      center :{lat: 30.274, lng: 120.155},
      zoom:13
    },
    '绍兴市':{
      center :{lat: 29.995, lng: 120.587},
      zoom:13
    },
    '金华市':{
      center :{lat: 29.079, lng: 119.648},
      zoom:13
    },
    '宁波市':{
      center :{lat: 29.845, lng: 121.569},
      zoom:13
    },
    '嘉兴市':{
      center :{lat: 30.723, lng: 120.784},
      zoom:13
    },
    '湖州市':{
      center :{lat: 30.869, lng: 120.114},
      zoom:13
    },
    '舟山市':{
      center :{lat: 29.965, lng: 122.234},
      zoom:13
    },
    '衢州市':{
      center :{lat: 28.951, lng: 118.878},
      zoom:13
    },
    '丽水市':{
      center :{lat: 28.449, lng: 119.932},
      zoom:13
    },
    '台州市':{
      center :{lat: 28.632, lng: 121.426},
      zoom:13
    },
    '温州市':{
      center :{lat: 27.970, lng: 120.712},
      zoom:13
    }
  };

  //initMap()
  function initMap(){
    centerlatLng = {lat: 30.27409727939915, lng: 120.15506744384766};
    map = new google.maps.Map(document.getElementById("map"),{     //注：用$("#map")会出错
      center: centerlatLng,
      zoom:11
    });
    //设置信息窗口
    infowindow = new google.maps.InfoWindow();
    //设置地点服务service及service.nearbySearch(request,callback)
    service = new google.maps.places.PlacesService(map);
    //创建autocomplete(inputHTML,request)
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),{
        bounds:map.getBounds(),  //限定搜索区域
        componentRestrictions: {'country':'chn'},
        types:['(cities)']    //(regions) (cities)
      });
    //window.autocomplete=autocomplete;
    autocomplete.addListener("place_changed",onplaceChanged);
    //添加dom事件监听--当选择一个区域后地图产生变化 调用setAutocompleteArea()
    document.getElementById("area").addEventListener("change",setAutocompleteArea);

    //当自动搜索框 发生地点改变事件时 调用onplaceChanged() 进行附近搜素search()
    function onplaceChanged(){
      var place = autocomplete.getPlace();
      //将map指向自动输入的地点place
      if(place.geometry){
        map.panTo(place.geometry.location);
        map.setZoom(13);
        Search();
      }else{
        document.getElementById('autocomplete').placeholder = "点击自动搜索";
      }
      //每次自动搜素后 --若搜索的城市不在areas城市选项内 则将第一个选项设置为搜索的城市并设为可见
      for (var area in areas) {
        if (area.toLowerCase().indexOf(place.name.toLowerCase()) >= 0){
           //document.getElementById("area").value=place.name;
            return;
         }else{
           document.getElementById("area").childNodes[0].innerHTML = place.name;
           document.getElementById("area").childNodes[0].selected = true;
         };
      }
    }

    function setAutocompleteArea(){
      var areaValue = document.getElementById("area").value;
      map.setCenter(areas[areaValue].center);
      map.setZoom(areas[areaValue].zoom);
      deleteMarkers();  //彻底删除markers
      document.getElementById('autocomplete').value = areaValue;  //和输入框对应
    }

    //对城市city 进行附近搜索-大学
    function Search(){
      service.nearbySearch({
        bounds: map.getBounds(),
        //query: "university",
        types:["university"]
      },callback);
      //nearbySearch({},callback)中的callback()返回函数的设置,利用forEach()遍历results[]创建marker标记
      function callback(results,status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          deleteMarkers();
          results.forEach(function(result,index,array){
                  createMarker(result);       //for循环内--闭包closures
          });
          addWeather();  //为markers[]数组中的每处marker添加天气情况
        }
      };
    }

    //设置callback()中的createMarker() --创建marker同时设置marker点击事件 显示信息窗口
    function createMarker(result){
      var placeLoc = result.geometry.location, //获取返回结果result中的地理位置经纬度和id地址

        marker = new google.maps.Marker({       //添加var marker=后 变局部变量 私有化(外部函数无法访问)，可能会使marker的addListener()找不到marker
          map:map,
          title:result.name,
          place:{
            location:result.geometry.location,
            placeId:result.place_id
          },
          // icon:icon,          //添加标记图像
          label: labels[labelIndex++ % labels.length],   //？是否 相当于 labelIndex=(labelIndex+1)%labels.length
          animation: google.maps.Animation.DROP
        });
        marker.placeResult = result;   //将result赋值给marker.placeResult属性 以便单击marker时调用
        marker.addListener("click", showInfowindow);   //点击marker显示信息
        markers.push(marker);   //添加marker到数组markers[];
    }

    /* var markerUrl = "https://api.foursquare.com/v2/venues/" + marker.placeResult.place_id + "/photos?client_id=D3JDXGCF1NROD5NTRNZOQ4RRGM0X5E2IDU00RY2NJOAXBM53&client_secret=RX4OUBY3EEQ1GEHJ3D2BEOHBEU1EWHXBNIYANLCH1KTWPI1V&v=20131016&ll=30.274,120.155&callback=JSON_CALLBACK" ;
     * https://api.foursquare.com/v2/venues/search?client_id=CLIENT_ID&client_secret=SECRET_KEY&v=20130815&ll=17.416471,78.438247&query=coffee?callback=JSON_CALLBACK  30.274, lng: 120.155
     * imgSrc = imgPrefix + imgWidth +"x"+imgHeight+imgSuffix;
     */
    //从百度地图 第三方API获取marker地点的天气情况 并将其添加到infoWindow信息栏中 (ak=yb3Q7tLFUdlHbru69webtBWLZ8bk1G2H微信小程序开发端)
    function addWeather(){
      markers.forEach(function(marker){
        var location=marker.place.location.lng().toFixed(2) + "," + marker.place.location.lat().toFixed(2);
        var markerUrl = "http://api.map.baidu.com/telematics/v3/weather?location=" + location + "&output=json&ak=yb3Q7tLFUdlHbru69webtBWLZ8bk1G2H"
        $.ajax({
              // type: "GET",
              url: markerUrl,
              dataType:"jsonp",
              //jsonpCallback:"JSON_CALLBACK"
        }).done(function (resultData){
                  console.log(resultData);
                  if (resultData["results"]) {
                    var weatherResults = resultData["results"][0],
                        weatherData = weatherResults["weather_data"][0],
                        date = weatherData["date"],
                        imgUrl = weatherData["dayPictureUrl"];
                  marker.weather = "<div class='weather'><strong>"+marker.title+"</strong><br>"+
                                "<strong>Date：</strong>" +date+ "<br>" +
                               "<strong>Weather：</strong><img src ='" +imgUrl+ "' alt='weather' />" + "</div>";
                  }
            })
            .fail(function(){
              console.log("获取天气失败...");
            })
            .always(function(){
              console.log("获取天气成功!");
            });
      });
    }

      //showInfowindow
    function showInfowindow(){
      var marker = this;         // this为当前点击的marker placeId:result.place_id
       //通过places库 获取marker的主要信息 并将其添加到infoWindow信息栏中
      service.getDetails({placeId:marker.placeResult.place_id},function(place,status){
        if(status!==google.maps.places.PlacesServiceStatus.OK){
          alert("service.getDetails()回调出错,placeId: "+marker.placeResult.place_id);
          return;
        }
        console.log("getDetails()回调正确");
        content = "<div class='placeContent'>"+
                       "<strong>Place Formatted Address：</strong>"+place.formatted_address+"<br>"+
                       "<strong>Place ID：</strong>"+place.place_id+"<br>"+
                       "<strong>Place Website：</strong><a target='_blank' href='"+place.website+"'>"+place.website+"</a><br>"+
                  "</div>";
                  console.log(place);
        //点击跳动marker
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function(){
          marker.setAnimation(null);
        },200);
        //设置和显示信息栏内容
        infowindow.setContent(marker.weather + content);
        infowindow.open(map,marker);
      });
    }

    //点击地图
    google.maps.event.addListener(map,"click",function(event){
      console.log("bounds:"+map.getBounds()+"event:"+"latitude:"+event.latLng.lat()+" "+"lngitude:"+event.latLng.lng());
      console.log(markers);
    });

    //setMarkers()遍历markers[]数组 对每个maker重新设置map属性
    function setMarkers(map){
      markers.forEach(function(marker,index,array){
        marker.setMap(map);
      });
    }

    //showMarkers() 显示标记markers
    function showMarkers(){
      setMarkers(map);
    }

    //hiddenMarkers()隐藏标记
    function hiddenMarkers(){
      setMarkers(null);
    }
    //deleteMarkers() 删除标记
    function deleteMarkers(){
      hiddenMarkers();
      markers = [];
    }

    //viewModel Part ----VM部分

    function AreasViewModel() {
      var self = this;
      var areasArr=[],
          markersArr=[];

      //将areas{}中的name 组合为areasArr[]数组
      for (var variable in areas) {
        if (areas.hasOwnProperty(variable)) {
          areasArr.push(variable);
        };
      };

      self.availableAreas = ko.observableArray(areasArr);
      self.availableMarkers =  ko.observableArray(markers);
      self.selectedArea = ko.observable();
      //点击remove it时，将地图上的marker及表格内marker移除
      self.removeMarker = function(marker){
          self.availableMarkers.remove(marker);
          marker.setMap(null);
      };  // 怎么去出除availableMarkers[]的-- http://knockoutjs.com/documentation/observableArrays.html

      //对availableMarkers()数组添加marker 设置时间差 给 Autocomplete(,)返回完整markers[]数据
      self.addmarkers = function(){
        setTimeout(function(){
            self.availableMarkers([]);
            markers.forEach(function(marker){
              self.availableMarkers.push(marker);
              markersArr.push(marker.title);  //返回markers的title 组成数组markersArr[]
            });
            console.log(markers);
        },1500);
      };
      //点击表格中名称时 同时显示地图上对应的标记
      self.selected = function(){
        var index = markersArr.indexOf(this.title);
        google.maps.event.trigger(markers[index],"click");
        console.log(this.placeResult.name);
      };

      autocomplete.addListener("place_changed",self.addmarkers); //当自动搜索框地址改变时 调用(toggle?trigger)addmarkers()
      //self.selectedArea.subscribe(self.addmarkers);  //selectedArea 改变返回新的markers[]--？？有bug,为什么autocomplete框内 点击得到自动搜索结果后 value:selectedArea没改变？？
    }
    ko.applyBindings(new AreasViewModel());
 }

 //加载超时...
 var mapError = function(){
    setTimeout(function(){
      alert("谷歌地图加载超时...");
    },3000);
 }
