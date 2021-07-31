import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export async function convert(
    url: string,
) {
    const options = process.env.AWS_REGION
        ? {
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        }
        : {
            args: [],
            executablePath:
                process.platform === "win32"
                    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
                    : process.platform === "linux"
                    ? "/usr/bin/google-chrome"
                    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        };
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setViewport({
        width: 4000,
        height: 4000,
    });
    await page.setContent(url, {waitUntil: "networkidle0"});
    const example = await page.$('#image');
    const bounding_box = await example?.boundingBox();
    return await page.screenshot({
        type: 'png',
        omitBackground: true,
        clip: {
            x: bounding_box ? bounding_box.x : 0,
            y: bounding_box ? bounding_box.y : 0,
            width: Math.min(bounding_box ? bounding_box.width : 0, page.viewport()?.width ? page.viewport()?.width as number : 0),
            height: Math.min(bounding_box ? bounding_box.height : 0, page.viewport()?.height ? page.viewport()?.height as number : 0),
        },
    });
}