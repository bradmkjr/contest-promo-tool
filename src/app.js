var express = require('express');
var app = express();

var Twit = require('twit');
var sqlite3 = require('sqlite3').verbose();

var cache = require('sqlcachedb');

var pj = require('phrasejumble');

var title = '';
var category = '';
var coupon = '';
var description = '';
var amazonImg = '';
var amazonURL = '';
var shortURL = ''; 
var longURL = '';

var b64content = '';

var response = '';

var tags = ['#Amazon', '#PROMO', '#Savings', '#Discount', '#SALE', '#Bargin', '#Promotion', '#Coupon', '#DEALS', '#special', '#Offer', '#FrugalLiving', '#couponing', '#blackfriday'];

var blackFridayTags = ['#blackfriday'];
    // '#blackfridaysavings' , '#blackfridayads', '#blackfridayad', '#blackfridaysale'

var rawHtml = '<div id="" class="container bg-no-repeat associates" style="width:100%;"><div class="text align-left ">Here are some promotions that manufacturers want to share with associates. Remember to open links below and confirm the promotion is active before sharing it with customers. If associates refer customers to the page before a promotion has started or after it has ended, customers will be redirected to Amazon’s Deals page. We regularly review performance and may reach out with exclusive promo codes for associates who have successfully shared these promotions.<br><br><u><em>Apparel &amp; Accessories:</em></u><em> <br></em><a href="https://www.amazon.com/gp/mpc/A2KHO21YVYE52J">20ACMEMADE1</a> - 20%   off Acme Made backpack. Available now through 10/22, while supplies last.    <em><br></em><a href="https://www.amazon.com/gp/mpc/A12OWWYGD8CEU4">15TOMMYRFID</a> - 15%   off Tommy Hilfiger men\'s leather wallet. Available now through 11/9, while   supplies last.    <br><a href="https://www.amazon.com/gp/mpc/A2HB81B35QFXPN">15EXACTFIT</a> - 15%   off Exact Fit men\'s belt. Available now through 11/9, while supplies last.    <br><u><em>Arts &amp; Crafts </em></u><a href="https://www.amazon.com/gp/mpc/A1OV4KYUCU91RG">15HALLOWEEN</a> - 15% off Smart-Fab craft fabric for Halloween. Available now through 10/30, while supplies last.    <br><u><em>Beauty:</em></u>  <br><a href="https://www.amazon.com/gp/mpc/A1Z9VT7LQ0CFMS">25ELSIG</a> - 25% off   English Laundry perfume. Available now through 10/31, while supplies last.    <br><a href="https://www.amazon.com/gp/mpc/AGW5UX4R2MQY4">15MYEBFAVS</a> - 15% off Ecco Bella organic beauty products. Available now through 10/23, while supplies last.<u><em><br></em></u><a href="https://www.amazon.com/gp/mpc/AWIQNMCDT6ND6">15THEWINNERS</a> - 15% off La Roche-Posay beauty products. Available now through 10/31, while supplies last.<u><em><br>Camera</em></u> <a href="https://www.amazon.com/gp/mpc/A140DOPLEKLUCR">15EZVIZTROOP</a> - 15% off EZVIZ security system. Available now through 10/20, while supplies last.<br><u><em>Electronics</em></u> <a href="https://www.amazon.com/gp/mpc/AVIGKWGFNUIPJ">15VAUXVERGE</a> - 15% off VAUX smart speaker and battery. Available now through 10/31, while supplies last.<u><em><br>Furniture <br></em></u><a href="https://www.amazon.com/gp/mpc/A2ZE5R0ANBP5LQ">15RUGS</a> - 15% off Mohawk rugs. Available now through 10/31, while supplies last. <u><em><br></em></u><a href="https://www.amazon.com/gp/mpc/A1FUQCPGU8W2DB">102SIMPDRAPB</a> - $102 off Simpli Home mid century storage bench. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A24TWDLB7S8590">104SIMPAVECT</a> - $104 off Simpli Home coffee table, java. Available now through 10/29, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A43K0O6A2I0GA">105SIMPDYLHC</a> - $105 off Simpli Home hallway table, driftwood. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A3G56UF402OH5G">106SIMPDRPCT</a> - $106 off Simpli Home mid century sofa table. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2WOLZHXB2TD8K">107SIMPBRLCO</a> - $107 off Simpli Home coffee table, espresso. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A31K9ES9FUS26Y">107SIMPGALCC</a> - $107 off Simpli Home club chair, brown. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A36Z44OW0LKZSN">108SIMPSHLA</a> - $108 off Simpli Home sawhorse ladder shelf bookcase. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AEI9YGAF18G0G">111REDMOND</a> - $111 off Simpli Home coffee table, brown. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/ASPQGTKL9OMNZ">111SIMPSHLA1</a> - $111 off Simpli Home sawhorse ladder shelf bookcase, grey. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/ASZR7XRN69WRF">112SIMPBRLCT</a> - $112 off Simpli Home sofa table, espresso. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A17ZLG6IXX82VA">115SIMPRIOCT</a> - $115 off Simpli Home sofa table, brown. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A3UNLXJICFGHA7">119SIMPWSHWR</a> - $119 off Simpli Home storage wine rack, grey. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AWZIPX8PX84CK">121SIMPDRPCT</a> - $121 off Simpli Home mid century coffee table, brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A6YF9RREU7DVZ">126SIMPRIV</a> - $126 off Simpli Home coffee table, natural. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AEVYKPEJ05W94">126SIMPCOSWR</a> - $126 off Simpli Home storage wine rack, brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A3MSIL9OVVHC8T">127SIMPWSCON</a> - $127 off Simpli Home console sofa table, grey. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A270DZ5R5L0LR4">128SIMPRIO1</a> - $128 off Simpli Home TV stand, brown. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2ODVO520H48LJ">128SIMPSH1</a> - $128 off Simpli Home media stand, chestnut. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2R6K02CLXB829">128SIMPSHTVS</a> - $128 off Simpli Home sawhorse media stand, grey. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A26WARYE2RPSGW">129SIMPLI</a> - $129 off Simpli Home coffee table. Available now through 11/4, while supplies last. <br><a href="https://www.amazon.com/gp/mpc/A1N6WFCCUPC43N">130SIMCOFFEE</a> - $130 off Simpli Home coffee table, russet. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A30IMXAGMDRI31">67SIMPHAMOT2</a> - $140 off Simpli Home storage ottoman, natural. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AVJ7E2OH5WEQI">142SIMPDININ</a> - $142 off Simpli Home dining table, java. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AMDKX3EAOR4GH">66SIMPCONET</a> - $146 off Simpli Home end table, dark brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AI3UCFWYT64Z6">148SIMPMONCT</a> - $148 off Simpli Home console table, charcoal brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A18XDDKVD2VKML">156SIMPARTVS</a> - $156 off Simpli Home tv stand, natural brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A27K7333IBYQ8O">157SIMPSKY</a> - $157 off Simpli Home nesting coffee table. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/ACHWEOP8W2A4E">16BOOOKCASE</a> - $16 off 30H wooden bookcase. Available now through 10/21, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A1H61DTE8TK61P">186SIMPARTDR</a> - $186 off Simpli Home bedroom dresser, brown. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/ASDERZQ4BMXQ0">188SIMPLIDRE</a> - $188 off Simpli Home bedroom dresser, brown. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A1SA931T3TMHYL">72SIMPSHTVS2</a> - $190 off Simpli Home TV media stand. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AD4IYBIANSTZY">20LIGHTING</a> - $20 off Catalina 3-piece lamp set. Available now through 10/21, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2HXIHX9C7ERDR">25SIMBAR</a> - $25 off Simpli Home bar stool, mocha. Available now through 10/23, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A178OQFPDL4E37">25SIMDAX</a> - $25 off Simpli Home office chair, black. Available now through 10/23, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A1AVQ35XYI07H4">25SIMBAR1</a> - $25 off Simpli Home bar stool, black. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2WUJXGR6MX10D">32SIMPCOSMET</a> - $32 off Simpli Home end table, farmhouse brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A1P9KESLH4UFEN">35SIMPCARL1</a> - $35 off Simpli Home end table, brown. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A15LNWU5L7EFVE">35SIMPCRLET</a> - $35 off Simpli Home end side table, brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A3CL5SFBPTDPA5">35SIMPCRLEST</a> - $35 off Simpli Home end table, farmhouse grey. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/ALQSPBJFPYH70">53SIMPLISHCT</a> - $53 off Simpli Home sawhorse softa table, brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A39DVEYSFR86QG">55SIMPSHCON</a> - $55 off Simpli Home sawhorse sofa table, chestnut. Available now through 10/27, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AYSW0239W76XL">55SIMEND</a> - $55 off Simpli Home side table, brown. Available now through 10/23, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2FTJO8Z6DOMRF">57SIMPLARSB</a> - $57 off Simpli Home storage ottoman, dark brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A29JB03L5M7VKA">57SIMPACADLS</a> - $57 off Simpli Home ladder bookcase. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AWAQ74C0W4IXS">63SIMPDRAPND</a> - $63 off Simpli Home mid century end table, brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AUS4YVGFOZK87">63SIMPCARLD</a> - $63 off Simpli Home office desk, dark brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2NC2BZX9BOOHB">64SIMPHAMOT</a> - $64 off Simpli Home storage ottoman, gray. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A6P1MV47TPOQ1">71SIMPLIABWW</a> - $71 off Simpli Home entryway storage bench, light brown. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A3IHH71MPXS9QN">72SIMPSHCT</a> - $72 off Simpli Home sawhorse coffee table, brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AFK4QRBF2VV0M">72SIMPDYLCT</a> - $72 off Simpli Home coffee table, driftwood. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A3H8BLK2FE4VK">74SIMPLIABW</a> - $74 off Simpli Home entryway storage bench, white. Available now through 10/22, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A1C71E1WXYQL3V">77SIMPJAMACC</a> - $77 off Simpli Home accent chair, bright blue. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A3KEXZZNEJCT0U">77SIMPJENOTB</a> - $77 off Simpli Home ottoman bench, fawn. Available now through 10/29, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2IV0MJAMIB9L0">78SIMPDYLSCT</a> - $78 off Simpli Home square coffee table, driftwood. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A1FQB5O0LGND46">78SIMPCASTOT</a> - $78 off Simpli Home storage ottoman bench, tan. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A3CPFSSY8I0JYR">80SIMPCASOTT</a> - $80 off Simpli Home storage ottoman bench, fawn. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2MKNYWRKOAPCQ">80SIMPDOROT2</a> - $80 off Simpli Home storage ottoman bench, black. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AB1ZI4F4N7Y3U">81SIMPDRAPLS</a> - $81 off Simpli Home mid century low storage cabinet, brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2U42QJVU9CVTT">81SIMPJAMAC3</a> - $81 off Simpli Home accent chair, blue. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A29BTAC6MYDGMM">81SIMPJAMAC4</a> - $81 off Simpli Home accent chair, brown. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A1H538KJ9A1E4E">83SIMPLONGT2</a> - $81 off Simpli Home tub chair, grey. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A149KQUU7ML949">81SIMPJAMAC2</a> - $81 off Simpli Home accent chair, taupe. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2AG676BNFXFZR">91SIMPKITLS</a> - $91 off Simpli Home low storage cabinet, dark brown. Available now through 10/26, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A1CFCFE67ZOMAI">98SIMPAVECO</a> - $98 off Simpli Home sofa table. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2KRS6J46JSLOG">98SIMPAVERC</a> - $98 off Simpli Home square coffee table, java. Available now through 10/28, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A21BCTSXP28ZH1">47SIMPBURLET</a> - $99 off Simpli Home end table, espresso. Available now through 10/26, while supplies last.   <u><em><br>Grocery:</em></u>  <br><a href="https://www.amazon.com/gp/mpc/A1UVLPTXBZ6FK0">20LKFEAST</a> - 20% off Lorissa\'s Kitchen snacks. Available now through 10/21/17.<br><a href="https://www.amazon.com/gp/mpc/A1TOATFNPLXAX8">15BRAZIL32CT</a> - 15%   off Peet\'s Coffee k-cup packs. Available now through 10/31, while supplies   last.    <br><u><em>Health &amp; Personal Care</em></u><em>:</em> <br><a href="https://www.amazon.com/gp/mpc/A3NOFTCEDX5J1J">30NATURALLY</a> - 30% off Naturally vitamins. Available now through 10/23/17, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/AY0HAS2EW9S2V">30SGP</a> - 30% off Sleep Great supplement. Available now through 10/19/17, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A2UU17E77J5H5D">20YEAHBUDDY</a> - 20% off Ronnie Coleman pre-workout supplement. Available now through 10/19, while supplies last. <br><a href="https://www.amazon.com/gp/mpc/A3RTWO45OOT4BZ">20OUTLIFT4U</a> - 20%   off Nutrex pre-workout supplements. Available now through 10/21, while   supplies last.    <br><a href="https://www.amazon.com/gp/mpc/A1ZQEV944CZJY4">20NUTREXDIET</a> - 20%   off Nutrex supplements. Available now through 10/31, while supplies last.    <br><a href="https://www.amazon.com/gp/mpc/A1Z60L1IH2O2HR">20ZOLLISMILE</a> - 20%   off Zollipops anti-cavity products. Available now through 11/9, while   supplies last.    <br><a href="https://www.amazon.com/gp/mpc/A1MCOZM5FFKZVZ">20VENUS</a> - 20% off   Gillette Venus with Olay women\'s razors. Available now through 11/1, while   supplies last.   <br><a href="https://www.amazon.com/gp/mpc/AV1D48DA5EEZD">20GILLETTE</a> - 20%   off Gillette Fusion shave gel. Available now through 11/1, while supplies   last. <br><a href="https://www.amazon.com/gp/mpc/A1S5ASDTGDD58B">15HS4S</a> - 15% off   iHealth Lite wireless BMI scale. Available now through 11/10, while supplies   last.<br><a href="https://www.amazon.com/gp/mpc/AOPKI8SIQRR2I">15VENUS</a> - 15% off   Gillette Venus women\'s razor. Available now through 11/1, while supplies   last.<br><a href="https://www.amazon.com/gp/mpc/AHEECJPPEG2XO">1515HEALTHY</a> - 15%   off iHealth wireless blood pressure monitor. Available now through 11/1,   while supplies last.  <br><a href="https://www.amazon.com/gp/mpc/A37GNZ1UQ6WPXJ">15GILLETTE</a> - 15%   off Gillette Mach3 men\'s razor. Available now through 11/1, while supplies   last.<br><a href="https://www.amazon.com/gp/mpc/A1AXHLNN2FPS0C">5OFFGILLETTE</a> - $5   off Gillette Fusion ProGlide men\'s razer. Available now through 11/1, while   supplies last.<br><a href="https://www.amazon.com/gp/mpc/AXS45LAIT7XQX">15SBQ4PK</a> - 15% off Sea-Band anti-nausea kit. Available now through 10/30/17, while supplies last. <br><a href="https://www.amazon.com/gp/mpc/A3494P2OETBTQY">15LOVEBEETS</a> - 15% off superfood dietary supplement. Available now through 10/31, while supplies last.    <br><u><em>Home Improvement:</em></u><br><a href="https://www.amazon.com/gp/mpc/A1SAJDNZQK0LC">20LUNA1011</a> - 20% off towel sets. Available now through 11/2, while supplies last.    <br><a href="https://www.amazon.com/gp/mpc/A1KAETI5AJR0EE">15FALL2017</a> - 15% off EcoPure water filtration systems. Available now through 10/19, while   supplies last.    <br><a href="https://www.amazon.com/gp/mpc/A273HGBP91IIYN">6COUPONOFF</a> - $6 off Pass &amp; Seymour timer. Available now through 10/30, while supplies last.    <br><a href="https://www.amazon.com/gp/mpc/A2WWWUBO3TN0NH">3COUPONOFF</a> - $3 off Pass &amp; Seymour outlet. Available now through 10/30, while supplies last.    <br><u><em>Jewelry</em></u>: <a href="https://www.amazon.com/gp/mpc/A123WQR9UY0X9R">20JEWELRY</a> - 20% off Amazon Collection wedding bands. Available now through 10/23/17, while supplies last.<br><u><em>Kitchen:</em></u> <a href="https://www.amazon.com/gp/mpc/A227RSBTU7DKFX">30TIGEROCT</a> - $30 off Tiger JAX rice cooker. Available now through 10/31, while supplies last.    <br><u><em>Lawn &amp; Garden</em></u>:<a href="https://www.amazon.com/gp/mpc/A2JUDNVXYAI4LQ">15WORX15</a> - 15% off   WORX wheelbarrow &amp; leaf mulcher. Available now through 10/25, while   supplies last. <br><u><em>Outdoors</em></u>: <br><a href="https://www.amazon.com/gp/mpc/A1R537YSONWG8S">30Y4BK6Q109</a> - 30% off Yes4All Beach Blanket. Available now through 10/23/17, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A1UMNZDF431WSY">20PALERMO</a> - 20% off oversized beach towel. Available now through 10/22, while supplies last.    <br><a href="https://www.amazon.com/gp/mpc/A3JGANB0EAZAKN">15JETS</a> - 15% off insulated cooler bag. Available now through 10/31, while supplies last.    <br><a href="https://www.amazon.com/gp/mpc/A3K9RMZMXO35VN">15Y4AHM0510</a> - 15%   off Yes4All camping hammock. Available now through 11/3, while supplies last.        <br><u><em>Pets:</em></u><em> <br></em><a href="https://www.amazon.com/gp/mpc/A3IX98IG4YCP4">20GPN</a> - 20% off   Global Pet Nutrition soft chews. Available now through 10/31, while supplies   last.    <br><a href="https://www.amazon.com/gp/mpc/ACIC0SIKH7K6X">20PETCHEER</a> - 20%   off PetCheer cat scratcher lounge bed with catnip. Available now through   11/13, while supplies last.   <br><a href="https://www.amazon.com/gp/mpc/A1SBX5FOP4C0L0">20PETCHEER59</a> - 20%   off PetCheer cat scratcher lounge bed. Available now through 11/13, while   supplies last.    <em><br></em><a href="https://www.amazon.com/gp/mpc/A3NQELV0BQIMEM">104DB</a> - $10 off Best Pet Supplies pet bed. Available now through 10/22, while supplies last.<br><u><em>Sports:</em></u> <br><a href="https://www.amazon.com/gp/mpc/A3GAXVET7GZP0">35VB800PROMO</a> - 35% off Versus Sports volleyball set. Available now through 10/20/17, while supplies last.<br><a href="https://www.amazon.com/gp/mpc/A390HRHJP04IFJ">20BPYOGAMAT</a> - 20%   off BestsharedPlus yoga mat. Available now through 11/13, while supplies   last.    <br><a href="https://www.amazon.com/gp/mpc/A1QBHYYRPBLK2A">20DRONE</a> - 20% off   Callaway golf caddy push cart. Available now through 11/4, while supplies   last.    <br><u><em>Toys:</em></u> <a href="https://www.amazon.com/gp/mpc/A1VR45B463IXNR">20GIVEGREEN</a> - 20% off Green Toys. Available now through 10/22, while supplies last.<br><u><em>Tools &amp; Industrial Supplies</em></u>:<br><a href="https://www.amazon.com/gp/mpc/A3FI5W1U8PJLSV">25CORDOVA</a> - 25% off   Stanley protective work gloves. Available now through 11/10, while supplies   last.<br><a href="https://www.amazon.com/gp/mpc/A1WWO1DU68SYEE">20CORDOVA</a> - 20% off   Stanley synthetic leather gloves. Available now through 11/10, while supplies   last.    <br><a href="https://www.amazon.com/gp/mpc/A2EBFLN4MD3BS9">18PROMO</a> - 18% off   Meyer Gage gage sets. Available now through 10/31, while supplies last.  <br><a href="https://www.amazon.com/gp/mpc/A13KVL6YNJG635">15CORDOVA</a> - 15% off   Stanley work gloves. Available now through 11/10, while supplies last. </div></div>';

