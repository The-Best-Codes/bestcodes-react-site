import { AccordionItem } from "../types/accordion";

export const generateHTML = (
  header: string,
  subheader: string,
  description: string,
  items: AccordionItem[],
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${header}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <style>
    .my-accordion .menu { background-color: #d5d5d5; color: #444; cursor: pointer; padding: 12px; width: 100%; text-align: left; border: none; outline: none; margin-top: 4px; border-radius: 8px; font-size: 1.5em; }
    .my-accordion .panel { background-color: #FFFFFF; color: #000000; overflow: hidden; }
    .my-accordion .open { display: block; }
    .my-accordion .close { display: none; }
    .my-accordion .active { background-color: #1b90bb; color: #fff; }
    .my-accordion .arrow { float: right; display: block; }
    .my-accordion .darrow { display: none; }
    .my-accordion .active .darrow { display: block; }
    .my-accordion .active .rarrow { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="jumbotron">
      <h1>${header}</h1>
      <h3><strong><span style="color:#FF0000;">${subheader}</span></strong></h3>
      <div><span style="font-size:18px;">${description}</span></div>
      <br />
      <div class="my-accordion">
        ${
    items
      .map(
        (item) => `
          <button class="menu" data-editor-id="${item.id}">${item.question}<span class="arrow rarrow">+</span><span class="arrow darrow">-</span></button>
          <div class="panel close">
            <div style="padding:10px">${item.answer}</div>
          </div>
        `,
      )
      .join("")
  }
      </div>
    </div>
  </div>
  <script>
    !function(){for(var l=document.querySelectorAll(".my-accordion .menu"),e=0;e<l.length;e++)l[e].addEventListener("click",n);function n(){for(var e=document.querySelectorAll(".my-accordion .panel"),n=0;n<e.length;n++)e[n].className="panel close";if(-1==this.className.indexOf("active")){for(n=0;n<l.length;n++)l[n].className="menu";this.className="menu active",this.nextElementSibling.className="panel open"}else for(n=0;n<l.length;n++)l[n].className="menu"}}();
  </script>
</body>
</html>
`;
};
