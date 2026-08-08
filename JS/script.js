// ローディングから画面遷移
const loadingArea = document.querySelector('#loading');
const loadingText = document.querySelector('#loading p');
window.addEventListener('load',() =>{
  // ローディング中（グレースクリーン）
  loadingArea.animate(
    {
      opacity:[1,0],
      visibility:'hidden',
    },
    {
      duration: 2000,
      delay: 1200,
      easing:'ease',
      fill:'forwards',
    }
  );
  
  // ローディング中テキスト
  loadingText.animate(
    [
      {
        opacity: 1,
        offset: .8 //80%
      },
      {
        opacity: 0,
        offset:1 //100%
      },
    ],
    {
      duration:2000,
      delay:1200,
      easing: 'ease',
      fill:'forwards',
    }
  );
})

// ライトモードボタン
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon') : null;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) themeIcon.textContent = '☀️';
  } else {
    if (themeIcon) themeIcon.textContent = '🌙';
  }

  // スイッチクリック時の処理
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');

      const isLight = document.body.classList.contains('light-mode');
      
      // アイコン切り替え
      if (themeIcon) {
        themeIcon.textContent = isLight ? '☀️' : '🌙';
      }
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }
});

//===========================================
// メインページ
//===========================================
// スクロールで要素を表示
// 監視対象が範囲内に現れたら実行する動作
const animate = (entries, obs) =>{
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.animate(
        {
          opacity:[0, 1],
          filter:['blur(.4rem)', 'blur(0'],
          translate:['0 4rem', 0],
        },
        {
          duration: 2000,
          easing: 'ease',
          fill: 'forwards',
        }
      );
      obs.unobserve(entry.target);
    } 
  });
};
// 監視設定
const fadeObserver = new IntersectionObserver(animate);
const fadeElements = document.querySelectorAll('.fadein');
fadeElements.forEach((fadeElement) =>{
  fadeObserver.observe(fadeElement);
});

// 画像ギャラリー
const mainImage = document.querySelector('.hero-img');
const conceptImages = document.querySelectorAll('.concept-img');
for(let i=0; i<conceptImages.length; i++){
  conceptImages[i].addEventListener('mouseover',(event)=>{
    mainImage.src = event.target.src;
    mainImage.animate({opacity:[0, 1]}, 500);
  });
}
conceptImages.forEach((conceptImages)=>{
  conceptImages.addEventListener('mouseover', (event)=>{
    mainImage.src=event.target.src;
    mainImage.animate({opacity:[0, 1]}, 500);
  });
});

