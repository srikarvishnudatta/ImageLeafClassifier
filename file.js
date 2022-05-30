var RED_INTENCITY_COEF = 0.2126;
var GREEN_INTENCITY_COEF = 0.7152;
var BLUE_INTENCITY_COEF = 0.0722;

//var canvas = document.createElement('CANVAS');
let canvas = document.getElementById('viewport');
let ctx = canvas.getContext('2d');

var img = new Image();

function toGrayscale(context, w, h) {
    var imageData = context.getImageData(0, 0, w, h);
    var data = imageData.data;
    
    for(var i = 0; i < data.length; i += 4) {
        var brightness = RED_INTENCITY_COEF * data[i] + GREEN_INTENCITY_COEF * data[i + 1] + BLUE_INTENCITY_COEF * data[i + 2];
        // red
        data[i] = brightness;
        // green
        data[i + 1] = brightness;
        // blue
        data[i + 2] = brightness;
    }
    
    // overwrite original image
    context.putImageData(imageData, 0, 0);
};

function hist(context, w, h) {
    var imageData = context.getImageData(0, 0, w, h);
    var data = imageData.data;
    var brightness;
    var brightness256Val;
    var histArray = Array.apply(null, new Array(256)).map(Number.prototype.valueOf,0);
    
    for (var i = 0; i < data.length; i += 4) {
        brightness = RED_INTENCITY_COEF * data[i] + GREEN_INTENCITY_COEF * data[i + 1] + BLUE_INTENCITY_COEF * data[i + 2];
        brightness256Val = Math.floor(brightness);
        histArray[brightness256Val] += 1;
    }
    
    return histArray;
};

function otsu(histogram, total) {
    var sum = 0;
    for (var i = 1; i < 256; ++i)
        sum += i * histogram[i];
    var sumB = 0;
    var wB = 0;
    var wF = 0;
    var mB;
    var mF;
    var max = 0.0;
    var between = 0.0;
    var threshold1 = 0.11;
    var threshold2 = 0.4;
    for (var i = 0; i < 256; ++i) {
        wB += histogram[i];
        if (wB == 0)
            continue;
        wF = total - wB;
        if (wF == 0)
            break;
        sumB += i * histogram[i];
        mB = sumB / wB;
        mF = (sum - sumB) / wF;
        between = wB * wF * Math.pow(mB - mF, 2);
        if ( between >= max ) {
            threshold1 = i;
            if ( between > max ) {
                threshold2 = i;
            }
            max = between;            
        }
    }
    return ( threshold1 + threshold2 ) / 2.0;
};
function binarize(threshold, context, w, h) {
    var imageData = context.getImageData(0, 0, w, h);
    var data = imageData.data;
    var val;
    
    for(var i = 0; i < data.length; i += 4) {
        var brightness = RED_INTENCITY_COEF * data[i] + GREEN_INTENCITY_COEF * data[i + 1] + BLUE_INTENCITY_COEF * data[i + 2];
        val = ((brightness > threshold) ? 255 : 0);
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
    }
    
    // overwrite original image
    context.putImageData(imageData, 0, 0);
    return imageData
}
function export_otsu(img){
    var w = img.width, h = img.height
    canvas.height = h;     
    canvas.width = w;       
    ctx.drawImage(img, 0, 0);
    //toGrayscale(ctx, w, h);
    var histogram = hist(ctx, w, h);
    var threshold = otsu(histogram, w*h);
    return binarize(threshold, ctx, w, h);
}