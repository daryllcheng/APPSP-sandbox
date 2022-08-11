const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const axios = require("axios").default;
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors())

app.options('/create-checkout', cors())
app.post('/create-checkout', async (req, res) => {
  try {
    const options = {
      method: 'POST',
      url: 'https://global-api-sandbox.afterpay.com/v2/checkouts',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'APPSP Demo',
        Accept: 'application/json',
        Authorization: 'Basic MTAwMTAwMTE1OjQ4YTM1N2Q5YjBjYjI0N2NlZGE1NDUzZjczZmFmMDM3ZTIzZDQ3NjIzOWMzYWQ1MTA4NTkzZWQ2ZGY4Nzk0Nzc0MTI5Nzg4YzJlOGIxMzZhOWY1NTNjODljMDRlZmRmY2U2N2M3Y2ZlMjFiNDdmZWYwOWI2MDIxOTQ1ZTQxMzFi'
      },
      data: req.body
    };
    const response = await axios.request(options);
    res.status(200).send({ response: response.data })
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err)
  }
});

app.use(express.static(__dirname + "/public"));

app.get('/managed', (req, res) => {
  console.log(req.query)
  res.sendFile('/managed/index.html')
})

app.listen(3000, () => {
  console.log('server started');
});