// タイピング風アニメーション
document.addEventListener('DOMContentLoaded', () => {
  const typingElements = document.querySelectorAll('.typing');

  if (typingElements.length > 0) {
    
    // 1文字ずつ出力する関数
    const startTyping = (el) => {
      const fullText = el.innerHTML.trim();
      el.innerHTML = '';
      let index = 0;
      const speed = 150; // 1文字あたりの速度(ミリ秒)

      function typeWriter() {
        if (!fullText) return;
        // <br> タグがある場合の判定
        if (fullText.slice(index, index + 4).toLowerCase() === '<br>') {
          el.innerHTML += '<br>';
          index += 4;
        } else {
          el.innerHTML += fullText.charAt(index);
          index++;
        }
        if (index < fullText.length) {
          setTimeout(typeWriter, speed);
        }
      }
      typeWriter();
    };
    // 画面内に入ったら発動させる設定
    const typingObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startTyping(entry.target);
          observer.unobserve(entry.target); // 1度動いたら監視解除
        }
      });
    }, { threshold: 0.3 });
    
    typingElements.forEach((el) => {
      typingObserver.observe(el);
    });
  }
});
// =====================================================================
// 調色サポート 計算
// =====================================================================
document.addEventListener('DOMContentLoaded', () =>{
  const colorInput = document.getElementById('input');
  const calcBtn = document.getElementById('btn')
  const previewBox = document.getElementById('preview');
  // 割合表示用エレメント
  const ratioElements={
    white:document.getElementById('ratio-white'),
    black:document.getElementById('ratio-black'),
    blue:document.getElementById('ratio-blue'),
    red:document.getElementById('ratio-red'),
    yellow:document.getElementById('ratio-yellow'),
    green:document.getElementById('ratio-green'),
  };
  const berElements={
    white:document.getElementById('ber-white'),
    black:document.getElementById('ber-black'),
    blue:document.getElementById('ber-blue'),
    red:document.getElementById('ber-red'),
    yellow:document.getElementById('ber-yellow'),
    green:document.getElementById('ber-green'),
  };
  if(calcBtn && colorInput){
    calcBtn.addEventListener('click', () => {
      const selectColor = colorInput.value;
      if (previewBox) {
        previewBox.style.backgroundColor = selectColor;
        previewBox.style.color = '#ffffff';
        previewBox.textContent = `選択色: ${selectColor.toUpperCase()}`;
      }
      //RGB（0〜255）を取得
      const r = parseInt(selectColor.slice(1,3),16);
      const g = parseInt(selectColor.slice(3,5),16);
      const b = parseInt(selectColor.slice(5,7),16);
      //各色の基本割合を計算(調べた)
      const ave = (r+g+b)/3;
      let white = 0;
      let black = 0;
      if(ave > 128){
        white = Math.round((ave-128) / 1.27);
      }else{
        black = Math.round((128-ave) / 1.27);
      };
      let blue = Math.round(b / 2.55);
      let red = Math.round(r / 2.55);
      let green = Math.round(g / 2.55);
      //※塗料の混色特性を考慮し、混ぜて作れない原色「イエロー」をRGBの重複成分から抽出、
      //実物の調色（ガンプラ等）に合わせた比率に補正。
      let yellow = Math.min(red,green);
      red = Math.max(0, red - Math.round(yellow * 0.5));
      green = Math.max(0, green - Math.round(yellow * 0.5));

      let total = white + black + blue + red + yellow + green;
      if(total === 0){
        total = 1;
      };
      if(r===g && g===b){
        const bright = Math.round((r/255) * 100);
        recipes = {
          white:bright,
          black:100-bright,
          blue:0,
          red:0,
          yellow:0,
          green:0,
        };
      }else if(r===g || g===b || r===b){
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const range = max - min;
        const total = max || 1;
        const colorRatio = Math.round((range/total) * 100);
        const whiteRatio = Math.round((min/255) * 100);
        // const blackRatio = Math.max(0, 100-colorRatio - whiteRatio);
        const blackRatio = 100-colorRatio - whiteRatio;
        if(r===g && r>b){
          recipes = {
            white:whiteRatio,
            black:blackRatio,
            blue:0,
            red:0,
            yellow:colorRatio,
            green:0,
          };
        }else if(g===b && g>r){
          const half = Math.floor(colorRatio/2);
          recipes = {
            white:whiteRatio,
            black:blackRatio,
            blue:half,
            red:0,
            yellow:0,
            green:half,
          };
        }else if(r===b && r>g){
          const half = Math.floor(colorRatio/2);
          recipes = {
            white:whiteRatio,
            black:blackRatio,
            blue:half,
            red:half,
            yellow:0,
            green:0,
          };
        }else{
          recipes = {
            white:whiteRatio,
            black:100-whiteRatio,
            blue:0,
            red:0,
            yellow:0,
            green:0,
          };
        };
      }else{
        recipes={
         white:Math.round((white / total)*100),
         black:Math.round((black / total)*100),
         blue:Math.round((blue / total)*100),
         red:Math.round((red / total)*100),
         yellow:Math.round((yellow / total)*100),
         green:Math.round((green / total)*100),
        };
      };
      let currentTotal = recipes.white + recipes.black + recipes.blue + recipes.red + recipes.yellow + recipes.green;
      if (currentTotal !== 100) {
        // 最も大きい値を持つ色の名前（キー）を保持する変数
        let maxColor = 'white';
        // ループで一番大きい色を探す
        for (let color in recipes) {
          if (recipes[color] > recipes[maxColor]) {
            maxColor = color;
          };
        };
        // 最も大きな値に「100 - 合計」の差分を足す（引き算になっても自動調整される）
        recipes[maxColor] += (100 - currentTotal);
      };

      Object.keys(recipes).forEach((color) => {
        const val = recipes[color];
        if(ratioElements[color])ratioElements[color].textContent = val;
        if(berElements[color])berElements[color].value = val;
      });
    });
  };
});

// ====================================
// レビューページ
// ====================================
const reviewCards = document.querySelectorAll('.review-card');
const closeBtns = document.querySelectorAll('.closeBtn');
const modals = document.querySelectorAll('.modal-overlay');

reviewCards.forEach((card)=>{
  card.addEventListener('click',function(){
    const targetId = card.dataset.target;
    const targetModal = document.getElementById(targetId);
    if(targetModal){
      targetModal.classList.add('active');
    };
  });
});

closeBtns.forEach(function(btn){
  btn.addEventListener('click', function(){
    modals.forEach(function(modal){
      modal.classList.remove('active');
    });
  });
});

modals.forEach((modal)=>{
  modal.addEventListener('click',(e)=>{
    if(e.target === modal){
      modal.classList.remove('active');
    };
  });
});

