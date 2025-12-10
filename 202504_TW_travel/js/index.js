function setEqualHeightByRow(className) {
    const elements = document.querySelectorAll(className);
    let rows = {};
  
    // 重置高度，避免前一次計算影響
    elements.forEach((el) => {
      el.style.height = "auto";
    });
  
    // 分組：依照 offsetTop 分類每一行
    elements.forEach((el) => {
      const top = el.offsetTop;
      if (!rows[top]) {
        rows[top] = [];
      }
      rows[top].push(el);
    });
  
    // 每一行找最高高度，然後設定同高
    Object.values(rows).forEach((row) => {
      let maxHeight = 0;
      row.forEach((el) => {
        maxHeight = Math.max(maxHeight, el.offsetHeight);
      });
      row.forEach((el) => {
        el.style.height = maxHeight + "px";
      });
    });
  }
  
  
  // 當 DOM 加載完後執行
  window.addEventListener("load", () => setEqualHeightByRow(".step li"));
  
  // 當視窗大小改變時也要重新計算高度
  window.addEventListener("resize", () => setEqualHeightByRow(".step li"));


// 燈箱

const lightBox = document.querySelector(".lightbox");
const bodyElement = document.querySelector("body");
const htmlElement = document.querySelector("html");

// 用來控制是否可以放大縮小
let scaleWeb = false;

function openLightBox(src) {
  if (src) {
    lightBox.src = src;
  }
  $("body").css("overflow", "hidden");
  $("html").css("overflow", "hidden");

  lightBox.className = "lightbox show";
}

function closeLightBox() {
  bodyElement.removeAttribute("style");
  htmlElement.removeAttribute("style");

  if (scaleWeb) {
    // 取消讓整個網頁縮放
    document.querySelector('meta[name="viewport"]').setAttribute("content", "width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no");
  }
  lightBox.className = "lightbox";
  lightBox.src = "";
  window.focus();
}