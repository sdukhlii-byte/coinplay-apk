/* ===== НАСТРОЙКИ САЙТА — правьте только здесь ===== */
window.CFG = {
  APK_URL: "https://promotioncoinplay.com/L?tag=d_5250688m_67365c_stslnd13&site=5250688&ad=67365",  // партнёрская ссылка, сразу отдаёт APK
  WEB_URL: "https://promotioncoinplay.com/L?tag=d_6159212m_57511c_apk_land1&site=6159212&ad=57511",         // основной сайт / трекер-ссылка
  TG_URL:  "https://t.me/thecoinplay",       // Telegram
  X_URL:   "https://x.com/thecoinplay",
  IG_URL:  "https://www.instagram.com/coinplayofficial/",
  PASS_PARAMS: false,                      // пробрасывать clickid, sub1 и др. во все кнопки
  TRACK_URL: "/t?e={event}&cid={clickid}", // отстук кликов на наш сервер (он шлёт S2S-постбэк в Propeller). Пусто = выключено
  SUBID_PARAM: "",                         // имя sub-параметра партнёрки для передачи click-id (напр. "sub1"), пусто = не передавать
  BONUS_TEXT: "", BONUS_LINK_TEXT: "Claim it in the app →", // верхняя плашка с бонусом, пустое = скрыта. Только реальный бонус!
  VERSION: "", SIZE: "", UPDATED: "",      // данные APK, пустое = скрыто
  FACTS: [
    // По официальному тексту CoinPlay. Бонус (по обзорам: 100% до 5,000 USDT, min 20 USDT) добавляйте только после проверки:
    // {label:"Welcome bonus", value:"…"},
    {label:"Welcome bonus", value:"Up to 5000 USDT + 80 FS"},
    {label:"Min. deposit", value:"1 USDT / 10 TRX"},
    {label:"Licence", value:"Curaçao"},
    {label:"Cryptocurrencies", value:"40+"},
    {label:"Deposits & withdrawals", value:"In minutes"},
    {label:"Support", value:"24/7 live chat"},
    {label:"Security", value:"2FA available"}
  ]
};
