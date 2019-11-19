var input=new Image();
var file=document.getElementById('file');
var label = document.getElementById('filelabel');
var submit=document.getElementById('submit');
var brightness=document.getElementById('brightness');
var contrast=document.getElementById('contrast');
var img = document.getElementById("img");
var aadhar=document.getElementById('aadhar');
var pan=document.getElementById('pan');
var text=document.getElementById('text');
var cropImage = document.getElementById('cropImage');
var cropCancel=document.getElementById("cropCancel");
var cropSubmit=document.getElementById('cropSubmit');
var cropDiv=document.getElementById('cropDiv');

var rotate=0,times=0;
var croppedData,cropper,cropDone=0;

function anticlock(){
	Jimp.read(img.src)
	.then(function(lenna){
		lenna.rotate(90)
			.getBase64(Jimp.MIME_JPEG, function (err, src) {
                     img.setAttribute("src", src);
         });
		rotate++;
		rotate=rotate%4;
		if(rotate==3){
			rotate=-1;
		}
	}).catch(function (err) {
	    console.error(err);
	});
}

function clock(){
	Jimp.read(img.src)
	.then(function(lenna){
		lenna.rotate(-90)
			.getBase64(Jimp.MIME_JPEG, function (err, src) {
                     img.setAttribute("src", src);
         });
		rotate--;
		rotate=rotate%4;
		if(rotate==-3){
			rotate=1;
		}

	}).catch(function (err) {
	    console.error(err);
	});
}

function crop(x,y,w,h){
	Jimp.read(input.src)
	.then(function(lenna){
		lenna.crop(x,y,w,h)
         	.getBase64(Jimp.MIME_JPEG, function (err, src) {
                    img.setAttribute("src", src);
        })
	}).catch(function (err) {
	   		 console.error(err);
		});
	cropDone=1;
}

function select(){
    img.hidden=true;
    cropDiv.hidden=false;
    if(!times){
    	times++;
	    cropper = new Cropper(cropImage, {
	    movable: false,
	    zoomable: false,
	    rotatable: false,
	    scalable: false
		});
	}
}

function cropped(){
    croppedData=cropper.getData();
    var imageData=cropper.getImageData();
    console.log(croppedData);
	cropDiv.hidden=true;
	img.hidden=false;
	cropDone=1;
	// crop(croppedData.x,croppedData.y,croppedData.width,croppedData.height);
	edit();
}
function cancel(){
	cropDiv.hidden=true;
	img.hidden=false;
}

function edit(){
	if(cropDone){
		Jimp.read(input.src)
	.then(function (lenna) {
    lenna.quality(100)
         .grayscale()
         .rotate(90*rotate)
         .crop(croppedData.x,croppedData.y,croppedData.width,croppedData.height)
         .brightness(brightness.value/1)
         .contrast(contrast.value/1)
         .getBase64(Jimp.MIME_JPEG, function (err, src) {
                    img.setAttribute("src", src);
         });
	}).catch(function (err) {
	    console.error(err);
	});
	}
	else{
		Jimp.read(input.src)
	.then(function (lenna) {
    lenna.quality(100)
         .grayscale()
         .rotate(90*rotate)
         .brightness(brightness.value/1)
         .contrast(contrast.value/1)
         .getBase64(Jimp.MIME_JPEG, function (err, src) {
                    img.setAttribute("src", src);
         });
	}).catch(function (err) {
	    console.error(err);
	});

	}
}
var loadFile = function(event) {
	label.innerHTML=(file.value).split("\\")[2];
	document.getElementById('edit').hidden=false;
	submit.hidden=false;
	input.src = URL.createObjectURL(event.target.files[0]);
	img.src=input.src;
	cropImage.src=input.src;
	times=0;
	rotate=0;
	cropDone=0;
	edit();
};

function loadImage(){
	input.src = document.getElementById('camera--output').src;
	document.getElementById('camera').hidden=true;
	document.getElementById('edit').hidden=false;
	submit.hidden=false;
	img.src=input.src;
	cropImage.src=input.src;
	times=0;
	rotate=0;
	cropDone=0;
	edit();
}


