import mapDataJson from "@/static/mapJson/Hefei.json";
import * as echarts from "echarts";
import "echarts/lib/chart/map";
import "echarts/lib/component/geo";
import "echarts-gl";
import { useRef } from "react";
import { useEffect } from "react";
const Home = () => {
  const chartRef = useRef(null);

  const initMap = () => {
    const myChart = echarts.init(chartRef.current);
    echarts.registerMap("map", mapDataJson);
    let option = {
      backgroundColor: "transparent",
      geo3D: {
        map: "map",
        regionHeight: 6, //地图厚度
        itemStyle: {
          color: "rgb(8,32,53)",
          borderWidth: 2, //分界线宽度
          borderColor: "#409EFF", //分界线颜色
        },

        // 配置为纯黑色的背景
        // environment: "#998866", // 环境贴图。支持纯色、渐变色、全景贴图的 url。

        // 配置为垂直渐变的背景
        environment: new echarts.graphic.LinearGradient(
          0,
          0,
          0,
          1,
          [
            {
              offset: 0,
              color: "#00aaff", // 天空颜色
            },
            {
              offset: 0.7,
              color: "#998866", // 地面颜色
            },
            {
              offset: 1,
              color: "#998866", // 地面颜色
            },
          ],
          false
        ),

        //背景图
        //   environment:
        //     "https://cdn.polyhaven.com/asset_img/primary/kloppenheim_06_puresky.png?height=780",
        // shading: 'lambert',
        label: {
          show: true,
          color: "#fff", //文字颜色
          fontSize: 18, //文字大小
          position: [100, 100],
          padding: [5, 10],
          alignText: "center",
          lineHeight: 24,
          backgroundColor: "rgba(0,0,0,0.35)", //透明度0清空文字背景
          borderWidth: 1.5, //分界线宽度
          borderRadius: 5,
          borderColor: "#F2A451", //分界线颜色
          formatter: function (params) {
            // console.log("渲染", params);
            // if(params.name=='内蒙古林西工业园区' || params.name=='城北街道办事处筹备处' || params.name=='城南街道办事处筹备处'){
            //   return ` `
            // }else{
            //   return params.name
            // }
            return params.name;
          },
        },
        // 设置单独区域样式
        // regions: mapDataJson.features.map(function (feature) {
        //   return {
        //     name: feature.properties.name,
        //     height: Math.random() * 10,
        //     // itemStyle: {
        //     //   color: "#ff0000",
        //     //   opacity: 0.9, // 透明度
        //     //   borderWidth: 4, //分界线宽度
        //     //   borderColor: "#FF0000", //分界线颜色
        //     // },
        //   };
        // }),
        regions: [
          {
            name: "蜀山区",
            height: 10,
            itemStyle: {
              color: "#ff0000",
              opacity: 0.9, // 透明度
              borderWidth: 0, //分界线宽度
            },
            emphasis: {
              itemStyle: {
                color: "#ff0000",
              },
            },
          },
        ],
        // hover高亮颜色
        emphasis: {
          label: {
            formatter: function (params) {
              // console.log("hover", params);
              return params.name;
            },
          },
          itemStyle: {
            color: "#1341BE",
            opacity: 0.9, // 透明度
            borderWidth: 1, //分界线宽度
            borderColor: "#00EBFF", //分界线颜色
            shadowColor: "rgba(0, 0, 0, 0.5)", // 阴影颜色
          },
        },
        shading: "realistic",
        // 真实感材质相关配置 shading: 'realistic'时有效
        realisticMaterial: {
          detailTexture:
            "https://cdn.polyhaven.com/asset_img/primary/painted_concrete.png?height=780", // 纹理贴图
          textureTiling: 1, // 纹理平铺，1是拉伸，数字表示纹理平铺次数
          roughness: 1, // 材质粗糙度，0完全光滑，1完全粗糙
          metalness: 0, // 0材质是非金属 ，1金属
          roughnessAdjust: 0, // 粗糙度调整，在使用粗糙度贴图的时候有用。可以对贴图整体的粗糙度进行调整。默认为 0.5，0的时候为完全光滑，1的时候为完全粗糙。
        },
        // shading 为color 时无效
        light: {
          //光照阴影
          main: {
            color: "#fff", //光照颜色
            intensity: 5, //光照强度
            // shadowQuality: "high", //阴影亮度
            shadow: true, //是否显示阴影
            shadowQuality: "medium", //阴影质量 ultra //阴影亮度
            alpha: 55,
            beta: 10,
          },
          ambient: {
            intensity: 0.7,
          },
        },

        // viewControl: viewControl,
        viewControl: {
          distance: 150, // 地图视角 控制初始大小
          rotateSensitivity: 10, // 旋转操作的灵敏度，值越大越灵敏。支持使用数组分别设置横向和纵向的旋转灵敏度。设置为0后无法旋转。
          zoomSensitivity: 10, // 缩放操作的灵敏度，值越大越灵敏。设置为0后无法缩放。
          // autoRotate: false, // 是否开启视角绕物体的自动旋转查看
          // maxBeta: Infinity, // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。
          // minBeta: -Infinity, // 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。
          beta: 15, // 视角绕 y 轴，即左右旋转的角度。
          alpha: 40, // 视角绕 x 轴，即上下旋转的角度。配合 beta 可以控制视角的方向。
          panMouseButton: "left", // 平移操作使用的鼠标按键，如果设置为鼠标右键则会阻止默认的右键菜单。
          rotateMouseButton: "right", // 旋转操作使用的鼠标按键，如果设置为鼠标右键则会阻止默认的右键菜单。
          center: [5, -10, 0], // 视角中心点，旋转也会围绕这个中心点旋转
        },
      },

      series: [
        // {
        //   type: 'lines3D',
        //   coordinateSystem: 'geo3D',
        //   effect: {
        //     show: true,
        //     trailWidth: 2,
        //     trailOpacity: 0.8,
        //     trailLength: 2,
        //     constantSpeed: 120
        //   },
        //   blendMode: 'source-over',
        //   lineStyle: {
        //     width: 12,
        //     opacity: 0.9
        //   },
        //   data: [
        //     [
        //       [106.360329, 29.630748],
        //       [109.226216, 30.82779]
        //     ]
        //   ]
        // },
        {
          type: "map3D",
          map: "map",
          top: "-12",

          left: "-2",
          itemStyle: {
            opacity: 0, //设置opacity透明度为0
            borderWidth: 0,
          },
          regionHeight: 8,
          viewControl: {
            distance: 150, // 地图视角 控制初始大小
            // rotateSensitivity: 0, // 旋转
            // zoomSensitivity: 0, // 缩放
            // autoRotate: false,
            // maxBeta: Infinity,
            // minBeta: -Infinity,
            beta: 15, //旋转视角
            alpha: 40, //视角
            panMouseButton: "left",
            rotateMouseButton: "right",
            center: [5, -10, 0],
          },
          zlevel: 10,
        },
      ],
    };
    myChart.setOption(option);
  };

  useEffect(() => {
    initMap();
  }, []);

  return (
    <div id="map3decharts" className="w-full h-full">
      <div id="mapChart" ref={chartRef} className="w-full h-full"></div>
    </div>
  );
};

export default Home;
