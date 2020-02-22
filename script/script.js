'use strict';

document.addEventListener('DOMContentLoaded', () => { //обращаемся к всему документу, навешивает событие, которое сработает при определенном действии/времени,
  //потом указать ф - цию, в данном случае на весь документ 
  //писать все внутри данной конструкции, область работы - весь документ
  //"function (){}" - заменяем на "() => {}"
  const search = document.querySelector('.search');   //найти елемент DOM и его дочерние, обращение по тегу/id, найдет первый с таким именем
  // console.log('search : ', search );   //нажать на имя елемента + комбинацию ctrl+sft+L - напечатает console.log(); и запишет внутрь 
  // тут по сss задаетсяб тоесть через '.' или решетку '#'
  const cartBtn = document.getElementById('cart'); // другой способ - найти елемент по id 
  const wishlistBtn = document.getElementById('wishlist');
  const goodsWrapper = document.querySelector('.goods-wrapper');
  // методы getElement/querySelector работаю с существующими елементами
  const cart = document.querySelector('.cart');
  const category = document.querySelector('.category'); //создать category для последующей сортировки
  const cardCounter = cartBtn.querySelector('.counter');
  const wishlistCounter = wishlistBtn.querySelector('.counter');
  const cartWrapper = document.querySelector('.cart-wrapper');   //если работа с елементом страницы, есть смысл добавить Elem к названию: cartWrapperElem

  //делаем "избранное", любимые, выбранные
  //при клике на card-add-wishlist будет добавлять выбранную единицу в массив
  // используя делигирование, в массив передадим 'id'
  const wishList = [];


  const goodsBasket = {};



  //=======================    СПИНЕР     =========================

  const loading = (nameFunction) => {        // вставляет верстку в документ(сам спинер, оформление в css)
    const spinner = `<div id="spinner"><div class="spinner-loading">
    <div><div><div></div>
    </div><div><div></div></div><div><div></div>
    </div><div><div></div></div></div></div></div>`;

    if (nameFunction === 'renderCard') {
      goodsWrapper.innerHTML = spinner;
    }
    if (nameFunction === 'renderBasket') {
      cartWrapper.innerHTML = spinner;
    }
  };

  //=======================    СПИНЕР  =========================
  
  

  
  // ===================================СЕТЕВЫЕ ЗАПРОСЫ ====================================

  //обратится к базе в папке проекта, работает в JSON формате, имеет свои методы
  //делаем запрос с помощью ф-ции fetch() к базе, с помощью метода then() ожидаем ответ и когда приходит ответ запускается ф-ция  response
  // cоllback функции 
  //  fetch('db/db.json')
  //      .then((response) => {
  //          return  response.json()      
  //  })     
  //  .then((goods) =>{   // будет принимать обработанный promise из JSon
  //      console.log(goods);
  //  });


  const getGoods = (handler, filter) => {
    loading(handler.name);  // вызов ф-ции спинера
    fetch('./db/db.json')       //делает запрос на сервек к файлу JSON
      .then(response => response.json()) //данные возвращаются в виде аргумента response(в виде promise, содержащий items) и отправляет в ф-цию handler
      .then(filter)  //создать фильтрацию товаров по категории
      .then(handler);
  };

  // ===================================СЕТЕВЫЕ ЗАПРОСЫ ====================================




  //===================  СОЗДАНИЕ КАРТ НА СТРАНИЦЕ ==================
  
  // метод создания новых HTML блоков
  let money = 5555; //используя интерполяцию можно вставить в код, синтаксис ${money}, где 'money' - имя переменной, внутрь тега <div>
  const createCardGoods = (id, title, price, img) => {
    const card = document.createElement('div');  // методы createElement - создает новый елемент
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3'; // присвоить <div> классы, в данном случае бутстрап
    card.innerHTML = `<div class="card">
                                <div class="card-img-wrapper">
                                  <img class="card-img-top" src="./${img}" alt="">
                                  <button class="card-add-wishlist ${wishList.includes(id) ? 'active' : ''}"
                                    data-goods-id="${id}">
                                  </button>                            
                                </div>

                                  <div class="card-body justify-content-between">
                                    <a href="#" class="card-title">${title}</a>
                                    <div class="card-price">${price}</div>  
                                  <div>
                                    <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину
                                    </button>
                                </div>
                               </div>
                          </div>`;
    return card; //обязательно вконце, что бы вывести данные, возврат на страницу введенных данных/свойств/методов
    //передали в 'button' новый класс и передать в него 'id', через '${id}'
    //   '${}' - такая запись - интерполяция

            
  };

  //===================  СОЗДАНИЕ КАРТ НА СТРАНИЦЕ =========================================



  //===================================== ОТОБРАЖЕНИЕ ТОВАРОВ В КОРЗИНЕ =============================================
  
  const createCardGoodsBasket = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = `<div class="goods-img-wrapper">
                        <img class="goods-img" src="./${img}" alt="">
                     </div>
                    <div class="goods-description">
                        <h2 class="goods-title">${title}</h2>
                        <p class="goods-price">${price} ₽</p>
                    </div>
                    <div class="goods-price-count">
                      <div class="goods-trigger">
                        <button class="goods-add-wishlist ${wishList.includes(id) ? 'active' : ''}"
                        data-goods-id="${id}"></button>
                        <button class="goods-delete" data-goods-id="${id}"></button>
                      </div>
                      <div class="goods-count">${goodsBasket[id]}</div> 
                    </div>`;
    return card;
  };
  //${goodsBasket[id]} для добавления нескольких одинаковых товаров

  //===================================== ОТОБРАЖЕНИЕ ТОВАРОВ В КОРЗИНЕ =============================================





  //======================== рЕНДЕРИНГ/ПОЛУЧЕНИЕ (отображение) КАРТ ИЗ БАЗЫ ======================

  // collback ф-ции
  // ф-ция getGoods будет принимать ф-цию handler
  //  вызов getGoods, внутренюю передается renderCard
  // дальше идет перебор массива(глянуть методы, (forEach) Пример: [1, 2, 3, 4].forEach(item => console.log(item))
  // деструктуризация JS
  // добавит карточки всех товаров
  const renderCard = (goods) => {
    goodsWrapper.textContent = '';            // очистить от предыдущих запросов

    if (goods.length) {   //проверка: если goods.lenght есть(есть товар), то тогда переберет товары и выведет их
      goods.forEach(({ id, title, price, imgMin }) => {  // достаем заранее созданные обьекты 
        // console.log(title); выведет(переберет) title всех добавленных товаров 
        goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin)); // передаедаем данные, полученные из ф-ции выше и с помощью метода append добавим на страницу
      });

    } else {   //а если товара нет, то выведет крест/текст/картинку по выбору
      goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по вашему запросу';
    }
  };

  //======================== /рЕНДЕРИНГ/ПОЛУЧЕНИЕ (отображение) КАРТ ИЗ БАЗЫ ======================


  
 //======================== РЕНДЕРИНГ В КОРЗИНЕ =================================== 
  

  const renderBasket = (goods) => {
    cartWrapper.textContent = '';
    if (goods.length) {
      goods.forEach(({ id, title, price, imgMin }) => {
        cartWrapper.appendChild(createCardGoodsBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = '<div id="cart-empty"> Ваша корзина пока пуста </div> ';
    }
  };
 
 //======================== РЕНДЕРИНГ В КОРЗИНЕ =================================== 
  
  
  
  
 // =============================== ПОДСЧЕТ =============================================
  
    //======== расчет стоимости выбранных товаров ==============================
    const calcTotalPrice = (goods) => { //функция подсчета товаров
      let sum = 0;
      for (const item of goods) {   // перебор всех товаров, каждый раз новый товар
        sum += item.price * goodsBasket[item.id];     //сумирует и сразу сохраняет '+=' Присваивание со сложением 
      }
      cart.querySelector('.cart-total>span').textContent = sum.toFixed(2); //sum.fixed(2) - ограничить ответ 2 знаками после запятой
    };
  
    
    const checkCount = () => {  // проверяет количество елементов в избранном и корзине, потом вызов в ф-ции
      wishlistCounter.textContent = wishList.length; //перебор массива id
      cardCounter.textContent = Object.keys(goodsBasket).length;    //"перебор" через глобальный обьект, вернет массив "ключей"
    };
  
  //======== расчет стоимости выбранных товаров ===================================

 //==================================== ПОДСЧЕТ ============================================= 
  

  //создать новый раздел в разделе 'goodsWrapper' методом 'appendChild', в данном случае - добавить еще одну карточку товара
  goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, 'img/temp/Archer.jpg'));
  goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 3000, 'img/temp/Flamingo.jpg'));
  goodsWrapper.appendChild(createCardGoods(3, 'Носки', 333, 'img/temp/Socks.jpg'));
      
  //   cartBtn.addEventListener('click', () => {});   бзаузерное событие, реагирует на клик по корзине('cartBtn')
  //   событий по 1 клику может быть множество одновременно     cartBtn(имя фц-ции ).addEventListener(добавить событие)('условия для события, например - click' , 'еще одно условие', openCart(добавить ф-цию)) 
  // для удаления у\используется .removeEventListener   




