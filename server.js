//----------------------------------------------------------------------------//
// MODULE IMPORTS
//----------------------------------------------------------------------------//
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const qs      = require('querystring');
const http    = require('http');

const html_color_codes = ['none','black','navy','darkblue','mediumblue','blue','darkgreen','green','teal','darkcyan','deepskyblue','darkturquoise','mediumspringgreen','lime','springgreen','aqua','cyan','midnightblue','dodgerblue','lightseagreen','forestgreen','seagreen','darkslategray','darkslategrey','limegreen','mediumseagreen','turquoise','royalblue','steelblue','darkslateblue','mediumturquoise','indigo','darkolivegreen','cadetblue','cornflowerblue','rebeccapurple','mediumaquamarine','dimgray','dimgrey','slateblue','olivedrab','slategray','slategrey','lightslategray','lightslategrey','mediumslateblue','lawngreen','chartreuse','aquamarine','maroon','purple','olive','gray','grey','skyblue','lightskyblue','blueviolet','darkred','darkmagenta','saddlebrown','darkseagreen','lightgreen','mediumpurple','darkviolet','palegreen','darkorchid','yellowgreen','sienna','brown','darkgray','darkgrey','lightblue','greenyellow','paleturquoise','lightsteelblue','powderblue','firebrick','darkgoldenrod','mediumorchid','rosybrown','darkkhaki','silver','mediumvioletred','indianred','peru','chocolate','tan','lightgray','lightgrey','thistle','orchid','goldenrod','palevioletred','crimson','gainsboro','plum','burlywood','lightcyan','lavender','darksalmon','violet','palegoldenrod','lightcoral','khaki','aliceblue','honeydew','azure','sandybrown','wheat','beige','whitesmoke','mintcream','ghostwhite','salmon','antiquewhite','linen','lightgoldenrodyellow','oldlace','red','fuchsia','magenta','deeppink','orangered','tomato','hotpink','coral','darkorange','lightsalmon','orange','lightpink','pink','gold','peachpuff','navajowhite','moccasin','bisque','mistyrose','blanchedalmond','papayawhip','lavenderblush','seashell','cornsilk','lemonchiffon','floralwhite','snow','yellow','lightyellow','ivory','white'];

const free_icons = require('@fortawesome/free-solid-svg-icons');
const brand_icons = require('@fortawesome/free-brands-svg-icons');
const combined_icons = {...free_icons,...brand_icons};

const all_icons = {};
for (let i in combined_icons) {
  let icon = combined_icons[i];
  if (combined_icons[i].iconName !== undefined) {
    let iconName = icon.iconName;
    let svg = {width:icon.icon[0],height:icon.icon[1],path:icon.icon[4],name:iconName};
    all_icons[iconName] = svg;
  }
}

//----------------------------------------------------------------------------//
// SERVER SETUP
//----------------------------------------------------------------------------//

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json()); // header: application/json

//----------------------------------------------------------------------------//
// FUNCTION RESOURCE SETUP
//----------------------------------------------------------------------------//

function get_icon(req,res) {
  let stroke = req.params.stroke || req.params.color;  
  let stroke_width = req.params.stroke_width || 0;
  let icon  = req.params.icon || 'question';
  let color  = req.params.color ;

  if (html_color_codes.indexOf(color) === -1) {
    color = `#${color}`;
  } 
  if (html_color_codes.indexOf(stroke) === -1) {
    stroke = `#${stroke}`;
  } 
  let {path,width,height} = all_icons[icon];
  let svg_image = `<?xml version="1.0" encoding="utf-8"?><svg width="${width}" height="${height}" viewBox="-10 -10 ${width+20} ${height+20}" xmlns="http://www.w3.org/2000/svg"><path stroke-width="${stroke_width}"  stroke="${stroke}" d="${path}" fill="${color}"/></svg>`;
  res.type('image/svg+xml');
  res.send(svg_image);
}

app.get('/:icon/:color/:stroke/:stroke_width', (req, res) => {
  get_icon(req,res);
});

app.get('/:icon/:color', (req, res) => {
  get_icon(req,res);
});

//----------------------------------------------------------------------------//
// SERVER HOSTING
//----------------------------------------------------------------------------//

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`TroopTravel Icon Server listening on port ${PORT}...`);
});

//----------------------------------------------------------------------------//