var goldBoxDealsURL = 'https://rssfeeds.s3.amazonaws.com/goldbox';

var promoCodesURL = 'https://affiliate-program.amazon.com/resource-center/amazon-promo-codes-for-associates/';

console.log('Starting Up!!!');

/**
*
* Http Server
*
*/

app.set('port', (process.env.PORT || 5000));

// // views is directory for all template files
// // app.set('views', __dirname + '/views');
// // app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.writeHead(403, {'Content-Type': 'text/html'}); 

  res.write('Go Away');
  res.end();
});

app.get('/promote', function(req, res) {
  // Start process
  // parseHTML();
  // response.render('pages/index')
  // response.send( 'Running' );

  res.writeHead(200, {'Content-Type': 'text/html'}); 

  var T = new Twit( {
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret
    } );

  // a very #warmwelcome to #newestfollowers!

  var text = "{{Warm Welcome|Greetings|Hello}} to the {{newest|most recent|our Favorite|best|most awesome}} {{followers|friends|fans|Tweeters}} #{{NewestFollowers|RecentFollowers|FavoriteFollowers|TwitterFollowers|FollowBack}} ";

  var jumble = pj.build(text);
  // console.log(jumble); // Randomized Output
  // res.write(jumble);

  var db = new sqlite3.Database('./src/data/database.db');

  db.serialize(function(){

  	db.all("SELECT * FROM followers WHERE `promoted` == '' ORDER BY RANDOM() LIMIT 4", function(err, rows) {

  		var followers = [];

  		for( i=0; i < rows.length; i++){
  			// console.log(rows[i].screen_name);

  			followers.push('@'+rows[i].screen_name);
  		}

  		// console.log(followers);

  		var tweet = jumble+followers.join(', ');

  		console.log(tweet);
  		res.write(tweet);

  		var config = { status: tweet } 

  		T.post('statuses/update', config, function(err, data, response){

	    if(err){

	      console.log("Something went wrong!");

	      console.log(err.message);
	   
	    }else{

	      // res.write('Voila It worked!');

	      for( i=0; i < rows.length; i++){
  			// console.log(rows[i].screen_name);

	  			var stmt = db.prepare('UPDATE `followers` SET `promoted` = datetime("now"),`date_updated` =datetime("now") WHERE `ID` = (?);');
				stmt.run( rows[i].ID );
				stmt.finalize();
	  			
	  		}

	  		res.write('Voila It worked!');

	  		res.end(); 
	  		db.close();
	     
	    }


	    }); // this is how we actually post a tweet ,again takes three params 'statuses/update' , tweet message and a call back function


  		// console.log('INSERT OR REPLACE INTO `followers` (`ID`,`promoted`,`date_updated`) VALUES ( (SELECT `ID` FROM `followers` WHERE `ID` IN ( '+ids+' ) ), datetime("now"), datetime("now") );');

  		
  	});

  });

  	

}); // end get /promote

