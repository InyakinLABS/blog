![image](https://github.com/user-attachments/assets/3d012c57-2d4e-458e-b550-2ca1d8f31b1b)

#Что было сделано:
1.При перезагрузке страницы пагинация не слетает, хранится в url (реализовано с помощью location из react-router-dom
2.При перезагрузке страницы убран редирект на главную (реализовано фиксом редюсера проверяющего токен - добавлен флаг на логин, который проверяется app перед отрисовкой)
3.Добавлена валидация на пробелы при создании и редактирования статьи
4.Добавлена возможность удаления последнего тега (реализовано очищением формы + теги из пробелов не добавляются в запрос)
5.Поправлены стили на кнопках добавления и удаления тега на формах создания и редактирования.