function getAadhar(result){
	var n,l,dob,flag=0;
	for (l = 0; l < result.lines.length; l++) {
		for (var i = 0; i < result.lines[l].words.length; i++) {
			if(result.lines[l].words[i].text.toLowerCase()==="government"){
				n=l;
			}
			if(result.lines[l].words[i].text.length===10){
				if(result.lines[l].words[i].symbols[2].text=== result.lines[l].words[i].symbols[5].text && !isNaN(parseInt(result.lines[l].words[i].text.substring(0,2)))){
					dob=result.lines[l].words[i].text.substring(6,10)+"-"+result.lines[l].words[i].text.substring(3,5)+"-"+result.lines[l].words[i].text.substring(0,2);
					flag=1;
					break;
				}
			}
		}
		if (flag) {
			break;
		}
	}
	if(!dob){

	}
	//name
	if(result.lines[n+1]&&n){
		if (n+1==l-1) {
			var name=result.lines[n+1].text.replace(/[^A-Za-z ]/g,"");
		}
		else if(n+2==l-1) {
			var name=result.lines[n+2].text.replace(/[^A-Za-z ]/g,"");			
		}
	}
	//gender
	var i,j,gender;
	if(!gender){
		if(result.lines[l+2].words){
		    for(i=0;i<result.lines[l+2].symbols.length;i++){
	    		if(result.lines[l+2].symbols[i].text==="M"){
	    			gender=result.lines[l+2].symbols[i].text;
	    			break;
	    		}
	    		else if(result.lines[l+2].symbols[i].text==="F"){
	    			gender=result.lines[l+2].symbols[i].text;
	    			break;
	    		}
		    }
		}		
	}

	//AadharNo,PhoneNo
	var aadharNo="",phoneNo="",flag=0,p=1;

	for (var j = l+2; j < result.lines.length; j++) {
    	if(result.lines[j].text.length>=12){
    		for (var i = 0; i <result.lines[j].symbols.length-11 ; i++) {
					console.log(result.lines[j].symbols[i].text);
				for(var a=0;a<12;a++){
					if(!isNaN(parseInt(result.lines[j].symbols[i+a].text))){
						aadharNo=aadharNo+result.lines[j].symbols[i+a].text;
						console.log(aadharNo);
						if(a==9&&p){
							phoneNo=aadharNo;
							p=0;
							console.log(phoneNo);
						}
						if(a==11){
							if(phoneNo==aadharNo.substring(0,10)){
								phoneNo="";
							}
							flag=1;
						}
					}
					else{
						aadharNo="";
						i=i+a;
						break;
					}
				}
				if (flag) {
					break;    
				}
			}
			if (flag) {
				break;
			}
		}
	}
	console.log(dob+"--"+name+"---"+ aadharNo+ "--" +gender+"--"+phoneNo);
	// alert("Name:"+name+"\nAadharNo: "+aadharNo+"\nDOB: "+dob+"\nGender: "+gender+"\nPhone: "+phoneNo);
	document.getElementById('aadharNo').value=aadharNo;
	document.getElementById('name').value=name;
	document.getElementById('gender').value=gender;
	document.getElementById('dob').value=dob;
}

function getPan(result){
	//dob,name,father
		var c=1,l,dob,name,father,flag=0,income="";
    for (l = 0; l < result.lines.length; l++) {
		for (var i = 0; i < result.lines[l].words.length; i++) {
			if(result.lines[l].words[i].text.length===10){
				if(result.lines[l].words[i].symbols[2].text=== result.lines[l].words[i].symbols[5].text && !isNaN(parseInt(result.lines[l].words[i].text.substring(0,2)))){
					dob=result.lines[l].words[i].text.substring(6,10)+"-"+result.lines[l].words[i].text.substring(3,5)+"-"+result.lines[l].words[i].text.substring(0,2);
					flag=1;
					break;
				}
			}
		}
		if (flag) {
			break;
		}
	}
	if(!dob){
		l = prompt("Enter DOB line No. : ", 3);
		l=parseInt(l);
	}
	//name ,father
	if(result.lines[l-1]){
		father=result.lines[l-1].text.replace(/[^A-Z ]/g,"");
	}
	if(result.lines[l-2]){
		name=result.lines[l-2].text.replace(/[^A-Z ]/g,"");
	}

	//panNo
	var panNo,p=l+2;
	if (result.lines[l+1].symbols[0].text==="P") {
		p=l+2;
	}
	else{
		p=l+1;
	}
	if(result.lines[p]) {
	    for(var i=0;i<result.lines[p].words.length;i++){
	    	if(result.lines[p].words[i].text.length==10){
	    		panNo=result.lines[p].words[i].text;
	    	}
	    }
	}
	console.log(name+"----"+father+"---"+dob+"---"+"---"+panNo);
	// alert("Name:"+name+"\nFather: "+father+"\nPanNo: "+panNo+"\nDOB: "+dob);
	document.getElementById('panNo').value=panNo;
	document.getElementById('father').value=father;
	document.getElementById('pan_name').value=name;
	document.getElementById('pan_dob').value=dob;
}

function getText(data){
	// alert(data.text);
	document.getElementById('textarea').value=data.text+"";
}

function recognizeFile(){
             const corePath = window.navigator.userAgent.indexOf("Edge") > -1
			    ? 'node_modules/tesseract.js-core/tesseract-core.asm.js'
			    : 'node_modules/tesseract.js-core/tesseract-core.wasm.js';
			  const { TesseractWorker } = Tesseract;
			  const worker = new TesseractWorker({
			    corePath,
			  });
				worker.recognize(img,'eng')
					.progress(function(packet){
						console.info(packet)
					})
					.then(function(data){
						document.getElementById('input').hidden=true;
						console.log(data)
						if(aadhar.checked){
							document.getElementById('aadhar_form').hidden=false;
							getAadhar(data);							
						}else if(pan.checked){
							document.getElementById('pan_form').hidden=false;
							getPan(data);
						}
						else if(text.checked){
							document.getElementById('text_form').hidden=false;
							getText(data);
						}
					})
}