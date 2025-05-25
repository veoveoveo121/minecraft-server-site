document.addEventListener('DOMContentLoaded', () => {
    // Функция для отображения уведомлений (оптимизирована для одного уведомления)
    let notificationTimeout;
    function showNotification(message) {
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        notification.innerText = message;
        notification.classList.add('show');

        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Копирование никнейма администрации
    const nicknames = document.querySelectorAll('.staff-nickname');
    nicknames.forEach(nicknameElement => {
        nicknameElement.addEventListener('click', () => {
            const nickname = nicknameElement.getAttribute('data-nickname');
            if (nickname) {
                navigator.clipboard.writeText(nickname).then(() => {
                    showNotification(`Никнейм скопирован: ${nickname}`);
                }).catch(err => {
                    console.error('Ошибка копирования:', err);
                    showNotification('Не удалось скопировать никнейм.');
                });
            }
        });
    });

    // Функциональность для правил
    const ruleNumbers = document.querySelectorAll('.rule-number');
    ruleNumbers.forEach(ruleNumber => {
        ruleNumber.addEventListener('click', () => {
            const ruleId = ruleNumber.getAttribute('data-copy');
            if (ruleId) {
                const fullUrl = `${window.location.origin}${window.location.pathname}${ruleId}`;
                navigator.clipboard.writeText(fullUrl).then(() => {
                    showNotification(`Ссылка скопирована: ${fullUrl}`);
                    document.querySelectorAll('.rule.highlighted').forEach(rule => {
                        rule.classList.remove('highlighted');
                    });
                    const targetRule = document.querySelector(ruleId);
                    if (targetRule) {
                        targetRule.classList.add('highlighted');
                        targetRule.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }).catch(err => {
                    console.error('Ошибка копирования ссылки:', err);
                    showNotification('Не удалось скопировать ссылку.');
                });
            }
        });
    });

    // Копирование IP сервера
    const copyableElements = document.querySelectorAll('.copyable');
    copyableElements.forEach(element => {
        element.addEventListener('click', () => {
            const textToCopy = element.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showNotification(`Скопировано: ${textToCopy}`);
                }).catch(err => {
                    console.error('Ошибка копирования IP:', err);
                    showNotification('Не удалось скопировать IP.');
                });
            }
        });
    });

    // Галерея
    const galleryContainer = document.querySelector('.gallery-container');
    const gallery = document.querySelector('.gallery');
    const galleryImages = document.querySelectorAll('.gallery img');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    let currentIndex = 0;

    function updateGallery() {
        if (galleryImages.length > 0 && galleryContainer) {
            const width = galleryContainer.clientWidth;
            gallery.style.width = `${galleryImages.length * width}px`;
            galleryImages.forEach(img => {
                img.style.width = `${width}px`;
            });
            gallery.style.transform = `translateX(-${currentIndex * width}px)`;
        }
    }

    // Функция debounce для оптимизации вызова updateGallery при resize
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentIndex < galleryImages.length - 1) {
                currentIndex++;
                updateGallery();
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateGallery();
            }
        });
    }

    if (galleryContainer) {
        window.addEventListener('resize', debounce(updateGallery, 200));
        window.addEventListener('load', updateGallery);
    }

    // Выделение абзаца при переходе по ссылке (для правил)
    function highlightRuleFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetRule = document.querySelector(hash);
            if (targetRule) {
                targetRule.scrollIntoView({ behavior: 'smooth', block: 'center' });
                document.querySelectorAll('.rule.highlighted').forEach(rule => {
                    rule.classList.remove('highlighted');
                });
                targetRule.classList.add('highlighted');
            }
        }
    }

    highlightRuleFromHash();

    const dropdowns = document.querySelectorAll('.nav-links li.dropdown');

    dropdowns.forEach(dropdown => {
        const toggleLink = dropdown.querySelector('a.toggle-dropdown');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

    // Отображение flash сообщений
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        showNotification(message.innerText);
        message.remove();
    });

    // Слушаем изменение хэша в URL
    window.addEventListener('hashchange', highlightRuleFromHash);
});
