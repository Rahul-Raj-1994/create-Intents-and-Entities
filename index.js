const fs = require("fs");
require("dotenv").config();

const { spawn } = require("child_process");

const express = require("express");
const axios = require("axios");

const app = express();

app.post("/", (req, res) => {
  const getAccessCode = spawn("gcloud", [
    "auth",
    "application-default",
    "print-access-token",
  ]);

  // console.log("getAccessCode: ", getAccessCode);

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

    const data = {
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
        axiosConfig,
        data
      )
      .then((response) => {
        console.log("response", response);

        res.status(201).json({
          ok: true,
          message: "successfully set the agent",
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
