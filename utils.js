import 'dotenv/config'
import fetch from "node-fetch";

export const getSearchResultList = async ({
  offset = 0,
  limit = 50,
  query = "",
}) => {
  try {
    const regex = /\s/g;
    const validQuery = query.replace(regex, '+')
    const url = `https://julac.hosted.exlibrisgroup.com/primo_library/libweb/webservices/rest/primo-explore/v1/pnxs?blendFacetsSeparately=false&came_from=pagination_1_2&getMore=0&inst=CUHK_ALMA&lang=en_US&limit=${limit}&mode=advanced&newspapersActive=false&newspapersSearch=false&offset=${offset}&pcAvailability=true&q=sub,exact,${validQuery},AND;dr_s,exact,20000101,AND;dr_e,exact,99991231,AND&qExclude=&qInclude=&refEntryActive=false&rtaLinks=true&scope=Books&skipDelivery=Y&sort=rank&tab=default_tab&vid=CUHK`

    const response = await fetch(
      url,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language":
            "zh-HK,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,zh-CN;q=0.5,fr;q=0.4",
          authorization:
            `Bearer ${process.env.token}`,
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie:
            "JSESSIONID=B46250A3669B148E0A5E33142641DC5B; ___utmvm=###########; __Secure-UqZBpD3n3i-KBX8ylSuc+G6PQv5b5JRCfdaK6tbY+kGKSg__=v1FIoOgw__bIY; TBMCookie_3555100366678004564=4844420016481324071dxKRy1ssJ1kr0V5vXLbDezNCyY=",
          Referer:
            "https://julac.hosted.exlibrisgroup.com/primo-explore/search?query=sub,exact,Hong%20Kong%20(China)%20--%20Social%20conditions,AND&pfilter=creationdate,exact,20-YEAR,AND&tab=default_tab&search_scope=Books&vid=CUHK&mode=advanced&offset=50",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const transformSearchResultListToTable = (list) => {
  return {
    info: list.info,
    list: list.docs.map((doc) => {
      const {
        title,
        contributor,
        subject,
        publisher,
        creationdate,
        format,
        language,
        lds02,
      } = doc.pnx.display;
      return {
        title,
        contributor,
        subject,
        publisher,
        creationdate,
        format,
        language,
        lds02,
      };
    }),
  };
};

export const printRow = row => {
    const items = Object.values(row).map(item => {
        if (!item) {
            return ''
        }

        if (item && item.length) {
            return `${item.join(',')}`
        }
        return `${[item]}`
    })
    console.log(items.join('#'))
}
