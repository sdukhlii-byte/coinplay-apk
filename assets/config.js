/* ===== НАСТРОЙКИ САЙТА — правьте только здесь ===== */
window.CFG = {
  APK_URL: "https://promotioncoinplay.com/L?tag=d_5250688m_67365c_stslnd13&site=5250688&ad=67365",  // партнёрская ссылка, сразу отдаёт APK
  WEB_URL: "https://coinplay.com",         // основной сайт / трекер-ссылка
  TG_URL:  "https://t.me/thecoinplay",       // Telegram
  X_URL:   "https://x.com/thecoinplay",
  IG_URL:  "https://www.instagram.com/coinplayofficial/",
  CONTACT_EMAIL: "support@example.com",    // контактный email
  PASS_PARAMS: false,                      // пробрасывать clickid, sub1 и др. во все кнопки
  TRACK_URL: "",                           // опц. пиксель клика: https://track.example.com/c?cid={clickid}&e={event}
  BONUS_TEXT: "", BONUS_LINK_TEXT: "Claim it in the app →", // верхняя плашка с бонусом, пустое = скрыта. Только реальный бонус!
  VERSION: "", SIZE: "", UPDATED: "",      // данные APK, пустое = скрыто
  FACTS: [
    // По официальному тексту CoinPlay. Бонус (по обзорам: 100% до 5,000 USDT, min 20 USDT) добавляйте только после проверки:
    // {label:"Welcome bonus", value:"…"},
    {label:"Min. deposit", value:"1 USDT / 10 TRX"},
    {label:"Licence", value:"Curaçao"},
    {label:"Cryptocurrencies", value:"40+"},
    {label:"Deposits & withdrawals", value:"In minutes"},
    {label:"Support", value:"24/7 live chat"},
    {label:"Security", value:"2FA available"}
  ]
};
