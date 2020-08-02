const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            // slowMo: 100,
            devtools: true
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

        await page.goto('https://tanifund.com/explore');

        await page.waitForSelector('.card');

        const data = await page.evaluate(() => {
            const cards = document.querySelectorAll('.card');
            const arrOpenFund = [];
            for (let i = 0; i < cards.length - 1; i++) {
                const card = cards[i];
                if (card.textContent.length > 0 && card.textContent.includes("Fundraising")) {
                    const title             = card.querySelector('.investment-title').textContent;
                    const profit_sharing    = card.querySelectorAll('.border-bottom')[0].textContent;
                    const tenor             = card.querySelectorAll('.border-bottom')[1].textContent;
                    
                    arrOpenFund.push({ title, profit_sharing, tenor, source_data: 'https://tanifund.com/explore' })
                }
            }
            return arrOpenFund;
        });

        await page.close();
        await browser.close();

        console.log(data);
        

    } catch (error) {
        console.log("Error nih ", error);
        
    }
    // Call this after the scrapping proccess is done
    // browser.close()
})();