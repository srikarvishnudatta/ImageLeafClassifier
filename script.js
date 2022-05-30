

let imageFile = null
var loadFile = function (event) {
    var image = document.getElementById("display-image");
    image.src = URL.createObjectURL(event.target.files[0]);
    imageFile = image
  };
function segmentation(imageFile){
    let raw_image =   tf.browser.fromPixels(imageFile).resizeNearestNeighbor([224, 224]).toFloat().expandDims()
    let final_result = export_otsu(imageFile)
    console.log(final_result)
    console.log(raw_image.shape)
    return seg_func(final_result)
}


function seg_func(image){
    sample_h = rgbToHsv(image[0],image[1],image[2])
    const t1 = image[0] * sample_h[0]
    const t2 = image[1] * sample_h[1]
    const t3 = image[2] * sample_h[2]
    console.log(t1)
    console.log(t2)
    console.log(t3)
    return [t1,t2,t3]
    // return mask2
}
function rgbToHsv(r, g, b) {
    // r /= 255, g /= 255, b /= 255;
  
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;
  
    var d = max - min;
    s = max == 0 ? 0 : d / max;
  
    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
    }
  
    return [ h, s, v ];
  }
async function loadVGG16(){
    seg_vgg16 = await tf.loadGraphModel('Files/seg/VGG16/model.json')
    console.log(seg_vgg16)
    console.log('seg VGG16 loaded')
}
loadVGG16()
async function loadNVGG16(){
    nseg_vgg16 = await tf.loadGraphModel('Files/non-seg/VGG16/model.json')
    console.log(nseg_vgg16)
    console.log('non-seg VGG16 loaded')
}
loadNVGG16()
async function loadINCEP(){
    seg_incep = await tf.loadGraphModel('Files/seg/InceptionResNetv2/model.json')
    console.log(seg_incep)
    console.log('seg InceptionResNetv2 loaded')
}
loadINCEP()
async function loadNINCEP(){
    nseg_incep = await tf.loadGraphModel('Files/non-seg/InceptionResNetv2/model.json')
    console.log(nseg_incep)
    console.log('non-seg InceptionResNetv2 loaded')
}
loadNINCEP()
async function loadRESNET(){
    seg_res = await tf.loadGraphModel('Files/seg/ResNet50v2/model.json')
    console.log(seg_res)
    console.log('seg ResNet50v2 loaded')
}
loadNRESNET()
async function loadNRESNET(){
    nseg_res = await tf.loadGraphModel('Files/non-seg/ResNet50v2/model.json')
    console.log(nseg_res)
    console.log('non-seg ResNet50v2 loaded')
}
loadRESNET()

async function predictModel(){  
    //models = ['VGG16', 'InceptionResNetv2', 'ResNet50v2']
    //loaded_models = [nseg_vgg16,nseg_incep,nseg_res]
    
    if (imageFile != null){
        console.log('image is loaded')
        segmentation(imageFile)
        predictNResults(nseg_res,'ResNet50v2',6)
        predictNResults(nseg_incep,'InceptionResNetv2',5)
        predictNResults(nseg_vgg16,'VGG16',4)
        

        predictResults(seg_res,'ResNet50v2',3)
        predictResults(seg_incep,'InceptionResNetv2',2)
        predictResults(seg_vgg16,'VGG16',1)
    }
    else{
        console.log('image is not loaded')
    }
async function predictResults(element, our_model,model_num){
    let image = document.getElementById("display-image") 
    let tensorImg =   tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().expandDims()
    let out = await element.execute(tensorImg).data()
    output = await element.execute(tensorImg).data()
        // console.log(output)
        results = Array()
        results.push(output[0])
        results.push(output[1])
        results.push(output[2])
        // console.log(results)
        answer = results.indexOf(1)
        final_value = ''
        if (answer == 0){
            final_value = 'angular-leaf-spot'
        }
        else if (answer == 1){
            final_value = 'bean-rust'
        }
        else{
            final_value = 'healthy'
        }
        const node = document.getElementById(model_num)
        node.style.backgroundColor = '#00DBD0'
        let r1 = model_num + '-1'
        let r2 = model_num + '-2'
        const textNode = document.getElementById(r2)
        textNode.textContent = final_value
        const modelNode = document.getElementById(r1)
        modelNode.textContent = our_model
        
        // const parent = document.getElementById(our_model)
        // parent.appendChild(node)
        // console.log(out)
}

async function predictNResults(element,our_model,model_num){
    let image = document.getElementById("display-image")  
    let tensorImg =   tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().expandDims()
    
    // console.log(tensorImg)
        output = await element.execute(tensorImg).data()
        // console.log(output)
        results = Array()
        results.push(output[0])
        results.push(output[1])
        results.push(output[2])
        // console.log(results)
        answer = results.indexOf(1)
        final_value = ''
        if (answer == 0){
            final_value = 'angular-leaf-spot'
        }
        else if (answer == 1){
            final_value = 'bean-rust'
        }
        else{
            final_value = 'healthy'
        }
        const node = document.getElementById(model_num)
        node.style.backgroundColor = '#00DBD0'
        let r1 = model_num + '-1'
        let r2 = model_num + '-2'
        const textNode = document.getElementById(r2)
        textNode.textContent = final_value
        const modelNode = document.getElementById(r1)
        modelNode.textContent = our_model
        // const parent = document.getElementById('non_segmented_div')
        // parent.appendChild(node)
}
}