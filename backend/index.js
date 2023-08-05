const apiKey = "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"
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
// let corsOptions = {
//     origin: 'https://www.domain.com',
//     credentials: true
// }
app.use(cors());

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/cookChat', async function (req, res) {
    let { mypage, userMessages, assistantMessages} = req.body

    let messages = [
        {role: "system", content: "당신은 세계 최고의 요리사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 쿡챗입니다. 당신은 사람이 어떤 재료가 있을때 어떤 음식을 할 수 있냐고 물어보면 매우 명확하게 음식 레시피를 대답해 줄 수 있습니다. 당신은 요리 관련 지식이 풍부하고 모든 질문에 대해서 명확하게 답변해불 수 있습니다."},
        {role: "user", content: "당신은 세계 최고의 요리사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 쿡챗입니다. 당신은 사람이 어떤 재료가 있을때 어떤 음식을 할 수 있냐고 물어보면 매우 명확하게 음식 레시피를 대답해 줄 수 있습니다. 당신은 요리 관련 지식이 풍부하고 모든 질문에 대해서 명확하게 답변해불 수 있습니다."},
        {role: "assistant", content: "안녕하세요! 저는 쿡챗입니다. 어떤 요리를 먹을지 고민중이신가요? 재료를 알려주시면 제가 어떤 요리를 할 수 있는지 답변해드리겠습니다."},
        {role: "user", content: `저의 이름, 나이, 성별, 선호하는 음식, 알러지정보는 ${mypage}입니다.`},
        {role: "assistant", content: `당신의 이름, 나이, 성별, 선호하는 음식, 알러지정보는 ${mypage}인 것을 확인하였습니다. 궁금한 레시피에 대해서 어떤 것이든 물어보세요!`},
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    });
    let fortune = completion.data.choices[0].message['content']

    res.json({"assistant": fortune});
});

app.listen(3000)