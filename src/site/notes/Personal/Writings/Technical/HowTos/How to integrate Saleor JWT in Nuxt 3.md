---
{"title":"How to integrate Saleor JWT in Nuxt 3","aliases":["How to integrate Saleor JWT in Nuxt 3"],"created":"2024-04-29T10:26:43+06:00","updated":"2025-06-21T22:37:33+06:00","dg-publish":true,"dg-note-icon":"chest","tags":["technical","how-to","nuxt3","nuxt","apollo","graphql","saleor","jwt","django"],"dg-path":"Writings/Technical/HowTos/How to integrate Saleor JWT in Nuxt 3.md","permalink":"/writings/technical/how-tos/how-to-integrate-saleor-jwt-in-nuxt-3/","dgPassFrontmatter":true,"noteIcon":"chest"}
---

[Saleor](https://saleor.io) uses [JWT Authentication](https://docs.saleor.io/docs/3.x/api-usage/authentication) which is very easy to integrate in nuxt. Call the login API, get the token, and call the `onLogin` in [NuxtApollo](https://apollo.nuxtjs.org/recipes/authentication). Straightforward, isn't it?

The real challenge is to secure the Refresh Token. Ideally, Refresh Tokens are sensitive and **should be stored in secure HTTP cookies**, it shouldn't be transported to the frontend javascript at all.

## Implementation
### Login
We will start by implementing the login. The flow is roughly like this:
<style> .container {font-family: sans-serif; text-align: center;} .button-wrapper button {z-index: 1;height: 40px; width: 100px; margin: 10px;padding: 5px;} .excalidraw .App-menu_top .buttonList { display: flex;} .excalidraw-wrapper { height: 800px; margin: 50px; position: relative;} :root[dir="ltr"] .excalidraw .layer-ui__wrapper .zen-mode-transition.App-menu_bottom--transition-left {transform: none;} </style><script src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script><script src="https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js"></script><script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0/dist/excalidraw.production.min.js"></script><div id="JWTexcalidraw.md1"></div><script>(function(){const InitialData={"type":"excalidraw","version":2,"source":"https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/2.12.4","elements":[{"points":[[0,0],[-246.8663013317563,0],[-214.26229605984966,-95.96585212589889],[32.39673071212181,-95.96585212589889],[32.39673071212181,-95.3557651262226],[0,0]],"lastCommittedPoint":null,"startBinding":null,"endBinding":null,"startArrowhead":null,"endArrowhead":null,"id":"EWQyvjlZ","type":"line","x":-331.7817471194495,"y":-248.09325543978042,"width":279.26303204387807,"height":95.96585212589889,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"roundness":null,"seed":72886,"version":153,"versionNonce":555612512,"updated":1750499247728,"isDeleted":false,"groupIds":["c5tkAwXrUB-z5KVo-YDf4","Af92TvYlAsF_3LKwIczPH"],"boundElements":[],"link":null,"locked":false,"polygon":true,"index":"aJ","frameId":null},{"id":"0Yy49nL9","type":"text","x":-550.0714490042635,"y":-324.7966930794077,"width":222.11895751953125,"height":56.90039062500003,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["c5tkAwXrUB-z5KVo-YDf4","Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aK","roundness":null,"seed":124554400,"version":226,"versionNonce":836226400,"isDeleted":false,"boundElements":[{"id":"J97aAJtY7gZDjpYJCYZ7l","type":"arrow"}],"updated":1750499247728,"link":null,"locked":false,"text":"Request login with credentials\n(and optionally\nadditional data query)","rawText":"Request login with credentials\n(and optionally\nadditional data query)","fontSize":15.17343750000001,"fontFamily":5,"textAlign":"center","verticalAlign":"top","containerId":null,"originalText":"Request login with credentials\n(and optionally\nadditional data query)","autoResize":true,"lineHeight":1.25},{"id":"CRNB1Cna2t0uOqnIwnB9U","type":"rectangle","x":-234.82962823783237,"y":-330.2835189414356,"width":234.53125,"height":71.0703125,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Z696HB3AL0qTWor_ZMl_g","Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aL","roundness":{"type":3},"seed":91720032,"version":157,"versionNonce":1468790112,"isDeleted":false,"boundElements":[{"id":"2Jmp1vAS9AP6FQxYMZbhR","type":"arrow"}],"updated":1750499247728,"link":null,"locked":false},{"id":"sW80Xn2m","type":"text","x":-220.23994470511752,"y":-312.2483626914356,"width":205.3518829345703,"height":35,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Z696HB3AL0qTWor_ZMl_g","Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aM","roundness":null,"seed":964042912,"version":105,"versionNonce":1817582944,"isDeleted":false,"boundElements":[{"id":"J97aAJtY7gZDjpYJCYZ7l","type":"arrow"},{"id":"3_0qKUisiyvO0oB_bNcYP","type":"arrow"}],"updated":1750499247728,"link":null,"locked":false,"text":"/api/auth/login","rawText":"/api/auth/login","fontSize":28,"fontFamily":5,"textAlign":"center","verticalAlign":"top","containerId":null,"originalText":"/api/auth/login","autoResize":true,"lineHeight":1.25},{"id":"J97aAJtY7gZDjpYJCYZ7l","type":"arrow","x":-316.20462823783237,"y":-297.1194564414356,"width":88.015625,"height":0.4453125,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aN","roundness":{"type":2},"seed":1095156064,"version":165,"versionNonce":836833632,"isDeleted":false,"boundElements":[],"updated":1750499307382,"link":null,"locked":false,"points":[[0,0],[88.015625,-0.4453125]],"lastCommittedPoint":null,"startBinding":{"elementId":"0Yy49nL9","focus":-0.005226043793011446,"gap":11.747863246899897},"endBinding":{"elementId":"sW80Xn2m","focus":0.1873588534517885,"gap":7.949058532714844},"startArrowhead":null,"endArrowhead":"arrow","elbowed":false},{"id":"nGrwSy6rYp-eExYTVpavc","type":"rectangle","x":-193.98587823783237,"y":-141.9514876914356,"width":143.77734375,"height":134.29296875,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"#b2f2bb","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["os4FpGmg9pidJKYs_j2Ob","Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aO","roundness":{"type":3},"seed":117031072,"version":277,"versionNonce":221015392,"isDeleted":false,"boundElements":[{"id":"dWM9QPkMYY3gmdkLIaU_M","type":"arrow"},{"id":"2Jmp1vAS9AP6FQxYMZbhR","type":"arrow"}],"updated":1750499247728,"link":null,"locked":false},{"id":"7jB3vdKe","type":"text","x":-163.70518518363315,"y":-92.3050033164356,"width":83.21595764160156,"height":35,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"#b2f2bb","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["os4FpGmg9pidJKYs_j2Ob","Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aP","roundness":null,"seed":736720032,"version":197,"versionNonce":1765730656,"isDeleted":false,"boundElements":[],"updated":1750499247728,"link":null,"locked":false,"text":"Saleor","rawText":"Saleor","fontSize":28,"fontFamily":5,"textAlign":"center","verticalAlign":"top","containerId":null,"originalText":"Saleor","autoResize":true,"lineHeight":1.25},{"id":"dWM9QPkMYY3gmdkLIaU_M","type":"arrow","x":-118.00540948783237,"y":-259.5335189414356,"width":0.7810092504419828,"height":113.26953125,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"#b2f2bb","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aQ","roundness":{"type":2},"seed":1747043488,"version":452,"versionNonce":1786242400,"isDeleted":false,"boundElements":[{"type":"text","id":"4XAR1iIR"}],"updated":1750499307382,"link":null,"locked":false,"points":[[0,0],[-0.46875,52.4453125],[0.31225925044198277,113.26953125]],"lastCommittedPoint":null,"startBinding":null,"endBinding":{"elementId":"nGrwSy6rYp-eExYTVpavc","focus":0.07314855431066761,"gap":4.3125},"startArrowhead":null,"endArrowhead":"arrow","elbowed":false},{"id":"4XAR1iIR","type":"text","x":-195.2260973540433,"y":-227.0882064414356,"width":153.50387573242188,"height":40,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"#b2f2bb","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aR","roundness":null,"seed":1654302048,"version":75,"versionNonce":1021055328,"isDeleted":false,"boundElements":[],"updated":1750499247728,"link":null,"locked":false,"text":"Request for tokens\nand additional data","rawText":"Request for tokens and additional data","fontSize":16,"fontFamily":5,"textAlign":"center","verticalAlign":"middle","containerId":"dWM9QPkMYY3gmdkLIaU_M","originalText":"Request for tokens and additional data","autoResize":true,"lineHeight":1.25},{"id":"2Jmp1vAS9AP6FQxYMZbhR","type":"arrow","x":-192.46634698783237,"y":-80.2678939414356,"width":73.1171875,"height":177.4453125,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"#b2f2bb","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aS","roundness":{"type":2},"seed":711299232,"version":418,"versionNonce":1225133408,"isDeleted":false,"boundElements":[{"type":"text","id":"BIB1cajy"}],"updated":1750499307383,"link":null,"locked":false,"points":[[0,0],[-73.1171875,-84.21875],[-24,-177.4453125]],"lastCommittedPoint":null,"startBinding":{"elementId":"nGrwSy6rYp-eExYTVpavc","focus":-0.5041045275110102,"gap":1.51953125},"endBinding":{"elementId":"CRNB1Cna2t0uOqnIwnB9U","focus":0.5838036321755221,"gap":1.5},"startArrowhead":null,"endArrowhead":"arrow","elbowed":false},{"id":"BIB1cajy","type":"text","x":-291.91951776419955,"y":-174.4866439414356,"width":52.671966552734375,"height":20,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"#b2f2bb","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aT","roundness":null,"seed":2033743008,"version":48,"versionNonce":1498364256,"isDeleted":false,"boundElements":[],"updated":1750499247728,"link":null,"locked":false,"text":"tokens","rawText":"tokens","fontSize":16,"fontFamily":5,"textAlign":"center","verticalAlign":"middle","containerId":"2Jmp1vAS9AP6FQxYMZbhR","originalText":"tokens","autoResize":true,"lineHeight":1.25},{"id":"F0t6NbDm-xnPvCefJGQhC","type":"rectangle","x":-539.9390032378324,"y":-170.3653060508106,"width":153.91015625,"height":56.60546875,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"#a5d8ff","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aU","roundness":{"type":3},"seed":2080916832,"version":226,"versionNonce":1373703520,"isDeleted":false,"boundElements":[{"type":"text","id":"wuVBeRcp"},{"id":"3_0qKUisiyvO0oB_bNcYP","type":"arrow"}],"updated":1750499247728,"link":null,"locked":false},{"id":"wuVBeRcp","type":"text","x":-499.8438952056058,"y":-154.5625716758106,"width":73.71994018554688,"height":25,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aV","roundness":null,"seed":732047712,"version":207,"versionNonce":18375008,"isDeleted":false,"boundElements":[],"updated":1750499247728,"link":null,"locked":false,"text":"Cookies","rawText":"Cookies","fontSize":20,"fontFamily":5,"textAlign":"center","verticalAlign":"middle","containerId":"F0t6NbDm-xnPvCefJGQhC","originalText":"Cookies","autoResize":true,"lineHeight":1.25},{"id":"3_0qKUisiyvO0oB_bNcYP","type":"arrow","x":-207.37817642301218,"y":-263.25983730081055,"width":174.3147330648202,"height":114.6497361209229,"angle":0,"strokeColor":"#1e1e1e","backgroundColor":"#a5d8ff","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":1,"opacity":100,"groupIds":["Af92TvYlAsF_3LKwIczPH"],"frameId":null,"index":"aW","roundness":{"type":2},"seed":1105335648,"version":423,"versionNonce":673854816,"isDeleted":false,"boundElements":[],"updated":1750499307383,"link":null,"locked":false,"points":[[0,0],[-74.06082681482017,70.30859374999997],[-174.3147330648202,114.6497361209229]],"lastCommittedPoint":null,"startBinding":{"elementId":"sW80Xn2m","focus":0.4677171276957706,"gap":13.988525390625057},"endBinding":{"elementId":"F0t6NbDm-xnPvCefJGQhC","focus":0.4717193181116595,"gap":4.3359375},"startArrowhead":null,"endArrowhead":"arrow","elbowed":false}],"appState":{"theme":"light","viewBackgroundColor":"#ffffff","currentItemStrokeColor":"#1e1e1e","currentItemBackgroundColor":"#a5d8ff","currentItemFillStyle":"solid","currentItemStrokeWidth":2,"currentItemStrokeStyle":"solid","currentItemRoughness":1,"currentItemOpacity":100,"currentItemFontFamily":5,"currentItemFontSize":20,"currentItemTextAlign":"center","currentItemStartArrowhead":null,"currentItemEndArrowhead":"arrow","currentItemArrowType":"round","scrollX":857.942554517972,"scrollY":786.010068222481,"zoom":{"value":1.008825},"currentItemRoundness":"round","gridSize":20,"gridStep":5,"gridModeEnabled":false,"gridColor":{"Bold":"rgba(217, 217, 217, 0.5)","Regular":"rgba(230, 230, 230, 0.5)"},"currentStrokeOptions":null,"frameRendering":{"enabled":true,"clip":true,"name":true,"outline":true},"objectsSnapModeEnabled":false,"activeTool":{"type":"selection","customType":null,"locked":false,"fromSelection":false,"lastActiveTool":null}},"files":{}};InitialData.scrollToContent=true;App=()=>{const e=React.useRef(null),t=React.useRef(null),[n,i]=React.useState({width:void 0,height:void 0});return React.useEffect(()=>{i({width:t.current.getBoundingClientRect().width,height:t.current.getBoundingClientRect().height});const e=()=>{i({width:t.current.getBoundingClientRect().width,height:t.current.getBoundingClientRect().height})};return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[t]),React.createElement(React.Fragment,null,React.createElement("div",{className:"excalidraw-wrapper",ref:t},React.createElement(ExcalidrawLib.Excalidraw,{ref:e,width:n.width,height:n.height,initialData:InitialData,viewModeEnabled:!0,zenModeEnabled:!0,gridModeEnabled:!1})))},excalidrawWrapper=document.getElementById("JWTexcalidraw.md1");ReactDOM.render(React.createElement(App),excalidrawWrapper);})();</script>
1. A user will attempt to login with his credentials, but not directly to Saleor. The request will be made to `/api/auth/login`.
2. Our server's API handler will request on our behalf to the Saleor's API.
3. Then it will **strip the `refreshToken` from the response** and return the Access Token and the `additonalData` to the user.

```javascript
// server/api/auth/login.js

import { jwtDecode } from "jwt-decode";

const loginQuery = `
  mutation tokenCreate(
    $email: String
    $password: String!
  ) {
    tokenCreate(
      email: $email
      password: $password
    ) {
      token
      refreshToken
      <additionalFields>
      errors {
        message
        code
      }
    }
  }
`;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, additionalFields } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required",
      data: {
        errors: [
          {
            message: "Email is required",
            code: "MISSING_FIELD",
          },
        ],
      },
    });
  }
  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password is required",
      data: {
        errors: [
          {
            message: "Password is required",
            code: "MISSING_FIELD",
          },
        ],
      },
    });
  }

  const query = loginQuery.replace(
    "<additionalFields>",
    additionalFields ? additionalFields : ""
  );
  const config = useRuntimeConfig(event);
  const { data } = await $fetch(config.public.ecomApi, {
    method: "POST",
    body: {
      query,
      variables: { email, password },
    },
  });
  const { token, refreshToken, errors, ...additionalData } = data?.tokenCreate;
  const responseData = { ...additionalData, token, errors };
  if (data.tokenCreate?.token && data.tokenCreate?.refreshToken) {
    setCookie(event, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/api/auth",
      expires: new Date(jwtDecode(refreshToken).exp * 1000),
    });
    return { data: responseData };
  } else {
    const error = responseData.errors[0].code;
    let code = 400;
    if (error === "INVALID_CREDENTIALS") {
      code = 401;
    } else if (error === "ACCOUNT_NOT_CONFIRMED") {
      code = 407;
    }
    throw createError({
      statusCode: code,
      data: responseData,
    });
  }
});

```

The support for supplying `additonalFields` parameter allows user to get the user profile in one go with the tokens.

Notice that, we have set the `path` for the cookie to `/api/auth`. This will make the cookie accessible only to `/api/auth` routes. We have also set the expiry time to automatically expire the `refreshToken`.

From the frontend, the login request may look like this:

```javascript
const USER_FIELDS = 'user { id email firstName lastName isActive isConfirmed metafields(keys: ["gender"])';

const { onLogin } = useApollo();
const payload = {
  email: "someemail@somedomain.com",
  password: "averyhardpassword",
  additionalFields: USER_FIELDS,
};
try {
  const { data } = await $fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  onLogin(data.token);
} catch (error) {
  // ...handle errors
}

```

### Refresh
The refresh flow is quite similar to the login flow. In this case we're only getting the optional `additionalFields`. Then we get the `refreshToken` from the cookie and request a new `accessToken` from the Saleor's API.

```javascript
// server/api/auth/refresh.js

const refreshQuery = `
    mutation RefreshToken($refreshToken: String) {
        tokenRefresh(refreshToken: $refreshToken) {
            token
            <additionalFields>
            errors {
                message
                code
            }
        }
    }
`;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig(event);
  const cookies = parseCookies(event);
  const refreshToken = cookies.refreshToken;
  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Refresh expired",
      data: {
        errors: [
          {
            message: "Refresh expired",
            code: "REFRESH_EXPIRED",
          },
        ],
      },
    });
  }
  const query = refreshQuery.replace(
    "<additionalFields>",
    body.additionalFields ? body.additionalFields : ""
  );

  const { data } = await $fetch(config.public.ecomApi, {
    method: "POST",
    body: {
      query,
      variables: { refreshToken },
    },
  });
  if (!data.tokenRefresh?.token) {
    setCookie(event, "refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      path: "/api/auth",
    });
    return { data };
  }
  throw createError({
    statusCode: 400,
    data,
  });
});

```

### Logout
Since Saleor doesn't provide a `logout` Mutation, we're just deleting the `refreshToken` from the cookies.

```javascript
// server/api/auth/logout.js

export default defineEventHandler(async (event) => {
  setCookie(event, "refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    path: "/api/auth",
  });
  return { status: true };
});
```

## Conclusion
I tried finding a proper way to handle `refreshToken` in Nuxt 3's authentication flow but the solutions found are unsatisfactory. Eventually, I came up with it while working on a project. The theory is general enough to be implemented for any JWT authentication flow regardless of the backend used.