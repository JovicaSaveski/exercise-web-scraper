import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';

interface Venue {
    name: string;
    description: string;
    address: string;
}

interface TicketInfo {
    type: string;
    price: string;
    benefits: string[];
    link: string;
}

interface ConferenceData {
    name: string;
    date: string;
    organizers: { name: string, link: string }[];
    speakers: Speaker[];
    venues: Venue[];
    ticketInfo: TicketInfo[];
    agenda: DayAgenda[];
}
interface Organizer{
    name: string;
    link: string;
}

interface Speaker {
    name: string;
    shortDescription: string;
    fullDescription?: string;
    image?: string;
    links: string[];
    sessions?: Session[];
}

interface Session {
    time?: string;
    title: string;
    speakers?: string;
    link: string;
}

interface StageSessions {
    stage: string;
    sessions: Session[];
}

interface DayAgenda {
    day: string;
    venue: string;
    description: string;
    stages: StageSessions[];
}

async function scrapeWTS(url: string): Promise<ConferenceData> {
    const browser: Browser = await chromium.launch();
    const page: Page = await browser.newPage();
    await page.goto(url);

    const conferenceData: ConferenceData = {
        speakers: [],
        venues: [],
        ticketInfo: [],
        name: '',
        date: '',
        organizers: [],
        agenda: []
    };

    const speakers = await scrapeWTSSpeakers('https://wts.sh/');
    conferenceData.speakers = speakers;

    // Scrape venues
    const venueElements = await page.$$('h4 + p');
    for (const element of venueElements) {
        const name = await element.evaluate(el => el.previousElementSibling?.textContent?.trim() || '');
        const description = await element.textContent() || '';
        const address = await element.evaluate(el => el.nextElementSibling?.textContent?.trim() || '');
        conferenceData.venues.push({ name, description, address });
    }

    const ticketsSection = await page.$('section#tickets');
    if (ticketsSection) {
        const ticketCards = await ticketsSection.$$('div[id^="card-"]');

        for (const card of ticketCards) {
            const type = await card.$eval('h3', el => el.textContent?.trim() || '');

            const price = await card.$eval('p.my-4', el => el.textContent?.trim() || '');

            const benefits = await card.$$eval('ul li', els => els.map(el => el.textContent?.trim() || ''));

            const linkElement = await card.$('a');
            const link = linkElement ? await card.$eval('a', a => a.getAttribute('href')) : '';
            const fullLink = link ? (link.startsWith('http') ? link : new URL(link, url).toString()) : '';

            conferenceData.ticketInfo.push({
                type,
                price,
                benefits,
                link: fullLink,
            });
        }
    }

    const aboutPage = await browser.newPage();
    const aboutData = await scrapeAboutPage(aboutPage, 'https://wts.sh/about');
    await aboutPage.close();

    conferenceData.name = aboutData.name;
    conferenceData.date = aboutData.date;
    conferenceData.organizers = aboutData.organizers;

    const agendaPage = await browser.newPage();
    const agendaData = await scrapeAgendaByDay(agendaPage, 'https://wts.sh/agenda');
    conferenceData.agenda = agendaData;
    await agendaPage.close();

    await browser.close();
    return conferenceData;
}

async function scrapeAgendaByDay(page: Page, url: string): Promise<DayAgenda[]> {
    await page.goto(url);

    const dayAgendas: DayAgenda[] = [];

    try {
        const selectedTab = await page.$('.tab.tab-lg.text-lg.text-nowrap.border-b.pb-4.border-grey-100.border-secondary-500.text-secondary-300');
        if (!selectedTab) {
            console.error('No selected tab found');
            return dayAgendas;
        }

        const day = (await selectedTab.textContent())?.trim() || '';
        const dataTabId = await selectedTab.getAttribute('data-id');
        const dayContent = await page.$(`div[data-tab-id="${dataTabId}"]`);
        if (!dayContent) {
            console.log('no dayContent');
            return dayAgendas;
        }

        const venue = await dayContent.$eval('h3', el => el.textContent?.trim() || '');
        const description = await dayContent.$eval('p.text-center.text-base', el => el.textContent?.trim() || '');

        const sessionElements = await dayContent.$$('table tr');
        const sessionsByStage: { [stage: string]: Session[] } = {};

        for (const sessionElement of sessionElements) {
            const time = await sessionElement.$eval('th', el => el.textContent?.trim() || '');
            const stages = await sessionElement.$$eval('td', (els, baseUrl) => els.map(el => {
                const title = el.querySelector('p.text-secondary-300.font-bold')?.textContent?.trim() || '';
                const speakers = el.querySelector('p.text-white.font-bold')?.textContent?.trim() || '';
                const link = el.querySelector('a')?.getAttribute('href') || '';
                const fullLink = link.startsWith('http') ? link : new URL(link, baseUrl).toString();
                return { title, speakers, link: fullLink };
            }), url);

            stages.forEach((stage, index) => {
                if (stage.title) {
                    const stageName = `Stage ${index + 1}`;
                    if (!sessionsByStage[stageName]) {
                        sessionsByStage[stageName] = [];
                    }
                    sessionsByStage[stageName].push({ time, ...stage });
                }
            });
        }

        const stages: StageSessions[] = Object.entries(sessionsByStage).map(([stage, sessions]) => ({
            stage,
            sessions
        }));

        dayAgendas.push({ day, venue, description, stages });
    } catch (error) {
        console.error('An error occurred while processing the selected tab:', error);
    }

    return dayAgendas;
}