app.get('/followers', function(req, res) {
  // Start process
  // parseHTML();
  // response.render('pages/index')
  // response.send( 'Running' );

  res.writeHead(200, {'Content-Type': 'text/html'}); 

  var T = new Twit( {
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret
    } );

  	//
	//  search twitter for all tweets containing the word '#coupon'
	//
	T.get('followers/list', { user_id: '62594950', count: 10, skip_status: 1 }, function(error, data, response) {
	  // console.log(data);
	  // console.log(data.statuses.length);
	  // console.log(response);

	  if( data != undefined && !error && response.statusCode == 200 && data.users.length != 0 ){

	  	// res.write(JSON.stringify(data));	
	  	
	  	// console.log(data.users[0]);

	  	console.log( 'Followers: ' + data.users.length );

	  	var db = new sqlite3.Database('./src/data/database.db');

	  	for( i=0; i < data.users.length; i++){

	  		var follower = data.users[i];

		  	var stmt = db.prepare('INSERT OR REPLACE INTO `followers` (`ID`,`id_str`,`name`,`screen_name`,`followers_count`,`friends_count`,`following`,`date_created`,`date_updated`) VALUES ( (SELECT `ID` FROM `followers` WHERE `id_str` == (?)), (?), (?), (?), (?), (?), (?), COALESCE((SELECT `date_created` FROM `followers` WHERE `id_str` == (?)), datetime("now") ), datetime("now") );');

			stmt.run( follower.id_str, follower.id_str, follower.name, follower.screen_name, follower.followers_count, follower.friends_count, process.env.twitter_handle, follower.id_str );

			stmt.finalize();

			console.log(follower.name);
			console.log(follower.screen_name);

			res.write(JSON.stringify(follower.screen_name));	

	  	}

		db.close();
	  	
	  	res.end();
	  	
	  } // end if
	  else if( error )
	  {
		console.log(error);	
		console.log(data);
		console.log(response.statusCode);

		res.write(error);
		res.end();
	  }
	  

	}); // end followers/list


}); // end get /followers