//========================== ФИЛЬТРЫ =========================

  const showCardBasket = goods => { //фильтр товароф в корзине(что бы добавлял только выбранные) и подсчет
    const basketGoods = goods.filter(item => goodsBasket.hasOwnProperty(item.id));//проверка есть ли товар в обьекте 
    calcTotalPrice(basketGoods);
    return basketGoods;
  };

  const randomSort = (goods) => goods.sort(() => Math.random() - 0.5);  // использовать метод .sort и задать параметры сортировки(в примере random)
  // ф-ции с 1 аргументом можно писать в 1 рядок, без '{}'

//========================== ФИЛЬТРЫ =========================


   
  
  //=============================== СОХРАНЕНИЕ В ХРАНИЛИЩЕ(cookie/localStorage) ====================================  
  // фрагмент взят с learnjs  
  //Самый короткий способ получить доступ к куки – это использовать регулярные выражения.  
  // возвращает куки с указанным name,
  // или undefined, если ничего не найдено
  const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };
  //Здесь new RegExp генерируется динамически, чтобы находить ; name=<value>.
  //Обратите внимание, значение куки кодируется, поэтому getCookie использует встроенную функцию decodeURIComponent для декодирования.    
  
  //  const cookieQuery = (get) => {
  //    if (get) { // если идет запрос 'get', то нужно их получить, распарсить и передать в обьект
  //     goodsBasket = JSON.parse(getCookie('goodsBasket'));      
  //    } else {
  //      document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`; // отправить данные в cookie,// max-age=86400e3 - время хранения данных в милисекундах
  //   }
  //   console.log(goodsBasket);
  //    checkCount();
  //   
  // };

  const cookieQuery = (get) => {
    if (get) { // если идет запрос 'get', то нужно их получить, распарсить и передать в обьект
      if (getCookie('goodsBasket')) {                      //проверка cookie - если есть, то отправит, если нет то и ошибки не будет
        Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
        // goodsBasket = JSON.parse(getCookie('goodsBasket')); //проверка cookie - если есть, то отправит, если нет то и ошибки не будет - заменено на  Object.assign();
      }
      checkCount();
    } else {
      document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`; // отправить данные в cookie, max-age=86400e3 - время хранения данных в милисекундах
    }
  };
   

  const storageQuery = (get) => {  // ф-ция хранения введенных данных. принимает wishlist и отправляет на хранение в localStorage
    if (get) {  //если нужно получить данные, то получим
      if (localStorage.getItem('wishList')) {
        wishList.push(...JSON.parse(localStorage.getItem('wishList'))) //spread операторы глянуть. .splice(0, 0, 0) первое значение 0 - добавление в начало, infinity - в конец
        //const wishlistStorage = JSON.parse(localStorage.getItem('wishList'));
        // wishlistStorage.forEach(id => wishList.push(id)); //получение данных, распарсить(разобрать строку JSON с //возможностью преобразования) 
      }
    } else {
      localStorage.setItem('wishList', JSON.stringify(wishList));      //1 значение - рандомное имя(для понимания), 2 - преобразование в строку JSON, далее распарсить с помощью метода '.parse()'(отдача данных) 
    }
    checkCount();
  };

  //=============================== СОХРАНЕНИЕ В ХРАНИЛИЩЕ(cookie/localStorage) ====================================  
  
  
  

  
  

  // ========================= ОТКРЫТИЕ КОРЗИНЫ И ЗАКРЫТИЕ  =====================

  // если место клика елемент с классом cart(область снаружи карточки) или(||) на значек закрытия или ESC, то корзина закроется 
  const closeCart = (event) => {       // event - само событие
    const target = event.target;  // обратится к цели события
    if (target === cart ||
      target.classList.contains('cart-close') ||
      event.keyCode === 27) {
      cart.style.display = ''; // блокирует показ окна(если в кавычках написать flex/block... - покажет)
      document.removeEventListener('keyup', closeCart);//перестать выполнять событие после закрытия окна(завершение цикла)
    }
  };

  //================================= всплывающее окно корзины
  //+запрещаем переход по ссылкам(ДЗ)
  const openCart = (event) => {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeCart); // добавляем событие, которое сработает при открытии модального окна
    getGoods(renderBasket, showCardBasket); //отображение выбранных в корзину товаров
  };

// ========================= ОТКРЫТИЕ КОРЗИНЫ И ЗАКРЫТИЕ   =======================
  

  
//================================ СОРТИРОВКА ПО КАТЕГОРИЯМ ==================================

  //  const choiceCategory = (event) => {//
  //    event.preventDefault();
  //    const target = event.target;
  //
  //    if (target.classList.contains('category-item')) {
  //      const cat = target.dataset.category;
  //     getGoods(renderCard, (goods) => {
  //        const newGoods = goods.filter(item => {
  //          return item.category.includes(cat); //когда запрашиваемая категория есть у товара - он её вернет в новый массив newGoods, иначе нет(булевый принцип)
  //       });
  //       return newGoods
  //      })      
  //    }
  //  };
  
  // еще 1 вариант записи
  const choiceCategory = (event) => {
    event.preventDefault();    //блокировка автособытия(события по умолчанию)
    const target = event.target;
    if (target.classList.contains('category-item')) {
      const category = target.dataset.category;
      getGoods(renderCard, (goods) => goods.filter(item => item.category.includes(category)));
    }
  };

  // goods.filter() - метод, в который будет помещена ф-ция

//================================ СОРТИРОВКА ПО КАТЕГОРИЯМ ==================================  

  

  //======================== Подсчет с помощью reduce ===================
  //  const calcTotalPrice = (goods) => { //функция подсчета товаров   
  //    let sum = goods.reduce((accum, item) => {
  //     return accum + item.price * goodsBasket[item.id]
  //   }, 0)
  //   cart.querySelector('.cart-total>span').textContent = sum.fixed(2); //sum.fixed(2) - ограничить ответ 2 знаками //после запятой
  //  };
  //======================== Подсчет с помощью reduce ====================
  
  




  //============================= ПОИСК ТОВАРОВ =============================  
  // Принцип поиска
  // мы передаем строку, которую получили в input и на этой основе создали регулярное выражение
  // у регулярного выражения есть метод .test, который возвращает true/false если в строке item.title рег. выражение
  //
  //
  //Пример регулярного выражения let reg = /xiaomi/i

  const searchGoods = (event) => {
    event.preventDefault();       //блокировка обновления страницы(событие по умолчанию)
    const input = event.target.elements.searchGoods;
    const inputValue = input.value.trim(); //если строка поиска пустая или есть лишние пробелы - данных не будет
    if (inputValue !== '') {
      const searchString = new RegExp(inputValue, 'i')  //поиск по сайту через регулярное выражение, 'i' - не учитывать регистр
      getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
    } else {
      search.classList.add('error');   // если поле ввода пустое - будет ощибка(в примере анимация строки)
      setTimeout(() => {     // повторить ошибку через 2 сек, если нажмет еще раз(зациклим)
        search.classList.remove('error')
      }, 2000)
    }
    input.value = ''; // очистка поискового поля
  };
  
  //=============================== ПОИСК ТОВАРОВ ============================= 

  


  const toggleWhishlist = (id, elem) => {  //проверка есть ли в коллекции(массиве) WishList такой id, если есть то удалит из массива, а если нету - добавит
    // console.log(wishList.indexOf(id)); //indexOf возвращает id, а елемент может быть нулевым. в консоль выведет значение -1, у первого елемента индекс = 0 работать не сможем, потому нужно прибавить к этому значению +1 и если елемент будет, то вернет 'true', тоесть добавит/удалит - заменено на 'includes'
    if (wishList.includes(id)) {
      wishList.splice(wishList.indexOf(id), 1); // 1 значение - индекс елемента, который убираем, 2 значение - количество удаляемых елементов
      elem.classList.remove('active')
    } else {
      wishList.push(id); // если елемента там нет, то добавить
      elem.classList.add('active')
    }
    // console.log(wishList); //проверка работы в консоли
    checkCount();  // всегда вызов, для обновления информации
    storageQuery(); // для хранения не персональных данных(не безопасно)
  };
  




  //=================================== Ф-ЦИЯ ПЕРЕНОС ТОВАРОВ В КОРЗИНЕ ===========================================
  
  const addBasket = (id) => { //принимает id. Ключем будет id, а значение - количество товаров
    if (goodsBasket[id]) {  //если свойства нет, то undefined
      goodsBasket[id] += 1 //при выборе прибавит товар, если он существует(сколько раз нажмешь - столько шт. добавит)
    } else {
      goodsBasket[id] = 1
    }
    checkCount();
    cookieQuery();
    
  };
  
  //=================================== Ф-ЦИЯ ПЕРЕНОС ТОВАРОВ В КОРЗИНЕ ========================================== 
  
  


  //=============================== Ф-ЦИИ ДОБАВЛЕНИЯ В ИЗБРАННОЕ/КОРЗИНУ(СОБЫТИЕ) =============================  
  
  const handlerGoods = (event) => {
    const target = event.target;    //определит, что клик произошел по card-add-wishlist(по месту клика)
    if (target.classList.contains('card-add-wishlist')) {  // и если клик произошел по сердечку на товаре, то...
      // console.log(target.dataset.goodsId); вывод id в консоль
      toggleWhishlist(target.dataset.goodsId, target);  //добавляет и убирает в/из массива
    }

    if (target.classList.contains('card-add-cart')) {  //добавление в корзину
      addBasket(target.dataset.goodsId);
    }

  };
  
  
  
  const handlerBasket = (event) => {
    const target = event.target; 
    if (target.classList.contains('goods-add-wishlist')) { //определит место клика, события, и если клик произошел по сердечку в корзине, то...
       toggleWhishlist(target.dataset.goodsId, target);  //добавляет и убирает в/из массива
    }
    
    if (target.classList.contains('goods-delete')) { //определит место клика, события, и если клик произошел по сердечку в корзине, то...
       removeGoods(target.dataset.goodsId);  // убирает из выбранного в корзине
    }
    
  };
  //=============================== Ф-ЦИИ ДОБАВЛЕНИЯ В ИЗБРАННОЕ/КОРЗИНУ(СОБЫТИЕ) =============================   

  



  //================================================ работа с избранным и корзиной

  const removeGoods = (id) => { //ф-ция удаления товара из корзины
    delete goodsBasket[id]; // удалит выбранный елемент
    checkCount(); //потом провести пересчет выбранных товаров
    cookieQuery(); // обновить данные в cookie
    getGoods(renderBasket, showCardBasket); //обновит отображение содержимого
  };
  

 //================================================ работа с избранным и корзиной  
  
  
  
  
  
 //=============================== Ф-ЦИЯ Рендеринг избранного  =============================    

  const showWishlist = () => { // принимает каждый товар и возвращает выбранные елементы в wishList
    getGoods(renderCard, goods => goods.filter(item => wishList.includes(item.id)))
  };
  
//=============================== Ф-ЦИЯ Рендеринг избранного =============================     
  
 


//===================== ИНИЦИАЛИЗАЦИЯ/СТАРТ ===========================
  {
    getGoods(renderCard, randomSort)
    storageQuery('get');
    cookieQuery('get');

    // обработчики событий
    document.addEventListener('keyup', closeCart);
    cartBtn.addEventListener('click', openCart);      // обработчик события, при нажатии откроет корзину
    cart.addEventListener('click', closeCart);        // второй обработчик, при нажатии закроет корзину
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);            // submit - поиск
    goodsWrapper.addEventListener('click', handlerGoods);     //обработчик для избранных товаров
    cartWrapper.addEventListener('click', handlerBasket); //работа с избранным в корзине
    wishlistBtn.addEventListener('click', showWishlist);
  }
//===================== ИНИЦИАЛИЗАЦИЯ/СТАРТ  ===========================

});


//Ратоба с терминалом, подключение Node.js npm: (npm install http-server -g) в терминале, потом http-server(в папке проекта)
//через BABELJS.IO - перевести в старый формат
//для FETCH использовать полифил, подключается по типу BOOTSTRAP, либо использовать XML HttpRequest