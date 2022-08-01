const fileInput =document.querySelector(".file-input"),
previewImg =document.querySelector(".preview-img img");
filterName =document.querySelector(".filter-info .name");
filterValue =document.querySelector(".filter-info .value");
chooseImageBtn =document.querySelector(".choose-img");
resetFilterBtn =document.querySelector(".reset-filter");
saveImgBtn =document.querySelector(".save-img");
filterSlider =document.querySelector(".slider input");
filterOptions =document.querySelectorAll(".filter button");
rotateOptions =document.querySelectorAll(".rotate button");


let brightness =100, saturation =100, inversion =0, grayscale=0;
let rotate=0, flipHorizontal = 1, flipVertical = 1;

const applyFilters =()=> {
    previewImg.style.filter =`brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    previewImg.style.transform=`rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;

}


const loadImage =() =>{
    let file =fileInput.files[0];      //load image which user selected
    if(!file) return;       // its return if user has not selected file
    previewImg.src=URL.createObjectURL(file); //passing file url to previw image
    previewImg.addEventListener("load",()=>{

        resetFilterBtn.click();         // clciking reset btn, so reset the value for the new image
        document.querySelector(".container").classList.remove("disable")
    });

} 

filterOptions.forEach(option => {
    option.addEventListener("click",()=> {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        
        filterName.innerText=option.innerText;
   
        if(option.id === "brightness"){
            filterSlider.max="200";
            filterSlider.value = brightness;
            filterValue.innerText=`${brightness}%`;
        } else if(option.id === "saturation"){
            filterSlider.max="200";
            filterSlider.value = saturation;
            filterValue.innerText=`${saturation}%`;
        } else if(option.id === "inversion"){
            filterSlider.max="100";
            filterSlider.value = inversion;
            filterValue.innerText=`${inversion}%`;
        } else{
            filterSlider.max="100";
            filterSlider.value = grayscale;
            filterValue.innerText=`${grayscale}%`;
        }
    });
});


rotateOptions.forEach(option=>{
    option.addEventListener("click",()=> { 
        if(option.id==="left"){
            rotate -=90;
        } else if (option.id === "right"){
            rotate +=90;
        }else if (option.id === "horizon"){
           flipHorizontal =flipHorizontal === 1? -1 : 1;
        }else{
            flipVertical =flipVertical === 1? -1 : 1;
        }

        applyFilters();
    });
});
 
const updateFilter=() => {
    filterValue.innerText=`${filterSlider.value}%`;
    const selectedFilter= document.querySelector(".filter .active") //getting selected filter btn

    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
    } else if(selectedFilter.id=== "saturation"){
        saturation = filterSlider.value;
    } else if(selectedFilter.id=== "inversion"){
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }

    applyFilters();
}

const resetFilter = () => { // reset all in default value
    brightness =100; saturation =100; inversion =0; grayscale=0;
    rotate=0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click(); // now all value showing in default after reseting
    applyFilters();
}

const saveImg = () => {
    const canvas =document.createElement("canvas"); //creating  canvas element
    const obj = canvas.getContext("2d"); // canvas.getcontext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth; // setting actual width
    canvas.height = previewImg.naturalHeight; // setting actual height

    //applying user selected filter to the canvas that image will be saved
    obj.filter= `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    obj.translate(canvas.width /2, canvas.height /2); //translating canvas from center
    if(rotate !== 0) {
        obj.rotate(rotate * Math.PI /180)
    }
    obj.scale(flipHorizontal, flipVertical); //flip canvas forizontally and verticaly
    obj.drawImage(previewImg,-canvas.width /2, -canvas.height /2, canvas.width, canvas.height );
  
    const link = document.createElement("a");  //creating (a) element
    link.download = "image.jpg";                //paasing  a tag download value to "image.jpg"
    link.href = canvas.toDataURL();             //paasing  a tag download value to canvas data url
    link.click();                           //clciking  a tag to image downlaod


}

resetFilterBtn.addEventListener("click",resetFilter);
saveImgBtn.addEventListener("click",saveImg);
filterSlider.addEventListener("input", updateFilter);
fileInput.addEventListener("change",loadImage);
chooseImageBtn.addEventListener("click",()=> fileInput.click());