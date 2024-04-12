require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");
const fetchBiografy = require("./fetchBiografy");

const bot = new TelegramApi(process.env.TOKEN, {polling: true});

const numberQuestionAndChatId = {};

const questions = [
    "Какое у него было ФИО?",
    "Напишите его дату рождения",
    "Напишите его дату смерти",
    "Сколько лет ему было, когда он ушел от нас?",
    "В какой стране и городе он родился?",
    "Какую профессию он имел?",
    "Что он любил делать в свободное время?",
    "Имел ли он какие-то особые увлечения или хобби?",
    "Был ли он религиозным человеком?",
    "Были ли у него особые жизненные принципы или ценности, которые он хотел бы передать своим потомкам?",
    "Был ли он хорошим семьянином?",
    "Каким он был по характеру: добрым, веселым, строгим, спокойным?",
    "Есть ли какие-то особенные истории или моменты, связанные с ним, которые ты хотел бы увековечить в эпитафии?",
    "Ваше имя? Для указания автора эпитафии"
]

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const answer = msg.text;

    if(answer === "/start"){
        numberQuestionAndChatId[chatId] = {
            currentQuestion: 0,
            questionsAndAnswers: [],
            query: false // показывает начался запрос к нейросети или нет
        };
        await bot.sendMessage(chatId, "Добро пожаловать в бота заполнения страницы памяти!")
        await bot.sendMessage(chatId, questions[numberQuestionAndChatId[chatId].currentQuestion]);
        numberQuestionAndChatId[chatId].currentQuestion += 1;
        return;
    }
    else if(!numberQuestionAndChatId[chatId]){//если вдруг пользователь написал что-то кроме /start до начала опроса
        return bot.sendMessage(chatId, "Введите команду /start для начала заполнения страницы памяти")
    }
    
    console.log(numberQuestionAndChatId);//вывод в терминал ид чатов и их ответы на вопросы
    
    numberQuestionAndChatId[chatId].questionsAndAnswers.push({
        question: questions[numberQuestionAndChatId[chatId].currentQuestion - 1],
        answer
    })

    if(numberQuestionAndChatId[chatId].currentQuestion < questions.length){
        bot.sendMessage(chatId, questions[numberQuestionAndChatId[chatId].currentQuestion]);
        numberQuestionAndChatId[chatId].currentQuestion += 1;
    }
    else if(!numberQuestionAndChatId[chatId].query){ // если запроса к нейросети ещё не было, то сделать запрос
        const {message_id} = await bot.sendMessage(chatId, "Пожалуйста, дождитесь генерации Вашей страницы памяти");
        numberQuestionAndChatId[chatId].query = true; //запрос отправился, больше в этот блок кода не попасть пока не выполнится запрос
        let biografy = await fetchBiografy(numberQuestionAndChatId[chatId].questionsAndAnswers);
        bot.deleteMessage(chatId, message_id);

        await bot.sendMessage(chatId, "Ваша страница памяти:\n" + biografy);
        delete numberQuestionAndChatId[chatId];
    }
})