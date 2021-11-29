
function RefreshDragableCarte(){
    /* draggable element */
  [].slice.call(document.querySelectorAll('.carteNoir')).forEach(function(item) {
          item.addEventListener('dragstart', dragStart);
          item.addEventListener('dragend', dragEnd);
      });
  [].slice.call(document.querySelectorAll('.carteRouge')).forEach(function(item) {
          item.addEventListener('dragstart', dragStart);
          item.addEventListener('dragend', dragEnd);
      });
}


function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
  document.getElementById("Box1").setAttribute('style','pointer-events: all;');
  document.getElementById("Box2").setAttribute('style','pointer-events: all;');
  document.getElementById("Box3").setAttribute('style','pointer-events: all;');
  document.getElementById("Box4").setAttribute('style','pointer-events: all;');
}

function dragEnd(e)
{
  document.getElementById("Box1").style.removeProperty('pointer-events');
  document.getElementById("Box2").style.removeProperty('pointer-events');
  document.getElementById("Box3").style.removeProperty('pointer-events');
  document.getElementById("Box4").style.removeProperty('pointer-events');
  
  
  const id = e.dataTransfer.getData('text/plain');
  const draggable = document.getElementById(id);
  draggable.classList.remove('hide');
}


let o = document.getElementById("Box1");
let e = document.getElementById("Box2");
let n = document.getElementById("Box3");
let s = document.getElementById("Box4");
[o,e,n,s].forEach(box => {
    box.addEventListener('dragenter', dragEnter)
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});


function dragEnter(e) {
  e.preventDefault();
  e.target.parentElement.classList.add('level01dppreview');
}

function dragOver(e) {
  e.preventDefault();
  e.target.parentElement.classList.add('level01dppreview');
}

function dragLeave(e) {
  if (e.target.parentElement.classList)
  {
    e.target.parentElement.classList.remove('level01dppreview');
  }
}

function drop(e) {
  if (e.target.parentElement.classList)
  {
    e.target.parentElement.classList.remove('level01dppreview');
  }
  
  // get the draggable element
  const id = e.dataTransfer.getData('text/plain');
  const draggable = document.getElementById(id);
  
  let sta = convertNameToIndex(draggable.parentElement.parentElement.id);
  let end = convertNameToIndex(e.target.parentElement.id);
  let typ = convertGlyphToIndex(draggable.innerHTML.charAt(draggable.innerHTML.length-1));
  let val = draggable.innerHTML.split(" ")[0];
  val = val.replace("10","T");
  val = val.replace("R", "K");
  val = val.replace("D", "Q");
  val = val.replace("V", "J");
  
  moveCarte(sta, end, typ, val);
}

function convertGlyphToIndex(name)
{
  if (name == "♠")
    return 0;
  else if (name == "♥")
    return 1;
  else if (name == "♣")
    return 2;
  else
    return 3;
}


function convertNameToIndex(name)
{
  if (name == "SudName")
    return 0;
  else if (name == "OuestName")
    return 1;
  else if (name == "NordName")
    return 2;
  else
    return 3;
}