async function scrapeAboutPage(page: Page, url: string): Promise<{ name: string, date: string, organizers: { name: string, link: string }[] }> {
    await page.goto(url);

    const name = await page.$eval('span.text-primary-300', el => el.textContent?.trim() || '');
    const date = await page.$eval('p:last-of-type', el => el.textContent?.trim().match(/(\d{1,2}(?:st|nd|rd|th) of \w+)/)?.[0] || '');
    const organizers = await page.$$eval('ol li a', els => els.map(el => ({
        name: el.textContent?.trim() || '',
        link: el.getAttribute('href') || ''
    })));

    return { name, date, organizers };
}

async function scrapeSpeakerPage(page: Page, url: string): Promise<Partial<Speaker>> {
    await page.goto(url);

    const fullDescription = await page.$eval('article p', el => el.textContent?.trim() || '');
    const image = await page.$eval('article img', (el, baseUrl) => {
        const src = el.getAttribute('src') || '';
        return src.startsWith('http') ? src : new URL(src, baseUrl).toString();
    }, url);
    const links = await page.$$eval('article a[href^="http"]', els => els.map(el => el.getAttribute('href') || ''));
    
    const sessions = await page.$$eval('article section:last-of-type p a', (els, baseUrl) => els.map(el => ({
        time: '', 
        speakers: '',
        title: el.textContent?.trim() || '',
        link: el.getAttribute('href')?.startsWith('http') ? el.getAttribute('href') || '' : new URL(el.getAttribute('href') || '', baseUrl).toString()
    })), url);
    return { fullDescription, image, links, sessions };
}

async function scrapeWTSSpeakers(url: string): Promise<Speaker[]> {
    const browser: Browser = await chromium.launch();
    const context = await browser.newContext();
    const page: Page = await context.newPage();

    await page.route(/(png|jpeg|jpg|svg|webp)$/, route => route.abort());

    await page.goto(url);

    const speakers: Speaker[] = [];

    const speakersSection = await page.$('section#speakers');
    if (!speakersSection) {
        console.error('Speakers section not found');
        await browser.close();
        return speakers;
    }

    const speakerCards = await speakersSection.$$('div[id^="card-"]');

    //const limitedSpeakerCards = speakerCards.slice(0, 3);

    for (const card of speakerCards) {
        const nameElement = await card.$('h3');
        const name = nameElement ? await card.$eval('h3', el => el.textContent?.trim() || '') : '';

        const element = await card.$('h3 + p');
        const shortDescription = element ? await card.$eval('h3 + p', el => el.textContent?.trim() || '') : '';

        const linkElement = await card.$('div.glitch a');
        const link = linkElement ? await card.$eval('div.glitch a', a => a.getAttribute('href')) : '';

        const fullLink = link ? (link.startsWith('http') ? link : new URL(link, url).toString()) : '';

        const speakerPage = await context.newPage();
        const additionalDetails = await scrapeSpeakerPage(speakerPage, fullLink);
        await speakerPage.close();

        speakers.push({
            name,
            shortDescription,
            links: [fullLink, ...(additionalDetails.links || [])],
            fullDescription: additionalDetails.fullDescription,
            image: additionalDetails.image,
            sessions: additionalDetails.sessions,
        });
    }

    await browser.close();
    return speakers;
}

(async () => {
    try {
                    const data = await scrapeWTS('https://wts.sh/');
                    console.log(JSON.stringify(data, null, 2));

                    fs.writeFileSync('wts_conference_data.json', JSON.stringify(data, null, 2));
                    console.log('Data is in wts_conference_data.json');
    } catch (error) {
                    console.error('An error occurred:', error);
    }
})();
