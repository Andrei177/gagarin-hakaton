const { default: axios } = require("axios")

module.exports = async (userInf) => {

    messages = [
        {
            role: "system",
            text: "Ты произносишь похоронную речь. Твоя задача сформировать на основе ответов пользователя эпитафию о родственнике или знакомом пользователя. Раздели данный текст на 3 части: вступление, продолжение и финал. Текст должен быть развернутым и содержательным. Обязательно наличие полей: ФИО, дата рождения, дата смерти, эпитафия и автор эпитафии."
        },
        {
            role: "user",
            text: JSON.stringify(userInf)
        }
    ]
    console.log(JSON.stringify(userInf));

    const data = {
        modelUri: `gpt://${process.env.FOLDER_ID}/yandexgpt/latest`,
        completionOptions: {
          stream: false,
          temperature: 0.6,
          maxTokens: 2000
        },
        messages
      };
  
      const response = await axios.post(
          `https://llm.api.cloud.yandex.net/foundationModels/v1/completion`,
          data,
          {
            headers: {
              'Authorization': `Api-Key ${process.env.YANDEX_GPT_KEY}`,
              'x-folder-id': process.env.FOLDER_ID,
            }
          }
        );
        return response.data.result.alternatives[0].message.text;
}