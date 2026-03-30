const fs = require('fs');
let content = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

content = content.replace(
  "redirectTo: `${window.location.origin}/home`",
  "redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`"
);

fs.writeFileSync('src/pages/Auth.tsx', content);