app.get('/create', function(req, res) {
  // Start process
  
  res.writeHead(200, {'Content-Type': 'text/html'}); 

  console.log('Starting List Create');

  var T = new Twit( {
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret
    } );

  	var name = 'Contests-and-Raffles';
  	var description = 'Enter to win tons of free contest and raffles.';

  	return;

  	//
	//  Creates a new list for the authenticated user. Note that you can create up to 1000 lists per account.
	//
	T.post('lists/create', { name: name, description: description  }, function(error, data, response) {
	  // console.log(data);
	  // console.log(data.statuses.length);
	  // console.log(response);

	  if( data != undefined && !error && response.statusCode == 200 ){
	  	// res.write(JSON.stringify(data));	
	  	
 		  console.log(data);

	  	
	  } // end if
	  else if( data != undefined && !error )
	   {
			console.log(response.statusCode);
			res.write(response.statusCode);
			res.end(); 			

	   }	
	  else if( error )
	  {
		console.log(error);	
		console.log(data);
		console.log(response.statusCode);
		console.log(response.statusCode);
		res.write(response.statusCode);
		res.end();
	  }
	  

	}); // end search/tweets


}); // end get /create

app.get('/contest', function(req, res) {
  // Start process
  
  res.writeHead(200, {'Content-Type': 'text/html'}); 

  console.log('Starting.... /contest');
  res.write( 'Starting.... /contest' );	


  var T = new Twit( {
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret
    } );

  	//
	//  search twitter for all tweets containing the word '#contest'
	//
	T.get('search/tweets', { q: '#contest enter', count: 1, result_type: 'recent' }, function(error, data, response) {
	  // console.log(data);
	  // console.log(data.statuses.length);
	  // console.log(response);

	  if( data != undefined && !error && response.statusCode == 200 && data.statuses.length != 0 && data.statuses[0].retweeted_status == undefined ){
	  	// res.write(JSON.stringify(data));	
	  	
	  	var status = data.statuses[0];

	  	// console.log(status);

	  	console.log(status.text);
	  	res.write( 'Tweet: ' + status.text );	

	  	var id = status.id_str;

	  	// res.write( status.user.id_str );	
	  	res.write( 'User: ' + status.user.name );	
	  	// console.log( status.user.screen_name );	
	  	res.write( 'Screen Name: ' + status.user.screen_name );	

	  	T.post('friendships/create', { user_id: status.user.id_str }, function(error, data, response) {

	  		// console.log(data);
	  		// console.log(response);

	  		if( data != undefined && !error && response.statusCode == 200 ){

	  			// console.log(response);
	  			console.log(data.following);
	  			res.write( 'Following Status: ' + data.following );	

				// id: 929158451766353920,
				// id_str: '929158451766353920',
				// name: 'Contests-and-Raffles',
				// uri: '/vannscontests/lists/contests-and-raffles',


				// id: 15188191,
				// id_str: '15188191',
				// name: 'Contests, Jackpots & more',
				// screen_name: 'vannscontests',
				

				T.post('lists/members/create', { list_id: '929158451766353920', owner_id: '15188191', user_id: status.user.id_str, screen_name: status.user.screen_name }, function(error, data, response) {

			  		// console.log(data);
			  		// console.log(response);

			  		if( data != undefined && !error && response.statusCode == 200 ){

			  			// console.log(response);
			  			console.log( data.member_count );
			  			res.write( 'Member Count: '+data.member_count );	
			  			// console.log(data);

			  			T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
						  if( data != undefined && !error && response.statusCode == 200 ){
			  			  	  // console.log(data);
			  			  	  console.log(response.statusCode);
							  res.write( 'Retweeted!');	
							  res.end();
			  			  }
			  			  else if( error )
						  {
							console.log(error);	
							res.write(response.statusCode);
							res.end();  			
						  }
						})

			  		}
			  		else if( error )
			  		{
						console.log(error);	  			

						console.log('Reweet Failed');
						res.write( 'Reweet Failed' );	

						res.end();	
			  		}
			  	
			  	}); // end tweet



	  		}
	  		else if( error )
	  		{
				console.log(error);	  			
	  		}

	  		// res.end();	

	  	});
	  	
	  } // end if
	  else if( data.statuses != undefined && data.statuses.length != 0 && data.statuses[0].retweeted_status != undefined )
	  {

	  	var status = data.statuses[0]; 

	  	console.log('A ReTweet');
		// console.log(data.statuses[0]);
		res.write('A Retweet');

		console.log(status.text);
	  	res.write( 'Tweet: ' + status.text );	
		res.end();
	  }
	  else if( error )
	  {
		console.log(error);	
		console.log(data);
		console.log(response.statusCode);

		res.write(response.statusCode);
		res.end();
	  }
	  

	}); // end search/tweets


}); // end get /contest

