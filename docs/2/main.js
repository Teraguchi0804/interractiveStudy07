
// ターゲットの移動量
param = {
  x:0,
  y:0
};

// マウス
mouse = {
  isDown:false,     // 画面押されてるか
  x:0,              // マウス位置 X
  y:0,              // マウス位置 Y
  start:{x:0, y:0}, // マウスダウン時の座標
  dist:{x:0, y:0}   // マウスダウンしてからの移動距離
};


// 初期設定
init();
function init() {

  if(isMobile.any) {
    document.addEventListener('touchmove', _eMouseMove, {passive:false});
    document.addEventListener('touchstart', _eMouseDown, {passive:false});
    document.addEventListener('touchend', _eMouseUp, {passive:false});
  } else {
    $(window).on('mousemove', _eMouseMove).on('mousedown', _eMouseDown).on('mouseup', _eMouseUp);
  }

  update();

}

// 毎フレーム実行
window.requestAnimationFrame(update);
function update() {

  var tg = $('.js-tg');

  if(mouse.isDown) {
    // マウス押してるときは、マウスダウン時からのマウス移動量をちゃんと計算
    dx = mouse.x - mouse.start.x;
    dy = mouse.y - mouse.start.y;
    mouse.dist.x = dx;
    mouse.dist.y = dy;

    // ##########################################################
    var friction = 0.3; // 摩擦係数 小さいとより引っ張られる感じに
    mouse.dist.x *= friction;
    mouse.dist.y *= friction;
    // ##########################################################

  } else {
    // マウス押してないときの移動量は0
    mouse.dist.x = 0;
    mouse.dist.y = 0;
  }

  // 滑らかに移動させるためイージングつける
  var ease = 0.125; // イージング量 小さいとゆっくり
  param.x += (mouse.dist.x - param.x) * ease;
  param.y += (mouse.dist.y - param.y) * ease;

  // 中心からの距離
  var d = Math.sqrt(param.x * param.x + param.y * param.y);

  // ターゲットの移動量を更新
  // 角度や色変えたりの隠し味つける
  TweenMax.set(tg, {
    rotationZ:radian(param.x * param.y) * 0.1,
    scaleX:1 + Math.abs(param.x) * 0.001,
    scaleY:1 + Math.abs(param.y) * 0.001,
    x:param.x,
    y:param.y,
    backgroundColor:chroma.scale([0xff0000, 0x96782c])(map(d, 0, 1, 0, window.innerWidth * 0.25)).css(),
  });

	var mapVal = map(d, 0, 1, 0, window.innerWidth * 0.22);

  if(mapVal <= 0.95) {
		TweenMax.to($('.mv'), 0.1, {x:"0"});
		TweenMax.set($('.inner'), {
			opacity: mapVal,
			rotationZ:radian(param.x * param.y) * 0.1,
		});
		TweenMax.set($('.inner02'), {
			opacity: 0,
			rotationZ:radian(param.x * param.y) * 0.1,
		});
  } else if(mapVal > 0.95){
		TweenMax.set($('.inner'), {
			opacity: 0,
			rotationZ:radian(param.x * param.y) * 0.1,
		});
		TweenMax.set($('.inner02'), {
			opacity: mapVal,
			rotationZ:radian(param.x * param.y) * 0.0001,
		});
		TweenMax.to($('.mv'), 0.1, {x:"+=20", yoyo:true, repeat:5});
  }


  window.requestAnimationFrame(update);
}


// ----------------------------------------
// イベント マウス動いた
// ----------------------------------------
function _eMouseMove(e) {

  if(isMobile.any) {
    event.preventDefault();
    touches = event.touches;
    if(touches != null && touches.length > 0) {
      mouse.x = touches[0].pageX;
      mouse.y = touches[0].pageY;
    }
  } else {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

}


// ----------------------------------------
// イベント マウス押した
// ----------------------------------------
function _eMouseDown(e) {

  if(!mouse.isDown) {
    mouse.isDown = true;
    if(isMobile.any) {
      event.preventDefault();
      touches = event.touches;
      if(touches != null && touches.length > 0) {
        mouse.start.x = mouse.x = touches[0].pageX;
        mouse.start.y = mouse.y = touches[0].pageY;
      }
    } else {
      mouse.start.x = e.clientX;
      mouse.start.y = e.clientY;
    }
  }

}


// ----------------------------------------
// イベント マウス離した
// ----------------------------------------
function _eMouseUp(e) {

  mouse.isDown = false;

}




// ########################################
// ユーティリティ系 ↓
// ########################################

// ----------------------------------------
// 度からラジアンに変換
// @val : 度
// ----------------------------------------
function radian(val) {
  return val * Math.PI / 180;
}

// ----------------------------------------
// ラジアンから度に変換
// @val : ラジアン
// ----------------------------------------
function degree(val) {
  return val * 180 / Math.PI;
}

// ----------------------------------------
// minからmaxまでランダム
// ----------------------------------------
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// ----------------------------------------
// 範囲変換
// @val     : 変換したい値
// @toMin   : 変換後の最小値
// @toMax   : 変換後の最大値
// @fromMin : 変換前の最小値
// @fromMax : 変換前の最大値
// ----------------------------------------
function map(val, toMin, toMax, fromMin, fromMax) {
  if(val <= fromMin) {
    return toMin;
  }
  if(val >= fromMax) {
    return toMax;
  }
  p = (toMax - toMin) / (fromMax - fromMin);
  return ((val - fromMin) * p) + toMin;
}
