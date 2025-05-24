import React, { useState, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("о сервере");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", discord: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Звуки
  const tabSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_4c8a7f669d.mp3 ');
  const clickSound = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_2e8b5d16ac.mp3 ');

  const playTabSound = () => {
    tabSound.currentTime = 0;
    tabSound.play();
  };

  const playClickSound = () => {
    clickSound.currentTime = 0;
    clickSound.play();
  };

  const handleTabClick = (tab) => {
    playTabSound();
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
    }, 400);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    playClickSound();
    e.preventDefault();
    setStatus("Отправка...");

    try {
      const response = await fetch("https://discord.com/api/webhooks/1375921257081737307/p5CKB_1NhFGsGVdJHTMeMDcMSk8L49YFRkz9-DHVT6Qu3-USgMhup9MSQ88Z9Rb4JCw1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          embeds: [
            {
              title: "Новое сообщение с сайта",
              color: darkMode ? 15208739 : 0x00ff00,
              fields: [
                { name: "Имя", value: formData.name || "Не указано", inline: false },
                { name: "Discord ID", value: formData.discord || "Не указано", inline: false },
                { name: "Сообщение", value: formData.message || "Без текста", inline: false }
              ],
              footer: {
                text: "Отправлено через MinePRServer"
              }
            }
          ]
        })
      });

      if (response.ok) {
        setStatus("Сообщение отправлено!");
        setFormData({ name: "", discord: "", message: "" });
      } else {
        setStatus("Ошибка отправки.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Ошибка подключения.");
    }
  };

  const castVote = async () => {
    playClickSound();

    try {
      await fetch("https://discord.com/api/webhooks/1375921257081737307/p5CKB_1NhFGsGVdJHTMeMDcMSk8L49YFRkz9-DHVT6Qu3-USgMhup9MSQ88Z9Rb4JCw1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: `Голос за MinePRServer`
        })
      });

      alert("Вы проголосовали за сервер!");
    } catch (err) {
      alert("Ошибка голосования");
    }
  };

  // Мок онлайна игроков
  useEffect(() => {
    const fetchStatus = () => {
      const players = Math.floor(Math.random() * 20) + 1;
      setOnlinePlayers(players);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Переключатель темы
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Транзакции (мок)
  const transactions = [
    { id: 1, date: "2025-04-01", type: "Проходка на месяц", price: "80 ₽" },
    { id: 2, date: "2025-03-20", type: "VIP навсегда", price: "2000 ₽" },
    { id: 3, date: "2025-03-15", type: "Проходка на неделю", price: "20 ₽" }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 text-white' : 'bg-gradient-to-br from-pink-100 via-pink-200 to-white text-black'} font-minecraft relative`}>
      {/* Анимированный фон */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-20" style={{
        backgroundImage: `url('https://placehold.co/100x100/2d2d2d/ffffff?text=Grass '), url('https://placehold.co/100x100/ffc0cb/ffffff?text=Torch ')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100px 100px',
        animation: 'backgroundMove 20s linear infinite'
      }}></div>

      {/* Прогресс загрузки при переходе между вкладками */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-yellow-400 animate-progress-bar z-50"></div>
      )}

      {/* Header */}
      <header className={`${darkMode ? 'bg-black/70 border-pink-600 shadow-pink-900/30' : 'bg-white/70 border-pink-300 shadow-pink-300/30'} sticky top-0 z-50 backdrop-blur-md border-b shadow-lg`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`${darkMode ? 'text-pink-300' : 'text-pink-700'} text-xl md:text-2xl font-bold tracking-wider`}>MinePRServer</h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {["о сервере", "особенности", "проходки", "контакты"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`capitalize transition-all duration-300 hover:${darkMode ? 'text-pink-300' : 'text-pink-600'} ${
                  activeTab === tab ? (darkMode ? 'text-pink-300' : 'text-pink-600') : (darkMode ? 'text-gray-300' : 'text-pink-800')
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Тема и меню */}
          <div className="flex items-center space-x-4">
            {/* Кнопка смены темы с текстом */}
            <button
              onClick={toggleTheme}
              className={`text-sm px-4 py-2 rounded-full transition-colors duration-300 ${
                darkMode
                  ? 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-300'
                  : 'bg-pink-300/20 hover:bg-pink-300/30 text-pink-700'
              }`}
            >
              {darkMode ? "Светлая тема" : "Тёмная тема"}
            </button>

            <button
              className={`${darkMode ? 'text-pink-300' : 'text-pink-700'} md:hidden focus:outline-none`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className={`${darkMode ? 'bg-black/80' : 'bg-white/80'} p-4 space-y-4 animate-fadeIn`}>
            {["о сервере", "особенности", "проходки", "контакты"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`block w-full text-left capitalize py-2 transition-all duration-300 hover:${darkMode ? 'text-pink-300' : 'text-pink-600'} ${
                  activeTab === tab ? (darkMode ? 'text-pink-300' : 'text-pink-600') : (darkMode ? 'text-gray-300' : 'text-pink-800')
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20 pt-12">
          <h2 className={`${darkMode ? 'text-pink-300' : 'text-pink-600'} text-3xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg`}>
            Присоединяйся к MinePRServer!
          </h2>
          <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} text-lg max-w-2xl mx-auto mb-8`}>
            Самый крутой приватный Minecraft сервер с уникальными возможностями и сообществом.
          </p>
          <button
            onClick={() => handleTabClick("проходки")}
            className="px-6 py-3 rounded-lg text-black font-bold shadow-lg hover:shadow-pink-500/50 transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-pink-400 to-red-500 pulse-button"
          >
            Купить проходку
          </button>
        </section>

        {/* Online Status */}
        <section className="mb-12 text-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-xl border ${darkMode ? 'border-green-500 bg-green-500/20' : 'border-green-700 bg-green-100'} shadow-lg`}>
            <span className={`w-4 h-4 rounded-full mr-3 inline-block ${darkMode ? 'bg-green-500 animate-pulse' : 'bg-green-700 animate-pulse'}`}></span>
            <span className="text-xl font-bold">{onlinePlayers ?? "--"} игроков онлайн</span>
          </div>
        </section>

        {/* Tab Content */}
        <div className="transition-opacity duration-500 ease-in-out">
          {!loading && activeTab === "о сервере" && (
            <section id="about" className="mb-20 animate-fadeIn">
              <h3 className={`${darkMode ? 'text-pink-300' : 'text-pink-600'} text-2xl md:text-3xl font-bold mb-6 text-center`}>О сервере</h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className={`rounded-xl overflow-hidden shadow-xl transform transition-transform hover:scale-105 border ${darkMode ? 'border-pink-700' : 'border-pink-300'} relative`}>
                  <img src="https://placehold.co/600x400/1e1b2f/ffffff?text=Minecraft+World " alt="Server Image" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6 text-base md:text-lg`}>
                    MinePRServer — это живое и развивающееся сообщество Minecraft игроков. Мы создали уникальную среду для творчества, исследований и дружбы.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Собственный мир с уникальным генератором",
                      "Регулярные мероприятия и турниры",
                      "Высокий уровень безопасности и защиты от читеров",
                      "Возможность строить собственные поселения",
                      "Дружелюбное сообщество игроков"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mt-1 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {!loading && activeTab === "особенности" && (
            <section id="features" className="mb-20 animate-fadeIn">
              <h3 className={`${darkMode ? 'text-pink-300' : 'text-pink-600'} text-2xl md:text-3xl font-bold mb-6 text-center`}>Особенности сервера</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Уникальный мир",
                    description: "Кастомные локации, секретные зоны и разнообразные экосистемы."
                  },
                  {
                    title: "Кастомные плагины",
                    description: "Плагины для экономики, защиты и удобства пользователей."
                  },
                  {
                    title: "Активные события",
                    description: "Еженедельные турниры, конкурсы и игровые миниивенты."
                  }
                ].map((feature, index) => (
                  <div key={index} className={`${darkMode ? 'bg-black/40 border-pink-700 hover:border-pink-500 hover:bg-black/60' : 'bg-white/20 border-pink-300 hover:border-pink-500 hover:bg-white/30'} p-6 rounded-xl transition-all duration-300 border group transform hover:scale-105`}>
                    <h4 className="text-lg md:text-xl font-bold mb-1">{feature.title}</h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-xs md:text-sm`}>{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!loading && activeTab === "проходки" && (
            <section id="pricing" className="mb-20 animate-fadeIn">
              <h3 className={`${darkMode ? 'text-pink-300' : 'text-pink-600'} text-2xl md:text-3xl font-bold mb-6 text-center`}>Проходки</h3>
              <div className="grid md:grid-cols-4 gap-6 mb-10">
                {[
                  {
                    name: "Неделя",
                    price: "20",
                    features: ["Базовый доступ", "1 аккаунт"],
                    color: "from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                  },
                  {
                    name: "Месяц",
                    price: "80",
                    features: ["Полный доступ", "3 аккаунта", "Стандартная поддержка"],
                    color: "from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  },
                  {
                    name: "Год",
                    price: "300",
                    features: ["VIP статус", "До 5 аккаунтов", "Приоритетная поддержка"],
                    color: "from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  },
                  {
                    name: "Навсегда",
                    price: "2000",
                    features: ["VIP навсегда", "Неограниченное количество аккаунтов", "Эксклюзивный набор предметов"],
                    color: "from-yellow-500 to-amber-500 hover:from-amber-600 hover:to-yellow-600"
                  }
                ].map((plan, index) => (
                  <div key={index} className={`${darkMode ? 'bg-black/40 border-pink-700 hover:border-amber-500' : 'bg-white/20 border-pink-300 hover:border-pink-500'} p-4 rounded-xl hover:bg-black/60 transition-all duration-300 border group transform hover:-translate-y-2 pulse-button`}>
                    <h4 className="text-lg font-bold mb-2">{plan.name}</h4>
                    <p className="text-xl font-bold mb-3">{plan.price} ₽</p>
                    <ul className="space-y-1 mb-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-xs md:text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 mr-1 ${darkMode ? 'text-green-500' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a href="https://t.me/vselennayaminecrafta " target="_blank" rel="noopener noreferrer" className={`block text-center py-2 rounded-lg font-semibold bg-gradient-to-r ${plan.color} hover:shadow-lg hover:shadow-pink-500/40 transition-all duration-300`}>
                      Купить
                    </a>
                  </div>
                ))}
              </div>

              {/* История покупок */}
              <div>
                <h4 className={`${darkMode ? 'text-pink-300' : 'text-pink-600'} text-2xl font-bold mb-6`}>История покупок</h4>
                <div className={`${darkMode ? 'bg-black/40 border-pink-700' : 'bg-white/30 border-pink-300'} p-4 rounded-xl border shadow-lg`}>
                  <table className="w-full text-sm">
                    <thead className={darkMode ? 'text-pink-300' : 'text-pink-600'}>
                      <tr>
                        <th className="text-left pb-2">Дата</th>
                        <th className="text-left pb-2">Тип</th>
                        <th className="text-right pb-2">Цена</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-black/20 transition-colors">
                          <td className="py-2">{tx.date}</td>
                          <td className="py-2">{tx.type}</td>
                          <td className="py-2 text-right">{tx.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {!loading && activeTab === "контакты" && (
            <section id="contact" className="mb-20 animate-fadeIn">
              <h3 className={`${darkMode ? 'text-pink-300' : 'text-pink-600'} text-2xl md:text-3xl font-bold mb-6 text-center`}>Свяжитесь с нами</h3>
              <div className="max-w-xl mx-auto mb-8">
                <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-black/40 border-pink-700' : 'bg-white/30 border-pink-300'} p-6 rounded-xl border shadow-lg`}>
                  <div className="mb-4">
                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Имя</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white/80 border-gray-300 text-black'} w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500`}
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="discord" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discord ID</label>
                    <input
                      type="text"
                      id="discord"
                      name="discord"
                      value={formData.discord}
                      onChange={handleChange}
                      required
                      className={`${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white/80 border-gray-300 text-black'} w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500`}
                      placeholder="1234567890#1234"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Сообщение</label>
                    <textarea
                      rows="4"
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className={`${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white/80 border-gray-300 text-black'} w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500`}
                      placeholder="Ваше сообщение"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 pulse-button">
                    Отправить
                  </button>
                  {status && <p className="mt-3 text-center text-sm text-green-400">{status}</p>}
                </form>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Боковой чат */}
      <aside className={`fixed right-4 bottom-4 w-80 h-96 ${darkMode ? 'bg-black/90 border-pink-700' : 'bg-white/90 border-pink-300'} rounded-lg shadow-2xl border transition-transform duration-300 ${chatVisible ? 'translate-y-0' : 'translate-y-96'} z-40 overflow-hidden`}>
        <div className={`flex justify-between items-center p-3 ${darkMode ? 'bg-black/70 border-pink-700' : 'bg-white/70 border-pink-300'} border-b`}>
          <h4 className="text-sm font-bold">Чат сервера</h4>
          <button onClick={() => setChatVisible(false)} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
            &times;
          </button>
        </div>
        <iframe
          src="https://discord.com/widget?id=1375921125279793232&theme= ${darkMode ? 'dark' : 'light'}"
          width="100%"
          height="100%"
          allowtransparency="true"
          frameBorder="0"
          title="Discord Chat"
          className="bg-black"
        ></iframe>
      </aside>

      {/* Кнопка чата */}
      <button
        onClick={() => setChatVisible(!chatVisible)}
        className={`fixed right-4 bottom-4 z-30 px-4 py-3 rounded-full ${darkMode ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'} font-bold shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-all duration-300 pulse-button whitespace-nowrap`}
      >
        Чат сервера
      </button>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-black/60 border-pink-800' : 'bg-white/60 border-pink-300'} py-6 border-t`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className={`${darkMode ? 'text-pink-300' : 'text-pink-600'} mb-4 md:mb-0`}>
              <h2 className="text-xl font-bold">MinePRServer</h2>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-700'} mt-1 text-xs`}>
                © 2025 Все права защищены
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={castVote} className={`${darkMode ? 'text-pink-300 hover:text-pink-200' : 'text-pink-600 hover:text-pink-800'} text-sm underline transition-colors`}>
                Проголосуй за нас
              </button>
              <a href="https://t.me/vselennayaminecrafta " target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-pink-300 hover:text-pink-200' : 'text-pink-600 hover:text-pink-800'} text-sm transition-colors`}>
                Подписаться в Телеграм
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap ');
        .font-minecraft {
          font-family: 'Press Start 2P', monospace;
          font-size: 12px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes backgroundMove {
          from { background-position: 0 0; }
          to { background-position: 200px 200px; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        .pulse-button {
          animation: pulse 2s infinite;
        }

        .animate-progress-bar {
          animation: progress 0.5s ease-in-out forwards;
        }

        body.dark {
          background-image: url('https://placehold.co/100x100/2d2d2d/ffffff?text=Grass '), url('https://placehold.co/100x100/ffc0cb/ffffff?text=Torch ');
          background-repeat: repeat;
          background-size: 100px 100px;
          animation: backgroundMove 20s linear infinite;
        }

        body.light {
          background-image: url('https://placehold.co/100x100/ffe6f0/8b008b?text=Grass '), url('https://placehold.co/100x100/ffd1dc/8b008b?text=Torch ');
          background-repeat: repeat;
          background-size: 100px 100px;
          animation: backgroundMove 20s linear infinite;
        }

        @media (prefers-color-scheme: light) {
          body:not(.dark) {
            background-image: url('https://placehold.co/100x100/ffe6f0/8b008b?text=Grass '), url('https://placehold.co/100x100/ffd1dc/8b008b?text=Torch ');
          }
        }
      `}</style>
    </div>
  );
}