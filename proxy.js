const express = require("express");
const axios = require("axios");
const url = require("url");
const app = express();

const port = 3000;
const clientKey = "8f3145a1-7827-4082-ad11-afa85e5ca42a";
const clientSecret = "NCWzNWGk3+u+FMiWXWk10k5Eer9er1yFQ+gEYbyp5vk=";
const username = "testaccount";
const password = "dA2MCe4CXdJ@vj";
const grant_type = "password";
const xApiVersion = "3";

// for parsing the body in POST request
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/createOrder", async (req, res) => {
  try {
    const accessToken = await getToken();
    const createOrderData = await createOrder(accessToken);
    const inputOrderItemResult = await inputOrderItems(
      accessToken,
      createOrderData.orderId,
      createOrderData.id
    );
  } catch (error) {
    console.log("Error in API", error.message);
    return res.status(500).json({
      error: "Unexpected error",
    });
  }

  return res.status(200).end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function getToken() {
  const params = new url.URLSearchParams({ username, password, grant_type });
  const {
    data: { access_token },
  } = await axios.post(
    "https://bss.leadercloud.com.au/oauth/token",
    params.toString(),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientKey}:${clientSecret}`
        ).toString("base64")}`,
      },
    }
  );

  return access_token;
}

async function createOrder(accessToken) {
  const { data } = await axios.post(
    "https://bss.leadercloud.com.au/api/orders",
    {
      name: "testing",
      accountId: 2637,
      billingToId: 2637,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-api-version": xApiVersion,
      },
    }
  );
  return data;
}

async function inputOrderItems(accessToken, orderId, id) {
  const { data } = await axios.post(
    `https://bss.leadercloud.com.au/api/orders/${orderId}/execute`,
    {
      id,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-api-version": xApiVersion,
      },
    }
  );
  return data;
}