app.get('/retweet', function(req, res) {
  // Start process
  
  res.writeHead(200, {'Content-Type': 'text/html'}); 

  console.log('Starting.... /retweet');
  res.write( 'Starting.... /retweet' );	

  var T = new Twit( {
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret
    } );

  	//
	//  search twitter for all tweets containing the word '#coupon'
	//
	T.get('search/tweets', { q: '#contest enter', count: 1, result_type: 'recent' }, function(error, data, response) {
	  // console.log(data);
	  // console.log(data.statuses.length);
	  // console.log(response);

	  if( data != undefined && !error && response.statusCode == 200 && data.statuses.length != 0 &&  data.statuses[0].retweeted_status != undefined ){
	  	// res.write(JSON.stringify(data));	
	  	
	  	var status = data.statuses[0];

	  	// console.log(status);

	  	console.log('Tweet: ' +status.text);
	  	res.write( 'Tweet: ' + status.text );	


	  	// res.write( status.user.id_str );	
	  	console.log( 'User: ' + status.user.name );	
	  	res.write( 'User: ' + status.user.name );	
	  	// console.log( status.user.screen_name );	
	  	console.log( 'Screen Name: ' + status.user.screen_name );	
	  	res.write( 'Screen Name: ' + status.user.screen_name );	
	  	

	  	var status = data.statuses[0].retweeted_status;

	  	// console.log(status.text);
	  	console.log( 'Original Tweet: ' + status.text );	
	  	res.write( 'Original Tweet: ' + status.text );	

	  	// retweeted id
	  	var id = status.id_str;

	  	// res.write( status.user.id_str );	
	  	console.log( 'Original User: ' + status.user.name );	
	  	res.write( 'Original User: ' + status.user.name );	
	  	// console.log( status.user.screen_name );	
	  	console.log( 'Original Screen Name: ' + status.user.screen_name );	
	  	res.write( 'Original Screen Name: ' + status.user.screen_name );	

	  	T.post('friendships/create', { user_id: status.user.id_str }, function(error, data, response) {

	  		// console.log(data);
	  		// console.log(response);

	  		if( data != undefined && !error && response.statusCode == 200 ){

	  			// console.log(response);
	  			console.log('Following Status: ' +data.following);
	  			res.write( 'Following Status: ' + data.following );	

  				// id: 929158451766353920,
				// id_str: '929158451766353920',
				// name: 'Contests-and-Raffles',
				// uri: '/vannscontests/lists/contests-and-raffles',


				// id: 15188191,
				// id_str: '15188191',
				// name: 'Contests, Jackpots & more',
				// screen_name: 'vannscontests',


				T.post('lists/members/create', { list_id: '929158451766353920', owner_id: '15188191', user_id: status.user.id_str, screen_name: status.user.screen_name }, function(error, data, response) {

			  		// console.log(data);
			  		// console.log(response);

			  		if( data != undefined && !error && response.statusCode == 200 ){

			  			// console.log(response);
			  			console.log( 'Member Count: '+data.member_count );
			  			res.write( 'Member Count: '+data.member_count );	
			  			// console.log(data);

			  			T.post('statuses/retweet/:id', { id: id }, function(error, data, response) {
						  
			  			  if( data != undefined && !error && response.statusCode == 200 ){
			  			  	  // console.log(data);
			  			  	  console.log('Status Code: '+response.statusCode);
							  
							  res.write( 'Retweeted!');	
							  console.log( 'Retweeted!');	

							  res.end();
			  			  }
			  			  else if( error )
						  {
							console.log(error);	
							
							res.write('Status Code: '+response.statusCode);
							console.log('Status Code: '+response.statusCode);

							res.end();  			
						  }
						  
						});

			  		}
			  		else if( error )
			  		{
						console.log(error);	
						res.write(response.statusCode);
						res.end();  			
			  		}

			  	});

	  		}
	  		else if( data != undefined && !error )
	  		{
	  			console.log(response.statusCode);
	  			res.write(response.statusCode);
	  			res.end(); 			

	  		}	
	  		else if( error )
	  		{
				console.log(error);	
				res.write(JSON.stringify(error)); 
				res.end(); 			
	  		}

	  		// res.end();	

	  	});
	  	
	  } // end if
	  else if( data.statuses != undefined && data.statuses.length != 0 && data.statuses[0].retweeted_status == undefined )
	  {

	  	var status = data.statuses[0]; 

	  	console.log('Not a ReTweet');
		// console.log(data.statuses[0]);
		res.write('Not a Retweet');

		console.log(status.text);
	  	res.write( 'Tweet: ' + status.text );	

		res.end();
	  }
	  else if( error )
	  {
		console.log(error);	
		console.log(data);
		console.log(response.statusCode);

		res.write( response.statusCode );	
		res.end();
	  }
	  

	}); // end search/tweets


}); // end get /retweet

