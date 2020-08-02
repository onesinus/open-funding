const puppeteer = require('puppeteer');

async function scrap(url, cardsSelector, status, fields) {
    try {
        const browser = await puppeteer.launch({
            // headless: false,
            // slowMo: 100,
            // devtools: true
        });
    
        const page = await browser.newPage();
    
        await page.setRequestInterception(true);

        page.on('request', (req) => {            
            if (['font', 'image'].includes(req.resourceType())) {
                req.abort();
            }else {
                req.continue();
            }
        });

        await page.goto(url);        

        await page.waitForSelector(cardsSelector);

        const data = await page.evaluate((url, cardsSelector, status, fields) => {
            console.log("=================Scrapping Start =================================");
            console.log("URL: " , url);
            
            
            const cards = document.querySelectorAll(cardsSelector);
            const arrOpenFund = [];
            for (let i = 0; i < cards.length - 1; i++) {
                const card = cards[i];
                console.log(card);
                
                if (card.textContent.length > 0 && card.textContent.includes(status)) {
                    const title             = card.querySelector(fields.title).textContent;

                    let profit_sharing = "";
                    if (Array.isArray(fields.profit_sharing)) {
                        profit_sharing    = card.querySelectorAll(fields.profit_sharing[0])[fields.profit_sharing[1]].textContent;
                    }else {
                        profit_sharing    = card.querySelector(fields.profit_sharing).textContent;
                    }

                    profit_sharing = profit_sharing.replace("Bunga efektif", "")

                    let tenor = "";
                    if (Array.isArray(fields.tenor)) {
                        tenor    = card.querySelectorAll(fields.tenor[0])[fields.tenor[1]].textContent;
                    }else {
                        tenor    = card.querySelector(fields.tenor).textContent;
                    }

                    tenor = tenor.replace("Tenor", "")
                    
                    arrOpenFund.push({ title, profit_sharing, tenor, source_data: url })
                }
            }
            return arrOpenFund;
        }, url, cardsSelector, status, fields);

        await page.close();
        await browser.close();

        console.log("================================= Scrapping result ===============================================");
        
        console.log(data);
        

    } catch (error) {
        console.log("Error nih ", error);
        
    }
    // Call this after the scrapping proccess is done
    // browser.close()

}

scrap('https://tanifund.com/explore', '.card', 'Fundraising', {
    title: '.investment-title',
    profit_sharing: ['.border-bottom', 0],
    tenor: ['.border-bottom', 1]
});

scrap('https://www.akseleran.co.id/beri-pinjaman', '.card', 'Hari lagi', {
    title: 'p',
    profit_sharing: ['.eight', 2],
    tenor: ['.eight', 1]
});