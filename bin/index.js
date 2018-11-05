/**
 * Created by nocoolyoyo on 2018/8/27.
 */
const config = require('./config' )
const args = require('yargs').argv
const PSD = require('psd')
const images = require('images')
const fs = require('fs')
const path = require('path')
const cwd = process.cwd()

const fullFile =  path.resolve(cwd, `${config.preview}`)

const SliceInfos = []

console.log(args)

const emptyDir = function(fileUrl){
	const files = fs.readdirSync(fileUrl);//读取该文件夹
	files.forEach(function(file){
		const stats = fs.statSync(fileUrl+'/'+file);
		if(stats.isDirectory()){
			emptyDir(fileUrl+'/'+file);
		}else{
			fs.unlinkSync(fileUrl+'/'+file);
		}
	});
}

async function clean() {
	if (fs.existsSync(config.output)){
		emptyDir(config.output)
		await fs.rmdir(config.output, (err) => {
			if (err) throw err;
		})
	}

	await fs.mkdir(config.output, { recursive: true }, (err) => {
		if (err) throw err;
	});
}
/**
 * 读取psd转换输出图片
 */
async function psdPipe() {
	if(fs.existsSync(fullFile)){
		fs.unlinkSync(fullFile)
	}
	const result = await PSD.open(config.input)
	if(result) {
		await result.image.saveAsPng(fullFile)
	}
}

/**
 * 切图
 */
function slicePipe() {
	const imageData = images(fullFile)
	const height = imageData.size().height
	const width = imageData.size().width
	const sliceMap = _getSliceMap()

	function _getSliceMap() {
		const _sliceMap = []
		if(height > width){
			sliceCount = parseInt(height / width)
			const sliceLast = height % width

			for(let i = 0; i < sliceCount; i ++){
				_sliceMap.push([0, i * width, width, width])
			}
			if(sliceLast){
				_sliceMap.push([0, sliceCount * width, width, sliceLast])
			}
		} else {
			_sliceMap.push([0, 0, width, height])
		}
		return _sliceMap
	}

	sliceMap.forEach((slice, index) =>{

		SliceInfos.push({
			ratio: slice[2] / slice[3]
		})

		images(imageData, ...slice)
			.save(`${config.output}${config.SliceConfig.prefix + index}.${config.SliceConfig.ext}`, {               //Save the image to a file, with the quality of 50
				quality : config.SliceConfig.quality                    //保存图片到文件,图片质量为50
			})
	})
}

/**
 * 生成vue组件
 */
function genPsdLayer() {
	function _genBgStyles() {
		let bgImageStr = '',
				bgPositionStr = '',
				bgRepeatStr = '',
				bgSizeStr = ''
				minHeight = 0

		for(let i = 0; i < SliceInfos.length; i++){
			bgImageStr += `url(~@/static-layer/${config.SliceConfig.prefix + i}.${config.SliceConfig.ext}),`
			bgPositionStr += `center ${i === 0 ? '0': `${100 * i}vw`},`
			bgRepeatStr += 'no-repeat,'
			bgSizeStr += '100vw auto,'
			minHeight += 100 / SliceInfos[i].ratio
		}

		bgImageStr = bgImageStr.substring(0, bgImageStr.length - 1)
		bgPositionStr = bgPositionStr.substring(0, bgPositionStr.length - 1)
		bgRepeatStr = bgRepeatStr.substring(0, bgRepeatStr.length - 1)
		bgSizeStr = bgSizeStr.substring(0, bgSizeStr.length - 1)

		return ` 
			${config.$Layer} {
				min-height: ${minHeight}vw;
		    background-image: ${bgImageStr};
		    background-position: ${bgPositionStr};
		    background-repeat: ${bgRepeatStr};
		    background-size: ${bgSizeStr};
			}
		`
	}

	fs.writeFile(`${config.output}/${config.outputName}`, _genBgStyles(), (err) => {
		if (err) throw err;
		console.log('psdLayer输出成功！');
	})
}


async function run(){
	await clean()
	await psdPipe()
	slicePipe()
	genPsdLayer()
}

run()





