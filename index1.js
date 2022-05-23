const fs = require("fs");
const { spawn } = require("child_process");

require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.post("/", (req, res) => {
  const getAccessCode = spawn("gcloud", [
    "auth",
    "application-default",
    "print-access-token",
  ]);
  getAccessCode.stdout.on("data", (accessToken) => {
    // console.log(`stdout: ${accessToken}`);

    accessToken.toString().replace(/\n/g, "");

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken
          .toString()
          .replace(/[\r\n]+/gm, "")}`,
      },
    };

    // const agentBody = {
    //   displayName: "agent-from-node",
    //   defaultLanguageCode: "en",
    //   timeZone: "America/New_York",
    // };

    const intentData = {
      name: "",
      displayName: "veggies",
      kind: "KIND_MAP",
      entities: [
        {
          value: "potatao",
          synonyms: ["potatao", "pota"],
        },
        {
          value: "tomato",
          synonyms: ["tom", "toma"],
        },
      ],
    };

    axios
      .post(
        `https://dialogflow.googleapis.com/v2/projects/${privateKeyObj.project_id}/agent/entityTypes?key=${process.env.GOOGLE_API_KEY}`,
        intentData,
        axiosConfig
      )
      .then((response) => {
        console.log("response: ", response);
        res.status(201).json({
          ok: true,
          message: "successfully set the intent",
          data: response.data,
        });
      })
      .catch((e) => {
        console.log("error: ", e);
        res.status(500).json({ error: e });
      });
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
