# YSurvey

Система для проведения опросов

# Как запустить?

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

# Сценарий моего идеального рабочего дня

Представь. Вот начинается твой очередной день, как бы ты хотел в идеале его организовать?

-   ## У меня есть набор стандартных ежедневных активностей вида. По каждой такой активности есть период ее выполнения, в течении дня.
    -   Если я ее выполняю в этот период один раз, то напоминать о ней повторно не нужно.
    -   Если не выполняю
-   Примеры ежедневных активностей
    -   Например, проверка входящих с 10 до 11, с 11 до 13, с 13 до 15, с 15 до 18 - почта там и другие входящие
    -   Спланировать задачи завтра
    -   Списать Timesheet
-   В идеале я уже вчера решил, что мне сегодня делать

# Recurring Task

RecurringTask

id, name, description

recurring: Recurring; // данные о повторных запусках

greenInterval: number; // в миллисекундах, сколько задача зеленая, после активации

yellowInterval: number; // в миллисекундах, сколько задача желтая, после истечения зеленого интервала

Добавить recurring taskСтартует задачу в заданный интервалЗадача "зреет":За пределами интервала - она всегда сераяВ начале интервала - она зеленаяЗатем желтаяК концу - краснаяЕсли задача не выполнена внутри интервала, то она в следующий интервал зайдет Красной. Между интервалами она серая. Скорость покраснения задачи - параметр.

# Recurring

Данные о повторных запусках

##### RecurringIntervalItem

type: "interval",

interval: number;

##### RecurringDayItem

type:"day",

dayTime:number[];

##### RecurringWeekItem

type:"week",

weekDays: number[];

dayTime:number[];

##### RecurringMonthItem

type:"month",

monthDay: number;

dayTime:number[];

##### RecurringYearItem

type:"year",

month: number;

monthDay: number;

dayTime:number[];

##### Recurring

start: Date;

lastOccurance: Date;

end?:Date;

items:RecurringItem[];

onHolyday: "skip" | "move";

# MVP-1 TODO

- [ ] Владение объектами, полученными с севера

  - [ ] Нужно размещать объекты по id, в противном случае не ясно как поддержать консистентность между несколькими копиями одного объекта полученного  с сервера несколько раз

  - [ ] Все же нужно владение объектами

    - [ ] Owner при get запросе Чтобы управлять временем жизни объектов JavaScript client. Через useEffect реализовать загрузку значений и их очистку. 

    - [ ] Важно убрать хуки на верхний уровень  компонентов - требование реакта

      React useEffect cleanup: How and when to use it - DEV
      https://dev.to/otamnitram/react-useeffect-cleanup-how-and-when-to-use-it-2hbm

      Далее просто на каждом объекте сохраняем массив его владельцев. Если массив пуст - удаляем обьект. Владельца ставим по useEffect

-   [ ] Измененное поле Editable нужно дополнительно сохранять в newValue:{} внутри самого объекта.

    -   [ ] Оттуда оно удаляется после успешной отправки на сервер
    -   [ ] В список Edited при таком раскладе достаточно хранить Set ссылок на соотв. объекты,
    -   [ ] а уже по полю newValue понимать что отправить на сервер.
    -   [ ] readdEdited - найти и заменить на концепцию

-   [ ] Исправить: Labels Не работает - не создает новые Label - может таки убрать его в Link???

-   [ ] Исправить: Date и Duration + не меняется на - при нажатии Shift

-   [ ] Добавить <u>expand</u> в search api. Если он равен <u>minimal</u>, то возвращается только id и name

-   [ ] Добавить: Удаление задачи с подтверждением

    -   [ ] http://localhost:63342/api/file/src/client/components/main.tsx:165:1

-   [ ] Добавить: автосохранение даты создания, даты закрытия на сервере

    -   [ ] При создании задачи - сохранить createdTs = (new Date())
    -   [ ] При закрытии задачи - сохранить finishedTs = (new Date())

-   [ ] Добавить: UI - дерево задач

-   [ ] Добавить задачи контроля

    -   [ ] controlled_id = id контролируемой задачи
    -   [ ] При отображении такой задачи должна отображаться контролируемая задача, перед которой добавляется "Контроль: "
    -   [ ] isDelegated = true - для таких задач
    -   [ ] Задачи isDelegated = true - нужно уметь группировать по исполнителю
    -   [ ] Должна быть возможность быстро отобразить зависимые задачи
    -   [ ] ? Продумать, как описывать согласования типа согласования политики

