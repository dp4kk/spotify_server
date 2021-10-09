import dotenv from 'dotenv'
import express, { urlencoded, json } from "express";
import cors from "cors";
import SpotifyWebApi from "spotify-web-api-node";


dotenv.config()
const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(urlencoded({ extended: true }));
app.use(json());

app.post("/login", (req, res) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });
  const code = req.body.code;

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.status(400).json(err);
      console.log(err);
    });
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) =>
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      })
    )
    .catch((err) => res.status(400).send(err));
});

app.get("/", (req, res) => {
  res.send("Checking if works");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("listening to port 5000");
});