app.get('/giveaway', function(req, res) {
  // Start process
  
  res.writeHead(200, {'Content-Type': 'text/html'}); 

  var T = new Twit( {
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret
    } );

  	//
	//  search twitter for all tweets containing the word '#coupon'
	//
	T.get('search/tweets', { q: '#giveaway', count: 1, result_type: 'recent' }, function(error, data, response) {
	  // console.log(data);
	  // console.log(data.statuses.length);
	  // console.log(response);

	  if( data != undefined && !error && response.statusCode == 200 && data.statuses.length != 0 && data.statuses[0].retweeted_status == undefined ){
	  	// res.write(JSON.stringify(data));	
	  	
	  	var status = data.statuses[0];

	  	// console.log(status);

	  	console.log(status.text);
	  	res.write( 'Tweet: ' + status.text );	


	  	// res.write( status.user.id_str );	
	  	res.write( 'User: ' + status.user.name );	
	  	// console.log( status.user.screen_name );	
	  	res.write( 'Screen Name: ' + status.user.screen_name );	

	  	T.post('friendships/create', { user_id: status.user.id_str }, function(error, data, response) {

	  		// console.log(data);
	  		// console.log(response);

	  		if( data != undefined && !error && response.statusCode == 200 ){

	  			// console.log(response);
	  			console.log(data.following);
	  			res.write( 'Following Status: ' + data.following );	

  				// id: 927408685214658561,
				// id_str: '927408685214658561',
				// name: 'Free-Shipping-Codes',
				// uri: '/vannscoupons/lists/free-shipping-codes',


				// id: 15188045,
				//  id_str: '15188045',
				//  name: 'Promo Deals & Offers',
				//  screen_name: 'vannscoupons',


				T.post('lists/members/create', { list_id: '927408685214658561', owner_id: '15188045', user_id: status.user.id_str, screen_name: status.user.screen_name }, function(error, data, response) {

			  		// console.log(data);
			  		// console.log(response);

			  		if( data != undefined && !error && response.statusCode == 200 ){

			  			// console.log(response);
			  			console.log( data.member_count );
			  			res.write( 'Member Count: '+data.member_count );	
			  			// console.log(data);

			  		}
			  		else if( error )
			  		{
						console.log(error);	  			
			  		}

			  		res.end();	

			  	});



	  		}
	  		else if( error )
	  		{
				console.log(error);	  			
	  		}

	  		// res.end();	

	  	});
	  	
	  } // end if
	  else if( data.statuses != undefined && data.statuses.length != 0 && data.statuses[0].retweeted_status != undefined )
	  {

	  	var status = data.statuses[0]; 

	  	console.log('A ReTweet');
		// console.log(data.statuses[0]);
		res.write('A Retweet');

		console.log(status.text);
	  	res.write( 'Tweet: ' + status.text );	
		res.end();
	  }
	  else if( error )
	  {
		console.log(error);	
		console.log(data);
		console.log(response.statusCode);

		console.log(response.statusCode);
		res.end();
	  }
	  

	}); // end search/tweets


}); // end get /giveaway

