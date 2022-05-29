
let imageFile = null

var loadFile = function (event) {
    var image = document.getElementById("display-image");
    image.src = URL.createObjectURL(event.target.files[0]);
    imageFile = image
  };
async function loadVGG16(){
    seg_vgg16 = await tf.loadGraphModel('Files/seg/VGG16/model.json')
    console.log(seg_vgg16)
    console.log('seg VGG16 loaded')
}
async function loadNVGG16(){
    nseg_vgg16 = await tf.loadGraphModel('Files/non-seg/VGG16/model.json')
    console.log(nseg_vgg16)
    console.log('non-seg VGG16 loaded')
}
async function loadINCEP(){
    seg_incep = await tf.loadGraphModel('Files/seg/InceptionResNetv2/model.json')
    console.log(seg_incep)
    console.log('seg InceptionResNetv2 loaded')
}
async function loadNINCEP(){
    nseg_incep = await tf.loadGraphModel('Files/non-seg/InceptionResNetv2/model.json')
    console.log(nseg_incep)
    console.log('non-seg InceptionResNetv2 loaded')
}
async function loadRESNET(){
    seg_res = await tf.loadGraphModel('Files/seg/ResNet50v2/model.json')
    console.log(seg_res)
    console.log('non-seg ResNet50v2 loaded')
}
async function loadNRESNET(){
    nseg_res = await tf.loadGraphModel('Files/non-seg/ResNet50v2/model.json')
    console.log(nseg_res)
    console.log('non-seg ResNet50v2 loaded')
}
loadVGG16()
loadNVGG16()
loadINCEP()
loadNINCEP()
loadNRESNET()
loadNRESNET()
async function predictModel(){  
    models = ['VGG16', 'InceptionResNetv2', 'ResNet50v2']
    loaded_models = [nseg_vgg16,nseg_incep,nseg_res]
    if (imageFile != null){
        console.log('image is loaded')
        predictNResults(nseg_res,'ResNet50v2')
        predictNResults(nseg_incep,'InceptionResNetv2')
        predictNResults(nseg_vgg16,'VGG16')
        
    }
    else{
        console.log('image is not loaded')
    }
async function predictNResults(element,our_model){
    let image = document.getElementById("display-image")  
    let tensorImg =   tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
        output = await element.execute(tensorImg).data()
        console.log(output)
        results = Array()
        results.push(output[0])
        results.push(output[1])
        results.push(output[2])
        console.log(results)
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
        const node = document.createElement('div')
        const textNode = document.createTextNode(final_value)
        const modelNode = document.createTextNode(our_model)
        node.appendChild(modelNode)
        node.appendChild(textNode)
        const parent = document.getElementById('non_segmented_div')
        parent.appendChild(node)
}
}