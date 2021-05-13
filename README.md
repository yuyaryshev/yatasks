# yatasks

Система для проведения опросов

# Как запустить?

Самый простой способ запуска - установить

`npm i -g my_wins`

И запустить mywins.bat

### Запуск вручную

Запуск компилятора api сервера

`npm run watch`

Запуск компилятора front-end сервера

`npm run web_server_dev`

Запуск api сервера

`node --trace-warnings ts_out/src/start.js run --devuser=test`

Страница в браузере

http://localhost:8080/?id=1

Адрес в браузере с просмотром ответа от api сервера

http://localhost:4300/api/survey?id=1

## Точки входа

src\start.ts - сервер

src\client\index.tsx - клиент

# Структура папок

-   src - папка всех исходников. Все ее - только сгенерированные и конфигурационные файлы

    -   api - содержит описание запросов и ответов, а также их верификаторов. Используется и сервером и клиентом
    -   client - вся клиентская часть
        -   components - визуальная часть. React компоненты
        -   models - структуры данных
    -   server
        -   controllers - обработчики HTTP запросов (get, post и тп)
        -   models - модели данных - уровень абстракции от БД
    -   tests - тесты
    -   types - общие типы данных
    -   Папки Y\* - разные библиотеки, которые пока не были вынесены в отдельные репозитарии. Вообще их проще разместить в папке Lib
        -   Yjira - библиотека для взаимодействия с Jira
        -   Yoracle - библиотека для взаимодействия с Oracle
        -   Ystd - большой набор небольших "стандартных" функций

-   ### Value - Future

-   [ ] CSS как растянуть div на остаток пространства на странице

    -   [ ] https://stackoverflow.com/questions/25098042/fill-remaining-vertical-space-with-css-using-displayflex/25098486
    -   [ ] https://stackoverflow.com/questions/34977227/html5-css-full-height-layout
    -   [ ] https://stackoverflow.com/questions/90178/make-a-div-fill-the-height-of-the-remaining-screen-space
    -   [ ] http://blog.stevensanderson.com/2011/10/05/full-height-app-layouts-a-css-trick-to-make-it-easier/

-   [ ] Для Material-UI - набор дополнительных компонент и сложных компонент
        https://mui-treasury.com/
-   [ ] https://material-ui.com/components/selects/

-   [ ] Пригодятся выборки из календаря https://material-ui-pickers.dev

    -   [ ] https://material-ui.com/components/autocomplete/ -Autocomplete! лучший!

-   [ ] Есть готовые библиотеки с формами ввода

    -   [ ] https://react-select.com/ - понравился - крутой Drop-Down в том числе с множественным выбором!

-   [ ] https://github.com/react-hook-form/react-hook-form - полноценные формы

-   [ ] ```````
                                        const valueContext = useValueContainerContext()
                                    <ValueContainer mode="form">....</ValueContainer>
        ```

                    s
                    ````
                `````
            ``````
        ```````