app.get('/coupon', function(req, res) {
  // Start process
  // parseHTML();
  // response.render('pages/index')
  // response.send( 'Running' );

  res.writeHead(200, {'Content-Type': 'text/html'}); 

  var T = new Twit( {
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret
    } );

  	//
	//  search twitter for all tweets containing the word '#coupon'
	//
	T.get('search/tweets', { q: '#coupon', count: 1, result_type: 'recent' }, function(error, data, response) {
	  // console.log(data);
	  // console.log(data.statuses.length);
	  // console.log(response);

	  if( data != undefined && !error && response.statusCode == 200 && data.statuses.length != 0 ){
	  	// res.write(JSON.stringify(data));	
	  	
	  	var status = data.statuses[0];

	  	console.log(status.text);
	  	res.write( 'Tweet: ' + status.text );	

	  	// res.write( status.user.id_str );	
	  	res.write( 'User: ' + status.user.name );	
	  	// console.log( status.user.screen_name );	
	  	res.write( 'Screen Name: ' + status.user.screen_name );	

	  	T.post('friendships/create', { user_id: status.user.id_str }, function(error, data, response) {

	  		// console.log(data);
	  		// console.log(response);

	  		if( data != undefined && !error && response.statusCode == 200 ){

	  			// console.log(response);
	  			console.log(data.following);
	  			res.write( 'Following Status: ' + data.following );	

  				// id: 926944341066596400,
  				// id_str: '926944341066596352',
				// name: 'Coupons-For-Everyone',
				// uri: '/vannscoupons/lists/coupons-for-everyone',

				// id: 62594950,
				//  id_str: '62594950',
				//  name: 'Promo Deals & Offers',
				//  screen_name: 'vannscoupons',


				T.post('lists/members/create', { list_id: '926944341066596352', owner_id: '62594950', user_id: status.user.id_str, screen_name: status.user.screen_name }, function(error, data, response) {

			  		// console.log(data);
			  		// console.log(response);

			  		if( data != undefined && !error && response.statusCode == 200 ){

			  			// console.log(response);
			  			console.log( data.member_count );
			  			res.write( 'Member Count: '+data.member_count );	
			  			// console.log(data);

			  		}
			  		else if( error )
			  		{
						console.log(error);	  			
			  		}

			  		res.end();	

			  	});



	  		}
	  		else if( error )
	  		{
				console.log(error);	  			
	  		}

	  		// res.end();	

	  	});
	  	
	  } // end if
	  else if( error )
	  {
		console.log(error);	
		console.log(data);
		console.log(response.statusCode);
	  }
	  

	}); // end search/tweets


}); // end get /coupon


