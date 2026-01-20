// Express Modules
const express = require("express");
const session = require("express-session");
const rateLimiters = require("./middlewares/rateLimiters");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// check for environment variables
required = [
  "SECRET_SESSION",
  "MONGO_URI",
  "BASE_URL",
  "MY_EMAIL_PASSWORD",
  "EMAIL",
];
required.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable ${envVar}`);
    process.exit(1);
  }
});
// MISC
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
// i18next modules
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const path = require("path");

// routes
const router = require("./routes/routes");
const courseContentRoute = require("./routes/courseContentRoute");

connectDB().then(() => {
  const secretSessionString = process.env.SECRET_SESSION;

  const app = express();

  app.disable("x-powered-by");

  // Set EJS as templating engine
  app.set("view engine", "ejs");

  // Add navbar Translator
  app.set("navsTranslator", {
    Home: "/",
    "Dashboard Admin": "/admin",
    "Dashboard Educator": "/EducatorDashboardMain",
    Search: "/search",
    Pricing: "/pricing",
    "Insert Course": "/EducatorDashboard",
  });

  // Static files middleware
  app.use(express.static(path.join(__dirname, "public")));
  // Global slow-down then hard rate limit (applies to non-static routes)
  app.use(rateLimiters.globalSlowDown);
  app.use(rateLimiters.globalLimiter);

  i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      debug: false,
      fallbackLng: "en",
      backend: {
        loadPath: path.join(__dirname, "./locales/{{lng}}/translation.json"),
      },
      detection: {
        order: ["querystring", "cookie"],
        caches: ["cookie"],
      },
    });

  app.use(i18nextMiddleware.handle(i18next));

  // Session (using MongoDB store for production)
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: secretSessionString,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: "stemref",
        ttl: 14 * 24 * 60 * 60, // 14 days
      }),
      cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
        secure: process.env.NODE_ENV === "production", // only over HTTPS
        httpOnly: true,
        sameSite: "lax",
      },
    }),
  );

  // Convert data into json
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.locals.req = req;
    res.locals.navData = { access: false };
    if (req.session?.user)
      res.locals.navData = {
        accesses: req.session.user.authenticated,
        user: req.session.user,
        path: "/" + req.path.split("/")[1],
      };
    next();
  });

  // Routing
  app.use(router);
  app.use(courseContentRoute);

  // Port Listner, [Do not remove this]
  port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("port Connected in", `http://localhost:${port}`);
  });
});
