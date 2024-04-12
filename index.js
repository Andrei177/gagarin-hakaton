require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");
const fetchBiografy = require("./fetchBiografy");

const bot = new TelegramApi(process.env.TOKEN, {polling: true});

const numberQuestionAndChatId = {};

const questions = [
    "Как Вас зовут?",
    "Укажите дату рождения в любом формате",
    "Имена близких родственников. Также напишите, пожалуйста, кто Вам кем приходиться",
    "Где сейчас живёте?",
    "Какой у Вас номер мобильного телефона?",
    "Какие у Вас любимые книги?",
    "Какие у Вас любимые фильмы?",
    "Какие Вы имеете достижения, может быть в спорте, музыке и т.д.?",
    "Есть ли у Вас хобби. Если да, то какие?",
    "Какие Вы можете выделить важные даты в вашей жизни? Можете написать дату и описание события (например - свадьба и т.д.ы)",
    "Какую музыку Вы предпочитаете слушать? Вы также можете выделить несколько любимых песен",
    "Какие Вы можете выделить важные события в Вашей жизни, которые Вам запомнились, или как-то повлияли на Вас?",
    "Есть ли у Вас мечта или какие-то цели?",
    "Расскажите какие-нибудь интересные факты о себе, о каком-то событии связанном с Вами",
    "Каким родом деятельности Вы занимаетесь, а также какие профессиональные навыки у Вас есть?",
    "Есть ли у Вас планы на будущее. Если есть - напишите, если не секрет, пожалуйста "
]

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const answer = msg.text;

    if(answer === "/start"){
        numberQuestionAndChatId[chatId] = {
            currentQuestion: 0,
            questionsAndAnswers: []
        };
        await bot.sendMessage(chatId, "Добро пожаловать в бота заполнения страницы памяти!")
        await bot.sendMessage(chatId, questions[numberQuestionAndChatId[chatId].currentQuestion]);
        numberQuestionAndChatId[chatId].currentQuestion += 1;
        return;
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
    else{
        let biografy = await fetchBiografy(numberQuestionAndChatId[chatId].questionsAndAnswers);

        bot.sendMessage(chatId, "Ваша страница памяти:\n" + biografy);
    }
})