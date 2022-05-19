const fs = require("fs");
const { spawn } = require("child_process");

const express = require("express");
const axios = require("axios");

// require("./db/mongoose");

const app = express();

// accessCode.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// accessCode.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// Read the private key:
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH);

const privateKeyObj = JSON.parse(privateKey.toString());

// app.get('/', (req, res) => {
//   const getAccessCode = spawn('gcloud', [
//     'auth',
//     'application-default',
//     'print-access-token',
//   ]);
//   getAccessCode.stdout.on('data', (accessToken) => {
//     // console.log(`stdout: ${accessToken}`);

//     accessToken.toString().replace(/\n/g, '');

//     const axiosConfig = {
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         Authorization: `Bearer ${accessToken
//           .toString()
//           .replace(/[\r\n]+/gm, '')}`,
//       },
//     };

//     axios
//       .get(
//         `https://dialogflow.googleapis.com/v2/projects/${privateKeyObj.project_id}/agent?key=${process.env.GOOGLE_API_KEY}`,
//         axiosConfig
//       )
//       .then((response) => {
//         // console.log('response: ', response.data);
//         res.status(201).json({
//           ok: true,
//           message: 'Successfully got agent',
//           data: response.data,
//         });
//       })
//       .catch((e) => {
//         // console.log('error: ', e);
//         res.status(500).json({ error: e });
//       });
//   });
// });

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

    // const agentBody = {
    //   displayName: "agent-from-node",
    //   defaultLanguageCode: "en",
    //   timeZone: "America/New_York",
    // };

    axios
      .post(
        `https://dialogflow.googleapis.com/v2/projects/${privateKeyObj.project_id}/agent/intents?key=${process.env.GOOGLE_API_KEY}`,
        axiosConfig,
        data
      )
      .then((response) => {
        // console.log('response: ', response.data);

        // save to mongodb
        // const agent = new Agent({
        //   projectId: privateKeyObj.project_id,
        //   clientId: privateKeyObj.client_id,
        //   clientEmail: privateKeyObj.client_email,
        //   SAPrivateKey: privateKey,
        //   agentName: response.data.displayName,
        //   defaultLanguageCode: response.data.defaultLanguageCode,
        //   timeZone: response.data.timeZone,
        //   apiVersion: response.data.apiVersion,
        // });

        // agent
        //   .save()
        //   .then(() => {
        //     console.log("agent saved successfully");
        //   })
        //   .catch((e) => {
        //     console.log("error: ", e);
        //   });

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
