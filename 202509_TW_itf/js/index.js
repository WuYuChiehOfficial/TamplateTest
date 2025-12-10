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

// 處理 more_info 中 ▸ 符號的自動分行
function formatMoreInfoText() {
  const moreInfoElements = document.querySelectorAll(".more_info");

  moreInfoElements.forEach((element) => {
    // 獲取原始文字內容
    let text = element.textContent || element.innerText;

    // 將 ▸ 符號前面加上換行，但第一個 ▸ 不加換行
    let formattedText = text.replace(/▸/g, function (match, offset) {
      // 如果是第一個 ▸ 符號，不加換行
      if (offset === 0 || text.substring(0, offset).trim() === "") {
        return match;
      }
      // 其他 ▸ 符號前面加換行
      return "<br>" + match;
    });

    // 更新元素內容
    element.innerHTML = formattedText;
  });
}

// 動態調整文字長度以確保單行顯示
function adjustTextForSingleLine() {
  const coupDescs = document.querySelectorAll(".coup-desc");

  coupDescs.forEach((desc) => {
    const textElement = desc.querySelector(".truncate-wrapper");
    const button = desc.querySelector(".desc-moreButton");

    if (!textElement || !button) return;

    // 保存原始文字內容
    if (!textElement.dataset.originalText) {
      textElement.dataset.originalText = textElement.textContent;
    }

    const originalText = textElement.dataset.originalText;
    const containerWidth = desc.offsetWidth;
    const buttonWidth = button.offsetWidth;
    const gap = 8; // CSS 中設定的 gap
    const availableWidth = containerWidth - buttonWidth - gap - 10; // 預留一些空間

    // 重置文字內容
    textElement.textContent = originalText;

    // 如果文字寬度超出可用空間，則逐步縮短
    if (textElement.scrollWidth > availableWidth) {
      let text = originalText;

      // 逐步縮短文字直到適合容器寬度
      while (textElement.scrollWidth > availableWidth && text.length > 0) {
        text = text.slice(0, -1);
        textElement.textContent = text + "...";
      }
    }
  });
}

// 頁面加載完成後執行
window.addEventListener("load", () => {
  setEqualHeightByRow(".step li");
  adjustTextForSingleLine();
  formatMoreInfoText(); // 添加格式化 more_info 文字
});

// 視窗大小改變時重新調整
window.addEventListener("resize", () => {
  setEqualHeightByRow(".step li");
  adjustTextForSingleLine();
  formatMoreInfoText(); // 視窗大小改變時也重新格式化
});

// 移動版 more_info 功能
function initMobileMoreInfo() {
  const coupDescs = document.querySelectorAll(".coup-desc");

  coupDescs.forEach((desc) => {
    const moreButton = desc.querySelector(".desc-moreButton");
    const moreInfo = desc.querySelector(".more_info");

    if (!moreButton || !moreInfo) return;

    // 檢查是否為移動版
    function isMobile() {
      return window.innerWidth <= 980; // 根據 mixin @include m 的斷點
    }

    // 移除現有事件監聽器並重新添加
    function updateEventListeners() {
      if (isMobile()) {
        // 移動版：整個 coup-desc 都可以點擊
        desc.style.cursor = "pointer";
        desc.addEventListener("click", handleMobileClick);
        moreButton.removeEventListener("click", handleMobileClick); // 移除按鈕特定事件
      } else {
        // 桌面版：移除點擊事件，使用 CSS hover
        desc.style.cursor = "pointer";
        desc.removeEventListener("click", handleMobileClick);
        closeMobileMoreInfo(desc); // 關閉可能開啟的移動版彈窗
      }
    }

    // 移動版點擊處理
    function handleMobileClick(e) {
      e.preventDefault();
      e.stopPropagation();
      openMobileMoreInfo(desc);
    }

    // 初始化和視窗大小改變時更新
    updateEventListeners();
    window.addEventListener("resize", updateEventListeners);
  });
}

// 打開移動版 more_info
function openMobileMoreInfo(desc) {
  const moreInfo = desc.querySelector(".more_info");
  if (!moreInfo) return;

  // 創建遮罩
  const overlay = document.createElement("div");
  overlay.className = "mobile-more-info-overlay";

  // 創建關閉按鈕
  const closeBtn = document.createElement("a");
  closeBtn.href = "javascript:;";
  closeBtn.className = "mobile-more-info-close";

  // 將 more_info 移到遮罩中並添加關閉按鈕
  moreInfo.appendChild(closeBtn);
  overlay.appendChild(moreInfo);

  // 添加遮罩到頁面
  document.body.appendChild(overlay);

  // 禁止頁面滾動
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  // 關閉事件
  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeMobileMoreInfo(desc, overlay, moreInfo, closeBtn);
  });

  // 點擊遮罩背景關閉
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeMobileMoreInfo(desc, overlay, moreInfo, closeBtn);
    }
  });

  // ESC 鍵關閉
  document.addEventListener("keydown", (e) => handleEscClose(e, desc, overlay, moreInfo, closeBtn));
}

// 關閉移動版 more_info
function closeMobileMoreInfo(desc, overlay, moreInfo, closeBtn) {
  // 如果沒有傳入參數，嘗試從 DOM 中找到
  if (!overlay) {
    overlay = document.querySelector(".mobile-more-info-overlay");
  }
  if (!moreInfo) {
    moreInfo = overlay ? overlay.querySelector(".more_info") : desc.querySelector(".more_info");
  }
  if (!closeBtn && moreInfo) {
    closeBtn = moreInfo.querySelector(".mobile-more-info-close");
  }

  if (overlay && moreInfo) {
    // 添加關閉動畫類
    overlay.classList.add("closing");
    moreInfo.classList.add("closing");

    // 等待動畫完成後執行清理
    setTimeout(() => {
      // 移除關閉按鈕
      if (closeBtn) {
        closeBtn.remove();
      }

      // 將 more_info 移回原位置
      desc.appendChild(moreInfo);

      // 移除動畫類
      moreInfo.classList.remove("closing");

      // 移除遮罩
      overlay.remove();

      // 恢復頁面滾動
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }, 0); // 動畫時間
  } else {
    // 如果找不到元素，直接清理
    if (overlay) {
      overlay.remove();
    }

    // 恢復頁面滾動
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  // 移除 ESC 監聽器
  document.removeEventListener("keydown", handleEscClose);
}

// ESC 鍵關閉處理
function handleEscClose(e, desc, overlay, moreInfo, closeBtn) {
  if (e.key === "Escape") {
    closeMobileMoreInfo(desc, overlay, moreInfo, closeBtn);
  }
}

// 頁面加載完成後初始化移動版功能
window.addEventListener("load", () => {
  setEqualHeightByRow(".step li");
  adjustTextForSingleLine();
  formatMoreInfoText(); // 添加格式化 more_info 文字
  initMobileMoreInfo();
});

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
    document
      .querySelector('meta[name="viewport"]')
      .setAttribute("content", "width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no");
  }
  lightBox.className = "lightbox";
  lightBox.src = "";
  window.focus();
}