-   [ ] Добавить типизацию задач

    -   [ ] Можно создавать и редактировать типы задач
    -   [ ] Задачи каждого типа могут быть запланированы на свои промежутки времени
    -   [ ]
    -   [ ]

-   [ ] Добавить: задание промежутков времени в календаре

    -   [ ] Еженедельное планирование
        -   [ ] Когда обрабатываю входящие, когда-какие входящие и сколько времени
        -   [ ] Когда осуществляю контроль по работе
        -   [ ] Когда осуществляю контроль по домашним задачам
        -   [ ] Когда осуществляю контроль по задачам своего бизнеса
        -   [ ] Когда выполняются личные задачи по работе
        -   [ ] Когда выполняются личные задачи по дому
        -   [ ] Когда выполняются личные задачи по своего бизнеса

-   [ ] Добавить: загрузку и обновление задач из Jira по заданному JQL

-   [ ] Добавить: проверку задач из Jira на соответствие моим критериям - что заданы review и т.п.

-   [ ] Добавить: планирование задач, в том числе загруженных из Jira

-   [ ] Добавить: чтение новостей по задачам

-   [ ] UI D:\b\Mine\GIT_Work\yatasks\docs\yatasks.pptx

    -   [ ] Стартовая страница - следующие задачи на выполнение

    -   [ ] TODO this.openTaskForm - открыть страницу редактирования Task

        http://localhost:63342/api/file/src/client/models/MainModel.ts:33:13

    -   [ ] Список задач - результат поиска - вид: набор горизонтальных карточек, кнопка "Создать", кнопка "Удалить" http://localhost:63342/api/file/src/client/components/TaskList.tsx:52:1

    -   [ ] Задача - Большая, полноценная форма задачи со всеми полями http://localhost:63342/api/file/src/client/components/TaskForm.tsx:52:1

    -   [ ] Планирование задач http://localhost:63342/api/file/src/client/components/Plan.tsx:52:1

-   [ ] Добавить в поиск подсветку auto-suggest - см Autocomplete из material-ui

-   [ ] Добавить Autocomplete - Virtualization

# MVP-2 TODO

-   [ ] **Ystd** function recurringGenerator(recurring: Recurring, currentDate?: Date) => возвращает функцию, которая при вызове выдает следующую дату. Следующая дата выдается начиная с currentDate если она задана
-   [ ] Вопрос-ответ - для исполнения задач-опросников
-   [ ] Бизнес задачи
    -   [ ] Базовое создание и поиск задач
    -   [ ] Календарь, планирование
    -   [ ] Опросники для выполнения текущих задач

# Поля задачи

## TO_BE_DONE

**assignee** - нужно для планирования
​ **reporter**
​ flags
​ isAcceptedByAssignee
​ isInProgress
​ isFinished
​ isWaiting
​ isAcceptedByManager
​ isAcceptedByReporter
​ isSucceded
​ **labels**
​ workDaysDuration - нужно для планирования
​ calendarDaysDuration - нужно для планирования
​ remainingEstimate - нужно для планирования
​ createdDate - нужно для планирования
​ startDate - нужно для планирования
​ dueDate - нужно для планирования
​ expectedStartDate - нужно для планирования
​ expectedEndDate - нужно для планирования
​ epicLink - нужно для копирования из jira
​ jiraKey - нужно для копирования из jira
​ WaitType
​ WaitDate

Comments

## WONT_DO

linked_issues
​ components
​ priority
​ Attachment
​ originalEstimate,

### Value - Future

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

-   [ ] ``````
                                    const valueContext = useValueContainerContext()
                                <ValueContainer mode="form">....</ValueContainer>
    ```

                s
                ````
            `````
        ``````

# Основные направления развития yatasks

-   [ ] Новые функции
    -   [ ] Интервалы времени. Контроль за временем переключения
    -   [ ] Личный Timesheet
    -   [ ] Задачи-опросники
    -   [ ] Граф целей
        -   [ ] Автопланирование задач по нему
-   [ ] Заменить LeaderTask
    -   [ ] Хранение информации
-   [ ] По работе
    -   [ ] Jira
        -   [ ] Контроль за правилами ведения
        -   [ ] Автопланирование своих и чужих задач
        -   [ ] Чтение новостей по задачам
    -   [ ] Почта
        -   [ ] Обработка почты в системе ведения задач
-   [ ] Заменить файлы для хранения задач кодинга
    -   [ ] Деревья задач
    -   [ ] Опросники для ускорения выполнения задач
