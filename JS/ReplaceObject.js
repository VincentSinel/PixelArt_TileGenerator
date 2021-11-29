
function ReplaceObject(){
	ReplaceInputFile();
	ReplaceComboBox();
}

function ReplaceInputFile(){
	let inputs = document.getElementsByTagName('fileinput');
	let filesinputs = [];
	
	for (let index = 0; index < inputs.length; ++index) {
		let obj = inputs[index];
			
		let di = document.createElement('div');
		obj.classList.forEach(ele =>  di.classList.add(ele));
		di.classList.add("file-input");
		
		let input = document.createElement('input');
		input.type = "file";
		input.id = obj.id;
		input.setAttribute('accept', obj.getAttribute('accept'));
		input.setAttribute('style', obj.style);
		di.appendChild(input);
		
		let label = document.createElement('label');
		label.setAttribute('for', input.id);
		
		let p = document.createElement('p');
		p.className = "file-name";
		p.innerHTML = obj.getAttribute('text');
		label.appendChild(p);
		while (obj.childElementCount > 0){
			label.appendChild(obj.children[0]);
		}
		
		obj.parentElement.replaceChild(di, obj);
		di.appendChild(label);
		filesinputs.push(input);
	}
	
	for (let index = 0; index < filesinputs.length; ++index) {
		let obj = filesinputs[index];
		
		if (obj.type != "file")
			continue;
	
		obj.addEventListener('change', (e) => {
			// Get the selected file
			let [file] = e.target.files;
			// Get the file name and size
			let { name: fileName, size } = file;
			// Convert size in bytes to kilo bytes
			let fileSize = (size / 1000).toFixed(2);
			NomDeFichier = fileName;
			// Set the text content
			let fileNameAndSize = `${fileName} - ${fileSize}KB`;
			e.target.parentElement.getElementsByTagName("p")[0].innerHTML = fileNameAndSize;
			readSingleFile(e, file);
		});
	}
}

function readSingleFile(e, file) {
    if (!file) {
        return;
    }
    var reader = new FileReader();
	//Check e.target.ID depend on inputfile;
    reader.onloadend = function(e) {
		
    };
	//reader.readAsText(file);
    //reader.readAsDataURL(file);
}

function ReplaceComboBox(){
	var x, i, j, l, ll, selElmnt, a, b, c;
	/*look for any elements with the class "custom-select":*/
	x = document.getElementsByClassName("custom-select");
	l = x.length;
	for (i = 0; i < l; i++) {
	  selElmnt = x[i].getElementsByTagName("select")[0];
	  ll = selElmnt.length;
	  /*for each element, create a new DIV that will act as the selected item:*/
	  a = document.createElement("DIV");
	  a.setAttribute("class", "select-selected");
	  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
	  x[i].appendChild(a);
	  /*for each element, create a new DIV that will contain the option list:*/
	  b = document.createElement("DIV");
	  b.setAttribute("class", "select-items select-hide");
	  for (j = 0; j < ll; j++) {
		/*for each option in the original select element,
		create a new DIV that will act as an option item:*/
		c = document.createElement("DIV");
		c.innerHTML = selElmnt.options[j].innerHTML;
		c.addEventListener("click", function(e) {
			/*when an item is clicked, update the original select box,
			and the selected item:*/
			var y, i, k, s, h, sl, yl;
			s = this.parentNode.parentNode.getElementsByTagName("select")[0];
			sl = s.length;
			h = this.parentNode.previousSibling;
			for (i = 0; i < sl; i++) {
			  if (s.options[i].innerHTML == this.innerHTML) {
				s.selectedIndex = i;
				s.onchange();
				h.innerHTML = this.innerHTML;
				y = this.parentNode.getElementsByClassName("same-as-selected");
				yl = y.length;
				for (k = 0; k < yl; k++) {
				  y[k].removeAttribute("class");
				}
				this.setAttribute("class", "same-as-selected");
				break;
			  }
			}
			h.click();
		});
		b.appendChild(c);
	  }
	  x[i].appendChild(b);
	  a.addEventListener("click", function(e) {
		  /*when the select box is clicked, close any other select boxes,
		  and open/close the current select box:*/
		  e.stopPropagation();
		  closeAllSelect(this);
		  this.nextSibling.classList.toggle("select-hide");
		  this.classList.toggle("select-arrow-active");
		});
	}
	
	
	/*if the user clicks anywhere outside the select box,
	then close all select boxes:*/
	document.addEventListener("click", closeAllSelect);
}

function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}


ReplaceObject();