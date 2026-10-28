import { expect, test } from '@playwright/test';
const base='https://newchanges-cloudflare-preview.cabo-solutions-za.workers.dev';
for(const viewport of [
  {name:'desktop',width:1440,height:900},
  {name:'mobile',width:390,height:844}
]){
  test('NewChanges safe Cloudflare public homepage on '+viewport.name,async ({browser})=>{
    const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
    try{
      const page=await context.newPage();
      const response=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/The Fixer|Financial Wellbeing/i);
      await expect(page.getByText(/Cloudflare staging preview/i).first()).toBeVisible();
      const body=await page.locator('body').innerText();
      expect(body).toMatch(/financial wellbeing|workforce/i);
      const login=await page.request.get(base+'/login');
      expect(login.status()).toBe(403);
      const status=await page.request.post(base+'/api/auth/login',{data:{email:'synthetic@example.test',password:'not-a-real-password'}});
      expect(status.status()).toBe(404);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(8);
    }finally{await context.close();}
  });
}
