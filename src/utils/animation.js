
export const Disappear = (id,data,style) => {
  let timer = null;
  var alpha = 100;
  var speed = -10;
  var show = 0;
  clearInterval(timer);
  let e_div = document.getElementById(id);
  if(e_div !== null) {
    timer = setInterval(function () {
      if(alpha === 0){
        if(style.hasOwnProperty('color')){
          e_div.style.color = style['color'];
        }
        if(style.hasOwnProperty('backgroundColor')){
          e_div.style.backgroundColor =style['backgroundColor'];
        }
        if(typeof(data)!=='undefined'){
          e_div.innerHTML =data;
        }
        speed = 10;
        show =1;
      }
      if(alpha === 100 && show === 1){
        clearInterval(timer);
        return;
      }
      alpha += speed;
      e_div.style.opacity = alpha / 100
    }, 50);
  }
}
