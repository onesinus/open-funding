const puppeteer = require('puppeteer');


(async () => {
    const browser = await puppeteer.launch({
        // headless: false,
        // slowMo: 100,
        devtools: true
    });

    try {

        const page = await browser.newPage();
    
        // await page.setRequestInterception(true);

        await page.goto('https://tanifund.com/explore', {
            // waitUntil: 'load',
            // timeout: 0
        });    


        await page.waitForSelector('.card');

        await page.evaluate(() => {
            const cards = document.querySelectorAll('.card');
            const arrOpenFund = [];
            for (let i = 0; i < cards.length - 1; i++) {
                const card = cards[i];
                if (card.textContent.length > 0 && card.textContent.includes("Menunggu Dimulai")) {
                    const title             = card.querySelector('.investment-title').textContent;
                    const profit_sharing    = card.querySelectorAll('.border-bottom')[0].textContent;
                    const tenor             = card.querySelectorAll('.border-bottom')[1].textContent;

                    arrOpenFund.push({ title, profit_sharing, tenor })
                }
            }   
            console.log(arrOpenFund);
            
            
        })

    //    page
    //         .on('request', (req) => {            
    //             if (['font', 'image'].includes(req.resourceType())) {
    //                 req.abort();
    //             }else {
    //                 req.continue();
    //             }
    //         })
    //         .on('load', () => {

    //             console.log('Load is here');
                
    //         });


    } catch (error) {
        console.log("Error nih ", error);
        
    }
    // Call this after the scrapping proccess is done
    // browser.close()
})();