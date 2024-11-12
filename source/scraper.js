"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var playwright_1 = require("playwright");
var fs = require("fs");
function scrapeWTS(url) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, conferenceData, speakers, venueElements, _i, venueElements_1, element, name_1, description, address, ticketsSection, ticketCards, _a, ticketCards_1, card, type, price, benefits, linkElement, link, _b, fullLink, aboutPage, aboutData, agendaPage, agendaData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, playwright_1.chromium.launch()];
                case 1:
                    browser = _c.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _c.sent();
                    return [4 /*yield*/, page.goto(url)];
                case 3:
                    _c.sent();
                    conferenceData = {
                        speakers: [],
                        venues: [],
                        ticketInfo: [],
                        name: '',
                        date: '',
                        organizers: [],
                        agenda: []
                    };
                    return [4 /*yield*/, scrapeWTSSpeakers('https://wts.sh/')];
                case 4:
                    speakers = _c.sent();
                    conferenceData.speakers = speakers;
                    return [4 /*yield*/, page.$$('h4 + p')];
                case 5:
                    venueElements = _c.sent();
                    _i = 0, venueElements_1 = venueElements;
                    _c.label = 6;
                case 6:
                    if (!(_i < venueElements_1.length)) return [3 /*break*/, 11];
                    element = venueElements_1[_i];
                    return [4 /*yield*/, element.evaluate(function (el) { var _a, _b; return ((_b = (_a = el.previousElementSibling) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || ''; })];
                case 7:
                    name_1 = _c.sent();
                    return [4 /*yield*/, element.textContent()];
                case 8:
                    description = (_c.sent()) || '';
                    return [4 /*yield*/, element.evaluate(function (el) { var _a, _b; return ((_b = (_a = el.nextElementSibling) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || ''; })];
                case 9:
                    address = _c.sent();
                    conferenceData.venues.push({ name: name_1, description: description, address: address });
                    _c.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [4 /*yield*/, page.$('section#tickets')];
                case 12:
                    ticketsSection = _c.sent();
                    if (!ticketsSection) return [3 /*break*/, 23];
                    return [4 /*yield*/, ticketsSection.$$('div[id^="card-"]')];
                case 13:
                    ticketCards = _c.sent();
                    _a = 0, ticketCards_1 = ticketCards;
                    _c.label = 14;
                case 14:
                    if (!(_a < ticketCards_1.length)) return [3 /*break*/, 23];
                    card = ticketCards_1[_a];
                    return [4 /*yield*/, card.$eval('h3', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                case 15:
                    type = _c.sent();
                    return [4 /*yield*/, card.$eval('p.my-4', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                case 16:
                    price = _c.sent();
                    return [4 /*yield*/, card.$$eval('ul li', function (els) { return els.map(function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; }); })];
                case 17:
                    benefits = _c.sent();
                    return [4 /*yield*/, card.$('a')];
                case 18:
                    linkElement = _c.sent();
                    if (!linkElement) return [3 /*break*/, 20];
                    return [4 /*yield*/, card.$eval('a', function (a) { return a.getAttribute('href'); })];
                case 19:
                    _b = _c.sent();
                    return [3 /*break*/, 21];
                case 20:
                    _b = '';
                    _c.label = 21;
                case 21:
                    link = _b;
                    fullLink = link ? (link.startsWith('http') ? link : new URL(link, url).toString()) : '';
                    conferenceData.ticketInfo.push({
                        type: type,
                        price: price,
                        benefits: benefits,
                        link: fullLink,
                    });
                    _c.label = 22;
                case 22:
                    _a++;
                    return [3 /*break*/, 14];
                case 23: return [4 /*yield*/, browser.newPage()];
                case 24:
                    aboutPage = _c.sent();
                    return [4 /*yield*/, scrapeAboutPage(aboutPage, 'https://wts.sh/about')];
                case 25:
                    aboutData = _c.sent();
                    return [4 /*yield*/, aboutPage.close()];
                case 26:
                    _c.sent();
                    conferenceData.name = aboutData.name;
                    conferenceData.date = aboutData.date;
                    conferenceData.organizers = aboutData.organizers;
                    return [4 /*yield*/, browser.newPage()];
                case 27:
                    agendaPage = _c.sent();
                    return [4 /*yield*/, scrapeAgendaByDay(agendaPage, 'https://wts.sh/agenda')];
                case 28:
                    agendaData = _c.sent();
                    conferenceData.agenda = agendaData;
                    return [4 /*yield*/, agendaPage.close()];
                case 29:
                    _c.sent();
                    return [4 /*yield*/, browser.close()];
                case 30:
                    _c.sent();
                    return [2 /*return*/, conferenceData];
            }
        });
    });
}
function scrapeAgendaByDay(page, url) {
    return __awaiter(this, void 0, void 0, function () {
        var dayAgendas, selectedTab, day, dataTabId, dayContent, venue, description, sessionElements, sessionsByStage_1, _loop_1, _i, sessionElements_1, sessionElement, stages, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, page.goto(url)];
                case 1:
                    _b.sent();
                    dayAgendas = [];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 14, , 15]);
                    return [4 /*yield*/, page.$('.tab.tab-lg.text-lg.text-nowrap.border-b.pb-4.border-grey-100.border-secondary-500.text-secondary-300')];
                case 3:
                    selectedTab = _b.sent();
                    if (!selectedTab) {
                        console.error('No selected tab found');
                        return [2 /*return*/, dayAgendas];
                    }
                    return [4 /*yield*/, selectedTab.textContent()];
                case 4:
                    day = ((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                    return [4 /*yield*/, selectedTab.getAttribute('data-id')];
                case 5:
                    dataTabId = _b.sent();
                    return [4 /*yield*/, page.$("div[data-tab-id=\"".concat(dataTabId, "\"]"))];
                case 6:
                    dayContent = _b.sent();
                    if (!dayContent) {
                        console.log('no dayContent');
                        return [2 /*return*/, dayAgendas];
                    }
                    return [4 /*yield*/, dayContent.$eval('h3', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                case 7:
                    venue = _b.sent();
                    return [4 /*yield*/, dayContent.$eval('p.text-center.text-base', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                case 8:
                    description = _b.sent();
                    return [4 /*yield*/, dayContent.$$('table tr')];
                case 9:
                    sessionElements = _b.sent();
                    sessionsByStage_1 = {};
                    _loop_1 = function (sessionElement) {
                        var time, stages_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, sessionElement.$eval('th', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                                case 1:
                                    time = _c.sent();
                                    return [4 /*yield*/, sessionElement.$$eval('td', function (els, baseUrl) { return els.map(function (el) {
                                            var _a, _b, _c, _d, _e;
                                            var title = ((_b = (_a = el.querySelector('p.text-secondary-300.font-bold')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
                                            var speakers = ((_d = (_c = el.querySelector('p.text-white.font-bold')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) || '';
                                            var link = ((_e = el.querySelector('a')) === null || _e === void 0 ? void 0 : _e.getAttribute('href')) || '';
                                            var fullLink = link.startsWith('http') ? link : new URL(link, baseUrl).toString();
                                            return { title: title, speakers: speakers, link: fullLink };
                                        }); }, url)];
                                case 2:
                                    stages_1 = _c.sent();
                                    stages_1.forEach(function (stage, index) {
                                        if (stage.title) {
                                            var stageName = "Stage ".concat(index + 1);
                                            if (!sessionsByStage_1[stageName]) {
                                                sessionsByStage_1[stageName] = [];
                                            }
                                            sessionsByStage_1[stageName].push(__assign({ time: time }, stage));
                                        }
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, sessionElements_1 = sessionElements;
                    _b.label = 10;
                case 10:
                    if (!(_i < sessionElements_1.length)) return [3 /*break*/, 13];
                    sessionElement = sessionElements_1[_i];
                    return [5 /*yield**/, _loop_1(sessionElement)];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 10];
                case 13:
                    stages = Object.entries(sessionsByStage_1).map(function (_a) {
                        var stage = _a[0], sessions = _a[1];
                        return ({
                            stage: stage,
                            sessions: sessions
                        });
                    });
                    dayAgendas.push({ day: day, venue: venue, description: description, stages: stages });
                    return [3 /*break*/, 15];
                case 14:
                    error_1 = _b.sent();
                    console.error('An error occurred while processing the selected tab:', error_1);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/, dayAgendas];
            }
        });
    });
}
function scrapeAboutPage(page, url) {
    return __awaiter(this, void 0, void 0, function () {
        var name, date, organizers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.goto(url)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.$eval('span.text-primary-300', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                case 2:
                    name = _a.sent();
                    return [4 /*yield*/, page.$eval('p:last-of-type', function (el) { var _a, _b; return ((_b = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim().match(/(\d{1,2}(?:st|nd|rd|th) of \w+)/)) === null || _b === void 0 ? void 0 : _b[0]) || ''; })];
                case 3:
                    date = _a.sent();
                    return [4 /*yield*/, page.$$eval('ol li a', function (els) { return els.map(function (el) {
                            var _a;
                            return ({
                                name: ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                                link: el.getAttribute('href') || ''
                            });
                        }); })];
                case 4:
                    organizers = _a.sent();
                    return [2 /*return*/, { name: name, date: date, organizers: organizers }];
            }
        });
    });
}
function scrapeSpeakerPage(page, url) {
    return __awaiter(this, void 0, void 0, function () {
        var fullDescription, image, links, sessions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.goto(url)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.$eval('article p', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                case 2:
                    fullDescription = _a.sent();
                    return [4 /*yield*/, page.$eval('article img', function (el, baseUrl) {
                            var src = el.getAttribute('src') || '';
                            return src.startsWith('http') ? src : new URL(src, baseUrl).toString();
                        }, url)];
                case 3:
                    image = _a.sent();
                    return [4 /*yield*/, page.$$eval('article a[href^="http"]', function (els) { return els.map(function (el) { return el.getAttribute('href') || ''; }); })];
                case 4:
                    links = _a.sent();
                    return [4 /*yield*/, page.$$eval('article section:last-of-type p a', function (els, baseUrl) { return els.map(function (el) {
                            var _a, _b;
                            return ({
                                time: '',
                                speakers: '',
                                title: ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                                link: ((_b = el.getAttribute('href')) === null || _b === void 0 ? void 0 : _b.startsWith('http')) ? el.getAttribute('href') || '' : new URL(el.getAttribute('href') || '', baseUrl).toString()
                            });
                        }); }, url)];
                case 5:
                    sessions = _a.sent();
                    return [2 /*return*/, { fullDescription: fullDescription, image: image, links: links, sessions: sessions }];
            }
        });
    });
}
function scrapeWTSSpeakers(url) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, context, page, speakers, speakersSection, speakerCards, _i, speakerCards_1, card, nameElement, name_2, _a, element, shortDescription, _b, linkElement, link, _c, fullLink, speakerPage, additionalDetails;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, playwright_1.chromium.launch()];
                case 1:
                    browser = _d.sent();
                    return [4 /*yield*/, browser.newContext()];
                case 2:
                    context = _d.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _d.sent();
                    return [4 /*yield*/, page.route(/(png|jpeg|jpg|svg|webp)$/, function (route) { return route.abort(); })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, page.goto(url)];
                case 5:
                    _d.sent();
                    speakers = [];
                    return [4 /*yield*/, page.$('section#speakers')];
                case 6:
                    speakersSection = _d.sent();
                    if (!!speakersSection) return [3 /*break*/, 8];
                    console.error('Speakers section not found');
                    return [4 /*yield*/, browser.close()];
                case 7:
                    _d.sent();
                    return [2 /*return*/, speakers];
                case 8: return [4 /*yield*/, speakersSection.$$('div[id^="card-"]')];
                case 9:
                    speakerCards = _d.sent();
                    _i = 0, speakerCards_1 = speakerCards;
                    _d.label = 10;
                case 10:
                    if (!(_i < speakerCards_1.length)) return [3 /*break*/, 27];
                    card = speakerCards_1[_i];
                    return [4 /*yield*/, card.$('h3')];
                case 11:
                    nameElement = _d.sent();
                    if (!nameElement) return [3 /*break*/, 13];
                    return [4 /*yield*/, card.$eval('h3', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                case 12:
                    _a = _d.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _a = '';
                    _d.label = 14;
                case 14:
                    name_2 = _a;
                    return [4 /*yield*/, card.$('h3 + p')];
                case 15:
                    element = _d.sent();
                    if (!element) return [3 /*break*/, 17];
                    return [4 /*yield*/, card.$eval('h3 + p', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                case 16:
                    _b = _d.sent();
                    return [3 /*break*/, 18];
                case 17:
                    _b = '';
                    _d.label = 18;
                case 18:
                    shortDescription = _b;
                    return [4 /*yield*/, card.$('div.glitch a')];
                case 19:
                    linkElement = _d.sent();
                    if (!linkElement) return [3 /*break*/, 21];
                    return [4 /*yield*/, card.$eval('div.glitch a', function (a) { return a.getAttribute('href'); })];
                case 20:
                    _c = _d.sent();
                    return [3 /*break*/, 22];
                case 21:
                    _c = '';
                    _d.label = 22;
                case 22:
                    link = _c;
                    fullLink = link ? (link.startsWith('http') ? link : new URL(link, url).toString()) : '';
                    return [4 /*yield*/, context.newPage()];
                case 23:
                    speakerPage = _d.sent();
                    return [4 /*yield*/, scrapeSpeakerPage(speakerPage, fullLink)];
                case 24:
                    additionalDetails = _d.sent();
                    return [4 /*yield*/, speakerPage.close()];
                case 25:
                    _d.sent();
                    speakers.push({
                        name: name_2,
                        shortDescription: shortDescription,
                        links: __spreadArray([fullLink], (additionalDetails.links || []), true),
                        fullDescription: additionalDetails.fullDescription,
                        image: additionalDetails.image,
                        sessions: additionalDetails.sessions,
                    });
                    _d.label = 26;
                case 26:
                    _i++;
                    return [3 /*break*/, 10];
                case 27: return [4 /*yield*/, browser.close()];
                case 28:
                    _d.sent();
                    return [2 /*return*/, speakers];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, scrapeWTS('https://wts.sh/')];
            case 1:
                data = _a.sent();
                console.log(JSON.stringify(data, null, 2));
                fs.writeFileSync('wts_conference_data.json', JSON.stringify(data, null, 2));
                console.log('Data is in wts_conference_data.json');
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('An error occurred:', error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
