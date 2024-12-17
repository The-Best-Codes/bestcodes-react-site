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
    .my-accordion .menu {
      background-color: #eaeaea;
      color: #333;
      cursor: pointer;
      padding: 16px;
      width: 100%;
      text-align: left;
      border: none;
      outline: none;
      margin-top: 8px;
      border-radius: 8px;
      font-size: 1.2em;
      transition: all 0.3s ease;
    }
    .my-accordion .panel {
      background-color: #FFFFFF;
      color: #333;
      overflow: hidden;
      padding: 0 16px;
      border-radius: 0 0 8px 8px;
    }
    .my-accordion .open {
      display: block;
      padding: 16px;
    }
    .my-accordion .close { display: none; }
    .my-accordion .active {
      background-color: #2563eb;
      color: #fff;
      border-radius: 8px 8px 0 0;
    }
    .my-accordion .arrow {
      float: right;
      display: block;
      transition: transform 0.3s ease;
    }
    .my-accordion .darrow { display: none; }
    .my-accordion .active .darrow { display: block; }
    .my-accordion .active .rarrow { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="jumbotron">
      <h1>${header}</h1>
      <h3><strong><span style="color:#2563eb;">${subheader}</span></strong></h3>
      <div><span style="font-size:18px;">${description}</span></div>
      <br />
      <div class="my-accordion">
        ${items
          .map(
            (item) => `
          <button class="menu" data-editor-id="${item.id}">
            ${item.question}
            <span class="arrow rarrow">+</span>
            <span class="arrow darrow">-</span>
          </button>
          <div class="panel close">
            <div>${item.answer}</div>
          </div>
        `,
          )
          .join("")}
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
