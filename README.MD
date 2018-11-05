# psd-layer

>PSD生成html层

## 安装
```shell
yarn add onemt-image-min
```
## 使用
```shell
npx psd-layer --config.output=src/static-layer
```
## 指定配置
```shell
npx psd-to-html --config=./config/psd.js
```

## 参数

| 参数名称 | 类型 | 默认值 | 说明 |  
| :--- | :--- | :--- | :----: | 
| $Layer | string | '#app' | 背景层节点选择符 | 
| input  | string | '' | psd文件路径 |
| output  | string | 'src/psd-layer/' | 输出目录 |
| outputName  | string | 'style.css' | 输出层样式文件名 |
| preview  | string | 'preview.png' | 输出预览图片路径 |
| prefix  | string | 'slice-' | 输出切片名前缀 |
| ext  | string | ext | 输出切片文件类型 |
| quality  | string | 80 | 输出切片质量 |