app.get('/friday', function(req, res) {
  // Start process
  // parseHTML();
  // response.render('pages/index')
  // response.send( 'Running' );

  res.writeHead(200, {'Content-Type': 'text/html'}); 

  var T = new Twit( {
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret
    } );

	var blackFridayTag = blackFridayTags[getRandomRange(0,blackFridayTags.length)];

	console.log(blackFridayTag);

  	//
	//  search twitter for all tweets containing the word 'banana' since July 11, 2011
	//
	T.get('search/tweets', { q: blackFridayTag, count: 1, result_type: 'recent' }, function(error, data, response) {
	  // console.log(data);
	  // console.log(data.statuses.length);
	  // console.log(response);

	  if( data != undefined && !error && response.statusCode == 200 && data.statuses.length != 0 ){
	  	// res.write(JSON.stringify(data));	
	  	
	  	var status = data.statuses[0];

	  	console.log(status.text);
	  	res.write( 'Tweet: ' + status.text );	

	  	// res.write( status.user.id_str );	
	  	res.write( 'User: ' + status.user.name );	
	  	// console.log( status.user.screen_name );	
	  	res.write( 'Screen Name: ' + status.user.screen_name );	

	  	T.post('friendships/create', { user_id: status.user.id_str }, function(error, data, response) {

	  		// console.log(data);
	  		// console.log(response);

	  		if( data != undefined && !error && response.statusCode == 200 ){

	  			// console.log(response);
	  			console.log(data.following);
	  			res.write( 'Following Status: ' + data.following );	

  				// id_str: '926908877945241600',
				// name: 'Black-Friday-Savings',
				// uri: '/vannscoupons/lists/black-friday-savings',

				// id: 62594950,
				//  id_str: '62594950',
				//  name: 'Promo Deals & Offers',
				//  screen_name: 'vannscoupons',


				T.post('lists/members/create', { list_id: '926908877945241600', owner_id: '62594950', user_id: status.user.id_str, screen_name: status.user.screen_name }, function(error, data, response) {

			  		// console.log(data);
			  		// console.log(response);

			  		if( data != undefined && !error && response.statusCode == 200 ){

			  			// console.log(response);
			  			console.log( data.member_count );
			  			res.write( 'Member Count: '+data.member_count );	
			  			// console.log(data);

			  		}
			  		else if( error )
			  		{
						console.log(error);	  			
			  		}

			  		res.end();	

			  	});



	  		}
	  		else if( error )
	  		{
				console.log(error);	  			
	  		}

	  		// res.end();	

	  	});
	  	
	  } // end if
	  else if( error )
	  {
		console.log(error);	
		console.log(data);
		console.log(response.statusCode);
	  }
	  

	}); // end search/tweets


}); // end get /friday



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function statusUpdate( category, description, shortURL ){

  var statusUpdate = '';

  var optionalTag = (getRandomRange(0,tags.length) > 5)?' '+ tags[getRandomRange(0,tags.length)] +' ':'';

  var maxLength = 139 - ( category.length + 2 + shortURL.length + optionalTag.length );

  statusUpdate = category + ': ' + trimWords(description, maxLength) + optionalTag + shortURL;

  return statusUpdate;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getRandomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function trimWords(description, maxLength){
	description = description.replace(/\s\s+/g, ' ')

	description = description.substring(0, maxLength);

	var length = maxLength;
	// console.log(length);
	for (var i = maxLength - 1; i >= 0; i--) {
		if(description[i] == ' '){
			length = i;
			break;
		}	
	};
	// console.log(length);

	return description.substring(0, length);
}